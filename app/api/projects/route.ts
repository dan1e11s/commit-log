import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
        }

        const { repoName, repoOwner, repoFullName, themeColor } =
            await request.json();

        if (!repoName || !repoOwner || !repoFullName) {
            return NextResponse.json(
                { error: "Все поля обязательны" },
                { status: 400 }
            );
        }

        // Проверяем лимиты бесплатного тарифа
        // ВРЕМЕННО ОТКЛЮЧЕНО ДЛЯ ТЕСТИРОВАНИЯ
        /*
        const subscription = await prisma.subscription.findUnique({
            where: { userId: session.user.id },
        });

        if (subscription?.tier === "FREE") {
            const projectCount = await prisma.project.count({
                where: { userId: session.user.id },
            });

            if (projectCount >= 1) {
                return NextResponse.json(
                    {
                        error:
                            "Достигнут лимит бесплатного тарифа (1 проект). Обновитесь до Pro.",
                    },
                    { status: 403 }
                );
            }
        }
        */


        const project = await prisma.project.create({
            data: {
                userId: session.user.id,
                repoName,
                repoOwner,
                repoFullName,
                themeColor: themeColor || "#0ea5e9",
            },
        });

        return NextResponse.json(project);
    } catch (error: any) {
        console.error("Error creating project:", error);

        if (error.code === "P2002") {
            return NextResponse.json(
                { error: "Этот репозиторий уже добавлен" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Ошибка создания проекта" },
            { status: 500 }
        );
    }
}
