import { prisma } from "@/lib/prisma";

export class ProjectService {
    static async getProjects(userId: string) {
        return prisma.project.findMany({
            where: { userId },
            orderBy: { updatedAt: "desc" },
            include: {
                _count: {
                    select: { changelogs: true },
                },
            },
        });
    }

    static async getProject(id: string, userId: string) {
        const project = await prisma.project.findUnique({
            where: { id },
        });

        if (!project) {
            throw new Error("Project not found");
        }

        if (project.userId !== userId) {
            throw new Error("Forbidden");
        }

        return project;
    }

    static async createProject(userId: string, data: {
        repoName: string;
        repoOwner: string;
        repoFullName: string;
        themeColor?: string;
    }) {
        // Check for existing project with same repo
        const existing = await prisma.project.findFirst({
            where: {
                userId,
                repoFullName: data.repoFullName,
            },
        });

        if (existing) {
            throw new Error("Repository already added");
        }

        return prisma.project.create({
            data: {
                userId,
                repoName: data.repoName,
                repoOwner: data.repoOwner,
                repoFullName: data.repoFullName,
                themeColor: data.themeColor || "#0ea5e9",
            },
        });
    }
}
