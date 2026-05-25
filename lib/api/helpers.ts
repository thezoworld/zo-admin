import type { AxiosError, AxiosResponse } from "axios"

/** Pull the response body out of an axios response (or null if absent). */
export function unwrap<T>(
  response: AxiosResponse<T> | undefined | null
): T | null {
  return (response?.data ?? null) as T | null
}

/** Extract the HTTP status from an unknown thrown error. */
export function errorStatus(err: unknown): number | undefined {
  return (err as AxiosError | undefined)?.response?.status
}

type ApiErrorBody = {
  message?: string
  detail?: string
  errors?: string[]
}

/** Best-effort: get a user-displayable message from an unknown error. */
export function errorMessage(err: unknown): string | undefined {
  const body = (err as AxiosError<ApiErrorBody> | undefined)?.response?.data
  return body?.message ?? body?.detail ?? body?.errors?.[0]
}
