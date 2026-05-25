import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** ISO yyyy-mm-dd of `today + daysFromNow`. */
export function isoDateOffset(
  daysFromNow: number,
  today: Date = new Date()
): string {
  const d = new Date(today)
  d.setDate(d.getDate() + daysFromNow)
  return d.toISOString().slice(0, 10)
}
