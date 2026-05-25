export function getDeviceId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function getDeviceSecret(deviceId: string): string {
  if (typeof window === "undefined") return ""
  return window.btoa(`${Date.now()}${deviceId}`)
}
