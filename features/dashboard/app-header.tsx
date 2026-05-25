"use client"

import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AppBreadcrumbs } from "@/features/dashboard/app-breadcrumbs"
import { NavUser } from "@/features/dashboard/nav-user"
import { Bell, Moon, Search, Sun } from "@/components/icons"
import { useCallback } from "react"

export function AppHeader() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  const handleThemeToggle = useCallback(() => {
    setTheme(isDark ? "light" : "dark")
  }, [isDark, setTheme])

  return (
    <header
      className={cn(
        "sticky top-2 z-50 mx-2 mt-2 flex h-16 shrink-0 items-center gap-3 rounded-2xl border bg-background px-4 shadow-sm md:mx-3 md:mt-3 md:px-6"
      )}
    >
      {/* Left: breadcrumbs */}
      <div className="flex shrink-0 items-center">
        <AppBreadcrumbs />
      </div>

      {/* Center: search with ⌘K hint */}
      <div className="mx-auto flex max-w-sm flex-1 items-center">
        <div className="group relative w-full">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-foreground" />
          <input
            type="search"
            placeholder="Search guests, bookings…"
            className="h-9 w-full rounded-full border border-input bg-background pr-14 pl-9 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
          />
          <kbd className="pointer-events-none absolute top-1/2 right-2 hidden h-5 -translate-y-1/2 items-center gap-0.5 rounded-md border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground sm:inline-flex">
            <span className="text-[11px]">⌘</span>K
          </kbd>
        </div>
      </div>

      {/* Right: notifications + theme + user */}
      <div className="flex shrink-0 items-center gap-2">
        <Button
          aria-label="Notifications"
          size="icon"
          variant="outline"
          className="relative rounded-full"
        >
          <Bell />
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground ring-2 ring-background">
            3
          </span>
        </Button>
        <Button
          aria-label="Toggle theme"
          size="icon"
          variant="outline"
          className="rounded-full"
          onClick={handleThemeToggle}
        >
          <Sun className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        </Button>
        <Separator
          className="h-5 data-[orientation=vertical]:self-center"
          orientation="vertical"
        />
        <NavUser />
      </div>
    </header>
  )
}
