"use client";

import { signOut } from "next-auth/react";
import { LogOut, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Link from "next/link";

export default function SignOutPage() {
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
                    <CardTitle className="text-2xl font-heading">Выйти из аккаунта?</CardTitle>
                    <CardDescription>
                        Вы уверены, что хотите выйти из CommitLog?
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        variant="destructive"
                        className="w-full"
                        size="lg"
                    >
                        <LogOut className="h-5 w-5" />
                        Выйти
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        className="w-full"
                        size="lg"
                    >
                        <Link href="/dashboard">
                            Отмена
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
