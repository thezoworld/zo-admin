"use client"

import * as React from "react"
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"

import { useAuthStore, useZostelAuthStore } from "@/features/auth"
import { errorStatus } from "@/lib/api"

const isServer = typeof window === "undefined"

function handleAuthError(error: unknown) {
  if (isServer) return
  // Only 401 means the session is invalid. 403 ("authenticated but not
  // permitted") is handled per-route by AccessDenied — we must not log
  // those users out.
  if (errorStatus(error) !== 401) return

  useAuthStore.getState().logout()
  useZostelAuthStore.getState().logout()
  if (window.location.pathname !== "/login") {
    window.location.assign("/login")
  }
}

function makeQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({ onError: handleAuthError }),
    mutationCache: new MutationCache({ onError: handleAuthError }),
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
      mutations: {
        retry: 0,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined

function getQueryClient() {
  if (isServer) return makeQueryClient()
  if (!browserQueryClient) browserQueryClient = makeQueryClient()
  return browserQueryClient
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const client = getQueryClient()
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
