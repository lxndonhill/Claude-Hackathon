import { Skeleton } from '@/components/ui/skeleton'

export default function ChildrenLoading() {
  return (
    <div className="space-y-6 page-enter">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-10 w-28" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-xl border bg-card p-5">
            <div className="mb-3 flex items-start justify-between">
              <div className="space-y-1">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
            <div className="mb-3 flex gap-1">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
