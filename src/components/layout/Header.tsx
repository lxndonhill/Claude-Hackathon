'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Menu } from 'lucide-react'

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  children: 'Students',
  plans: 'Learning Plans',
  schedules: 'Schedules',
  progress: 'Progress',
  new: 'New',
  edit: 'Edit',
  consent: 'Privacy',
}

function buildBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean)
  return segments.map((seg, i) => {
    const href = '/' + segments.slice(0, i + 1).join('/')
    // Use a friendly label if available, otherwise capitalize the raw segment
    const label =
      SEGMENT_LABELS[seg] ??
      (seg.length === 25
        ? '' // skip cuid-like IDs in breadcrumb label
        : seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' '))
    return { href, label }
  }).filter((c) => c.label !== '')
}

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname()
  const crumbs = buildBreadcrumbs(pathname)

  return (
    <header className="flex h-14 items-center gap-3 border-b bg-white px-4 md:px-6">
      {onMenuClick && (
        <button
          onClick={onMenuClick}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground overflow-hidden">
        {crumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-1 min-w-0">
            {i > 0 && <ChevronRight className="h-3 w-3 flex-shrink-0" />}
            {i === crumbs.length - 1 ? (
              <span className="font-semibold text-foreground truncate">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="hover:text-foreground transition-colors truncate">
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </nav>
    </header>
  )
}
