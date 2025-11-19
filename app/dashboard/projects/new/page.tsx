"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Github, Loader2, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Repository {
    id: number;
    name: string;
    full_name: string;
    private: boolean;
}

export default function NewProjectPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [selectedRepo, setSelectedRepo] = useState<string>("");
    const [themeColor, setThemeColor] = useState("#0ea5e9");

    useEffect(() => {
        fetch("/api/repositories")
            .then((res) => res.json())
            .then((data) => {
                setRepositories(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch repositories", err);
                setLoading(false);
            });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRepo) return;

        setSubmitting(true);
        const repo = repositories.find((r) => r.id.toString() === selectedRepo);

        if (!repo) return;

        try {
            const res = await fetch("/api/projects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    repoName: repo.name,
                    repoOwner: repo.full_name.split("/")[0],
                    repoFullName: repo.full_name,
                    themeColor,
                }),
            });

            if (res.ok) {
                const project = await res.json();
                router.push(`/dashboard/projects/${project.id}`);
            }
        } catch (error) {
            console.error("Failed to create project", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <Button variant="ghost" asChild className="pl-0 hover:bg-transparent hover:text-primary">
                    <Link href="/dashboard">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Назад к проектам
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Новый проект</CardTitle>
                    <CardDescription>Подключите репозиторий GitHub для отслеживания изменений.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Выберите репозиторий
                            </label>
                            <div className="relative">
                                <select
                                    className="flex h-10 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                                    value={selectedRepo}
                                    onChange={(e) => setSelectedRepo(e.target.value)}
                                    required
                                >
                                    <option value="">Выберите репозиторий...</option>
                                    {repositories.map((repo) => (
                                        <option key={repo.id} value={repo.id}>
                                            {repo.full_name} {repo.private ? "(Private)" : ""}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-2.5 pointer-events-none text-muted-foreground">
                                    <Github size={16} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Цвет темы виджета
                            </label>
                            <div className="flex items-center gap-4">
                                <Input
                                    type="color"
                                    value={themeColor}
                                    onChange={(e) => setThemeColor(e.target.value)}
                                    className="w-12 h-12 p-1 rounded-lg cursor-pointer"
                                />
                                <div className="flex-1">
                                    <div
                                        className="h-10 rounded-lg flex items-center justify-center text-white text-sm font-medium shadow-sm transition-colors"
                                        style={{ backgroundColor: themeColor }}
                                    >
                                        Предпросмотр кнопки
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={submitting || !selectedRepo}>
                            {submitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Создание...
                                </>
                            ) : (
                                <>
                                    <Check className="mr-2 h-4 w-4" />
                                    Создать проект
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
