import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ArrowRight, Check, Github, Layout, Zap, Shield, Code2, Sparkles } from "lucide-react";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      {/* Background Gradients */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30 animate-pulse mix-blend-multiply" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-30 animate-pulse delay-1000 mix-blend-multiply" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl opacity-50 animate-blob" />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <Code2 size={20} />
            </div>
            CommitLog
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Возможности</Link>
            <Link href="#pricing" className="hover:text-foreground transition-colors">Цены</Link>
            <Link href="https://github.com" target="_blank" className="hover:text-foreground transition-colors">GitHub</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/api/auth/signin"
              className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Войти
            </Link>
            <Link
              href="/api/auth/signin"
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-95"
            >
              <Github size={16} />
              Start for free
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 md:pt-40 md:pb-32 container mx-auto px-4 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border text-xs font-medium text-secondary-foreground mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            v1.0 Public Beta is live
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading tracking-tight mb-6 animate-fade-in-up [animation-delay:200ms]">
            Превратите ваши <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">коммиты</span><br />
            в красивый чейнджлог
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up [animation-delay:400ms]">
            Автоматически синхронизируйте историю изменений из GitHub.
            Встраивайте виджет обновлений на сайт за 2 минуты.
            Никакой ручной работы.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up [animation-delay:600ms]">
            <Link
              href="/api/auth/signin"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3.5 rounded-full font-medium text-lg transition-all hover:shadow-xl hover:shadow-primary/25 active:scale-95"
            >
              <Github size={20} />
              Подключить GitHub
            </Link>
            <Link
              href="#demo"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-8 py-3.5 rounded-full font-medium text-lg transition-all active:scale-95"
            >
              Смотреть демо
            </Link>
          </div>

          {/* UI Preview */}
          <div className="mt-20 relative mx-auto max-w-5xl animate-fade-in-up [animation-delay:800ms]">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-20"></div>
            <div className="relative rounded-xl border border-white/10 bg-black/5 backdrop-blur-md shadow-2xl overflow-hidden ring-1 ring-white/20">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                </div>
                <div className="ml-4 flex-1 text-center pr-14">
                  <div className="inline-flex items-center justify-center px-3 py-0.5 rounded-md bg-black/10 text-[10px] text-muted-foreground font-mono border border-white/5 shadow-inner">
                    commitlog.io/widget-preview
                  </div>
                </div>
              </div>
              <div className="p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6 text-left">
                  <div className="space-y-2">
                    <div className="h-2 w-20 bg-primary/20 rounded-full" />
                    <h3 className="text-2xl font-bold">Что нового в версии 2.0</h3>
                    <p className="text-muted-foreground">Мы полностью переработали интерфейс и добавили темную тему.</p>
                  </div>
                  <div className="space-y-3">
                    {[
                      { type: 'feat', text: 'Добавлена поддержка темной темы' },
                      { type: 'fix', text: 'Исправлен баг с авторизацией' },
                      { type: 'improvement', text: 'Ускорено время загрузки на 40%' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${item.type === 'feat' ? 'bg-green-500/10 text-green-600' :
                          item.type === 'fix' ? 'bg-blue-500/10 text-blue-600' :
                            'bg-gray-500/10 text-gray-600'
                          }`}>
                          {item.type}
                        </span>
                        <span className="text-sm font-medium">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  {/* Abstract representation of the widget */}
                  <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4">
                    <div className="w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center animate-bounce">
                      <Sparkles className="text-white" />
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">3</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Всё, что нужно для чейнджлога</h2>
              <p className="text-muted-foreground text-lg">
                Мы автоматизируем рутину, чтобы вы могли сосредоточиться на написании кода, а не отчетов об обновлениях.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Github className="w-6 h-6 text-white" />,
                  color: "bg-gray-900",
                  title: "GitHub Синхронизация",
                  desc: "Подключите репозиторий и мы автоматически подтянем все коммиты."
                },
                {
                  icon: <Layout className="w-6 h-6 text-white" />,
                  color: "bg-blue-500",
                  title: "Готовый Виджет",
                  desc: "Вставьте одну строчку кода и получите красивый виджет обновлений на сайте."
                },
                {
                  icon: <Zap className="w-6 h-6 text-white" />,
                  color: "bg-yellow-500",
                  title: "Semantic Commits",
                  desc: "Автоматическое определение типа изменений (feat, fix) по заголовкам коммитов."
                },
                {
                  icon: <Shield className="w-6 h-6 text-white" />,
                  color: "bg-green-500",
                  title: "Полный контроль",
                  desc: "Редактируйте описания перед публикацией. Ничего не уйдет в продакшн без вашего ведома."
                },
                {
                  icon: <Sparkles className="w-6 h-6 text-white" />,
                  color: "bg-purple-500",
                  title: "Премиум Дизайн",
                  desc: "Виджет выглядит профессионально и вписывается в любой современный интерфейс."
                },
                {
                  icon: <Code2 className="w-6 h-6 text-white" />,
                  color: "bg-red-500",
                  title: "Для разработчиков",
                  desc: "API доступ, TypeScript поддержка и легковесный скрипт без зависимостей."
                }
              ].map((feature, i) => (
                <div key={i} className="group relative p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 overflow-hidden">
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 ${feature.color.replace('bg-', 'bg-gradient-to-br from-transparent to-')}`} />
                  <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 shadow-lg shadow-primary/5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold font-heading mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Простые и честные цены</h2>
              <p className="text-muted-foreground text-lg">
                Начните бесплатно, платите когда вырастете.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Plan */}
              <div className="p-8 rounded-3xl border border-border bg-card relative hover:border-primary/30 transition-colors duration-300">
                <h3 className="text-2xl font-bold font-heading mb-2">Hobby</h3>
                <div className="text-4xl font-bold font-heading mb-6">$0 <span className="text-lg font-normal text-muted-foreground font-sans">/ мес</span></div>
                <p className="text-muted-foreground mb-8">Идеально для пет-проектов и инди-хакеров.</p>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-500" />
                    </div>
                    <span>1 Проект</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-500" />
                    </div>
                    <span>10 последних обновлений</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-500" />
                    </div>
                    <span>Базовая аналитика</span>
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-6 h-6 rounded-full border border-muted-foreground/30 flex items-center justify-center text-[10px]">i</div>
                    <span>Брендинг CommitLog</span>
                  </li>
                </ul>

                <Link href="/api/auth/signin" className="block w-full py-3 px-6 text-center rounded-xl border border-border font-medium hover:bg-muted transition-colors">
                  Начать бесплатно
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="p-8 rounded-3xl border border-primary/20 bg-primary/5 relative shadow-2xl shadow-primary/10 hover:shadow-primary/20 transition-all duration-300 scale-105 ring-1 ring-primary/20">
                <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">
                  POPULAR
                </div>
                <h3 className="text-2xl font-bold font-heading mb-2 text-primary">Pro</h3>
                <div className="text-4xl font-bold font-heading mb-6">$9 <span className="text-lg font-normal text-muted-foreground font-sans">/ мес</span></div>
                <p className="text-muted-foreground mb-8">Для серьезных проектов и стартапов.</p>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span>Безлимитные проекты</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span>Безлимитная история</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span>Приоритетная поддержка</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span>Без брендинга</span>
                  </li>
                </ul>

                <Link href="/api/auth/signin" className="block w-full py-3 px-6 text-center rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 hover:shadow-primary/40">
                  Подключить Pro
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-lg">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Code2 size={18} />
            </div>
            <span className="font-heading tracking-tight">CommitLog</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2024 CommitLog. All rights reserved.
          </div>
          <div className="flex gap-8">
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors hover:underline underline-offset-4">Twitter</Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors hover:underline underline-offset-4">GitHub</Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors hover:underline underline-offset-4">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
