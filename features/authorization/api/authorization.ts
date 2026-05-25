import { zoServer, zostelServer } from "@/lib/api/client"
import { defineQuery } from "@/lib/api/factory"

export const authorizationMutationApis = {}

export const authorizationQueryApis = {
  AUTHORIZATION_MY_ASSOCIATION: defineQuery({
    server: zostelServer,
    path: "/api/v1/authorization/my/association",
    key: ["authorization", "my", "association"],
  }),
  AUTHORIZATION_SCOPE_ME: defineQuery({
    server: zoServer,
    path: "/api/v1/authorization/scope/me",
    key: ["authorization", "scope", "me"],
  }),
}

export type AUTHORIZATION_MUTATION_ENDPOINTS =
  keyof typeof authorizationMutationApis
export type AUTHORIZATION_QUERY_ENDPOINTS = keyof typeof authorizationQueryApis
