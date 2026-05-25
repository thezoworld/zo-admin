"use client"

import {
  bookingNights,
  formatBookingDateRange,
  formatCurrency,
  primaryGuestMobile,
  primaryGuestName,
  primaryRoomName,
} from "@/features/admin/services/booking.service"
import type { Booking } from "@/features/admin/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export function BookingsTable({
  bookings,
  isLoading,
  isFetching,
  emptyMessage = "No bookings.",
}: {
  bookings: ReadonlyArray<Booking>
  isLoading?: boolean
  isFetching?: boolean
  emptyMessage?: string
}) {
  if (isLoading) {
    return (
      <div className="rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground">
        Loading bookings…
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-3xl border border-border bg-card",
        isFetching && "opacity-80"
      )}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Guest</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead className="text-right">Nights</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Paid</TableHead>
            <TableHead className="text-right">Due</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <BookingRow key={booking.id} booking={booking} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function BookingRow({ booking }: { booking: Booking }) {
  return (
    <TableRow>
      <TableCell className="font-mono text-xs">{booking.code}</TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium">{primaryGuestName(booking)}</span>
          <span className="text-xs text-muted-foreground">
            {primaryGuestMobile(booking)}
          </span>
        </div>
      </TableCell>
      <TableCell>{primaryRoomName(booking)}</TableCell>
      <TableCell className="text-xs whitespace-nowrap">
        {formatBookingDateRange(booking)}
      </TableCell>
      <TableCell className="text-right tabular-nums">
        {bookingNights(booking)}
      </TableCell>
      <TableCell className="text-right tabular-nums">
        {formatCurrency(booking.amount, booking.currency)}
      </TableCell>
      <TableCell className="text-right tabular-nums">
        {formatCurrency(booking.paid_amount, booking.currency)}
      </TableCell>
      <TableCell className="text-right tabular-nums">
        {formatCurrency(booking.due_amount, booking.currency)}
      </TableCell>
      <TableCell className="text-xs">{booking.source?.name}</TableCell>
      <TableCell>
        <StatusBadge status={booking.status} />
      </TableCell>
    </TableRow>
  )
}

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "confirmed"
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
      : status === "cancelled"
        ? "bg-destructive/10 text-destructive"
        : "bg-muted text-muted-foreground"
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize",
        tone
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  )
}
