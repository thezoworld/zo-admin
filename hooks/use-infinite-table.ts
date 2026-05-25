"use client"

import * as React from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import type { AxiosResponse } from "axios"

import { queryApis, type QUERY_ENDPOINTS } from "@/lib/api"
import type { GeneralObject } from "@/lib/definitions"

type Row = GeneralObject

type InfiniteResponse = AxiosResponse<{
  results?: Row[]
  count?: number
  next?: string | null
  previous?: string | null
}>

export type UseInfiniteTableArgs = {
  queryEndpoint: QUERY_ENDPOINTS
  customSearchQuery?: string
  enabled?: boolean
  pageSize?: number
  name?: string
  filterOptions?: GeneralObject
  setter?: (rows: Row[]) => void
  additionalRoute?: string
}

export function useInfiniteTable({
  queryEndpoint,
  customSearchQuery = "",
  enabled = true,
  pageSize = 20,
  name = "",
  filterOptions,
  setter,
  additionalRoute = "",
}: UseInfiniteTableArgs) {
  const query = useInfiniteQuery<InfiniteResponse>({
    queryKey: [
      queryEndpoint,
      name,
      additionalRoute,
      customSearchQuery,
      pageSize,
      filterOptions ?? null,
    ],
    queryFn: ({ pageParam }) => {
      const offset = (pageParam as number) ?? 0
      const parts = [
        customSearchQuery,
        `limit=${pageSize}`,
        `offset=${offset}`,
      ].filter(Boolean)
      const search = parts.join("&")
      const factory = queryApis[queryEndpoint]
      const { queryFn } = factory(additionalRoute, search)
      return queryFn({} as never) as Promise<InfiniteResponse>
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const results = lastPage?.data?.results ?? []
      if (results.length < pageSize) return undefined
      return allPages.length * pageSize
    },
    enabled,
  })

  const rows = React.useMemo<Row[]>(() => {
    if (!query.data) return []
    return query.data.pages.flatMap((page) => page?.data?.results ?? [])
  }, [query.data])

  React.useEffect(() => {
    if (setter) setter(rows)
  }, [rows, setter])

  const { refetch } = query
  const reset = React.useCallback(() => {
    refetch()
  }, [refetch])

  return {
    rows,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage ?? false,
    fetchNextPage: query.fetchNextPage,
    error: query.error,
    reset,
    raw: query,
  }
}
