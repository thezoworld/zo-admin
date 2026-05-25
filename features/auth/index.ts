// Public surface of the auth feature.
// Other features and pages should import from here only.

export { useAuth, useAuthStore, type AuthStore } from "./store/auth-store"
export {
  useZostelAuth,
  useZostelAuthStore,
  type ZostelAuthStore,
} from "./store/zostel-auth-store"

export { LoginForm } from "./ui/login-form"
export { useLoginFlow, type UseLoginFlow } from "./hooks/use-login-flow"
export { useRequestOtp, type SendOtpResult } from "./hooks/use-request-otp"
export { useVerifyOtp } from "./hooks/use-verify-otp"
export { useZostelActivation } from "./hooks/use-zostel-activation"
export {
  loginOtpSchema,
  loginPhoneSchema,
  type LoginOtpFormValues,
  type LoginPhoneFormValues,
} from "./schemas/login.schema"
export type {
  ActivateZostelResponse,
  LoginMobileResponse,
  RequestOtpZostelResponse,
  SubmittedPhone,
} from "./types"
