"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm, useWatch, type UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { type CountryCode } from "libphonenumber-js"

import { useAuth } from "@/features/auth"
import { useRequestOtp } from "@/features/auth/hooks/use-request-otp"
import { useVerifyOtp } from "@/features/auth/hooks/use-verify-otp"
import { useZostelActivation } from "@/features/auth/hooks/use-zostel-activation"
import {
  loginOtpSchema,
  loginPhoneSchema,
  type LoginOtpFormValues,
  type LoginPhoneFormValues,
} from "@/features/auth/schemas/login.schema"
import {
  formatPhoneInput,
  formatSubmittedPhone,
  zoLoginArgs,
} from "@/features/auth/services/login.service"
import type { SubmittedPhone } from "@/features/auth/types"
import { errorMessage, errorStatus } from "@/lib/api"
import { t } from "@/lib/messages"

export type LoginStep = "phone" | "otp"

export type UseLoginFlow = {
  step: LoginStep
  phoneForm: UseFormReturn<LoginPhoneFormValues>
  otpForm: UseFormReturn<LoginOtpFormValues>
  formattedPhone: string
  submittedDial: string | null
  submittedFormatted: string
  otpLength: number
  otpError: string | null
  resendIn: number
  isSending: boolean
  isVerifying: boolean
  onSendOtp: (e: React.BaseSyntheticEvent) => void
  onVerifyOtp: (e: React.BaseSyntheticEvent) => void
  onResend: () => void
  onBackToPhone: () => void
  clearOtpError: () => void
}

const REDIRECT_AFTER_LOGIN = "/dashboard"
const RESEND_SECONDS = 30

/**
 * Thin orchestrator for the phone+OTP login flow. Owns only step state +
 * the two RHF forms + the resend timer. Each side-effecting concern lives
 * in its own focused hook: useRequestOtp, useVerifyOtp, useZostelActivation.
 */
export function useLoginFlow(): UseLoginFlow {
  const router = useRouter()
  const auth = useAuth()
  const requestOtp = useRequestOtp()
  const verifyOtp = useVerifyOtp()
  const zostelActivation = useZostelActivation()

  const [step, setStep] = React.useState<LoginStep>("phone")
  const [submitted, setSubmitted] = React.useState<SubmittedPhone | null>(null)
  const [resendIn, setResendIn] = React.useState(0)
  const [otpError, setOtpError] = React.useState<string | null>(null)

  const phoneForm = useForm<LoginPhoneFormValues>({
    resolver: zodResolver(loginPhoneSchema),
    defaultValues: { countryCode: "IN", phone: "" },
    mode: "onTouched",
  })
  const otpForm = useForm<LoginOtpFormValues>({
    resolver: zodResolver(loginOtpSchema),
    defaultValues: { otp: "" },
    mode: "onSubmit",
  })

  const countryCode = useWatch({
    control: phoneForm.control,
    name: "countryCode",
  }) as CountryCode
  const phoneDigits = useWatch({
    control: phoneForm.control,
    name: "phone",
  })
  const otpValue = useWatch({ control: otpForm.control, name: "otp" }) ?? ""

  const formattedPhone = formatPhoneInput(countryCode, phoneDigits)
  const submittedFormat = submitted
    ? formatSubmittedPhone(submitted)
    : { dial: null as string | null, formatted: "" }

  React.useEffect(
    function redirectIfAlreadyLoggedIn() {
      if (auth.isLoggedIn === true) router.replace(REDIRECT_AFTER_LOGIN)
    },
    [auth.isLoggedIn, router]
  )

  React.useEffect(
    function tickResendCountdown() {
      if (resendIn <= 0) return
      const id = setInterval(() => setResendIn((n) => n - 1), 1000)
      return function clearTimer() {
        clearInterval(id)
      }
    },
    [resendIn]
  )

  function applyRequestOtpError(
    result: Extract<Awaited<ReturnType<typeof requestOtp.send>>, { ok: false }>
  ): string {
    return result.reason === "captcha"
      ? t("CAPTCHA_UNAVAILABLE")
      : (errorMessage(requestOtp.error) ?? t("GENERIC_ERROR"))
  }

  const onSendOtp = phoneForm.handleSubmit(
    async function handleSendOtp(values) {
      const code = values.countryCode as CountryCode
      const result = await requestOtp.send({
        countryCode: code,
        phone: values.phone,
      })
      if (!result.ok) {
        phoneForm.setError("phone", { message: applyRequestOtpError(result) })
        return
      }
      setSubmitted({ countryCode: code, phone: values.phone })
      setResendIn(RESEND_SECONDS)
      setOtpError(null)
      otpForm.reset({ otp: "" })
      setStep("otp")
    }
  )

  const onVerifyOtp = otpForm.handleSubmit(
    async function handleVerifyOtp(values) {
      if (!submitted) return
      try {
        const body = await verifyOtp.verify(submitted, values.otp)
        if (!body) {
          setOtpError(t("OTP_INVALID"))
          return
        }
        setOtpError(null)
        auth.login(...zoLoginArgs(body))
        await zostelActivation.activate()
        router.replace(REDIRECT_AFTER_LOGIN)
      } catch (err) {
        setOtpError(
          errorStatus(err) === 401 ? t("OTP_INCORRECT") : t("OTP_INVALID")
        )
        otpForm.setError("otp", { message: t("OTP_INVALID") })
      }
    }
  )

  async function onResend() {
    if (resendIn > 0 || !submitted) return
    const result = await requestOtp.send({
      countryCode: submitted.countryCode as CountryCode,
      phone: submitted.phone,
    })
    if (!result.ok) {
      setOtpError(applyRequestOtpError(result))
      return
    }
    setResendIn(RESEND_SECONDS)
    setOtpError(null)
    otpForm.reset({ otp: "" })
  }

  function onBackToPhone() {
    setStep("phone")
  }

  function clearOtpError() {
    setOtpError(null)
  }

  return {
    step,
    phoneForm,
    otpForm,
    formattedPhone,
    submittedDial: submittedFormat.dial,
    submittedFormatted: submittedFormat.formatted,
    otpLength: otpValue.length,
    otpError,
    resendIn,
    isSending: requestOtp.isSending,
    isVerifying: verifyOtp.isVerifying,
    onSendOtp,
    onVerifyOtp,
    onResend,
    onBackToPhone,
    clearOtpError,
  }
}
