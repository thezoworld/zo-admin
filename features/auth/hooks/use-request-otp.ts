"use client"

import type { CountryCode } from "libphonenumber-js"

import { useRecaptcha } from "@/features/auth/hooks/use-recaptcha"
import { buildRequestOtpPayload } from "@/features/auth/services/login.service"
import { useMutationApi } from "@/hooks/use-mutation-api"

export type SendOtpResult =
  | { ok: true }
  | { ok: false; reason: "captcha" | "network" }

/**
 * Owns the AUTH_LOGIN_MOBILE_OTP mutation and the reCAPTCHA integration.
 * Returns a `send(input)` callable that resolves with a structured result
 * — the caller decides what to do on failure (set field error, show toast).
 */
export function useRequestOtp() {
  const recaptcha = useRecaptcha()
  const requestOtp = useMutationApi("AUTH_LOGIN_MOBILE_OTP")

  async function send(input: {
    countryCode: CountryCode
    phone: string
  }): Promise<SendOtpResult> {
    const captchaToken = await recaptcha.execute("request_otp")
    if (recaptcha.enabled && !captchaToken) {
      return { ok: false, reason: "captcha" }
    }
    try {
      await requestOtp.mutateAsync({
        data: buildRequestOtpPayload({
          phone: input.phone,
          countryCode: input.countryCode,
          captchaToken,
        }),
      })
      return { ok: true }
    } catch {
      return { ok: false, reason: "network" }
    }
  }

  return {
    send,
    isSending: requestOtp.isPending,
    error: requestOtp.error,
  }
}
