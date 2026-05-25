"use client"

import * as React from "react"

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

import { env } from "@/lib/env"

const RECAPTCHA_KEY = env.NEXT_PUBLIC_RECAPTCHA_KEY

let scriptInjected = false

export function useRecaptcha() {
  React.useEffect(() => {
    if (!RECAPTCHA_KEY) return
    if (typeof document === "undefined") return
    if (scriptInjected) return
    if (document.querySelector('script[src*="recaptcha/api.js"]')) {
      scriptInjected = true
      return
    }
    const script = document.createElement("script")
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_KEY}`
    script.async = true
    script.defer = true
    document.head.appendChild(script)
    scriptInjected = true
  }, [])

  const execute = React.useCallback(
    async (action: string): Promise<string | null> => {
      if (!RECAPTCHA_KEY) return null
      if (typeof window === "undefined" || !window.grecaptcha) return null
      const grecaptcha = window.grecaptcha
      await new Promise<void>((resolve) => grecaptcha.ready(() => resolve()))
      return grecaptcha.execute(RECAPTCHA_KEY, { action })
    },
    []
  )

  return { execute, enabled: Boolean(RECAPTCHA_KEY) }
}
