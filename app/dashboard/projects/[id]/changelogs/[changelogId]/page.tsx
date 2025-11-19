"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Save, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Changelog {
    id: string;
    title: string;
    description: string | null;
    type: string;
    status: string;
}

export default function ChangelogEditorPage() {
    const params = useParams();
    const router = useRouter();
    const [changelog, setChangelog] = useState<Changelog | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("FEAT");
    const [status, setStatus] = useState("DRAFT");
    const [showPreview, setShowPreview] = useState(false);

    const fetchChangelog = useCallback(async () => {
        try {
            const res = await fetch(`/api/changelog/${params.changelogId}`);
            if (res.ok) {
                const data = await res.json();
                setChangelog(data);
                setTitle(data.title);
                setDescription(data.description || "");
                setType(data.type);
                setStatus(data.status);
            }
        } catch (error) {
            console.error("Error fetching changelog:", error);
        } finally {
            setLoading(false);
        }
    }, [params.changelogId]);

    useEffect(() => {
        fetchChangelog();
    }, [fetchChangelog]);

    async function handleSave() {
        setSaving(true);
        try {
            const res = await fetch(`/api/changelog/${params.changelogId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, type, status }),
            });

            if (res.ok) {
                router.push(`/dashboard/projects/${params.id}`);
            } else {
                alert("Ошибка сохранения");
            }
        } catch (error) {
            console.error("Error saving:", error);
            alert("Ошибка сохранения");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!confirm("Удалить этот чейнджлог?")) return;

        try {
            const res = await fetch(`/api/changelog/${params.changelogId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                router.push(`/dashboard/projects/${params.id}`);
            } else {
                alert("Ошибка удаления");
            }
        } catch (error) {
            console.error("Error deleting:", error);
            alert("Ошибка удаления");
        }
    }

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!changelog) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
                <h2 className="text-2xl font-bold mb-2">Чейнджлог не найден</h2>
                <Button asChild variant="link">
                    <Link href={`/dashboard/projects/${params.id}`}>Вернуться к проекту</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <Button variant="ghost" asChild className="pl-0 hover:bg-transparent hover:text-primary">
                    <Link href={`/dashboard/projects/${params.id}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Назад к проекту
                    </Link>
                </Button>
            </div>

            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold font-heading">Редактор чейнджлога</h1>
                <div className="flex gap-2">
                    <Button variant="destructive" onClick={handleDelete} size="icon" title="Удалить">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Заголовок</label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Краткое описание изменения"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Тип</label>
                                <div className="relative">
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className="flex h-10 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                                    >
                                        <option value="FEAT">Новое (Feature)</option>
                                        <option value="FIX">Исправлено (Fix)</option>
                                        <option value="IMPROVEMENT">Улучшено (Improvement)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Статус</label>
                                <div className="relative">
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="flex h-10 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                                    >
                                        <option value="DRAFT">Черновик</option>
                                        <option value="PUBLISHED">Опубликовано</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium leading-none">Описание (Markdown)</label>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowPreview(!showPreview)}
                                    className="h-8 text-xs"
                                >
                                    {showPreview ? (
                                        <>
                                            <EyeOff className="mr-2 h-3 w-3" /> Редактировать
                                        </>
                                    ) : (
                                        <>
                                            <Eye className="mr-2 h-3 w-3" /> Превью
                                        </>
                                    )}
                                </Button>
                            </div>

                            {showPreview ? (
                                <div className="min-h-[300px] rounded-xl border border-input bg-muted/30 p-4 prose prose-sm max-w-none dark:prose-invert">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {description || "*Нет описания*"}
                                    </ReactMarkdown>
                                </div>
                            ) : (
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="flex min-h-[300px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono resize-y"
                                    placeholder="Подробное описание изменения..."
                                />
                            )}
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button onClick={handleSave} disabled={saving} size="lg" className="min-w-[150px]">
                                {saving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Сохранение...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Сохранить
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
