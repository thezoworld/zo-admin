"use client"

import {
  buildBookingsSearchQuery,
  type BookingDateRange,
} from "@/features/admin/services/booking.service"
import type { Booking } from "@/features/admin/types"
import { useInfiniteTable } from "@/hooks/use-infinite-table"

export type UseBookingsArgs = {
  operatorId: number | string | undefined
  range: BookingDateRange
  enabled?: boolean
  pageSize?: number
}

/**
 * Typed wrapper around the generic infinite-table hook for the admin
 * bookings endpoint. Returns `rows: Booking[]` instead of `unknown[]`.
 */
export function useBookings({
  operatorId,
  range,
  enabled = true,
  pageSize = 20,
}: UseBookingsArgs) {
  const table = useInfiniteTable({
    queryEndpoint: "ADMIN_PM_BOOKINGS",
    enabled: enabled && Boolean(operatorId),
    pageSize,
    name: "admin-bookings",
    customSearchQuery: operatorId
      ? buildBookingsSearchQuery({ operatorId, range })
      : "",
  })

  return {
    ...table,
    bookings: table.rows as unknown as Booking[],
  }
}
