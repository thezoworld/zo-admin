"use client"

import * as React from "react"

import { useZostelAuth } from "@/features/auth"
import {
  buildAssociatedOperatorsQuery,
  computeEffectiveRole,
  filterOperatorsByScope,
  isValidOperator,
  meetsRequiredRole,
  principalsForOperator,
} from "@/features/authorization/services/access.service"
import { useSelectedOperatorStore } from "@/features/authorization/store/selected-operator-store"
import type {
  AuthorizationContextValue,
  EffectiveRole,
  Operator,
  RequiredRole,
} from "@/features/authorization/types"
import type { GeneralObject } from "@/lib/definitions"
import { useQueryApi } from "@/hooks/use-query-api"

const QUERY_OPTIONS_BASE = {
  refetchOnMount: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
} as const

/**
 * The user's authorization view: associated operators, the operator they've
 * selected, the role they hold on that operator, and a `hasAccess` predicate.
 *
 * State sources:
 *  - React Query (queries are deduped, so calling this from N components
 *    triggers at most one network request per endpoint).
 *  - `useSelectedOperatorStore` — Zustand-persisted user preference.
 */
export function useAuthorization(): AuthorizationContextValue {
  const { isLoggedIn } = useZostelAuth()
  const selectedOperatorId = useSelectedOperatorStore(
    (state) => state.selectedOperatorId
  )
  const setSelectedOperatorIdStore = useSelectedOperatorStore(
    (state) => state.setSelectedOperatorId
  )

  const associationsQuery = useQueryApi<{
    associations?: GeneralObject[]
  }>("AUTHORIZATION_MY_ASSOCIATION", {
    ...QUERY_OPTIONS_BASE,
    enabled: isLoggedIn === true,
  })

  const associatedOperatorIds = React.useMemo(
    () =>
      buildAssociatedOperatorsQuery(associationsQuery.data?.data?.associations),
    [associationsQuery.data]
  )

  const allOperatorsQuery = useQueryApi<{ results?: Operator[] }>(
    "CRS_OPERATORS",
    { ...QUERY_OPTIONS_BASE, enabled: associatedOperatorIds.length > 0 },
    "",
    `ids=${associatedOperatorIds}&fields=id,name,code,data,kyc_documents&limit=1000`
  )

  const scopeQuery = useQueryApi<{ permissions?: GeneralObject[] }>(
    "AUTHORIZATION_SCOPE_ME",
    { ...QUERY_OPTIONS_BASE, enabled: isLoggedIn === true }
  )

  const associatedOperators = React.useMemo<Operator[]>(
    () =>
      filterOperatorsByScope(
        allOperatorsQuery.data?.data?.results ?? [],
        scopeQuery.data?.data?.permissions
      ),
    [allOperatorsQuery.data, scopeQuery.data]
  )

  const selectedOperator = React.useMemo<Operator>(() => {
    if (selectedOperatorId != null) {
      const found = associatedOperators.find(
        (operator) => operator.id === selectedOperatorId
      )
      if (found) return found
    }
    return associatedOperators[0] ?? {}
  }, [selectedOperatorId, associatedOperators])

  const isFetchingAny =
    associationsQuery.isFetching ||
    scopeQuery.isFetching ||
    allOperatorsQuery.isFetching

  const effectiveRole = React.useMemo<EffectiveRole | "none" | null>(() => {
    if (isFetchingAny) return null
    const principals = principalsForOperator(
      scopeQuery.data?.data?.permissions,
      selectedOperator
    )
    return computeEffectiveRole(principals)
  }, [isFetchingAny, scopeQuery.data, selectedOperator])

  const hasAccess = React.useCallback(
    function checkAccess(minRole: RequiredRole) {
      return meetsRequiredRole(effectiveRole, minRole)
    },
    [effectiveRole]
  )

  const setSelectedOperator = React.useCallback(
    function pickOperator(operator: Operator) {
      if (!isValidOperator(operator)) {
        setSelectedOperatorIdStore(null)
        return
      }
      const id = operator.id as number | string | undefined
      setSelectedOperatorIdStore(id ?? null)
    },
    [setSelectedOperatorIdStore]
  )

  return {
    associatedOperators,
    selectedOperator,
    setSelectedOperator,
    effectiveRole,
    hasAccess,
  }
}
