import { AsYouType, type CountryCode } from "libphonenumber-js"

import { getCountry } from "@/features/auth/ui/country-select"
import type {
  ActivateZostelResponse,
  LoginMobileResponse,
  RequestOtpZostelResponse,
  SubmittedPhone,
} from "@/features/auth/types"
import type { AuthUser } from "@/lib/definitions"

/**
 * Pure business-logic functions for the login flow.
 *
 * This file has NO React imports, NO network calls, and NO global state.
 * It is the unit-test surface for the login feature.
 */

export function dialCodeFor(countryCode: CountryCode): string {
  return getCountry(countryCode).dial.replace("+", "")
}

export function formatPhoneInput(
  countryCode: CountryCode,
  digits: string
): string {
  if (!digits) return ""
  return new AsYouType(countryCode).input(digits)
}

export function formatSubmittedPhone(submitted: SubmittedPhone): {
  dial: string | null
  formatted: string
} {
  const country = getCountry(submitted.countryCode as CountryCode)
  return {
    dial: country?.dial ?? null,
    formatted: new AsYouType(country.code).input(submitted.phone),
  }
}

export type RequestOtpPayload = {
  mobile_number: string
  mobile_country_code: string
  captcha_response_token?: string
}

export function buildRequestOtpPayload(input: {
  phone: string
  countryCode: CountryCode
  captchaToken: string | null
}): RequestOtpPayload {
  const payload: RequestOtpPayload = {
    mobile_number: input.phone,
    mobile_country_code: dialCodeFor(input.countryCode),
  }
  if (input.captchaToken) payload.captcha_response_token = input.captchaToken
  return payload
}

export type VerifyOtpPayload = RequestOtpPayload & { otp: string }

export function buildVerifyOtpPayload(
  submitted: SubmittedPhone,
  otp: string
): VerifyOtpPayload {
  return {
    mobile_number: submitted.phone,
    mobile_country_code: dialCodeFor(submitted.countryCode as CountryCode),
    otp,
  }
}

export type ActivateZostelPayload = {
  mobile: string
  mobile_country_code: string
  otp: string
}

export function buildActivateZostelPayload(
  creds: RequestOtpZostelResponse
): ActivateZostelPayload {
  return {
    mobile: creds.mobile_number,
    mobile_country_code: creds.mobile_country_code,
    otp: creds.code,
  }
}

/**
 * Narrow + validate the verify-OTP response body. Returns `null` if the
 * server returned a 200 with a malformed body.
 */
export function parseLoginResponse(
  body: Partial<LoginMobileResponse> | null
): LoginMobileResponse | null {
  if (!body?.user?.id) return null
  if (!body.token) return null
  if (body.valid_till == null) return null
  return body as LoginMobileResponse
}

export function parseZostelCredsResponse(
  body: Partial<RequestOtpZostelResponse> | null
): RequestOtpZostelResponse | null {
  if (!body?.mobile_number) return null
  if (!body.mobile_country_code) return null
  if (!body.code) return null
  return body as RequestOtpZostelResponse
}

export function parseZostelActivateResponse(
  body: Partial<ActivateZostelResponse> | null
): ActivateZostelResponse | null {
  if (!body?.user?.id) return null
  if (!body.user_token) return null
  if (body.token_expiry == null) return null
  // Reject accounts that exist in Zo but are not provisioned in Zostel.
  // Without `user_id`, the `Client-User-Id` header has no valid value and
  // every downstream Zostel call would 401 with "session not authorised".
  if (!body.user.user_id) return null
  return body as ActivateZostelResponse
}

/** Convenience reshape: the Zo login response into AuthProvider.login args. */
export function zoLoginArgs(
  body: LoginMobileResponse
): [AuthUser, string, number | string] {
  return [body.user, body.token, body.valid_till]
}

export function zostelLoginArgs(
  body: ActivateZostelResponse
): [AuthUser, string, number | string] {
  return [body.user, body.user_token, body.token_expiry]
}
