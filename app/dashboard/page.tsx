"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { navigationLinks } from "@/features/dashboard"
import { useAuthorization } from "@/features/authorization"

export default function DashboardPage() {
  const router = useRouter()
  const { effectiveRole, hasAccess, selectedOperator } = useAuthorization()

  React.useEffect(() => {
    if (effectiveRole === null || effectiveRole === "none") return

    for (const set of navigationLinks) {
      for (const link of set.list) {
        if (!hasAccess(link.minAccess)) continue
        if (link.requiredDataKey) {
          const data = selectedOperator?.data as
            | Record<string, unknown>
            | undefined
          if (data?.[link.requiredDataKey] == null) continue
        }
        router.replace(link.link)
        return
      }
    }
  }, [effectiveRole, hasAccess, selectedOperator, router])

  return (
    <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
      Loading…
    </div>
  )
}
