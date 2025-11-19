import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fetchAndParseCommits } from "@/lib/github";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
        }

        const { projectId } = await request.json();

        if (!projectId) {
            return NextResponse.json(
                { error: "projectId обязателен" },
                { status: 400 }
            );
        }

        // Получаем проект и проверяем владельца
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: { user: true },
        });

        if (!project) {
            return NextResponse.json({ error: "Проект не найден" }, { status: 404 });
        }

        if (project.userId !== session.user.id) {
            return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
        }

        if (!project.user.accessToken) {
            return NextResponse.json(
                { error: "GitHub токен не найден" },
                { status: 400 }
            );
        }

        // Получаем коммиты с момента последней синхронизации
        const since = project.lastSyncAt || undefined;

        const parsedCommits = await fetchAndParseCommits(
            project.user.accessToken,
            project.repoOwner,
            project.repoName,
            since
        );

        // Создаём чейнджлоги в статусе DRAFT
        let createdCount = 0;
        let skippedCount = 0;

        for (const commit of parsedCommits) {
            // Проверяем, не существует ли уже такой коммит
            const existing = await prisma.changelog.findUnique({
                where: { commitHash: commit.hash },
            });

            if (existing) {
                skippedCount++;
                continue;
            }

            await prisma.changelog.create({
                data: {
                    projectId: project.id,
                    title: commit.title,
                    description: commit.description || null,
                    type: commit.type!,
                    status: "DRAFT",
                    commitHash: commit.hash,
                },
            });

            createdCount++;
        }

        // Обновляем время последней синхронизации
        await prisma.project.update({
            where: { id: projectId },
            data: { lastSyncAt: new Date() },
        });

        return NextResponse.json({
            success: true,
            created: createdCount,
            skipped: skippedCount,
            total: parsedCommits.length,
        });
    } catch (error: any) {
        console.error("Sync error:", error);
        return NextResponse.json(
            { error: error.message || "Ошибка синхронизации" },
            { status: 500 }
        );
    }
}
