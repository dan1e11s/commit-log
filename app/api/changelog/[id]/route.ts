import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-middleware";
import { ChangelogService } from "@/lib/services/changelog.service";

export const GET = withAuth(async (req, session, params) => {
    try {
        const changelog = await ChangelogService.getChangelog(params.id, session.user.id);
        return NextResponse.json(changelog);
    } catch (error: any) {
        if (error.message === "Changelog not found") return NextResponse.json({ error: error.message }, { status: 404 });
        if (error.message === "Forbidden") return NextResponse.json({ error: error.message }, { status: 403 });
        throw error;
    }
});

export const PUT = withAuth(async (req, session, params) => {
    const body = await req.json();
    try {
        const changelog = await ChangelogService.updateChangelog(params.id, session.user.id, body);
        return NextResponse.json(changelog);
    } catch (error: any) {
        if (error.message === "Changelog not found") return NextResponse.json({ error: error.message }, { status: 404 });
        if (error.message === "Forbidden") return NextResponse.json({ error: error.message }, { status: 403 });
        throw error;
    }
});

export const DELETE = withAuth(async (req, session, params) => {
    try {
        await ChangelogService.deleteChangelog(params.id, session.user.id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error.message === "Changelog not found") return NextResponse.json({ error: error.message }, { status: 404 });
        if (error.message === "Forbidden") return NextResponse.json({ error: error.message }, { status: 403 });
        throw error;
    }
});
