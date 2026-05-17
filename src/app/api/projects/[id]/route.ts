import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
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

    const projectId = params.id;

    // Get project with relations
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        analysisResult: true,
        featureModules: true,
        codeFlowGraphs: true,
        fileNodes: true, // Include actual file nodes for file explorer
        _count: {
          select: {
            chatMessages: true,
          },
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

    // Compute file and line totals from fileNodes to ensure UI reflects actual data
    try {
      const fileNodes = project.fileNodes || [];
      const totalFiles = fileNodes.filter((n: any) => n.type === "FILE").length;
      const totalLines = fileNodes.reduce((acc: number, n: any) => {
        if (typeof n.lines === "number" && n.lines > 0) return acc + n.lines;
        if (typeof n.content === "string")
          return acc + n.content.split("\n").length;
        return acc;
      }, 0);

      // Override returned values so frontend shows accurate counts (do not mutate DB here)
      const projectWithTotals = { ...project, totalFiles, totalLines };

      return NextResponse.json({ success: true, project: projectWithTotals });
    } catch (err) {
      console.error("Failed to compute project totals:", err);
      return NextResponse.json({ success: true, project });
    }
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
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

    const projectId = params.id;

    // Get project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check ownership
    if (project.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete project (cascade will delete related records)
    await prisma.project.delete({
      where: { id: projectId },
    });

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
