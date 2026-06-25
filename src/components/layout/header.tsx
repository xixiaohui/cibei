"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Menu, X } from "lucide-react";
import { SearchBar } from "./search-bar";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "@/lib/auth-client";

const NAV_ITEMS = [
  { href: "/sutras", label: "经典库" },
  { href: "/stories", label: "佛经故事" },
  { href: "/dictionary", label: "词典" },
  { href: "/encyclopedia", label: "百科" },
] as const;

export function Header() {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 group"
            onClick={closeMenu}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/10 group-hover:bg-accent/15 transition-colors">
              <BookOpen className="h-4 w-4 text-accent" />
            </div>
            <span className="text-lg font-semibold tracking-tight font-[family-name:var(--font-serif)]">
              慈悲空间
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-accent" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Search + Auth */}
          <div className="hidden md:flex items-center gap-2.5">
            <SearchBar />
            {isPending ? (
              <div className="h-8 w-14 bg-muted rounded-md animate-pulse" />
            ) : session?.user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground/70 hidden lg:inline">
                  {session.user.name || session.user.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  登出
                </Button>
              </div>
            ) : (
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  登录
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 -mr-2 rounded-md text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "关闭菜单" : "打开菜单"}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 top-16 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            onClick={closeMenu}
          />

          {/* Menu panel */}
          <div className="relative bg-background border-b border-border/40 shadow-lg animate-in slide-in-from-top-2 duration-200">
            <div className="px-5 py-6 space-y-6">
              {/* Search */}
              <SearchBar />

              {/* Nav */}
              <nav className="space-y-0.5">
                {NAV_ITEMS.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? "bg-accent/5 text-accent"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Auth */}
              <div className="pt-4 border-t border-border/30">
                {isPending ? (
                  <div className="h-9 w-20 bg-muted rounded-md animate-pulse" />
                ) : session?.user ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground truncate mr-2">
                      {session.user.name || session.user.email}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { signOut(); closeMenu(); }}
                      className="text-xs text-muted-foreground hover:text-foreground shrink-0"
                    >
                      登出
                    </Button>
                  </div>
                ) : (
                  <Link href="/auth/login" onClick={closeMenu}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      登录
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
