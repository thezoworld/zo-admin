import { describe, expect, it } from "vitest"

import { t } from "./index"

describe("t()", () => {
  it("returns the raw template when no params", () => {
    expect(t("PHONE_REQUIRED")).toBe("Mobile number is required")
  })

  it("interpolates {placeholders}", () => {
    expect(t("OTP_LENGTH", { count: 6 })).toBe("Enter all 6 digits")
  })

  it("leaves unknown placeholders untouched", () => {
    expect(t("FIELD_REQUIRED")).toBe("{field} is required")
    expect(t("FIELD_REQUIRED", { other: "x" })).toBe("{field} is required")
  })
})
