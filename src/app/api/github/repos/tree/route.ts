import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { parseGitHubUrl } from "@/lib/utils";

const GITHUB_API_BASE = "https://api.github.com";

async function fetchJson(url: string, token?: string) {
  const headers: any = { Accept: "application/vnd.github+json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const accessToken = (session as any)?.accessToken;

    const body = await request.json();
    let owner = body.owner;
    let repo = body.repo;

    if (!owner || !repo) {
      if (body.githubUrl) {
        const parsed = parseGitHubUrl(body.githubUrl);
        if (!parsed) {
          return NextResponse.json(
            { error: "Invalid GitHub URL" },
            { status: 400 },
          );
        }
        owner = parsed.owner;
        repo = parsed.repo;
      }
    }

    if (!owner || !repo) {
      return NextResponse.json(
        { error: "owner and repo required" },
        { status: 400 },
      );
    }

    const token = accessToken || process.env.GITHUB_TOKEN;

    // Get repo to find default branch
    const repoInfo = await fetchJson(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}`,
      token,
    );
    const branch = repoInfo.default_branch || "main";

    // Resolve branch to commit SHA, then fetch tree recursively
    const branchRef = await fetchJson(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/ref/heads/${branch}`,
      token,
    );
    const treeSha = branchRef?.object?.sha;

    let treeResp: any;
    try {
      treeResp = await fetchJson(
        `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees/${treeSha}?recursive=1`,
        token,
      );
    } catch (err) {
      // fallback: list root contents if tree fetch fails
      const contents = await fetchJson(
        `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents?ref=${branch}`,
        token,
      );
      treeResp = {
        tree: contents.map((c: any) => ({
          path: c.path,
          type: c.type,
          sha: c.sha,
        })),
      };
    }

    const files: any[] = [];

    for (const entry of treeResp.tree || []) {
      if (!entry.path) continue;

      if (entry.type === "tree") {
        files.push({
          id: `dir-${entry.path}`,
          path: entry.path,
          name: entry.path.split("/").pop(),
          type: "DIRECTORY",
        });
      } else if (entry.type === "blob" || entry.type === "file") {
        // Try fetching raw content via raw.githubusercontent (faster)
        const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${entry.path}`;
        let content: string | null = null;
        try {
          const res = await fetch(rawUrl);
          if (res.ok) {
            content = await res.text();
          }
        } catch (e) {
          // ignore
        }

        files.push({
          id: entry.sha || entry.path,
          path: entry.path,
          name: entry.path.split("/").pop(),
          type: "FILE",
          size: entry.size || (content ? content.length : 0),
          extension: entry.path.split(".").pop() || "",
          content,
        });
      }
    }

    return NextResponse.json({ success: true, files });
  } catch (error) {
    console.error("Failed to fetch GitHub tree:", error);
    return NextResponse.json(
      { error: "Failed to fetch repo tree" },
      { status: 500 },
    );
  }
}
