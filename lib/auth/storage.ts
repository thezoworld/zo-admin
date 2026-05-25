export const isClient = typeof window !== "undefined"

export function isValidString(v: unknown): v is string {
  return typeof v === "string" && v.length > 0
}

export function getUserIfExists<T = unknown>(stored: string | null): T | null {
  if (!stored) return null
  try {
    return JSON.parse(stored) as T
  } catch {
    return null
  }
}
