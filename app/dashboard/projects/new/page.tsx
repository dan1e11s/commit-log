"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Repository {
    id: number;
    name: string;
    full_name: string;
    owner: {
        login: string;
    };
    description: string | null;
}

export default function NewProjectPage() {
    const router = useRouter();
    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [selectedRepo, setSelectedRepo] = useState("");
    const [themeColor, setThemeColor] = useState("#0ea5e9");

    useEffect(() => {
        fetchRepositories();
    }, []);

    async function fetchRepositories() {
        try {
            const res = await fetch("/api/repositories");
            if (res.ok) {
                const data = await res.json();
                setRepositories(data);
            }
        } catch (error) {
            console.error("Error fetching repositories:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!selectedRepo) return;

        setCreating(true);

        try {
            const repo = repositories.find((r) => r.full_name === selectedRepo);
            if (!repo) return;

            const res = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    repoName: repo.name,
                    repoOwner: repo.owner.login,
                    repoFullName: repo.full_name,
                    themeColor,
                }),
            });

            if (res.ok) {
                const project = await res.json();
                router.push(`/dashboard/projects/${project.id}`);
            }
        } catch (error) {
            console.error("Error creating project:", error);
        } finally {
            setCreating(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8 animate-fade-in-up">
                <Link
                    href="/dashboard"
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 mb-4 group"
                >
                    <div className="p-1 rounded-full bg-secondary group-hover:bg-primary/10 transition-colors">
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </div>
                    Назад к проектам
                </Link>
                <h1 className="text-3xl font-bold font-heading">Новый проект</h1>
            </div>

            {loading ? (
                <div className="bg-card rounded-2xl border border-border p-12 text-center animate-fade-in-up [animation-delay:100ms]">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Загрузка репозиториев...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-8 shadow-xl shadow-black/5 animate-fade-in-up [animation-delay:100ms]">
                    <div className="mb-8">
                        <label className="block text-sm font-bold mb-2 text-foreground/80">
                            Выберите репозиторий
                        </label>
                        <div className="relative">
                            <select
                                value={selectedRepo}
                                onChange={(e) => setSelectedRepo(e.target.value)}
                                className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                                required
                            >
                                <option value="">-- Выберите репозиторий --</option>
                                {repositories.map((repo) => (
                                    <option key={repo.id} value={repo.full_name}>
                                        {repo.full_name}
                                        {repo.description && ` - ${repo.description}`}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <label className="block text-sm font-bold mb-2 text-foreground/80">
                            Цвет темы
                        </label>
                        <div className="flex gap-3 items-center">
                            <div className="relative overflow-hidden rounded-lg w-14 h-12 ring-1 ring-border">
                                <input
                                    type="color"
                                    value={themeColor}
                                    onChange={(e) => setThemeColor(e.target.value)}
                                    className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 border-0"
                                />
                            </div>
                            <input
                                type="text"
                                value={themeColor}
                                onChange={(e) => setThemeColor(e.target.value)}
                                className="flex-1 px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
                                placeholder="#0ea5e9"
                            />
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                            Этот цвет будет использоваться для акцентов в вашем виджете.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={creating || !selectedRepo}
                        className="w-full px-6 py-3.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-95 font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                    >
                        {creating ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="animate-spin w-4 h-4 border-2 border-white/50 border-t-white rounded-full" />
                                Создание...
                            </span>
                        ) : (
                            "Создать проект"
                        )}
                    </button>
                </form>
            )}
        </div>
    );
}
