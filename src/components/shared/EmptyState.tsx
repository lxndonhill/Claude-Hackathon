import Link from 'next/link'
import { LucideIcon } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
}

export function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20 p-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <h3 className="mb-2 text-lg font-bold text-foreground">{title}</h3>
      <p className="mb-6 max-w-sm text-muted-foreground leading-relaxed">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className={cn(buttonVariants(), 'font-semibold')}>
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
