import {
  adminMutationApis,
  adminQueryApis,
  type ADMIN_MUTATION_ENDPOINTS,
  type ADMIN_QUERY_ENDPOINTS,
} from "@/features/admin/api"
import {
  authMutationApis,
  authQueryApis,
  type AUTH_MUTATION_ENDPOINTS,
  type AUTH_QUERY_ENDPOINTS,
} from "@/features/auth/api"
import {
  authorizationMutationApis,
  authorizationQueryApis,
  type AUTHORIZATION_MUTATION_ENDPOINTS,
  type AUTHORIZATION_QUERY_ENDPOINTS,
} from "@/features/authorization/api"
import {
  crsMutationApis,
  crsQueryApis,
  type CRS_MUTATION_ENDPOINTS,
  type CRS_QUERY_ENDPOINTS,
} from "@/features/crs/api"

export const queryApis = {
  ...authQueryApis,
  ...authorizationQueryApis,
  ...crsQueryApis,
  ...adminQueryApis,
}

export const mutationApis = {
  ...authMutationApis,
  ...authorizationMutationApis,
  ...crsMutationApis,
  ...adminMutationApis,
}

export type QUERY_ENDPOINTS =
  | AUTH_QUERY_ENDPOINTS
  | AUTHORIZATION_QUERY_ENDPOINTS
  | CRS_QUERY_ENDPOINTS
  | ADMIN_QUERY_ENDPOINTS

export type MUTATION_ENDPOINTS =
  | AUTH_MUTATION_ENDPOINTS
  | AUTHORIZATION_MUTATION_ENDPOINTS
  | CRS_MUTATION_ENDPOINTS
  | ADMIN_MUTATION_ENDPOINTS
