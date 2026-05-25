import type { AuthUser } from "@/lib/definitions"

import { zoServer, zostelServer } from "@/lib/api/client"
import { defineMutation, defineQuery } from "@/lib/api/factory"

type RequestOtpMobileReq = {
  mobile_number: string
  mobile_country_code: string
  captcha_response_token?: string
}
type LoginMobileReq = RequestOtpMobileReq & { otp: string }
type LoginMobileResp = {
  user: AuthUser
  token: string
  valid_till: number | string
}
type ActivateZostelReq = {
  mobile: string
  mobile_country_code: string
  otp: string
}
type ActivateZostelResp = {
  user: AuthUser
  user_token: string
  token_expiry: number | string
}
type RequestOtpZostelResp = {
  mobile_number: string
  mobile_country_code: string
  code: string
}

export const authMutationApis = {
  AUTH_REQUEST_OTP_ZOSTEL: defineMutation<
    Record<string, never>,
    RequestOtpZostelResp
  >({
    server: zoServer,
    path: "/api/v1/auth/request-otp/zostel",
  }),
  AUTH_ACTIVATE: defineMutation<ActivateZostelReq, ActivateZostelResp>({
    server: zostelServer,
    path: "/api/v1/auth/activate",
  }),
  AUTH_LOGIN_WEB3: defineMutation({
    server: zoServer,
    path: "/api/v1/auth/login/web3",
  }),
  AUTH_LOGIN_EMAIL: defineMutation({
    server: zoServer,
    path: "/api/v1/auth/login/email",
  }),
  AUTH_LOGIN_MOBILE: defineMutation<LoginMobileReq, LoginMobileResp>({
    server: zoServer,
    path: "/api/v1/auth/login/mobile",
  }),
  AUTH_LOGIN_MOBILE_OTP: defineMutation<RequestOtpMobileReq, unknown>({
    server: zoServer,
    path: "/api/v1/auth/login/mobile/otp",
  }),
  AUTH_USER_WEB3_WALLETS: defineMutation({
    server: zoServer,
    path: "/api/v1/auth/user/web3-wallets",
  }),
  AUTH_USER_EMAILS: defineMutation({
    server: zoServer,
    path: "/api/v1/auth/user/emails",
  }),
  AUTH_USER_EMAIL_CREATE: defineMutation({
    server: zoServer,
    path: "/api/v1/auth/user/email/create",
  }),
  AUTH_USER_MOBILES: defineMutation({
    server: zoServer,
    path: "/api/v1/auth/user/mobiles",
  }),
  AUTH_LOGIN_AUTHORIZE: defineMutation({
    server: zoServer,
    path: "/api/v1/auth/login/authorize",
  }),
  AUTH_REQUEST_OTP_EMAIL: defineMutation({
    server: zoServer,
    path: "/api/v1/auth/request-otp/email",
  }),
  AUTH_REQUEST_OTP_MOBILE: defineMutation({
    server: zoServer,
    path: "/api/v1/auth/request-otp/mobile",
  }),
  AUTH_LOGIN_EMAIL_OTP: defineMutation({
    server: zoServer,
    path: "/api/v1/auth/login/email/otp",
  }),
  AUTH_USER_MERGE: defineMutation({
    server: zoServer,
    path: "/api/v1/auth/user/merge",
  }),
}

export const authQueryApis = {
  AUTH_USER_WEB3_WALLETS: defineQuery({
    server: zoServer,
    path: "/api/v1/auth/user/web3-wallets",
    key: ["auth", "user", "web3-wallets"],
  }),
  AUTH_LOGIN_CROSS_LOGIN_REQUEST: defineQuery({
    server: zoServer,
    path: "/api/v1/auth/login/cross-login/request",
    key: ["auth", "login", "cross-login", "request"],
  }),
  AUTH_USER_EMAILS: defineQuery({
    server: zoServer,
    path: "/api/v1/auth/user/emails",
    key: ["auth", "user", "emails"],
  }),
  AUTH_USER_MOBILES: defineQuery({
    server: zoServer,
    path: "/api/v1/auth/user/mobiles",
    key: ["auth", "user", "mobiles"],
  }),
  AUTH_SCOPE: defineQuery({
    server: zoServer,
    path: "/api/v1/auth/scope",
    key: ["auth", "scope"],
  }),
}

export type AUTH_MUTATION_ENDPOINTS = keyof typeof authMutationApis
export type AUTH_QUERY_ENDPOINTS = keyof typeof authQueryApis
