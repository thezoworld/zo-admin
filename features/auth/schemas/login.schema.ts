import { z } from "zod"

import { otpCodeSchema, phoneNumberSchema } from "@/lib/validations/shared"

export const loginPhoneSchema = phoneNumberSchema
export type LoginPhoneFormValues = z.infer<typeof loginPhoneSchema>

export const loginOtpSchema = z.object({
  otp: otpCodeSchema(6),
})
export type LoginOtpFormValues = z.infer<typeof loginOtpSchema>
