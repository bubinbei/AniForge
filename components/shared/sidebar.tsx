"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { Home, ListChecks, Library, Shield, User } from "lucide-react";

import { cn } from "@/lib/utils/cn";

const links: Array<{ href: Route; label: string; icon: typeof Home }> = [
  { href: "/", label: "Главная", icon: Home },
  { href: "/catalog", label: "Каталог", icon: Library },
  { href: "/my-list", label: "Мой список", icon: ListChecks },
  { href: "/profile", label: "Профиль", icon: User },
  { href: "/admin", label: "Админ", icon: Shield }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-r border-border/70 bg-card/40 p-4 md:w-64">
      <div className="mb-6 text-xl font-bold text-primary">AniForge</div>
      <nav className="flex flex-col gap-2">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                active ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
