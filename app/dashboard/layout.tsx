"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { useAuth } from "@/features/auth"
import { useAuthorization } from "@/features/authorization"
import { AccessDenied } from "@/features/dashboard"
import { DashboardShellSkeleton } from "@/features/dashboard"
import { AppShell } from "@/features/dashboard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  const { effectiveRole } = useAuthorization()

  React.useEffect(() => {
    if (isLoggedIn === false) {
      router.replace("/login")
    }
  }, [isLoggedIn, router])

  if (isLoggedIn !== true || effectiveRole === null) {
    return <DashboardShellSkeleton />
  }

  if (effectiveRole === "none") {
    return <AccessDenied />
  }

  return <AppShell>{children}</AppShell>
}
