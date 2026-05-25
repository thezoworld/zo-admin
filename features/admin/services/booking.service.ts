import type { Booking, Currency } from "@/features/admin/types"

/**
 * Pure derivations + formatters for bookings. No React, no network.
 * Heavily covered by tests under booking.service.test.ts.
 */

const ONE_DAY_MS = 24 * 60 * 60 * 1000

export function primaryGuestName(booking: Booking): string {
  const guest = booking.guests[0]
  if (guest?.name) return guest.name
  const roomGuest = booking.rooms_info[0]?.guest
  if (roomGuest?.name) return roomGuest.name
  return "—"
}

export function primaryGuestMobile(booking: Booking): string {
  return booking.guests[0]?.mobile ?? booking.rooms_info[0]?.guest.mobile ?? ""
}

export function primaryRoomName(booking: Booking): string {
  return booking.rooms[0]?.name ?? booking.rooms_info[0]?.inventory_name ?? "—"
}

export function nightsBetween(checkin: string, checkout: string): number {
  const a = new Date(checkin).getTime()
  const b = new Date(checkout).getTime()
  if (!Number.isFinite(a) || !Number.isFinite(b)) return 0
  return Math.max(0, Math.round((b - a) / ONE_DAY_MS))
}

export function bookingNights(booking: Booking): number {
  return nightsBetween(booking.start_date, booking.end_date)
}

export function formatCurrency(amount: number, currency: Currency): string {
  // Avoid `Intl` quirks with the rupee glyph; lean on the API's symbol.
  const fixed = Number.isInteger(amount) ? amount.toString() : amount.toFixed(2)
  return `${currency.symbol}${fixed}`
}

export function formatBookingDateRange(booking: Booking): string {
  return `${booking.start_date} → ${booking.end_date}`
}

export type BookingDateRange = {
  start: string
  end: string
}

/**
 * Build the search-query string for the bookings endpoint. The backend
 * uses `start_date__gte` / `start_date__lte` (Django filters), not bare
 * `start_date` / `end_date`.
 */
export function buildBookingsSearchQuery(input: {
  operatorId: number | string
  range: BookingDateRange
}): string {
  const parts = [
    `operator=${input.operatorId}`,
    `start_date__gte=${input.range.start}`,
    `start_date__lte=${input.range.end}`,
  ]
  return parts.join("&")
}

// `isoDateOffset` was moved to `lib/utils` — it's a generic date helper,
// not booking-specific. Imported here only so this file's tests can use
// it through the same module path they did before.
export { isoDateOffset } from "@/lib/utils"
