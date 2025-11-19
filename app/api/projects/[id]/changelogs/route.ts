import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
        }

        const project = await prisma.project.findUnique({
            where: { id: params.id },
        });

        if (!project) {
            return NextResponse.json({ error: "Проект не найден" }, { status: 404 });
        }

        if (project.userId !== session.user.id) {
            return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
        }

        const changelogs = await prisma.changelog.findMany({
            where: { projectId: params.id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(changelogs);
    } catch (error) {
        console.error("Error fetching changelogs:", error);
        return NextResponse.json(
            { error: "Ошибка получения чейнджлогов" },
            { status: 500 }
        );
    }
}
