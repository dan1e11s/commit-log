"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
                alert("Сохранено!");
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!changelog) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Чейнджлог не найден</h2>
                    <Link
                        href={`/dashboard/projects/${params.id}`}
                        className="text-blue-600 hover:text-blue-700"
                    >
                        Вернуться к проекту
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <Link href="/dashboard" className="flex items-center gap-2 w-fit">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
                        <span className="text-xl font-bold">CommitLog</span>
                    </Link>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-6">
                    <Link
                        href={`/dashboard/projects/${params.id}`}
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1 w-fit"
                    >
                        <svg
                            className="w-5 h-5"
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
                        Назад к проекту
                    </Link>
                </div>

                <h1 className="text-3xl font-bold mb-8">Редактор чейнджлога</h1>

                <div className="bg-white rounded-lg border p-6 mb-6">
                    <div className="mb-6">
                        <label className="block text-sm font-semibold mb-2">Заголовок</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Краткое описание изменения"
                        />
                    </div>

                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-semibold">Описание (Markdown)</label>
                            <button
                                onClick={() => setShowPreview(!showPreview)}
                                className="text-sm text-blue-600 hover:text-blue-700"
                            >
                                {showPreview ? "Редактировать" : "Превью"}
                            </button>
                        </div>
                        {showPreview ? (
                            <div className="border rounded-lg p-4 min-h-[200px] prose max-w-none">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {description || "*Нет описания*"}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                                rows={10}
                                placeholder="Подробное описание изменения (поддерживается Markdown)"
                            />
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Тип</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="FEAT">Новое</option>
                                <option value="FIX">Исправлено</option>
                                <option value="IMPROVEMENT">Улучшено</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Статус</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="DRAFT">Черновик</option>
                                <option value="PUBLISHED">Опубликовано</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {saving ? "Сохранение..." : "Сохранить"}
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-6 py-3 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition"
                        >
                            Удалить
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
