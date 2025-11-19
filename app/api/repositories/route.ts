import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-middleware";
import { GitHubService } from "@/lib/services/github.service";

export const GET = withAuth(async (req, session) => {
    if (!session.accessToken) {
        return NextResponse.json({ error: "GitHub token not found" }, { status: 401 });
    }
    const repos = await GitHubService.getRepositories(session.accessToken);
    return NextResponse.json(repos);
});
