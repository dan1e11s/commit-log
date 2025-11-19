import { prisma } from "@/lib/prisma";
import { Octokit } from "@octokit/rest";

export class GitHubService {
    static async getRepositories(accessToken: string) {
        const octokit = new Octokit({ auth: accessToken });
        const { data } = await octokit.rest.repos.listForAuthenticatedUser({
            sort: "updated",
            per_page: 100,
        });
        return data;
    }

    static async syncCommits(projectId: string, userId: string, accessToken: string) {
        const project = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!project) throw new Error("Project not found");
        if (project.userId !== userId) throw new Error("Forbidden");

        const octokit = new Octokit({ auth: accessToken });
        const [owner, repo] = project.repoFullName.split("/");

        // Get commits since last sync
        const since = project.lastSyncAt ? project.lastSyncAt.toISOString() : undefined;

        const { data: commits } = await octokit.rest.repos.listCommits({
            owner,
            repo,
            since,
            per_page: 100,
        });

        let createdCount = 0;
        let skippedCount = 0;

        for (const commit of commits) {
            // Skip merge commits or empty messages
            if (commit.commit.message.startsWith("Merge") || !commit.commit.message) {
                skippedCount++;
                continue;
            }

            // Check if exists
            const existing = await prisma.changelog.findFirst({
                where: {
                    projectId: project.id,
                    commitHash: commit.sha,
                },
            });

            if (existing) {
                skippedCount++;
                continue;
            }

            // Parse Conventional Commits
            const message = commit.commit.message.split("\n")[0];
            let type = "IMPROVEMENT";
            let title = message;

            if (message.startsWith("feat")) type = "FEAT";
            else if (message.startsWith("fix")) type = "FIX";

            // Clean title (remove type prefix)
            if (message.includes(":")) {
                title = message.split(":").slice(1).join(":").trim();
            }

            await prisma.changelog.create({
                data: {
                    projectId: project.id,
                    title,
                    description: commit.commit.message,
                    type: type as any,
                    status: "DRAFT",
                    commitHash: commit.sha,
                    authorName: commit.commit.author?.name || "Unknown",
                    authorAvatar: commit.author?.avatar_url,
                },
            });
            createdCount++;
        }

        await prisma.project.update({
            where: { id: project.id },
            data: { lastSyncAt: new Date() },
        });

        return { created: createdCount, skipped: skippedCount };
    }
}
