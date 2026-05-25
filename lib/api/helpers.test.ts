import { describe, expect, it } from "vitest"

import { errorMessage, errorStatus, unwrap } from "./helpers"

describe("unwrap", () => {
  it("returns null for undefined/null", () => {
    expect(unwrap(undefined)).toBeNull()
    expect(unwrap(null)).toBeNull()
  })

  it("returns the response body", () => {
    expect(
      unwrap({
        data: { hello: "world" },
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as never,
      })
    ).toEqual({ hello: "world" })
  })
})

describe("errorStatus", () => {
  it("returns undefined for non-axios errors", () => {
    expect(errorStatus(new Error("nope"))).toBeUndefined()
  })

  it("extracts the response status when present", () => {
    expect(errorStatus({ response: { status: 401 } })).toBe(401)
  })
})

describe("errorMessage", () => {
  it("prefers message, then detail, then errors[0]", () => {
    expect(errorMessage({ response: { data: { message: "first" } } })).toBe(
      "first"
    )
    expect(errorMessage({ response: { data: { detail: "second" } } })).toBe(
      "second"
    )
    expect(errorMessage({ response: { data: { errors: ["third"] } } })).toBe(
      "third"
    )
  })

  it("returns undefined when no message-shaped fields exist", () => {
    expect(errorMessage(new Error("nope"))).toBeUndefined()
  })
})
