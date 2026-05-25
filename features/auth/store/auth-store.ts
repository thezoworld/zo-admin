"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { useShallow } from "zustand/react/shallow"

import { setZoServerHeaders } from "@/lib/api"
import { getDeviceId, getDeviceSecret } from "@/lib/auth/device"
import { isExpiryValid } from "@/lib/auth/storage-keys"
import type { AuthUser } from "@/lib/definitions"
import { env } from "@/lib/env"

const STORAGE_KEY = "zo-pms-auth"

type AuthState = {
  user: AuthUser | null
  token: string | null
  expiry: string | null
  deviceId: string
  deviceSecret: string
  hasHydrated: boolean
}

type AuthActions = {
  login: (user: AuthUser, token: string, expiry: number | string) => void
  logout: () => void
  applyHeaders: () => void
  setHasHydrated: (value: boolean) => void
}

export type AuthStore = AuthState & AuthActions

function freshDevice() {
  const id = getDeviceId()
  return { id, secret: getDeviceSecret(id) }
}

const initialDevice = freshDevice()

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      expiry: null,
      deviceId: initialDevice.id,
      deviceSecret: initialDevice.secret,
      hasHydrated: false,

      login(user, token, expiry) {
        set({ user, token, expiry: String(expiry) })
        get().applyHeaders()
      },

      logout() {
        const next = freshDevice()
        set({
          user: null,
          token: null,
          expiry: null,
          deviceId: next.id,
          deviceSecret: next.secret,
        })
        get().applyHeaders()
      },

      applyHeaders() {
        if (typeof window === "undefined") return
        const { token, deviceId, deviceSecret, user, expiry } = get()
        const headers: Record<string, string> = {
          "client-device-id": deviceId,
          "client-device-secret": deviceSecret,
          "client-key": env.NEXT_PUBLIC_APP_ID,
        }
        if (token && user?.id && isExpiryValid(expiry)) {
          headers.Authorization = `Bearer ${token}`
        }
        setZoServerHeaders(headers)
      },

      setHasHydrated(value) {
        set({ hasHydrated: value })
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        expiry: state.expiry,
        deviceId: state.deviceId,
        deviceSecret: state.deviceSecret,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error || !state) return
        if (!isExpiryValid(state.expiry)) {
          state.user = null
          state.token = null
          state.expiry = null
        }
        state.applyHeaders()
        state.setHasHydrated(true)
      },
    }
  )
)

// Cross-tab sync: when another tab logs in or out, mirror the change here.
if (typeof window !== "undefined") {
  window.addEventListener("storage", function syncFromOtherTab(event) {
    if (event.key === STORAGE_KEY) {
      void useAuthStore.persist.rehydrate()
    }
  })
}

/**
 * Read-only view of the auth state. Returned shape matches the original
 * Context API so call sites don't change.
 *
 * `isLoggedIn` is `null` until the store has hydrated from localStorage,
 * then `true` / `false`. This lets the dashboard skeleton stay on screen
 * while we resolve the session from storage instead of flashing a redirect.
 */
export function useAuth() {
  return useAuthStore(
    useShallow(function selectAuth(state) {
      return {
        user: state.user,
        isLoggedIn: state.hasHydrated
          ? Boolean(
              state.user?.id && state.token && isExpiryValid(state.expiry)
            )
          : (null as boolean | null),
        login: state.login,
        logout: state.logout,
      }
    })
  )
}
