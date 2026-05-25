"use client"

import { Controller } from "react-hook-form"

import { ArrowLeft } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

import type { UseLoginFlow } from "@/features/auth/hooks/use-login-flow"

export function LoginOtpStep({ flow }: { flow: UseLoginFlow }) {
  const {
    otpForm,
    submittedDial,
    submittedFormatted,
    onVerifyOtp,
    onResend,
    onBackToPhone,
    resendIn,
    isVerifying,
    otpLength,
    otpError,
    clearOtpError,
  } = flow

  return (
    <form className="p-6 md:p-8" onSubmit={onVerifyOtp} noValidate>
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Enter the code</h1>
          <p className="text-balance text-muted-foreground">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-foreground">
              {submittedDial} {submittedFormatted}
            </span>
          </p>
        </div>

        <Field data-invalid={otpForm.formState.errors.otp ? true : undefined}>
          <FieldLabel htmlFor="otp" className="sr-only">
            One-time code
          </FieldLabel>
          <Controller
            control={otpForm.control}
            name="otp"
            render={({ field }) => (
              <div className="flex justify-center">
                <InputOTP
                  id="otp"
                  maxLength={6}
                  value={field.value}
                  onChange={(v) => {
                    field.onChange(v)
                    if (otpError) clearOtpError()
                  }}
                  autoFocus
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            )}
          />
          {otpForm.formState.errors.otp || otpError ? (
            <FieldError className="text-center">
              {otpError ?? otpForm.formState.errors.otp?.message}
            </FieldError>
          ) : null}
        </Field>

        <Field>
          <Button
            type="submit"
            disabled={
              otpForm.formState.isSubmitting || isVerifying || otpLength < 6
            }
          >
            {otpForm.formState.isSubmitting || isVerifying
              ? "Verifying…"
              : "Verify & continue"}
          </Button>
        </Field>

        <FieldDescription className="text-center">
          {resendIn > 0 ? (
            <>Resend code in {resendIn}s</>
          ) : (
            <button
              type="button"
              className="underline underline-offset-2 hover:text-foreground"
              onClick={onResend}
            >
              Resend code
            </button>
          )}
        </FieldDescription>

        <Field>
          <Button type="button" variant="ghost" onClick={onBackToPhone}>
            <ArrowLeft />
            Change mobile number
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
