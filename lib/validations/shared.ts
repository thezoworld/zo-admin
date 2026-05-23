import { z } from "zod"
import { isValidPhoneNumber, type CountryCode } from "libphonenumber-js"

import { t } from "@/lib/messages"

export const countryCodeSchema = z.string().length(2, t("COUNTRY_REQUIRED"))

export const phoneNumberSchema = z
  .object({
    countryCode: countryCodeSchema,
    phone: z.string().min(1, t("PHONE_REQUIRED")),
  })
  .refine(
    ({ countryCode, phone }) =>
      isValidPhoneNumber(phone, countryCode as CountryCode),
    { message: t("PHONE_INVALID"), path: ["phone"] }
  )

export function otpCodeSchema(length = 6) {
  return z
    .string()
    .length(length, t("OTP_LENGTH", { count: length }))
    .regex(/^\d+$/, t("OTP_NUMERIC"))
}
