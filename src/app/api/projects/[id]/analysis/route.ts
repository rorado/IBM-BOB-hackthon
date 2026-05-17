import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = params.id;
    const body = await request.json();

    // Body may include: analysis, features, flows, totalFiles, totalLines, language, framework, status
    const {
      analysis = {},
      features = [],
      flows = [],
      totalFiles,
      totalLines,
      language,
      framework,
      status = "COMPLETED",
    } = body;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    if (project.userId !== userId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const normalizeFlowType = (type: unknown) => {
      const value = String(type || "").toUpperCase();

      if (value.includes("AUTH")) return "AUTH";
      if (value.includes("DATA")) return "DATA";
      if (value.includes("ERROR")) return "ERROR";
      if (value.includes("FEATURE")) return "FEATURE";
      if (value.includes("REQUEST")) return "REQUEST";

      return "CUSTOM";
    };

    // Upsert analysisResult
    await prisma.analysisResult.upsert({
      where: { projectId },
      create: {
        projectId,
        architecture: (analysis.architecture || {}) as any,
        dependencies: (analysis.dependencies || {}) as any,
        entryPoints: (analysis.entryPoints || []) as any,
        codeQuality: analysis.codeQuality ?? 75,
        maintainability: analysis.maintainability ?? 70,
        strengths: (analysis.strengths || []) as any,
        weaknesses: (analysis.weaknesses || []) as any,
        suggestions: (analysis.suggestions || []) as any,
        summary: analysis.summary || "",
        technicalSummary: analysis.technicalSummary || "",
        userSummary: analysis.userSummary || "",
        processingTime: analysis.processingTime ?? 0,
      },
      update: {
        architecture: (analysis.architecture || {}) as any,
        dependencies: (analysis.dependencies || {}) as any,
        entryPoints: (analysis.entryPoints || []) as any,
        codeQuality: analysis.codeQuality ?? 75,
        maintainability: analysis.maintainability ?? 70,
        strengths: (analysis.strengths || []) as any,
        weaknesses: (analysis.weaknesses || []) as any,
        suggestions: (analysis.suggestions || []) as any,
        summary: analysis.summary || "",
        technicalSummary: analysis.technicalSummary || "",
        userSummary: analysis.userSummary || "",
        processingTime: analysis.processingTime ?? 0,
      },
    });

    // Replace featureModules and codeFlowGraphs for this project
    if (Array.isArray(features) && features.length > 0) {
      await prisma.featureModule.deleteMany({ where: { projectId } });
      for (const f of features) {
        await prisma.featureModule.create({
          data: {
            projectId,
            name: f.name || "Unnamed",
            description: f.description || "",
            category: f.category || null,
            files: f.files || ([] as any),
            technicalDetails: f.technicalDetails || "",
            userExplanation: f.userExplanation || "",
            importance: f.importance ?? 5,
          },
        });
      }
    }

    if (Array.isArray(flows) && flows.length > 0) {
      await prisma.codeFlowGraph.deleteMany({ where: { projectId } });
      for (const flow of flows) {
        await prisma.codeFlowGraph.create({
          data: {
            projectId,
            name: flow.name || "Flow",
            type: normalizeFlowType(flow.type) as any,
            description: flow.description || null,
            nodes: flow.nodes || ([] as any),
            edges: flow.edges || ([] as any),
            complexity: flow.complexity ?? null,
          },
        });
      }
    }

    // Update project metadata and totals (persist to DB)
    const updateData: any = { status, analyzedAt: new Date() };
    if (typeof totalFiles === "number") updateData.totalFiles = totalFiles;
    if (typeof totalLines === "number") updateData.totalLines = totalLines;
    if (language) updateData.language = language;
    if (framework) updateData.framework = framework;

    await prisma.project.update({ where: { id: projectId }, data: updateData });

    return NextResponse.json({ success: true, message: "Analysis persisted" });
  } catch (error) {
    console.error("Failed to persist analysis callback:", error);
    return NextResponse.json(
      { error: "Failed to persist analysis" },
      { status: 500 },
    );
  }
}
