"use client"

import { BookingsTable, useBookings } from "@/features/admin"
import { isoDateOffset } from "@/lib/utils"
import { useAuthorization } from "@/features/authorization"

const RANGE_DAYS_AHEAD = 1

export default function OverviewPage() {
  const { selectedOperator, hasAccess } = useAuthorization()
  const canView = hasAccess("front-desk-manager")
  const operatorId = selectedOperator?.id as number | undefined

  const range = {
    start: isoDateOffset(0),
    end: isoDateOffset(RANGE_DAYS_AHEAD),
  }

  const { bookings, isLoading, isFetching, hasNextPage, fetchNextPage } =
    useBookings({
      operatorId,
      range,
      enabled: canView,
    })

  function handleLoadMore() {
    fetchNextPage()
  }

  if (!canView) {
    return (
      <div className="p-8 text-sm text-muted-foreground">
        You don&apos;t have access to bookings.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Bookings arriving {range.start} → {range.end}
        </p>
      </header>

      <BookingsTable
        bookings={bookings}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyMessage="No arriving bookings in the selected range."
      />

      {hasNextPage ? (
        <button
          type="button"
          onClick={handleLoadMore}
          className="w-fit rounded-full border px-4 py-1.5 text-sm hover:bg-muted"
        >
          Load more
        </button>
      ) : null}
    </div>
  )
}
