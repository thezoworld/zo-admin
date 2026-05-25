import type { GeneralObject } from "@/lib/definitions"

export type EffectiveRole =
  | "activity-manager"
  | "front-desk-manager"
  | "property-manager"
  | "owner_partner"
  | "admin"

export type RequiredRole = EffectiveRole

export type Operator = GeneralObject

export type AuthorizationContextValue = {
  associatedOperators: Operator[]
  selectedOperator: Operator
  setSelectedOperator: (operator: Operator) => void
  effectiveRole: EffectiveRole | "none" | null
  hasAccess: (minRole: RequiredRole) => boolean
}
