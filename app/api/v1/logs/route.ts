import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

export async function GET(request: Request) {
    try {
        const ip = headers().get("x-forwarded-for") || "unknown";
        const { success } = rateLimit(ip);

        if (!success) {
            return NextResponse.json(
                { error: "Too many requests" },
                { status: 429 }
            );
        }

        const { searchParams } = new URL(request.url);
        const apiKey = searchParams.get("key");

        if (!apiKey) {
            return NextResponse.json(
                { error: "API ключ обязателен" },
                { status: 400 }
            );
        }

        // Находим проект по API ключу
        const project = await prisma.project.findUnique({
            where: { apiKey },
            include: {
                user: {
                    include: {
                        subscription: true,
                    },
                },
                changelogs: {
                    where: { status: "PUBLISHED" },
                    orderBy: { publishedAt: "desc" },
                },
            },
        });

        if (!project) {
            return NextResponse.json({ error: "Проект не найден" }, { status: 404 });
        }

        const isFree = project.user.subscription?.tier === "FREE";

        // Для бесплатного тарифа ограничиваем 10 записями
        const logs = isFree ? project.changelogs.slice(0, 10) : project.changelogs;

        const response = {
            color: project.themeColor,
            position: project.position,
            showBranding: isFree,
            logs: logs.map((log) => ({
                id: log.id,
                type: log.type.toLowerCase(),
                title: log.title,
                description: log.description,
                date: log.publishedAt?.toISOString().split("T")[0] || log.createdAt.toISOString().split("T")[0],
            })),
        };

        // Настройка CORS и кэширования
        return NextResponse.json(response, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
                "Cache-Control": "public, max-age=3600",
            },
        });
    } catch (error) {
        console.error("Error fetching logs:", error);
        return NextResponse.json(
            { error: "Ошибка получения логов" },
            { status: 500 }
        );
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}
