import { describe, expect, it } from "vitest"

import type { Booking, Currency } from "@/features/admin/types"

import {
  bookingNights,
  buildBookingsSearchQuery,
  formatBookingDateRange,
  formatCurrency,
  isoDateOffset,
  nightsBetween,
  primaryGuestMobile,
  primaryGuestName,
  primaryRoomName,
} from "./booking.service"

const INR: Currency = { code: "INR", name: "Indian Rupee", symbol: "₹" }

function makeBooking(overrides: Partial<Booking> = {}): Booking {
  return {
    id: 1,
    code: "X-1",
    status: "confirmed",
    guests: [],
    rooms: [],
    source: {} as never,
    operator: {} as never,
    currency: INR,
    rooms_info: [],
    start_date: "2026-05-24",
    end_date: "2026-05-26",
    time_create: "",
    time_update: "",
    amount: 0,
    tax_amount: 0,
    advance_amount: 0,
    paid_amount: 0,
    due_amount: 0,
    discount: 0,
    offer_discount: 0,
    can_pay_later: false,
    overbooked: false,
    expected_checkin_count: 0,
    origin: 1,
    cancelled_at: null,
    gst_num: null,
    guest_notes: null,
    manager_notes: null,
    booking_pdf: null,
    reserved_by: {},
    meta_details: {},
    checkins: [],
    created_by: null,
    coupon: null,
    channel_booking: null,
    ...overrides,
  }
}

describe("primaryGuestName", () => {
  it("returns the first guest's name when present", () => {
    const b = makeBooking({
      guests: [{ name: "Manish Choudhary" } as never],
    })
    expect(primaryGuestName(b)).toBe("Manish Choudhary")
  })

  it("falls back to rooms_info[0].guest.name", () => {
    const b = makeBooking({
      rooms_info: [{ guest: { name: "From Rooms" } } as never],
    })
    expect(primaryGuestName(b)).toBe("From Rooms")
  })

  it("returns em-dash when nothing available", () => {
    expect(primaryGuestName(makeBooking())).toBe("—")
  })
})

describe("primaryRoomName", () => {
  it("prefers rooms[0].name", () => {
    const b = makeBooking({
      rooms: [{ name: "Deluxe Private Room" } as never],
    })
    expect(primaryRoomName(b)).toBe("Deluxe Private Room")
  })

  it("falls back to rooms_info inventory_name", () => {
    const b = makeBooking({
      rooms_info: [{ inventory_name: "Dorm Bed" } as never],
    })
    expect(primaryRoomName(b)).toBe("Dorm Bed")
  })
})

describe("primaryGuestMobile", () => {
  it("returns the first guest mobile", () => {
    expect(
      primaryGuestMobile(
        makeBooking({ guests: [{ mobile: "918448844380" } as never] })
      )
    ).toBe("918448844380")
  })

  it("returns empty when nothing present", () => {
    expect(primaryGuestMobile(makeBooking())).toBe("")
  })
})

describe("nightsBetween / bookingNights", () => {
  it("returns whole nights between two dates", () => {
    expect(nightsBetween("2026-05-24", "2026-05-26")).toBe(2)
    expect(nightsBetween("2026-05-24", "2026-05-25")).toBe(1)
    expect(nightsBetween("2026-05-24", "2026-05-24")).toBe(0)
  })

  it("clamps negative ranges to 0", () => {
    expect(nightsBetween("2026-05-26", "2026-05-24")).toBe(0)
  })

  it("returns 0 for garbage", () => {
    expect(nightsBetween("not-a-date", "2026-05-24")).toBe(0)
  })

  it("bookingNights reads from start/end_date", () => {
    expect(
      bookingNights(
        makeBooking({ start_date: "2026-05-24", end_date: "2026-05-27" })
      )
    ).toBe(3)
  })
})

describe("formatCurrency", () => {
  it("prefixes the symbol", () => {
    expect(formatCurrency(4998, INR)).toBe("₹4998")
  })

  it("uses 2dp for non-integers", () => {
    expect(formatCurrency(2214.35, INR)).toBe("₹2214.35")
  })
})

describe("formatBookingDateRange", () => {
  it("joins start → end", () => {
    expect(
      formatBookingDateRange(
        makeBooking({ start_date: "2026-05-24", end_date: "2026-05-26" })
      )
    ).toBe("2026-05-24 → 2026-05-26")
  })
})

describe("buildBookingsSearchQuery", () => {
  it("emits the Django-filter form", () => {
    expect(
      buildBookingsSearchQuery({
        operatorId: 118,
        range: { start: "2026-05-23", end: "2026-05-24" },
      })
    ).toBe("operator=118&start_date__gte=2026-05-23&start_date__lte=2026-05-24")
  })
})

describe("isoDateOffset", () => {
  it("returns YYYY-MM-DD offset from the given date", () => {
    const ref = new Date("2026-05-24T12:00:00Z")
    expect(isoDateOffset(0, ref)).toBe("2026-05-24")
    expect(isoDateOffset(2, ref)).toBe("2026-05-26")
    expect(isoDateOffset(-1, ref)).toBe("2026-05-23")
  })
})
