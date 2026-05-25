import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex min-h-svh">
      <aside className="flex h-svh w-64 flex-col gap-3 border-r border-border bg-card p-4">
        <Skeleton className="h-10 w-full rounded-2xl" />
        <Skeleton className="h-8 w-3/4" />
        <div className="mt-4 flex flex-col gap-1.5">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
      </aside>
      <main className="flex-1 p-8">
        <Skeleton className="mb-4 h-8 w-48" />
        <Skeleton className="mb-2 h-4 w-64" />
        <Skeleton className="h-4 w-80" />
      </main>
    </div>
  )
}
