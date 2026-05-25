"use client"

import { Controller } from "react-hook-form"
import type { CountryCode } from "libphonenumber-js"

import { Phone } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { cn } from "@/lib/utils"

import type { UseLoginFlow } from "@/features/auth/hooks/use-login-flow"

import { CountrySelect } from "./country-select"
import { LoginSocialButtons } from "./login-social-buttons"

export function LoginPhoneStep({ flow }: { flow: UseLoginFlow }) {
  const { phoneForm, formattedPhone, onSendOtp, isSending } = flow
  const phoneError = phoneForm.formState.errors.phone

  return (
    <form className="p-6 md:p-8" onSubmit={onSendOtp} noValidate>
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-balance text-muted-foreground">
            Log in to your Zo World account with your mobile number
          </p>
        </div>

        <Field data-invalid={phoneError ? true : undefined}>
          <FieldLabel htmlFor="phone">Mobile number</FieldLabel>
          <div
            className={cn(
              "flex h-9 items-stretch rounded-3xl border border-transparent bg-input/50 transition-[color,box-shadow,background-color] focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30",
              phoneError && "border-destructive ring-3 ring-destructive/20"
            )}
          >
            <Controller
              control={phoneForm.control}
              name="countryCode"
              render={({ field }) => (
                <CountrySelect
                  value={field.value as CountryCode}
                  onChange={(code) => {
                    field.onChange(code)
                    phoneForm.setValue("phone", "", { shouldValidate: false })
                  }}
                />
              )}
            />
            <div aria-hidden="true" className="my-1.5 w-px bg-border/60" />
            <Controller
              control={phoneForm.control}
              name="phone"
              render={({ field }) => (
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="Phone number"
                  value={formattedPhone}
                  onChange={(e) =>
                    field.onChange(e.target.value.replace(/[^\d]/g, ""))
                  }
                  onBlur={field.onBlur}
                  maxLength={20}
                  className="min-w-0 flex-1 bg-transparent px-3 text-base outline-none placeholder:text-muted-foreground md:text-sm"
                />
              )}
            />
          </div>
          {phoneError ? (
            <FieldError errors={[{ message: phoneError.message }]} />
          ) : (
            <FieldDescription>
              We&apos;ll send a 6-digit code to verify it&apos;s you.
            </FieldDescription>
          )}
        </Field>

        <Field>
          <Button
            type="submit"
            disabled={phoneForm.formState.isSubmitting || isSending}
          >
            <Phone />
            {phoneForm.formState.isSubmitting || isSending
              ? "Sending…"
              : "Send OTP"}
          </Button>
        </Field>

        <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
          Or continue with
        </FieldSeparator>

        <LoginSocialButtons />

        <FieldDescription className="text-center">
          Follow Your ❤️
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}
