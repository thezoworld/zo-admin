"use client"

import * as React from "react"

import { authStorageKeys, isExpiryValid } from "@/lib/auth/storage-keys"

export type TokenStatus = "ok" | "expiring" | "expired" | "unknown"

/**
 * Watches a session's `${prefix}-token-expiry` localStorage entry and
 * returns a coarse-grained status. The check ticks every 30s; consumers
 * can use the returned status to schedule refreshes, show banners, etc.
 *
 * `warningSeconds` is how long before expiry to flip to "expiring".
 */
export function useTokenExpiry(
  prefix: string,
  warningSeconds = 5 * 60
): TokenStatus {
  const [status, setStatus] = React.useState<TokenStatus>(() =>
    typeof window === "undefined" ? "unknown" : compute(prefix, warningSeconds)
  )

  React.useEffect(() => {
    function tick() {
      setStatus(compute(prefix, warningSeconds))
    }
    tick()
    const id = setInterval(tick, 30_000)
    window.addEventListener("focus", tick)
    return () => {
      clearInterval(id)
      window.removeEventListener("focus", tick)
    }
  }, [prefix, warningSeconds])

  return status
}

function compute(prefix: string, warningSeconds: number): TokenStatus {
  const keys = authStorageKeys(prefix)
  const raw = localStorage.getItem(keys.expiry)
  if (!raw) return "unknown"
  const expiryMs = new Date(raw).getTime()
  if (!Number.isFinite(expiryMs)) return "unknown"
  if (!isExpiryValid(raw)) return "expired"
  if (expiryMs - Date.now() < warningSeconds * 1000) return "expiring"
  return "ok"
}
