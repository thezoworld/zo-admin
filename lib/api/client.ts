import Axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios"

import { env } from "@/lib/env"

const zostelServer = Axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL_ZOSTEL,
})

const zoServer = Axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
})

// Separate instance for comms API calls — only comms-specific headers
// (authorization, app-id, account-id) are set on this instance.
// Matches mobile pattern where ZO_COMMS is a separate axios instance
// that does NOT carry the base Zo auth headers (client-device-id,
// client-device-secret, Authorization).
const zoCommsServer = Axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
})

// axios v1 stores defaults as an AxiosHeaders instance with .common/.get/.post
// sub-objects. Replacing `defaults.headers` wholesale (the v0.x pattern) breaks
// merging at request time — extra top-level keys aren't included on the wire.
// Always assign to `.common` and explicitly drop the keys we own so a logout
// clears the previous session's Authorization.
function applyManagedHeaders(
  instance: AxiosInstance,
  managedKeys: ReadonlyArray<string>,
  headers: Record<string, string>
) {
  // axios v1's defaults.headers.common is typed as a narrow union; treating it
  // as a plain string map is safe for our managed headers (Authorization,
  // client-*) which are always strings.
  const common = instance.defaults.headers.common as Record<string, string>
  for (const key of managedKeys) {
    delete common[key]
  }
  Object.assign(common, headers)
}

// Pascal-Case matters here. The Zostel backend cross-checks the JWT's
// `user_id` claim against the `Client-User-Id` header and 401s on
// mismatch, and some middleware is case-sensitive. We MUST clear the
// exact keys we previously wrote, otherwise logout leaves a stale
// Authorization header sitting on `defaults.headers.common`.
const ZOSTEL_MANAGED_HEADERS = [
  "Authorization",
  "Client-App-Id",
  "Client-User-Id",
] as const

const ZO_MANAGED_HEADERS = [
  "Authorization",
  "client-key",
  "client-device-id",
  "client-device-secret",
] as const

const setZostelServerHeaders = (headers: Record<string, string>) => {
  applyManagedHeaders(zostelServer, ZOSTEL_MANAGED_HEADERS, headers)
}

const getZostelServerHeaders = () => zostelServer.defaults.headers

const setZostelInterceptors = (
  onFulfilled?: (
    value: AxiosResponse
  ) => AxiosResponse | Promise<AxiosResponse>,
  onRejected?: (error: unknown) => unknown
) => {
  zostelServer.interceptors.response.use(onFulfilled, onRejected)
}

const setZoServerHeaders = (headers: Record<string, string>) => {
  applyManagedHeaders(zoServer, ZO_MANAGED_HEADERS, headers)
}

const getZoServerHeaders = () => zoServer.defaults.headers

const setZoCommsServerHeaders = (headers: Record<string, string>) => {
  // Comms uses the Zo-shaped managed keys plus account-id if present.
  applyManagedHeaders(
    zoCommsServer,
    [...ZO_MANAGED_HEADERS, "account-id", "app-id"],
    headers
  )
}

const getZoCommsServerHeaders = () => zoCommsServer.defaults.headers

function applyJsonOrMultipart(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data"
    } else {
      config.headers["Content-Type"] = "application/json"
    }
  }
  return config
}

zoServer.interceptors.request.use(applyJsonOrMultipart)
zostelServer.interceptors.request.use(applyJsonOrMultipart)

zoCommsServer.interceptors.request.use((config) => {
  if (config.headers) {
    if (config.data instanceof FormData) {
      // Let the browser auto-set Content-Type with the correct boundary.
      delete config.headers["Content-Type"]
    } else {
      config.headers["Content-Type"] = "application/json"
    }
  }
  return config
})

export {
  getZoCommsServerHeaders,
  getZoServerHeaders,
  getZostelServerHeaders,
  setZoCommsServerHeaders,
  setZoServerHeaders,
  setZostelInterceptors,
  setZostelServerHeaders,
  zoCommsServer,
  zoServer,
  zostelServer,
}
