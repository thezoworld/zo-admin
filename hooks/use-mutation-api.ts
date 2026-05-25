"use client"

import type { UseMutationResult } from "@tanstack/react-query"
import type { AxiosResponse, Method } from "axios"

import { mutationApis, type MUTATION_ENDPOINTS } from "@/lib/api"
import type { GeneralObject, MutationArgs } from "@/lib/definitions"

type MutationFactory = (
  config: GeneralObject,
  additionalRoute: string,
  method: Method
) => UseMutationResult<AxiosResponse, unknown, MutationArgs>

export function useMutationApi<K extends MUTATION_ENDPOINTS>(
  endpoint: K,
  config: GeneralObject = {},
  additionalRoute: string = "",
  method: Method = "POST"
) {
  const factory = mutationApis[endpoint] as MutationFactory
  return factory(config, additionalRoute, method)
}
