import { zostelServer } from "@/lib/api/client"
import { defineMutation, defineQuery } from "@/lib/api/factory"

export const crsMutationApis = {
  CRS_OPERATORS: defineMutation({
    server: zostelServer,
    path: "/api/v1/crs/operators",
  }),
}

export const crsQueryApis = {
  CRS_OPERATORS: defineQuery({
    server: zostelServer,
    path: "/api/v1/crs/operators",
    key: ["crs", "operators"],
  }),
}

export type CRS_MUTATION_ENDPOINTS = keyof typeof crsMutationApis
export type CRS_QUERY_ENDPOINTS = keyof typeof crsQueryApis
