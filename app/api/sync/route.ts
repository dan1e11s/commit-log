import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-middleware";
import { GitHubService } from "@/lib/services/github.service";

export const POST = withAuth(async (req, session) => {
    const { projectId } = await req.json();

    if (!projectId) {
        return NextResponse.json({ error: "Project ID required" }, { status: 400 });
    }

    try {
        if (!session.accessToken) {
            return NextResponse.json({ error: "GitHub token not found" }, { status: 401 });
        }
        const result = await GitHubService.syncCommits(projectId, session.user.id, session.accessToken);
        return NextResponse.json(result);
    } catch (error: any) {
        if (error.message === "Project not found") return NextResponse.json({ error: error.message }, { status: 404 });
        if (error.message === "Forbidden") return NextResponse.json({ error: error.message }, { status: 403 });
        throw error;
    }
});
