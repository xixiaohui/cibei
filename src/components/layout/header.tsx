"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { SearchBar } from "./search-bar";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "@/lib/auth-client";

const NAV_ITEMS = [
  { href: "/sutras", label: "经典库" },
  { href: "/dictionary", label: "词典" },
  { href: "/encyclopedia", label: "百科" },
] as const;

export function Header() {
  const { data: session, isPending } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <BookOpen className="h-6 w-6 text-accent" />
          <span className="text-xl font-semibold tracking-tight">慈悲空间</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Search + Auth */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <SearchBar />
          </div>
          {isPending ? (
            <div className="h-8 w-16 bg-muted rounded animate-pulse" />
          ) : session?.user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{session.user.name || session.user.email}</span>
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                登出
              </Button>
            </div>
          ) : (
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">登录</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
