import React, { useMemo, useState } from "react";
import { Button } from "/imports/ui/components/button";
import { Separator } from "/imports/ui/components/separator";
import { ScrollArea } from "/imports/ui/components/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "/imports/ui/components/tooltip";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "/imports/ui/components/sheet";
import { cn } from "/imports/ui/lib/utils";
import {Menu, ArrowDownCircle, ArrowUpCircle, PiggyBank, ShoppingCart, LogOut} from "lucide-react";
import {TransactionForm} from "/imports/ui/transaction/TransactionForm";

// Navegação básica; troque window.location.href pelo seu roteador (FlowRouter/React Router)
const NAV_ITEMS = [
    { label: "Entradas", icon: ArrowDownCircle, href: "/entradas" },
    { label: "Saídas", icon: ArrowUpCircle, href: "/saidas" },
    { label: "Economias", icon: PiggyBank, href: "/economias" },
    { label: "Listas de compra", icon: ShoppingCart, href: "/listas" },
];

function NavItem({ label, href, Icon, collapsed, active, onClick }) {
    const content = (
        <button
            className={cn(
                "flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm transition cursor-pointer",
                active ? "bg-primary/10 font-medium text-primary" : "hover:bg-muted/80 text-muted-foreground"
            )}
            onClick={() => onClick && onClick(href)}
        >
            <Icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
        </button>
    );

    if (collapsed) {
        return (
            <TooltipProvider delayDuration={300}>
                <Tooltip>
                    <TooltipTrigger asChild>{content}</TooltipTrigger>
                    <TooltipContent side="right">{label}</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    return content;
}

function LogoutItem({ collapsed }) {
    const handleLogout = () => Meteor.logout();

    return (
        <button
            className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-2 text-sm text-muted-foreground hover:bg-muted/80"
            onClick={handleLogout}
        >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="truncate">Sair</span>}
        </button>
    );
}

export default function SidebarLayout({ activePath = "/", defaultExpanded = true, onNavigate, children }) {
    const [collapsed, setCollapsed] = useState(!defaultExpanded);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleNavigate = (href) => {
        if (onNavigate) onNavigate(href);
        setMobileOpen(false);
        if (typeof window !== "undefined") {
            window.location.href = href; // troque pelo seu roteador
        }
    };

    const desktopItems = useMemo(
        () => (
            <>
                {NAV_ITEMS.map((it) => (
                    <NavItem
                        className={"cursor-pointer"}
                        key={it.href}
                        label={it.label}
                        href={it.href}
                        Icon={it.icon}
                        collapsed={collapsed}
                        active={activePath === it.href}
                        onClick={handleNavigate}
                    />
                ))}
                <Separator className="my-2" />
                <LogoutItem collapsed={collapsed} />
            </>
        ),
        [collapsed, activePath]
    );

    return (
        <div className="flex min-h-screen w-full bg-background">
            <aside className={cn("hidden border-r bg-card/30 backdrop-blur supports-[backdrop-filter]:bg-card/50 md:block", collapsed ? "w-[76px]" : "w-64")}>
                <div className="flex h-16 items-center gap-2 px-3">
                    <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setCollapsed((c) => !c)} aria-label={collapsed ? "Expandir menu" : "Recolher menu"}>
                        <Menu className="h-5 w-5" />
                    </Button>
                    {!collapsed && <span className="text-base font-semibold tracking-tight">Organizador Financeiro</span>}
                </div>
                <Separator />
                <ScrollArea className="h-[calc(100vh-4rem)] px-2 py-3">
                    <nav className="flex flex-col gap-1">{desktopItems}</nav>
                </ScrollArea>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex h-14 items-center gap-2 border-b px-3 md:hidden">
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-xl">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-72 p-0">
                            <SheetHeader className="px-4 py-3">
                                <SheetTitle>Meu Financeiro</SheetTitle>
                            </SheetHeader>
                            <Separator />
                            <div className="p-2">
                                <nav className="flex flex-col gap-1">
                                    {NAV_ITEMS.map((it) => (
                                        <NavItem
                                            key={it.href}
                                            label={it.label}
                                            href={it.href}
                                            Icon={it.icon}
                                            collapsed={false}
                                            active={activePath === it.href}
                                            onClick={handleNavigate}
                                        />
                                    ))}
                                </nav>
                            </div>
                        </SheetContent>
                    </Sheet>
                    <span className="text-sm font-semibold">{(NAV_ITEMS.find((i) => i.href === activePath) || {}).label || "Dashboard"}</span>
                </div>

                <main className="min-h-[calc(100vh-3.5rem)] p-4 md:min-h-[calc(100vh-4rem)] md:p-6">
                    {children || (
                        <div className="grid place-items-center rounded-2xl border p-10 text-center text-muted-foreground">
                            <div>
                                <h1 className="mb-2 text-xl font-semibold tracking-tight">Bem-vindo 👋</h1>
                                <p>Escolha uma opção no menu lateral.</p>

                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
