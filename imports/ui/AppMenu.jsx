import React, { useMemo, useState } from "react";
import { Button } from "/imports/ui/components/button";
import { Separator } from "/imports/ui/components/separator";
import { ScrollArea } from "/imports/ui/components/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "/imports/ui/components/tooltip";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "/imports/ui/components/sheet";
import { cn } from "/imports/ui/lib/utils";
import {Menu, ArrowDownCircle, ArrowUpCircle, PiggyBank, ShoppingCart, LogOut} from "lucide-react";
import {NavLink, Outlet, useLocation} from "react-router-dom";

const NAV_ITEMS = [
    { label: "Entradas", icon: ArrowDownCircle, href: "/entradas" },
    { label: "Saídas", icon: ArrowUpCircle, href: "/saidas" },
    { label: "Economias", icon: PiggyBank, href: "/economias" },
    { label: "Listas de compra", icon: ShoppingCart, href: "/listas" },
];

function NavItem({ label, href, Icon, collapsed }) {
    const content = (
        <NavLink
            to={href}
            onClick={() => onNavigate?.(href)}
            className={({ isActive }) =>
                cn(
                    "flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm transition cursor-pointer",
                    isActive ? "bg-primary/10 font-medium text-primary" : "hover:bg-muted/80 text-muted-foreground"
                )
            }
            end
        >
            <Icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
        </NavLink>
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
    const location = useLocation();

    const handleNavigate = () => setMobileOpen(false);

    const title = useMemo(
        () => (NAV_ITEMS.find((i) => i.href === location.pathname)?.label ?? "Dashboard"),
        [location.pathname]
    );

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
                                        />
                                    ))}
                                </nav>
                            </div>
                        </SheetContent>
                    </Sheet>
                    <span className="text-sm font-semibold">{(NAV_ITEMS.find((i) => i.href === activePath) || {}).label || "Dashboard"}</span>
                </div>

                <aside className={cn("hidden border-r bg-card/30 backdrop-blur supports-[backdrop-filter]:bg-card/50 md:block")}>
                    <div className="flex h-16 items-center gap-2 px-3">
                        <span className="text-base font-semibold tracking-tight">{title}</span>
                    </div>
                    <Separator />
                </aside>
                <main className="min-h-[calc(100vh-3.5rem)] p-4 md:min-h-[calc(100vh-4rem)] md:p-6">
                    {children ?? <Outlet />}
                </main>
            </div>
        </div>
    );
}
