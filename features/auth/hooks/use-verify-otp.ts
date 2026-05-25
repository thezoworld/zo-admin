"use client"

import {
  buildVerifyOtpPayload,
  parseLoginResponse,
} from "@/features/auth/services/login.service"
import type { LoginMobileResponse, SubmittedPhone } from "@/features/auth/types"
import { unwrap } from "@/lib/api"
import { useMutationApi } from "@/hooks/use-mutation-api"

/**
 * Owns the AUTH_LOGIN_MOBILE mutation. `verify` throws on network/HTTP
 * errors (the caller inspects status via `errorStatus()`) and resolves
 * to `null` when the server returned 200 with a malformed body.
 */
export function useVerifyOtp() {
  const verifyOtp = useMutationApi("AUTH_LOGIN_MOBILE")

  async function verify(
    submitted: SubmittedPhone,
    otp: string
  ): Promise<LoginMobileResponse | null> {
    const response = await verifyOtp.mutateAsync({
      data: buildVerifyOtpPayload(submitted, otp),
    })
    return parseLoginResponse(unwrap(response) as never)
  }

  return {
    verify,
    isVerifying: verifyOtp.isPending,
  }
}
