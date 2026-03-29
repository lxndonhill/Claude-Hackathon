import { Skeleton } from '@/components/ui/skeleton'

export default function ProgressLoading() {
  return (
    <div className="space-y-6 page-enter">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="rounded-xl border bg-card p-6">
        <Skeleton className="mb-4 h-5 w-32" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border bg-card p-5">
            <div className="mb-3 flex items-start justify-between">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="mb-2 h-3 w-full rounded-full" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>
    </div>
  )
}
