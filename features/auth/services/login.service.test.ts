import { describe, expect, it } from "vitest"

import {
  buildActivateZostelPayload,
  buildRequestOtpPayload,
  buildVerifyOtpPayload,
  dialCodeFor,
  formatPhoneInput,
  parseLoginResponse,
  parseZostelActivateResponse,
  parseZostelCredsResponse,
} from "./login.service"

describe("dialCodeFor", () => {
  it("returns the country's dial code without the +", () => {
    expect(dialCodeFor("IN")).toBe("91")
    expect(dialCodeFor("US")).toBe("1")
  })
})

describe("formatPhoneInput", () => {
  it("returns empty for empty digits", () => {
    expect(formatPhoneInput("IN", "")).toBe("")
  })

  it("returns a human-readable format for valid digits", () => {
    expect(formatPhoneInput("IN", "9876543210")).toContain("98765")
  })
})

describe("buildRequestOtpPayload", () => {
  it("builds the basic payload without captcha", () => {
    const payload = buildRequestOtpPayload({
      phone: "9876543210",
      countryCode: "IN",
      captchaToken: null,
    })
    expect(payload).toEqual({
      mobile_number: "9876543210",
      mobile_country_code: "91",
    })
    expect(payload).not.toHaveProperty("captcha_response_token")
  })

  it("includes the captcha token when provided", () => {
    const payload = buildRequestOtpPayload({
      phone: "9876543210",
      countryCode: "IN",
      captchaToken: "tok",
    })
    expect(payload.captcha_response_token).toBe("tok")
  })
})

describe("buildVerifyOtpPayload", () => {
  it("threads the submitted phone + otp", () => {
    const payload = buildVerifyOtpPayload(
      { countryCode: "IN", phone: "9876543210" },
      "123456"
    )
    expect(payload).toEqual({
      mobile_number: "9876543210",
      mobile_country_code: "91",
      otp: "123456",
    })
  })
})

describe("buildActivateZostelPayload", () => {
  it("renames mobile_number to mobile and forwards the code as otp", () => {
    const payload = buildActivateZostelPayload({
      mobile_number: "9876543210",
      mobile_country_code: "91",
      code: "654321",
    })
    expect(payload).toEqual({
      mobile: "9876543210",
      mobile_country_code: "91",
      otp: "654321",
    })
  })
})

describe("parseLoginResponse", () => {
  it("returns null for null/empty body", () => {
    expect(parseLoginResponse(null)).toBeNull()
    expect(parseLoginResponse({})).toBeNull()
  })

  it("returns null when token is missing", () => {
    expect(
      parseLoginResponse({
        user: { id: "x" } as never,
        valid_till: 1,
      })
    ).toBeNull()
  })

  it("returns the body when all fields present", () => {
    const body = {
      user: { id: "x" } as never,
      token: "t",
      valid_till: 1,
    }
    expect(parseLoginResponse(body)).toBe(body)
  })
})

describe("parseZostelCredsResponse", () => {
  it("returns null when any field is missing", () => {
    expect(parseZostelCredsResponse(null)).toBeNull()
    expect(parseZostelCredsResponse({})).toBeNull()
    expect(
      parseZostelCredsResponse({
        mobile_number: "x",
        mobile_country_code: "1",
      })
    ).toBeNull()
  })

  it("returns the body when all fields present", () => {
    const body = {
      mobile_number: "x",
      mobile_country_code: "1",
      code: "c",
    }
    expect(parseZostelCredsResponse(body)).toBe(body)
  })
})

describe("parseZostelActivateResponse", () => {
  it("returns null for malformed body", () => {
    expect(parseZostelActivateResponse(null)).toBeNull()
    expect(parseZostelActivateResponse({ user_token: "t" })).toBeNull()
  })

  it("returns null when user.user_id is missing or null (unprovisioned account)", () => {
    const missing = {
      user: { id: "x" } as never,
      user_token: "t",
      token_expiry: "2099-01-01",
    }
    expect(parseZostelActivateResponse(missing)).toBeNull()

    const nullified = {
      user: { id: "x", user_id: null } as never,
      user_token: "t",
      token_expiry: "2099-01-01",
    }
    expect(parseZostelActivateResponse(nullified)).toBeNull()
  })

  it("returns the body when all fields present", () => {
    const body = {
      user: { id: "x", user_id: "abc1234567" } as never,
      user_token: "t",
      token_expiry: "2099-01-01",
    }
    expect(parseZostelActivateResponse(body)).toBe(body)
  })
})
