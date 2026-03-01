"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function Header() {
  const { data } = useSession();

  return (
    <header className="flex items-center justify-between border-b border-border/70 bg-card/40 px-4 py-3">
      <div className="text-sm text-muted-foreground">AI-powered anime discovery & tracking</div>
      <div className="flex items-center gap-2">
        {data?.user ? (
          <>
            <span className="text-sm text-muted-foreground">{data.user.email}</span>
            <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
              Выйти
            </Button>
          </>
        ) : (
          <>
            <Button asChild variant="outline">
              <Link href="/login">Войти</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Регистрация</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
