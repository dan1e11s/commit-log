import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fetchUserRepositories } from "@/lib/github";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (!user?.accessToken) {
            return NextResponse.json(
                { error: "GitHub токен не найден" },
                { status: 400 }
            );
        }

        const repositories = await fetchUserRepositories(user.accessToken);

        return NextResponse.json(repositories);
    } catch (error: any) {
        console.error("Error fetching repositories:", error);
        return NextResponse.json(
            { error: error.message || "Ошибка получения репозиториев" },
            { status: 500 }
        );
    }
}
