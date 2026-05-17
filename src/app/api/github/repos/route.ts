import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get access token from session
    const accessToken = (session as any).accessToken;

    if (!accessToken) {
      return NextResponse.json(
        { error: "No GitHub access token found" },
        { status: 401 },
      );
    }

    // Fetch user's repositories from GitHub API
    const response = await fetch(
      "https://api.github.com/user/repos?sort=updated&per_page=100",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch repositories from GitHub");
    }

    const repos = await response.json();

    return NextResponse.json({
      success: true,
      repos,
    });
  } catch (error) {
    console.error("GitHub repos fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch repositories" },
      { status: 500 },
    );
  }
}
