import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/api/auth/signin");
    }

    const projects = await prisma.project.findMany({
        where: { userId: session.user.id },
        include: {
            _count: {
                select: {
                    changelogs: true,
                },
            },
        },
        orderBy: { updatedAt: "desc" },
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-8 animate-fade-in-up">
                <h1 className="text-3xl font-bold font-heading">Мои проекты</h1>
                <Link
                    href="/dashboard/projects/new"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-95 font-medium flex items-center gap-2"
                >
                    <span className="text-lg leading-none">+</span> Добавить проект
                </Link>
            </div>

            {projects.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-border bg-card/50 p-12 text-center animate-fade-in-up [animation-delay:100ms]">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-muted-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold font-heading mb-2">Нет проектов</h2>
                    <p className="text-muted-foreground mb-6">
                        Подключите свой первый GitHub репозиторий
                    </p>
                    <Link
                        href="/dashboard/projects/new"
                        className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-95 font-medium"
                    >
                        Добавить проект
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, i) => (
                        <Link
                            key={project.id}
                            href={`/dashboard/projects/${project.id}`}
                            className="group bg-card rounded-2xl border border-border p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 animate-fade-in-up"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-bold font-heading text-lg mb-1 group-hover:text-primary transition-colors">
                                        {project.repoName}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {project.repoFullName}
                                    </p>
                                </div>
                                <div
                                    className="w-4 h-4 rounded-full shadow-sm ring-2 ring-white dark:ring-gray-900"
                                    style={{ backgroundColor: project.themeColor }}
                                ></div>
                            </div>
                            <div className="flex gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-foreground bg-secondary px-2 py-0.5 rounded-md">
                                        {project._count.changelogs}
                                    </span>{" "}
                                    записей
                                </div>
                                {project.lastSyncAt && (
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                                        {new Date(project.lastSyncAt).toLocaleDateString("ru")}
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
