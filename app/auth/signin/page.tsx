"use client";

import { signIn } from "next-auth/react";
import { Github, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary flex items-center justify-center p-4">
            {/* Background Gradients */}
            <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 animate-pulse mix-blend-multiply" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl opacity-20 animate-pulse delay-1000 mix-blend-multiply" />
            </div>

            <Card className="w-full max-w-md glass">
                <CardHeader className="text-center space-y-2">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
                            <Code2 size={32} />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-heading">Добро пожаловать в CommitLog</CardTitle>
                    <CardDescription>
                        Войдите с помощью GitHub для управления чейнджлогами ваших проектов
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button
                        onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                        className="w-full"
                        size="lg"
                    >
                        <Github className="h-5 w-5" />
                        Войти с GitHub
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                        Нажимая &quot;Войти с GitHub&quot;, вы соглашаетесь предоставить доступ к вашим репозиториям
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
