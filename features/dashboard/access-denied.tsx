"use client"

import { useRouter } from "next/navigation"

import { useAuth } from "@/features/auth"
import { Button } from "@/components/ui/button"

export function AccessDenied() {
  const router = useRouter()
  const { logout } = useAuth()

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-3 p-8 text-center">
      <h1 className="text-xl font-semibold">Access Denied</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        You don&apos;t have access to this app. Try logging in with a different
        account.
      </p>
      <Button
        type="button"
        className="mt-2"
        onClick={() => {
          logout()
          router.replace("/login")
        }}
      >
        Logout
      </Button>
    </div>
  )
}
