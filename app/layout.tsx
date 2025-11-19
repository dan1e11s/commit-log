import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
    title: "CommitLog - Автоматический чейнджлог для вашего проекта",
    description: "Автоматизируйте создание чейнджлогов из GitHub коммитов. Красивый виджет для вашего сайта.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru" className={`${inter.variable} ${outfit.variable}`}>
            <body className="antialiased font-sans bg-background text-foreground">
                {children}
            </body>
        </html>
    );
}
