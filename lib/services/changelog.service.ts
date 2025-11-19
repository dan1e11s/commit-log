import { prisma } from "@/lib/prisma";

export class ChangelogService {
    static async getChangelogs(projectId: string) {
        return prisma.changelog.findMany({
            where: { projectId },
            orderBy: { createdAt: "desc" },
        });
    }

    static async getChangelog(id: string, userId: string) {
        const changelog = await prisma.changelog.findUnique({
            where: { id },
            include: { project: true },
        });

        if (!changelog) {
            throw new Error("Changelog not found");
        }

        if (changelog.project.userId !== userId) {
            throw new Error("Forbidden");
        }

        return changelog;
    }

    static async updateChangelog(id: string, userId: string, data: {
        title?: string;
        description?: string;
        type?: string;
        status?: string;
    }) {
        // Verify ownership via getChangelog
        await this.getChangelog(id, userId);

        return prisma.changelog.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                type: data.type as any, // Cast to enum if needed, or ensure type safety elsewhere
                status: data.status as any,
                publishedAt: data.status === "PUBLISHED" ? new Date() : null,
            },
        });
    }

    static async deleteChangelog(id: string, userId: string) {
        // Verify ownership
        await this.getChangelog(id, userId);

        return prisma.changelog.delete({
            where: { id },
        });
    }
}
