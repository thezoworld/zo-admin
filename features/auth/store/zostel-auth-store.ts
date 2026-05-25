"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { useShallow } from "zustand/react/shallow"

import { setZostelServerHeaders } from "@/lib/api"
import { isExpiryValid } from "@/lib/auth/storage-keys"
import type { AuthUser } from "@/lib/definitions"
import { env } from "@/lib/env"

const STORAGE_KEY = "zo-pms-zostel-auth"

// The legacy provider sent `Client-User-Id: randomString(10)` on every
// Zostel call. The backend stores that string as the account's `user_id`
// when it creates the AN-XXX → UA-XXX record on activate, and the JWT
// echoes it back in the `user_id` claim. Skipping this header on the
// pre-login calls is what produces `user_id: null` accounts that 401
// on every subsequent authenticated call.
function genPreAuthUserId(): string {
  return Math.random().toString(36).slice(2, 12).padEnd(10, "0")
}

type ZostelAuthState = {
  user: AuthUser | null
  token: string | null
  expiry: string | null
  preAuthUserId: string
  hasHydrated: boolean
}

type ZostelAuthActions = {
  login: (
    user: AuthUser,
    userToken: string,
    tokenExpiry: number | string
  ) => void
  logout: () => void
  applyHeaders: () => void
  setHasHydrated: (value: boolean) => void
}

export type ZostelAuthStore = ZostelAuthState & ZostelAuthActions

export const useZostelAuthStore = create<ZostelAuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      expiry: null,
      preAuthUserId: genPreAuthUserId(),
      hasHydrated: false,

      login(user, userToken, tokenExpiry) {
        set({ user, token: userToken, expiry: String(tokenExpiry) })
        get().applyHeaders()
      },

      logout() {
        // Rotate the pre-auth user id so the next login seeds a fresh
        // backend record instead of colliding with the previous session.
        set({
          user: null,
          token: null,
          expiry: null,
          preAuthUserId: genPreAuthUserId(),
        })
        get().applyHeaders()
      },

      applyHeaders() {
        if (typeof window === "undefined") return
        const { user, token, expiry, preAuthUserId } = get()
        // `Client-User-Id` must always be present on Zostel calls. Pre-login
        // it's the random `preAuthUserId` (which the activate response writes
        // back as the new account's `user_id`); post-login it's the JWT's
        // `user_id` claim. Sending `user.id` (Zo `UA-XXXXXX`) would 401.
        const userId = user?.user_id ?? preAuthUserId

        const headers: Record<string, string> = {
          "Client-App-Id": env.NEXT_PUBLIC_ZOSTEL_APP_ID,
          "Client-User-Id": userId,
        }
        if (token && user?.user_id && isExpiryValid(expiry)) {
          headers.Authorization = `Bearer ${token}`
        }
        setZostelServerHeaders(headers)
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
        preAuthUserId: state.preAuthUserId,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error || !state) return
        if (!isExpiryValid(state.expiry)) {
          state.user = null
          state.token = null
          state.expiry = null
        }
        // Guard against an older persisted shape that doesn't include the
        // pre-auth id — generate one on the fly.
        if (!state.preAuthUserId) state.preAuthUserId = genPreAuthUserId()
        state.applyHeaders()
        state.setHasHydrated(true)
      },
    }
  )
)

if (typeof window !== "undefined") {
  window.addEventListener("storage", function syncFromOtherTab(event) {
    if (event.key === STORAGE_KEY) {
      void useZostelAuthStore.persist.rehydrate()
    }
  })
}

export function useZostelAuth() {
  return useZostelAuthStore(
    useShallow(function selectZostelAuth(state) {
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
