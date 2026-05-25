import { describe, expect, it, vi } from "vitest"

import { authStorageKeys, isExpiryValid } from "./storage-keys"

describe("authStorageKeys", () => {
  it("namespaces every key with the given prefix", () => {
    const keys = authStorageKeys("zo-pms")
    expect(keys).toEqual({
      token: "zo-pms-token",
      user: "zo-pms-user",
      expiry: "zo-pms-token-expiry",
      deviceId: "zo-pms-device-id",
      deviceSecret: "zo-pms-device-secret",
    })
  })
})

describe("isExpiryValid", () => {
  it("returns false for null / empty / garbage", () => {
    expect(isExpiryValid(null)).toBe(false)
    expect(isExpiryValid("")).toBe(false)
    expect(isExpiryValid("not-a-date")).toBe(false)
  })

  it("accepts an ISO timestamp in the future", () => {
    const isoFuture = new Date(Date.now() + 60_000).toISOString()
    expect(isExpiryValid(isoFuture)).toBe(true)
  })

  it("accepts an epoch ms string in the future", () => {
    expect(isExpiryValid(String(Date.now() + 60_000))).toBe(true)
  })

  it("returns false for an expired ISO timestamp", () => {
    const isoPast = new Date(Date.now() - 60_000).toISOString()
    expect(isExpiryValid(isoPast)).toBe(false)
  })

  it("uses Date.now at call time", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2025-01-01T00:00:00Z"))
    const expiry = "2025-01-01T00:00:30Z"
    expect(isExpiryValid(expiry)).toBe(true)
    vi.setSystemTime(new Date("2025-01-01T00:01:00Z"))
    expect(isExpiryValid(expiry)).toBe(false)
    vi.useRealTimers()
  })
})
