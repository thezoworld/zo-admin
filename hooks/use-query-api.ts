"use client"

import { useQuery, type UseQueryOptions } from "@tanstack/react-query"
import type { AxiosResponse } from "axios"

import { queryApis, type QUERY_ENDPOINTS } from "@/lib/api"

type QueryOpts<TBody> = Omit<
  UseQueryOptions<AxiosResponse<TBody>>,
  "queryKey" | "queryFn"
>

export function useQueryApi<TBody = unknown>(
  endpoint: QUERY_ENDPOINTS,
  config: QueryOpts<TBody> = {},
  additionalRoute: string = "",
  search: string = ""
) {
  const args = queryApis[endpoint](additionalRoute, search, config as never)
  return useQuery<AxiosResponse<TBody>>({
    queryKey: args.queryKey,
    queryFn: args.queryFn as () => Promise<AxiosResponse<TBody>>,
    ...(args.config as QueryOpts<TBody> | undefined),
    ...config,
  })
}
