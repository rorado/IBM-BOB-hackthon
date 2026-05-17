import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getIBMBobClient } from "@/lib/ai/ibm-bob";
import { inferProjectTechStack } from "@/lib/utils";

export async function POST(request: NextRequest) {
  let projectId: string | undefined;

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

    const body = await request.json();
    projectId = body.projectId;

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 },
      );
    }

    // Get project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { fileNodes: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check ownership
    if (project.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update status
    await prisma.project.update({
      where: { id: projectId },
      data: { status: "ANALYZING" },
    });

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
      dependencies: {}, // Would extract from package.json, etc.
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
    await prisma.analysisResult.upsert({
      where: { projectId },
      create: {
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
      update: {
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
    await prisma.featureModule.deleteMany({ where: { projectId } });
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
    await prisma.codeFlowGraph.deleteMany({ where: { projectId } });

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
              id: "flow-fallback-analysis-1",
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
              files: files.slice(0, 4).map((file) => file.path),
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

    return NextResponse.json({
      success: true,
      message: "Analysis completed successfully",
    });
  } catch (error) {
    console.error("Analysis error:", error);

    // Update project status to FAILED
    if (projectId) {
      await prisma.project
        .update({
          where: { id: projectId },
          data: { status: "FAILED" },
        })
        .catch(console.error);
    }

    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
