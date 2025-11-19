"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Copy, Check, ExternalLink, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Project {
    id: string;
    repoName: string;
    repoFullName: string;
    apiKey: string;
    themeColor: string;
    position: string;
    lastSyncAt: string | null;
}

interface Changelog {
    id: string;
    title: string;
    type: string;
    status: string;
    createdAt: string;
    publishedAt: string | null;
}

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [changelogs, setChangelogs] = useState<Changelog[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [activeTab, setActiveTab] = useState<"changelogs" | "settings">("changelogs");
    const [filter, setFilter] = useState<"all" | "draft" | "published">("all");

    const fetchProject = useCallback(async () => {
        try {
            const res = await fetch(`/api/projects/${params.id}`);
            if (res.ok) {
                const data = await res.json();
                setProject(data);
            }
        } catch (error) {
            console.error("Error fetching project:", error);
        } finally {
            setLoading(false);
        }
    }, [params.id]);

    const fetchChangelogs = useCallback(async () => {
        try {
            const res = await fetch(`/api/projects/${params.id}/changelogs`);
            if (res.ok) {
                const data = await res.json();
                setChangelogs(data);
            }
        } catch (error) {
            console.error("Error fetching changelogs:", error);
        }
    }, [params.id]);

    useEffect(() => {
        fetchProject();
        fetchChangelogs();
    }, [fetchProject, fetchChangelogs]);

    async function handleSync() {
        setSyncing(true);
        try {
            const res = await fetch("/api/sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ projectId: params.id }),
            });

            if (res.ok) {
                const result = await res.json();
                alert(`Синхронизация завершена!\nСоздано: ${result.created}\nПропущено: ${result.skipped}`);
                fetchProject();
                fetchChangelogs();
            } else {
                const error = await res.json();
                alert(`Ошибка: ${error.error}`);
            }
        } catch (error) {
            console.error("Error syncing:", error);
            alert("Ошибка синхронизации");
        } finally {
            setSyncing(false);
        }
    }

    const filteredChangelogs = changelogs.filter((log) => {
        if (filter === "all") return true;
        if (filter === "draft") return log.status === "DRAFT";
        if (filter === "published") return log.status === "PUBLISHED";
        return true;
    });

    const getTypeBadgeVariant = (type: string) => {
        if (type === "FEAT") return "success";
        if (type === "FIX") return "info";
        return "secondary";
    };

    const getTypeLabel = (type: string) => {
        if (type === "FEAT") return "Новое";
        if (type === "FIX") return "Исправлено";
        return "Улучшено";
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <RefreshCw className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
                <h2 className="text-2xl font-bold mb-2">Проект не найден</h2>
                <Button asChild variant="link">
                    <Link href="/dashboard">Вернуться к проектам</Link>
                </Button>
            </div>
        );
    }

    const embedCode = `<script src="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/widget.js" data-id="${project.apiKey}"></script>`;

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <Button variant="ghost" asChild className="pl-0 hover:bg-transparent hover:text-primary mb-4">
                    <Link href="/dashboard">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Назад к проектам
                    </Link>
                </Button>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold font-heading mb-1">{project.repoName}</h1>
                        <p className="text-muted-foreground flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary/50" />
                            {project.repoFullName}
                        </p>
                    </div>
                    <Button onClick={handleSync} disabled={syncing} className="shadow-lg shadow-primary/20">
                        {syncing ? (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Синхронизация...
                            </>
                        ) : (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Синхронизировать
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-border mb-8">
                <div className="flex gap-6">
                    <button
                        onClick={() => setActiveTab("changelogs")}
                        className={`pb-4 px-2 border-b-2 transition-all font-medium text-sm ${activeTab === "changelogs"
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                            }`}
                    >
                        Чейнджлоги
                    </button>
                    <button
                        onClick={() => setActiveTab("settings")}
                        className={`pb-4 px-2 border-b-2 transition-all font-medium text-sm ${activeTab === "settings"
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                            }`}
                    >
                        Настройки
                    </button>
                </div>
            </div>

            {/* Changelogs Tab */}
            {activeTab === "changelogs" && (
                <div className="space-y-6">
                    <div className="flex gap-2 p-1 bg-muted/50 rounded-xl w-fit border border-border">
                        {(["all", "draft", "published"] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === f
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                {f === "all" ? "Все" : f === "draft" ? "Черновики" : "Опубликовано"}
                                <span className="ml-2 opacity-60 text-xs">
                                    {f === "all"
                                        ? changelogs.length
                                        : changelogs.filter(l => f === "draft" ? l.status === "DRAFT" : l.status === "PUBLISHED").length}
                                </span>
                            </button>
                        ))}
                    </div>

                    {filteredChangelogs.length === 0 ? (
                        <Card className="border-dashed border-2 bg-muted/30">
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                <p className="text-muted-foreground mb-4">Нет чейнджлогов. Нажмите &quot;Синхронизировать&quot;.</p>
                                <Button onClick={handleSync} variant="outline">
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Синхронизировать
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {filteredChangelogs.map((log) => (
                                <Link key={log.id} href={`/dashboard/projects/${params.id}/changelogs/${log.id}`}>
                                    <Card className="hover:border-primary/50 transition-all hover:shadow-md group">
                                        <CardContent className="p-6 flex items-center justify-between">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={getTypeBadgeVariant(log.type) as any} className="uppercase tracking-wider">
                                                        {getTypeLabel(log.type)}
                                                    </Badge>
                                                    <Badge variant={log.status === "PUBLISHED" ? "success" : "warning"} className="uppercase tracking-wider">
                                                        {log.status === "PUBLISHED" ? "Опубликовано" : "Черновик"}
                                                    </Badge>
                                                </div>
                                                <h3 className="font-bold font-heading text-lg group-hover:text-primary transition-colors">
                                                    {log.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(log.createdAt).toLocaleDateString("ru", { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </p>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Код для встраивания</CardTitle>
                            <CardDescription>Добавьте этот код на ваш сайт перед закрывающим тегом &lt;/body&gt;</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-muted p-4 rounded-xl border border-border font-mono text-sm overflow-x-auto text-muted-foreground break-all">
                                {embedCode}
                            </div>
                            <Button
                                onClick={() => {
                                    navigator.clipboard.writeText(embedCode);
                                    alert("Скопировано!");
                                }}
                                variant="secondary"
                            >
                                <Copy className="mr-2 h-4 w-4" />
                                Скопировать код
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>API ключ</CardTitle>
                            <CardDescription>Используйте этот ключ для доступа к API</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-muted p-4 rounded-xl border border-border font-mono text-sm text-muted-foreground">
                                {project.apiKey}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Тема виджета</CardTitle>
                            <CardDescription>Цвет акцентов вашего виджета</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4 items-center">
                                <div
                                    className="w-12 h-12 rounded-xl border border-border shadow-sm"
                                    style={{ backgroundColor: project.themeColor }}
                                ></div>
                                <div className="font-mono text-muted-foreground bg-muted px-3 py-1 rounded-lg border border-border">
                                    {project.themeColor}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
