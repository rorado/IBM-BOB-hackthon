import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Octokit } from "octokit";
import JSZip from "jszip";
import { inferProjectTechStack, parseGitHubUrl } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentType = request.headers.get("content-type");

    // Handle GitHub URL upload
    if (contentType?.includes("application/json")) {
      const body = await request.json();
      const { githubUrl, sourceType } = body;

      if (sourceType !== "GITHUB" || !githubUrl) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
      }

      const parsed = parseGitHubUrl(githubUrl);
      if (!parsed) {
        return NextResponse.json(
          { error: "Invalid GitHub URL" },
          { status: 400 },
        );
      }

      const { owner, repo: repoName } = parsed;

      // Create project record
      const project = await prisma.project.create({
        data: {
          name: repoName,
          description: `GitHub repository: ${owner}/${repoName}`,
          sourceType: "GITHUB",
          githubUrl: githubUrl,
          status: "PENDING",
          userId: userId,
        },
      });

      void processGitHubUpload(project.id, owner, repoName, (session as any).accessToken).catch((error) => {
        console.error("GitHub processing error:", error);
      });

      return NextResponse.json(
        {
          success: true,
          projectId: project.id,
          message: "Repository upload started successfully!",
          status: "PENDING",
        },
        {
          status: 202,
        },
      );
    }

    // Handle ZIP file upload
    if (contentType?.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File;
      const sourceType = formData.get("sourceType") as string;

      if (sourceType !== "ZIP" || !file) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
      }

      // Read ZIP file
      const arrayBuffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(arrayBuffer);

      // Extract project name from ZIP
      const projectName = file.name.replace(".zip", "");

      // Create project record
      const project = await prisma.project.create({
        data: {
          name: projectName,
          description: `Uploaded ZIP file: ${file.name}`,
          sourceType: "ZIP",
          zipFileName: file.name,
          status: "PENDING",
          userId: userId,
        },
      });

      void processZipUpload(project.id, zip).catch((error) => {
        console.error("ZIP processing error:", error);
      });

      return NextResponse.json(
        {
          success: true,
          projectId: project.id,
          message: "ZIP upload started successfully!",
          status: "PENDING",
        },
        {
          status: 202,
        },
      );
    }

    return NextResponse.json(
      { error: "Invalid content type" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Process GitHub uploads in the background
async function processGitHubUpload(
  projectId: string,
  owner: string,
  repoName: string,
  accessToken?: string,
) {
  await prisma.project.update({
    where: { id: projectId },
    data: { status: "ANALYZING" },
  });

  try {
    await fetchGitHubFiles(projectId, owner, repoName, accessToken);
    await triggerAnalysis(projectId);
  } catch (error) {
    console.error("GitHub background processing failed:", error);
    await prisma.project
      .update({
        where: { id: projectId },
        data: { status: "FAILED" },
      })
      .catch(console.error);
    throw error;
  }
}

// Process ZIP uploads in the background
async function processZipUpload(projectId: string, zip: JSZip) {
  await prisma.project.update({
    where: { id: projectId },
    data: { status: "ANALYZING" },
  });

  try {
    await processZipFiles(projectId, zip);
    await triggerAnalysis(projectId);
  } catch (error) {
    console.error("ZIP background processing failed:", error);
    await prisma.project
      .update({
        where: { id: projectId },
        data: { status: "FAILED" },
      })
      .catch(console.error);
    throw error;
  }
}

// Helper function to process ZIP files
async function processZipFiles(projectId: string, zip: JSZip) {
  const files: Array<{
    path: string;
    name: string;
    type: "FILE" | "DIRECTORY";
    content: string | null;
    size: number;
  }> = [];

  // Extract all files
  for (const [path, zipEntry] of Object.entries(zip.files)) {
    if (zipEntry.dir) {
      files.push({
        path,
        name: path.split("/").filter(Boolean).pop() || path,
        type: "DIRECTORY",
        content: null,
        size: 0,
      });
    } else {
      const content = await zipEntry.async("text");
      files.push({
        path,
        name: path.split("/").pop() || path,
        type: "FILE",
        content,
        size: content.length,
      });
    }
  }

  // Store files in database
  for (const file of files) {
    await prisma.fileNode.create({
      data: {
        projectId,
        path: file.path,
        name: file.name,
        type: file.type,
        content: file.content,
        size: file.size,
        extension: file.type === "FILE" ? file.name.split(".").pop() : null,
      },
    });
  }

  // Update project stats
  await prisma.project.update({
    where: { id: projectId },
    data: {
      totalFiles: files.filter((f) => f.type === "FILE").length,
      totalLines: files.reduce(
        (sum, f) => sum + (f.content?.split("\n").length || 0),
        0,
      ),
    },
  });
}

// Helper function to fetch files from GitHub
async function fetchGitHubFiles(
  projectId: string,
  owner: string,
  repo: string,
  accessToken?: string,
) {
  try {
    const octokit = new Octokit({
      auth: accessToken || process.env.GITHUB_TOKEN || undefined,
    });

    const { data: repoInfo } = await octokit.rest.repos.get({ owner, repo });
    const defaultBranch = repoInfo.default_branch || "main";

    const { data: ref } = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${defaultBranch}`,
    });

    const treeSha = ref.object?.sha;
    if (!treeSha) {
      throw new Error(`Unable to resolve tree SHA for ${owner}/${repo}`);
    }

    // Get repository tree
    const { data: tree } = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: treeSha,
      recursive: "true",
    });

    const files: Array<{
      path: string;
      name: string;
      type: "FILE" | "DIRECTORY";
      content: string | null;
      size: number;
    }> = [];

    // Fetch content for each file (limit to reasonable size)
    for (const item of tree.tree.slice(0, 500)) {
      // Limit to 500 files
      if (item.type === "tree") {
        files.push({
          path: item.path || "",
          name: item.path?.split("/").pop() || "",
          type: "DIRECTORY",
          content: null,
          size: 0,
        });
      } else if (item.type === "blob" && item.size && item.size < 1000000) {
        // Skip files larger than 1MB
        try {
          const { data: blob } = await octokit.rest.git.getBlob({
            owner,
            repo,
            file_sha: item.sha!,
          });

          const content = Buffer.from(blob.content, "base64").toString("utf-8");

          files.push({
            path: item.path || "",
            name: item.path?.split("/").pop() || "",
            type: "FILE",
            content,
            size: item.size,
          });
        } catch (error) {
          console.error(`Error fetching file ${item.path}:`, error);
        }
      }
    }

    // Store files in database
    for (const file of files) {
      await prisma.fileNode.create({
        data: {
          projectId,
          path: file.path,
          name: file.name,
          type: file.type,
          content: file.content,
          size: file.size,
          extension: file.type === "FILE" ? file.name.split(".").pop() : null,
        },
      });
    }

    // Update project stats
    await prisma.project.update({
      where: { id: projectId },
      data: {
        totalFiles: files.filter((f) => f.type === "FILE").length,
        totalLines: files.reduce(
          (sum, f) => sum + (f.content?.split("\n").length || 0),
          0,
        ),
      },
    });
  } catch (error) {
    console.error("Error fetching GitHub files:", error);
    throw error;
  }
}

// Helper function to trigger analysis
async function triggerAnalysis(projectId: string) {
  try {
    // Import the analysis logic directly instead of making HTTP call
    const { getIBMBobClient } = await import("@/lib/ai/ibm-bob");

    // Get project with files
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { fileNodes: true },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    // Perform analysis
    const ibmBob = getIBMBobClient();
    const inferredTechStack = inferProjectTechStack(project.fileNodes);

    // Prepare files for analysis
    const files = project.fileNodes
      .filter((node) => node.type === "FILE" && node.content)
      .map((node) => ({
        path: node.path,
        content: node.content || "",
      }));

    // Analyze repository
    const analysis = await ibmBob.analyzeRepository({
      files,
      language: project.language || inferredTechStack.language,
      framework: project.framework || inferredTechStack.framework,
    });

    // Detect architecture
    const architecture = await ibmBob.detectArchitecture({
      projectStructure: project.fileNodes,
      dependencies: {},
    });

    // Extract features
    const features = await ibmBob.extractFeatures({ files });

    // Map code flows
    const flows = await ibmBob.mapCodeFlows({
      entryPoints: ["index.ts", "main.ts", "app.ts", "index.js"],
      traceDepth: 5,
      files,
    });

    // Store analysis results
    await prisma.analysisResult.create({
      data: {
        projectId,
        architecture: architecture as any,
        dependencies: {} as any,
        entryPoints: [] as any,
        codeQuality: analysis.codeQuality || 75,
        maintainability: analysis.maintainability || 70,
        strengths: analysis.strengths as any,
        weaknesses: analysis.weaknesses as any,
        suggestions: analysis.suggestions as any,
        summary: analysis.summary,
        technicalSummary: analysis.technicalSummary,
        userSummary: analysis.userSummary,
        processingTime: 0,
      },
    });

    // Store feature modules
    for (const feature of features) {
      await prisma.featureModule.create({
        data: {
          projectId,
          name: feature.name,
          description: feature.description,
          category: feature.category || "General",
          files: feature.files as any,
          technicalDetails: feature.technicalDetails,
          userExplanation: feature.userExplanation,
          importance: feature.importance || 5,
        },
      });
    }

    const normalizeFlowType = (type: unknown) => {
      const value = String(type || "").toUpperCase();

      if (value.includes("AUTH")) return "AUTH";
      if (value.includes("DATA")) return "DATA";
      if (value.includes("ERROR")) return "ERROR";
      if (value.includes("FEATURE")) return "FEATURE";
      if (value.includes("REQUEST")) return "REQUEST";

      return "CUSTOM";
    };

    const flowsToStore =
      flows.length > 0
        ? flows
        : [
            {
              id: "flow-fallback-upload-1",
              name: "Project Flow",
              type: "FEATURE",
              description: "General project execution flow from load to analysis",
              nodes: [
                { id: "1", type: "start", label: "Project Loaded", position: { x: 0, y: 0 } },
                { id: "2", type: "process", label: "Scan Files", position: { x: 0, y: 120 } },
                { id: "3", type: "process", label: "Analyze Code", position: { x: 0, y: 240 } },
                { id: "4", type: "process", label: "Build Insights", position: { x: 0, y: 360 } },
                { id: "5", type: "end", label: "Ready", position: { x: 0, y: 480 } },
              ],
              edges: [
                { id: "e1-2", source: "1", target: "2" },
                { id: "e2-3", source: "2", target: "3" },
                { id: "e3-4", source: "3", target: "4" },
                { id: "e4-5", source: "4", target: "5" },
              ],
              complexity: 2,
              files: project.fileNodes.filter((node) => node.type === "FILE").slice(0, 4).map((node) => node.path),
            },
          ];

    // Store code flows
    for (const flow of flowsToStore) {
      await prisma.codeFlowGraph.create({
        data: {
          projectId,
          name: flow.name,
          type: normalizeFlowType(flow.type) as any,
          description: flow.description,
          nodes: flow.nodes as any,
          edges: flow.edges as any,
          complexity: flow.complexity,
        },
      });
    }

    // Update project status
    await prisma.project.update({
      where: { id: projectId },
      data: {
        status: "COMPLETED",
        analyzedAt: new Date(),
        language:
          analysis.architecture?.language ||
          project.language ||
          inferredTechStack.language,
        framework:
          analysis.architecture?.framework ||
          project.framework ||
          inferredTechStack.framework,
      },
    });

    console.log(`Analysis completed for project ${projectId}`);
  } catch (error) {
    console.error("Analysis trigger error:", error);
    await prisma.project
      .update({
        where: { id: projectId },
        data: { status: "FAILED" },
      })
      .catch(console.error);
  }
}
