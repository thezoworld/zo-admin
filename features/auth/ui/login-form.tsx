"use client"

import * as React from "react"
import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"
import { FieldDescription } from "@/components/ui/field"
import { cn } from "@/lib/utils"

import { useLoginFlow } from "@/features/auth/hooks/use-login-flow"

import { LoginOtpStep } from "./login-otp-step"
import { LoginPhoneStep } from "./login-phone-step"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const flow = useLoginFlow()

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          {flow.step === "phone" ? (
            <LoginPhoneStep flow={flow} />
          ) : (
            <LoginOtpStep flow={flow} />
          )}
          <div className="relative hidden bg-muted md:block">
            <Image
              src="https://proxy.cdn.zo.xyz/gallery/media/images/a2d7b00a-3742-4f90-a844-a80606d65fab_20260523100537.webp"
              alt="Image"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By continuing, you agree to our <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
