"use client"

import {
  buildActivateZostelPayload,
  parseZostelActivateResponse,
  parseZostelCredsResponse,
  zostelLoginArgs,
} from "@/features/auth/services/login.service"
import { useZostelAuth } from "@/features/auth"
import { unwrap } from "@/lib/api"
import { useMutationApi } from "@/hooks/use-mutation-api"

/**
 * Post-Zo-login chain: request Zostel credentials, activate the Zostel
 * session, and seed the Zostel auth store. Failure is swallowed (logged
 * to the console) — the Zo login itself remains valid and the user lands
 * on the dashboard either way; missing Zostel permissions surface later
 * as an AccessDenied screen.
 *
 * Single responsibility: the activation sub-flow. The orchestrating
 * login hook calls `activate()` after a successful Zo verify.
 */
export function useZostelActivation() {
  const zostelAuth = useZostelAuth()
  const requestZostelCreds = useMutationApi("AUTH_REQUEST_OTP_ZOSTEL")
  const activateZostel = useMutationApi("AUTH_ACTIVATE")

  async function activate(): Promise<void> {
    try {
      const credsResponse = await requestZostelCreds.mutateAsync({ data: {} })
      const creds = parseZostelCredsResponse(unwrap(credsResponse) as never)
      if (!creds) return

      const activateResponse = await activateZostel.mutateAsync({
        data: buildActivateZostelPayload(creds),
      })
      const activated = parseZostelActivateResponse(
        unwrap(activateResponse) as never
      )
      if (activated) {
        zostelAuth.login(...zostelLoginArgs(activated))
      }
      // If `activated` is null the user has no Zostel provisioning (typically
      // a missing `user_id`). The Zo login itself remains valid; AccessDenied
      // will render once the dashboard tries to read a Zostel-only resource.
    } catch (zostelErr) {
      console.error("[zostel-activate] failed", zostelErr)
    }
  }

  return {
    activate,
    isActivating: requestZostelCreds.isPending || activateZostel.isPending,
  }
}
