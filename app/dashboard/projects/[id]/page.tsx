"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

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

    const getTypeLabel = (type: string) => {
        if (type === "FEAT") return { label: "Новое", color: "bg-green-100 text-green-800" };
        if (type === "FIX") return { label: "Исправлено", color: "bg-blue-100 text-blue-800" };
        return { label: "Улучшено", color: "bg-gray-100 text-gray-800" };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Проект не найден</h2>
                    <Link href="/dashboard" className="text-blue-600 hover:text-blue-700">
                        Вернуться к проектам
                    </Link>
                </div>
            </div>
        );
    }

    const embedCode = `<script src="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/widget.js" data-id="${project.apiKey}"></script>`;

    return (
        <div>
            <div className="mb-8 animate-fade-in-up">
                <Link
                    href="/dashboard"
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 mb-4 group w-fit"
                >
                    <div className="p-1 rounded-full bg-secondary group-hover:bg-primary/10 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </div>
                    Назад к проектам
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold font-heading mb-1">{project.repoName}</h1>
                        <p className="text-muted-foreground flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary/50" />
                            {project.repoFullName}
                        </p>
                    </div>
                    <button
                        onClick={handleSync}
                        disabled={syncing}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-95 font-medium disabled:opacity-50 flex items-center gap-2"
                    >
                        {syncing ? (
                            <>
                                <span className="animate-spin w-4 h-4 border-2 border-white/50 border-t-white rounded-full" />
                                Синхронизация...
                            </>
                        ) : (
                            <>
                                <span className="text-lg">🔄</span> Синхронизировать
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-border mb-8 animate-fade-in-up [animation-delay:100ms]">
                <div className="flex gap-8">
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
                <div className="animate-fade-in-up [animation-delay:200ms]">
                    <div className="flex gap-2 mb-6 p-1 bg-muted/50 rounded-xl w-fit border border-border">
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === "all" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            Все ({changelogs.length})
                        </button>
                        <button
                            onClick={() => setFilter("draft")}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === "draft" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            Черновики ({changelogs.filter((l) => l.status === "DRAFT").length})
                        </button>
                        <button
                            onClick={() => setFilter("published")}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === "published" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            Опубликовано ({changelogs.filter((l) => l.status === "PUBLISHED").length})
                        </button>
                    </div>

                    {filteredChangelogs.length === 0 ? (
                        <div className="bg-card rounded-2xl border border-dashed border-border p-12 text-center">
                            <p className="text-muted-foreground">Нет чейнджлогов. Нажмите &quot;Синхронизировать&quot;.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredChangelogs.map((log) => {
                                const typeInfo = getTypeLabel(log.type);
                                return (
                                    <Link
                                        key={log.id}
                                        href={`/dashboard/projects/${params.id}/changelogs/${log.id}`}
                                        className="block bg-card rounded-xl border border-border p-5 hover:border-primary/50 transition-all hover:shadow-md group"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${typeInfo.color}`}>
                                                        {typeInfo.label}
                                                    </span>
                                                    <span
                                                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${log.status === "PUBLISHED"
                                                            ? "bg-green-500/10 text-green-600"
                                                            : "bg-yellow-500/10 text-yellow-600"
                                                            }`}
                                                    >
                                                        {log.status === "PUBLISHED" ? "Опубликовано" : "Черновик"}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold font-heading text-lg mb-1 group-hover:text-primary transition-colors">{log.title}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(log.createdAt).toLocaleDateString("ru", { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </p>
                                            </div>
                                            <div className="text-muted-foreground group-hover:text-primary transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
                <div className="space-y-6 animate-fade-in-up [animation-delay:200ms]">
                    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                        <h3 className="font-bold font-heading mb-4">Код для встраивания</h3>
                        <div className="bg-muted p-4 rounded-xl border border-border font-mono text-sm overflow-x-auto text-muted-foreground">
                            {embedCode}
                        </div>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(embedCode);
                                alert("Скопировано!");
                            }}
                            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-95 font-medium text-sm"
                        >
                            📋 Скопировать
                        </button>
                    </div>

                    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                        <h3 className="font-bold font-heading mb-4">API ключ</h3>
                        <div className="bg-muted p-4 rounded-xl border border-border font-mono text-sm text-muted-foreground">
                            {project.apiKey}
                        </div>
                    </div>

                    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                        <h3 className="font-bold font-heading mb-4">Тема виджета</h3>
                        <div className="flex gap-3 items-center">
                            <div
                                className="w-12 h-12 rounded-xl border border-border shadow-sm"
                                style={{ backgroundColor: project.themeColor }}
                            ></div>
                            <span className="font-mono text-muted-foreground">{project.themeColor}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
