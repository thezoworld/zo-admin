import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query"
import type { AxiosInstance, AxiosResponse, Method } from "axios"

import type { QueryObjectFunction } from "@/lib/definitions"

/**
 * Build a query endpoint factory. The generic `TResp` is the API body shape;
 * `useQueryApi<TResp>("KEY")` will then type `query.data` as
 * `AxiosResponse<TResp> | undefined`.
 */
export function defineQuery<TResp = unknown>(opts: {
  server: AxiosInstance
  path: string
  key: ReadonlyArray<string>
}): QueryObjectFunction<TResp> {
  // `opts.server` and `opts.path` are closed-over from defineQuery's
  // arguments — they're stable for the lifetime of the resulting factory
  // and the endpoint identity they represent is already encoded in
  // `opts.key`. The exhaustive-deps lint can't see that, so it's silenced
  // intentionally here.
  // eslint-disable-next-line @tanstack/query/exhaustive-deps
  return ((additionalRoute, search, config) => ({
    queryKey: [...opts.key, additionalRoute, search],
    queryFn: () =>
      opts.server.get<TResp>(`${opts.path}/${additionalRoute}?${search}`),
    config,
  })) as QueryObjectFunction<TResp>
}

/**
 * Build a mutation endpoint factory. Generics:
 * - `TReq`: the request body shape (`mutate({ data })` is typed)
 * - `TResp`: the response body shape (`mutation.data?.data` is typed)
 *
 * The call-site signature matches the legacy registry:
 * `(config, additionalRoute, method) => UseMutationResult<…>`.
 */
export function defineMutation<TReq = unknown, TResp = unknown>(opts: {
  server: AxiosInstance
  path: string
  /** When true, FormData payloads send a multipart Content-Type header. */
  multipart?: boolean
}) {
  type Variables = { data?: TReq; route?: string }
  type ResolvedConfig = Omit<
    UseMutationOptions<AxiosResponse<TResp>, unknown, Variables>,
    "mutationFn"
  >

  return (
    config: ResolvedConfig,
    additionalRoute: string,
    method: Method
  ): UseMutationResult<AxiosResponse<TResp>, unknown, Variables> =>
    useMutation<AxiosResponse<TResp>, unknown, Variables>({
      mutationFn: (data) =>
        opts.server.request<TResp>({
          method,
          url: `${opts.path}/${data.route || additionalRoute}`,
          data: data.data,
          headers:
            opts.multipart && data.data instanceof FormData
              ? { "Content-Type": "multipart/form-data" }
              : undefined,
        }),
      ...config,
    })
}
