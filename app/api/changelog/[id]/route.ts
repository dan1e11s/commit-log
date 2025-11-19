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

        const changelog = await prisma.changelog.findUnique({
            where: { id: params.id },
            include: { project: true },
        });

        if (!changelog) {
            return NextResponse.json(
                { error: "Чейнджлог не найден" },
                { status: 404 }
            );
        }

        if (changelog.project.userId !== session.user.id) {
            return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
        }

        return NextResponse.json(changelog);
    } catch (error) {
        console.error("Error fetching changelog:", error);
        return NextResponse.json(
            { error: "Ошибка получения чейнджлога" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
        }

        const changelog = await prisma.changelog.findUnique({
            where: { id: params.id },
            include: { project: true },
        });

        if (!changelog) {
            return NextResponse.json(
                { error: "Чейнджлог не найден" },
                { status: 404 }
            );
        }

        if (changelog.project.userId !== session.user.id) {
            return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
        }

        const { title, description, type, status } = await request.json();

        const updated = await prisma.changelog.update({
            where: { id: params.id },
            data: {
                title: title || changelog.title,
                description: description !== undefined ? description : changelog.description,
                type: type || changelog.type,
                status: status || changelog.status,
                publishedAt: status === "PUBLISHED" && !changelog.publishedAt ? new Date() : changelog.publishedAt,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error updating changelog:", error);
        return NextResponse.json(
            { error: "Ошибка обновления чейнджлога" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
        }

        const changelog = await prisma.changelog.findUnique({
            where: { id: params.id },
            include: { project: true },
        });

        if (!changelog) {
            return NextResponse.json(
                { error: "Чейнджлог не найден" },
                { status: 404 }
            );
        }

        if (changelog.project.userId !== session.user.id) {
            return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
        }

        await prisma.changelog.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting changelog:", error);
        return NextResponse.json(
            { error: "Ошибка удаления чейнджлога" },
            { status: 500 }
        );
    }
}
