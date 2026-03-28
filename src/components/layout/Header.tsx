'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

function buildBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean)
  return segments.map((seg, i) => {
    const href = '/' + segments.slice(0, i + 1).join('/')
    const label = seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ')
    return { href, label }
  })
}

export function Header() {
  const pathname = usePathname()
  const crumbs = buildBreadcrumbs(pathname)

  return (
    <header className="flex h-14 items-center border-b bg-white px-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-gray-500">
        {crumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3 w-3" />}
            {i === crumbs.length - 1 ? (
              <span className="font-medium text-gray-900">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="hover:text-gray-700">
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </nav>
    </header>
  )
}
