import { describe, expect, it } from "vitest"

import {
  buildAssociatedOperatorsQuery,
  computeEffectiveRole,
  filterOperatorsByScope,
  isValidOperator,
  meetsRequiredRole,
  principalsForOperator,
} from "./access.service"

describe("isValidOperator", () => {
  it("rejects empty / null / non-object values", () => {
    expect(isValidOperator(null)).toBe(false)
    expect(isValidOperator(undefined)).toBe(false)
    expect(isValidOperator({})).toBe(false)
    expect(isValidOperator("foo")).toBe(false)
  })

  it("accepts a non-empty object", () => {
    expect(isValidOperator({ id: "x" })).toBe(true)
  })
})

describe("buildAssociatedOperatorsQuery", () => {
  it("returns empty for empty input", () => {
    expect(buildAssociatedOperatorsQuery(undefined)).toBe("")
    expect(buildAssociatedOperatorsQuery([])).toBe("")
  })

  it("filters by model=Operator and joins values", () => {
    const associations = [
      { model: "Operator", value: "a" },
      { model: "Hostel", value: "b" },
      { model: "Operator", value: "c" },
    ]
    expect(buildAssociatedOperatorsQuery(associations)).toBe("a,c")
  })
})

describe("filterOperatorsByScope", () => {
  it("returns [] when there are no permissions", () => {
    expect(filterOperatorsByScope([{ code: "a" }], undefined)).toEqual([])
  })

  it("returns all operators on wildcard scope", () => {
    const operators = [{ code: "a" }, { code: "b" }]
    expect(filterOperatorsByScope(operators, [{ scope: "*" }])).toEqual(
      operators
    )
  })

  it("filters by scope containing the operator code", () => {
    const operators = [{ code: "a" }, { code: "b" }, { code: "c" }]
    const permissions = [{ scope: "/op/a" }, { scope: "/op/c" }]
    expect(filterOperatorsByScope(operators, permissions)).toEqual([
      { code: "a" },
      { code: "c" },
    ])
  })

  it("drops operators with no code", () => {
    expect(
      filterOperatorsByScope([{ code: undefined }], [{ scope: "*" }])
    ).toEqual([{ code: undefined }])
    expect(filterOperatorsByScope([{}], [{ scope: "/op/a" }])).toEqual([])
  })
})

describe("principalsForOperator", () => {
  it("returns principals scoped to the selected operator", () => {
    const operator = { code: "a" }
    const permissions = [
      { scope: "/op/a", principal: "group:property-manager" },
      { scope: "/op/b", principal: "group:owner" },
    ]
    expect(principalsForOperator(permissions, operator)).toEqual([
      "group:property-manager",
    ])
  })

  it("includes wildcard-scoped principals", () => {
    const operator = { code: "a" }
    const permissions = [
      { scope: "*", principal: "group:owner" },
      { scope: "/op/a", principal: "group:property-manager" },
    ]
    expect(principalsForOperator(permissions, operator)).toEqual([
      "group:owner",
      "group:property-manager",
    ])
  })

  it("appends cas-admin once when present globally", () => {
    const permissions = [
      { scope: "/op/a", principal: "group:cas-admin" },
      { scope: "/op/a", principal: "group:property-manager" },
    ]
    const principals = principalsForOperator(permissions, { code: "a" })
    expect(principals.filter((p) => p === "group:cas-admin").length).toBe(2)
  })
})

describe("computeEffectiveRole", () => {
  it("returns 'none' for empty principals", () => {
    expect(computeEffectiveRole([])).toBe("none")
  })

  it("picks the highest-ranking principal", () => {
    expect(
      computeEffectiveRole([
        "group:activity-manager",
        "group:property-manager",
        "group:owner",
      ])
    ).toBe("owner_partner")
  })

  it("cas-admin trumps all", () => {
    expect(
      computeEffectiveRole(["group:front-desk-manager", "group:cas-admin"])
    ).toBe("admin")
  })

  it("ignores unknown principals", () => {
    expect(computeEffectiveRole(["something:else"])).toBe("none")
  })
})

describe("meetsRequiredRole", () => {
  it("returns false for null / none", () => {
    expect(meetsRequiredRole(null, "activity-manager")).toBe(false)
    expect(meetsRequiredRole("none", "activity-manager")).toBe(false)
  })

  it("returns true when role >= required", () => {
    expect(meetsRequiredRole("admin", "activity-manager")).toBe(true)
    expect(meetsRequiredRole("property-manager", "front-desk-manager")).toBe(
      true
    )
  })

  it("returns false when role < required", () => {
    expect(meetsRequiredRole("activity-manager", "property-manager")).toBe(
      false
    )
  })
})
