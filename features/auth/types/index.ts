import type { AuthUser } from "@/lib/definitions"

export type {
  LoginOtpFormValues,
  LoginPhoneFormValues,
} from "@/features/auth/schemas/login.schema"

export type SubmittedPhone = {
  countryCode: string
  phone: string
}

export type LoginMobileResponse = {
  user: AuthUser
  token: string
  valid_till: number | string
}

export type RequestOtpZostelResponse = {
  mobile_number: string
  mobile_country_code: string
  code: string
}

export type ActivateZostelResponse = {
  user: AuthUser
  user_token: string
  token_expiry: number | string
}
