"use client"

import * as React from "react"

import { useAuthorization, type RequiredRole } from "@/features/authorization"

export function RequireAccess({
  minRole,
  fallback,
  children,
}: {
  minRole: RequiredRole
  fallback?: React.ReactNode
  children: React.ReactNode
}) {
  const { effectiveRole, hasAccess } = useAuthorization()

  if (effectiveRole == null) return null
  if (!hasAccess(minRole)) {
    return (
      fallback ?? (
        <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
          You don&apos;t have access to this page.
        </div>
      )
    )
  }
  return <>{children}</>
}
