import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-middleware";
import { ChangelogService } from "@/lib/services/changelog.service";

export const GET = withAuth(async (req, session, params) => {
    const changelogs = await ChangelogService.getChangelogs(params.id);
    return NextResponse.json(changelogs);
});
