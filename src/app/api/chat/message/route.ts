import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getIBMBobClient } from "@/lib/ai/ibm-bob";
import { inferProjectTechStack } from "@/lib/utils";

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

    const { projectId, message, mode, context } = await request.json();

    if (!projectId || !message) {
      return NextResponse.json(
        { error: "Project ID and message are required" },
        { status: 400 },
      );
    }

    // Get project with analysis
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        analysisResult: true,
        featureModules: true,
        codeFlowGraphs: true,
        fileNodes: {
          where: { type: "FILE" },
          select: { path: true, content: true },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check ownership
    if (project.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get IBM Bob client
    const ibmBob = getIBMBobClient();
    const inferredTechStack = inferProjectTechStack(project.fileNodes);

    // Prepare context for AI with ACTUAL project files
    const aiContext = {
      projectName: project.name,
      ...inferredTechStack,
      language: project.language || inferredTechStack.language,
      framework: project.framework || inferredTechStack.framework,
      analysis: project.analysisResult,
      features: project.featureModules,
      codeFlows: project.codeFlowGraphs,
      projectStatus: project.status,
      totalFiles: project.totalFiles,
      totalLines: project.totalLines,
      files: project.fileNodes, // Include actual uploaded files
      mode: mode || "developer",
      responseStyle: context?.responseStyle,
      additionalContext: context,
    };

    // Get AI response
    const response = await ibmBob.chatWithContext({
      message,
      context: aiContext,
      conversationHistory: [], // Would fetch from database in production
    });

    // Store message in database
    await prisma.chatMessage.create({
      data: {
        projectId,
        userId: userId,
        role: "USER",
        content: message,
        mode: mode === "normal" ? "NORMAL" : "DEVELOPER",
      },
    });

    await prisma.chatMessage.create({
      data: {
        projectId,
        userId: userId,
        role: "ASSISTANT",
        content: response,
        mode: mode === "normal" ? "NORMAL" : "DEVELOPER",
      },
    });

    return NextResponse.json({
      success: true,
      response,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 },
    );
  }
}
