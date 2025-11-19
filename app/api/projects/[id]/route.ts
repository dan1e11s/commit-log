import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-middleware";
import { ProjectService } from "@/lib/services/project.service";

export const GET = withAuth(async (req, session, params) => {
    try {
        const project = await ProjectService.getProject(params.id, session.user.id);
        return NextResponse.json(project);
    } catch (error: any) {
        if (error.message === "Project not found") {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }
        if (error.message === "Forbidden") {
            return NextResponse.json({ error: error.message }, { status: 403 });
        }
        throw error;
    }
});
