import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-middleware";
import { ProjectService } from "@/lib/services/project.service";

export const POST = withAuth(async (req, session) => {
    const body = await req.json();
    const { repoName, repoOwner, repoFullName, themeColor } = body;

    if (!repoName || !repoOwner || !repoFullName) {
        return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 }
        );
    }

    try {
        const project = await ProjectService.createProject(session.user.id, {
            repoName,
            repoOwner,
            repoFullName,
            themeColor,
        });

        return NextResponse.json(project);
    } catch (error: any) {
        if (error.message === "Repository already added") {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        throw error; // Let middleware handle 500
    }
});

export const GET = withAuth(async (req, session) => {
    const projects = await ProjectService.getProjects(session.user.id);
    return NextResponse.json(projects);
});
