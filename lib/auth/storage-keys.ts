export type AuthStorageKeys = {
  token: string
  user: string
  expiry: string
  deviceId: string
  deviceSecret: string
}

export function authStorageKeys(prefix: string): AuthStorageKeys {
  return {
    token: `${prefix}-token`,
    user: `${prefix}-user`,
    expiry: `${prefix}-token-expiry`,
    deviceId: `${prefix}-device-id`,
    deviceSecret: `${prefix}-device-secret`,
  }
}

/**
 * Token expiry is stored as either an epoch-ms number (string) or an ISO 8601
 * date string. Either form is parsed safely.
 */
export function isExpiryValid(stored: string | null | undefined): boolean {
  if (!stored) return false
  const ms = /^\d+$/.test(stored) ? Number(stored) : new Date(stored).getTime()
  return Number.isFinite(ms) && ms > Date.now()
}
