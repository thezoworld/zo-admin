import type {
  EffectiveRole,
  Operator,
  RequiredRole,
} from "@/features/authorization/types"
import type { GeneralObject } from "@/lib/definitions"

/**
 * Pure logic for deriving the user's effective role on the selected
 * operator. No React, no network, no global state.
 *
 * Heavily covered by tests under access.service.test.ts.
 */

const ROLE_ORDER: ReadonlyArray<EffectiveRole> = [
  "activity-manager",
  "front-desk-manager",
  "property-manager",
  "owner_partner",
  "admin",
]

const WILDCARD_SCOPE = "*"
const ADMIN_PRINCIPAL = "group:cas-admin"

const PRINCIPAL_TO_ROLE: Record<string, EffectiveRole> = {
  "group:cas-admin": "admin",
  "group:owner": "owner_partner",
  "group:front-desk-manager": "front-desk-manager",
  "group:property-manager": "property-manager",
  "group:activity-manager": "activity-manager",
}

export function isValidOperator(value: unknown): value is Operator {
  return (
    typeof value === "object" && value !== null && Object.keys(value).length > 0
  )
}

/**
 * Pulls the comma-joined list of operator IDs the user is associated with.
 * Returns "" when no associations exist — call sites should treat that as
 * "don't fetch operators yet".
 */
export function buildAssociatedOperatorsQuery(
  associations: ReadonlyArray<GeneralObject> | undefined
): string {
  if (!associations?.length) return ""
  return associations
    .filter((association) => association.model === "Operator")
    .map((association) => association.value as string)
    .join(",")
}

/**
 * Filter the full operator list down to only the ones the user has any
 * permission on. A "*" scope shortcuts to "all".
 */
export function filterOperatorsByScope(
  operators: ReadonlyArray<Operator>,
  permissions: ReadonlyArray<GeneralObject> | undefined
): Operator[] {
  if (!permissions) return []
  const hasWildcard = permissions.some((p) => p.scope === WILDCARD_SCOPE)
  if (hasWildcard) return [...operators]

  return operators.filter((operator) => {
    const code = operator?.code
    if (!code) return false
    return permissions.some(
      (p) => typeof p.scope === "string" && p.scope.includes(code as string)
    )
  })
}

/**
 * Compute the principals (roles) the user has on a specific operator.
 * `cas-admin` always wins and is appended if granted globally.
 */
export function principalsForOperator(
  permissions: ReadonlyArray<GeneralObject> | undefined,
  selectedOperator: Operator
): string[] {
  if (!permissions) return []
  const code = selectedOperator.code as string | undefined
  const principals = permissions
    .filter((p) => {
      if (p.scope === WILDCARD_SCOPE) return true
      if (typeof p.scope !== "string" || !code) return false
      return p.scope.includes(code)
    })
    .map((p) => p.principal as string)

  const hasAdmin = permissions.some((p) => p.principal === ADMIN_PRINCIPAL)
  if (hasAdmin) principals.push(ADMIN_PRINCIPAL)
  return principals
}

/**
 * Highest role the user holds against the selected operator. Returns "none"
 * when authenticated but lacking any role on this operator.
 */
export function computeEffectiveRole(
  principals: ReadonlyArray<string>
): EffectiveRole | "none" {
  for (const role of [...ROLE_ORDER].reverse()) {
    if (principals.some((p) => PRINCIPAL_TO_ROLE[p] === role)) return role
  }
  return "none"
}

/** Does the effective role meet or exceed the required role? */
export function meetsRequiredRole(
  effectiveRole: EffectiveRole | "none" | null,
  required: RequiredRole
): boolean {
  if (effectiveRole === null || effectiveRole === "none") return false
  const currentIndex = ROLE_ORDER.indexOf(effectiveRole)
  const requiredIndex = ROLE_ORDER.indexOf(required)
  return currentIndex >= requiredIndex && currentIndex !== -1
}
