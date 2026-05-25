import type {
  QueryFunctionContext,
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query"
import type { AxiosResponse } from "axios"

import type { GeneralObject } from "./general"

export type AuthUser = {
  id: string
  pid: string
  first_name: string
  last_name: string
  wallet_address: string
  mobile_number: string
  email_address: string
  access_groups: string[]
  roles?: string[]
  membership: string
  // Zostel-specific: the opaque short id (e.g. "b7cf718f9d") that must be
  // sent as `Client-User-Id`. The JWT's `user_id` claim mirrors this value,
  // so sending anything else (notably `id` / `UA-XXX`) yields a 401.
  // Null when an account exists in Zo but is not provisioned in Zostel.
  user_id?: string | null
}

export type Profile = {
  address: string
  assets: GeneralObject[]
  avatar_url: string
  background_key: string
  bio: string
  city: number
  code: string
  country_citizen: number
  country_residing: number
  date_joined: string
  date_of_birth: string
  description: string
  email: string
  email_verified: boolean
  experience: number
  first_name: string
  gender: number
  hometown: number
  last_name: string
  level: number
  level_percent: number
  lobby_name: string
  media: GeneralObject
  middle_name: string
  mobile: string
  mobile_country_code: string
  mobile_verified: boolean
  music_key: string
  nickname: string
  relationship_status: number
  security: number
  socials: GeneralObject[]
  speakability: number
  status: string
  subdomain: string
  tags: GeneralObject[]
  time_create: string
  time_update: string
  work_role: string
}

export interface PFP_Metadata {
  contract_address: string
  token_id: string
  metadata: string
  is_valid: string
}

export interface User {
  id: string
  pid: string
  first_name: string
  last_name: string
  email_address: string
  wallet_address: string
  nickname: string | null
  membership: string
  pfp_image: string
  pfp?: string
  data?: GeneralObject
  twitter_handle: string
  pfp_metadata?: PFP_Metadata
  mobile_number: string
  name?: string
}

export type LoginTypes = "email" | "wallet" | "mobile"

/**
 * Pass-through to `@tanstack/react-query`'s `UseQueryOptions`, minus the
 * keys an endpoint factory already provides (`queryKey` / `queryFn`).
 * Mirrors the v3-era `QueryConfig` from the legacy project but tracks
 * v5 option names (`gcTime`, `throwOnError`, etc.).
 */
export type QueryConfig<TData = unknown, TError = unknown> = Omit<
  UseQueryOptions<TData, TError, TData, QueryKey>,
  "queryKey" | "queryFn"
>

/**
 * Mutation counterpart to `QueryConfig`, minus `mutationFn` which the
 * endpoint factory always provides.
 */
export type MutationConfig<
  TData = unknown,
  TError = unknown,
  TVariables = MutationArgs,
  TContext = unknown,
> = Omit<UseMutationOptions<TData, TError, TVariables, TContext>, "mutationFn">

export type QueryArgs<TData = unknown> = {
  queryKey: QueryKey
  queryFn: (context: QueryFunctionContext) => Promise<AxiosResponse<TData>>
  config?: QueryConfig<AxiosResponse<TData>>
}

export type QueryObjectFunction<TData = unknown> = (
  additionalRoute: string,
  search: string,
  config?: QueryConfig<AxiosResponse<TData>>
) => QueryArgs<TData>

export type MutationArgs<TData = GeneralObject> = {
  data?: TData
  route?: string
}
