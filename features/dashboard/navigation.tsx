"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { Logout01Icon } from "@hugeicons/core-free-icons"

import { navigationLinks } from "@/features/dashboard/navigation-links"
import { cn } from "@/lib/utils"
import { useAuth } from "@/features/auth"
import { useAuthorization } from "@/features/authorization"
import { NavIcon } from "@/features/dashboard/nav-icon"

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout, user } = useAuth()
  const { selectedOperator, hasAccess, effectiveRole } = useAuthorization()

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === href
    return pathname === href || pathname?.startsWith(`${href}/`)
  }

  return (
    <aside className="sticky top-0 left-0 flex h-svh w-64 flex-shrink-0 flex-col border-r border-border bg-card">
      <div className="flex items-center gap-3 border-b border-border px-5 py-5">
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold">
            {(selectedOperator?.name as string) || "Zo Admin"}
          </span>
          {effectiveRole && effectiveRole !== "none" ? (
            <span className="text-xs text-muted-foreground capitalize">
              {effectiveRole.replace(/-/g, " ")}
            </span>
          ) : null}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {navigationLinks.map((set) => {
          const visibleLinks = set.list.filter((link) => {
            if (!hasAccess(link.minAccess)) return false
            if (link.requiredDataKey) {
              const data = selectedOperator?.data as
                | Record<string, unknown>
                | undefined
              if (data?.[link.requiredDataKey] == null) return false
            }
            return true
          })
          if (visibleLinks.length === 0) return null
          return (
            <ul key={set.id || set.title || "default"} className="space-y-0.5">
              {set.title ? (
                <li className="px-3 pt-2 pb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {set.title}
                </li>
              ) : null}
              {visibleLinks.map((link) => {
                const active = isActive(link.link)
                return (
                  <li key={link.id}>
                    <Link
                      href={link.link}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-accent text-accent-foreground"
                          : "text-foreground hover:bg-muted"
                      )}
                    >
                      <NavIcon name={link.iconName} className="size-4" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )
        })}
      </nav>

      <div className="flex items-center justify-between gap-2 border-t border-border px-3 py-3">
        <div className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
          {user?.first_name || user?.email_address || user?.mobile_number}
        </div>
        <button
          type="button"
          onClick={() => {
            logout()
            router.replace("/login")
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs hover:bg-muted"
        >
          <HugeiconsIcon icon={Logout01Icon} className="size-3.5" />
          Logout
        </button>
      </div>
    </aside>
  )
}
