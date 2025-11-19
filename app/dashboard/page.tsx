import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, ArrowRight, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin");
    }

    const projects = await prisma.project.findMany({
        where: {
            userId: session.user.id,
        },
        orderBy: {
            updatedAt: "desc",
        },
        include: {
            _count: {
                select: { changelogs: true },
            },
        },
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-heading tracking-tight">Мои проекты</h1>
                    <p className="text-muted-foreground mt-1">Управляйте вашими чейнджлогами и настройками.</p>
                </div>
                <Button asChild className="rounded-full shadow-lg shadow-primary/20">
                    <Link href="/dashboard/projects/new">
                        <Plus className="h-4 w-4" />
                        Новый проект
                    </Link>
                </Button>
            </div>

            {projects.length === 0 ? (
                <Card className="border-dashed border-2 bg-muted/30">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mb-6 shadow-sm border border-border">
                            <Github className="w-10 h-10 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">У вас пока нет проектов</h3>
                        <p className="text-muted-foreground max-w-sm mb-8">
                            Подключите свой первый репозиторий GitHub, чтобы начать автоматически генерировать чейнджлоги.
                        </p>
                        <Button asChild size="lg" className="rounded-full">
                            <Link href="/dashboard/projects/new">
                                <Plus className="mr-2 h-4 w-4" />
                                Создать проект
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <Link key={project.id} href={`/dashboard/projects/${project.id}`} className="block group h-full">
                            <Card className="h-full hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg group-hover:scale-110 transition-transform duration-300">
                                            {project.repoName.charAt(0).toUpperCase()}
                                        </div>
                                        <Badge variant="outline" className="font-mono text-xs">
                                            {project._count.changelogs} updates
                                        </Badge>
                                    </div>
                                    <CardTitle className="mt-4 text-lg group-hover:text-primary transition-colors">
                                        {project.repoName}
                                    </CardTitle>
                                    <CardDescription className="line-clamp-1">
                                        {project.repoFullName}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                                        Активен
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-0 text-xs text-muted-foreground flex justify-between items-center border-t border-border/50 mt-auto p-4 bg-muted/20">
                                    <span>Обновлено {new Date(project.updatedAt).toLocaleDateString()}</span>
                                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary" />
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
