'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  BookOpen, LayoutDashboard, Users, LogOut, X, Settings,
  HelpCircle, MessageSquare, CalendarDays, BookMarked,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/children', label: 'Students', icon: Users },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

interface DashboardSummary {
  todayDay: string
  schedules: { id: string; title: string; childName: string; childId: string; blockCount: number }[]
  recentPlans: { id: string; title: string; focusArea: string; childName: string; childId: string; createdAt: string }[]
}

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [helpOpen, setHelpOpen] = useState(false)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [summary, setSummary] = useState<DashboardSummary | null>(null)

  useEffect(() => {
    fetch('/api/dashboard/today')
      .then((r) => r.json())
      .then((data) => { if (!data.error) setSummary(data) })
      .catch(() => {})
  }, [])

  const todayLabel = summary?.todayDay
    ? summary.todayDay.charAt(0) + summary.todayDay.slice(1).toLowerCase()
    : new Date().toLocaleDateString('en-US', { weekday: 'long' })

  return (
    <>
      <aside className="flex h-screen w-64 flex-col border-r bg-white px-4 py-6 overflow-y-auto">
        {/* Logo */}
        <div className="mb-6 flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-sm">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-extrabold text-foreground">Lumio</span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted md:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Main nav */}
        <nav className="space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-150',
                  active
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Daily Tasks */}
        <div className="mt-5 border-t border-border/50 pt-5">
          <div className="mb-2 flex items-center gap-2 px-2">
            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              {todayLabel}&apos;s Schedules
            </p>
          </div>
          {summary === null ? (
            <div className="space-y-1.5 px-2">
              <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
            </div>
          ) : summary.schedules.length === 0 ? (
            <p className="px-2 text-xs text-muted-foreground">No schedules for today</p>
          ) : (
            <div className="space-y-1">
              {summary.schedules.map((s) => (
                <Link
                  key={s.id}
                  href={`/dashboard/children/${s.childId}/schedules/${s.id}`}
                  onClick={onClose}
                  className="flex items-center justify-between rounded-lg px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <span className="truncate font-medium">{s.title}</span>
                  <ChevronRight className="h-3 w-3 flex-shrink-0 opacity-50" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Completed Work */}
        <div className="mt-5 border-t border-border/50 pt-5">
          <div className="mb-2 flex items-center gap-2 px-2">
            <BookMarked className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Recent Plans</p>
          </div>
          {summary === null ? (
            <div className="space-y-1.5 px-2">
              <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
            </div>
          ) : summary.recentPlans.length === 0 ? (
            <p className="px-2 text-xs text-muted-foreground">No plans generated yet</p>
          ) : (
            <div className="space-y-1">
              {summary.recentPlans.map((p) => (
                <Link
                  key={p.id}
                  href={`/dashboard/children/${p.childId}/plans/${p.id}`}
                  onClick={onClose}
                  className="flex items-center justify-between rounded-lg px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{p.focusArea}</p>
                    <p className="truncate text-muted-foreground/70">{p.childName}</p>
                  </div>
                  <ChevronRight className="h-3 w-3 flex-shrink-0 opacity-50" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Help & Feedback */}
        <div className="space-y-1 border-t border-border/50 pt-4">
          <button
            onClick={() => setHelpOpen(true)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-all duration-150 hover:bg-muted hover:text-foreground"
          >
            <HelpCircle className="h-4 w-4 flex-shrink-0" />
            Help
          </button>
          <button
            onClick={() => setFeedbackOpen(true)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-all duration-150 hover:bg-muted hover:text-foreground"
          >
            <MessageSquare className="h-4 w-4 flex-shrink-0" />
            Give Feedback
          </button>
        </div>

        {/* User profile */}
        <div className="mt-2 border-t border-border/50 pt-4">
          <div className="mb-3 flex items-center gap-3 px-2">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                {session?.user?.name?.charAt(0).toUpperCase() ?? 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-semibold text-foreground">{session?.user?.name}</p>
              <p className="truncate text-xs text-muted-foreground capitalize">{session?.user?.role?.toLowerCase()}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 font-semibold text-muted-foreground hover:text-foreground"
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Help modal */}
      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Help & Tips
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <p className="mb-1 font-semibold text-foreground">Getting started</p>
              <p>Add a student profile under Students, then generate a personalized learning plan from their profile page.</p>
            </div>
            <div>
              <p className="mb-1 font-semibold text-foreground">Learning plans</p>
              <p>Each plan is AI-generated based on the student&apos;s strengths, interests, and support level. You can review, accept, or override any suggestion.</p>
            </div>
            <div>
              <p className="mb-1 font-semibold text-foreground">Visual schedules</p>
              <p>Build day-by-day schedules with emoji icons and color blocks. Print them for the classroom or home.</p>
            </div>
            <div>
              <p className="mb-1 font-semibold text-foreground">Privacy</p>
              <p>Child names are never sent to AI services. Only anonymized profile data is used to generate plans.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Feedback modal */}
      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </>
  )
}

function FeedbackModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    // In a production app this would send to an API endpoint
    setSent(true)
    setTimeout(() => {
      setSent(false)
      setMessage('')
      onClose()
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Give Feedback
          </DialogTitle>
        </DialogHeader>
        {sent ? (
          <div className="py-6 text-center">
            <p className="text-2xl mb-2">✅</p>
            <p className="font-semibold text-foreground">Thank you for your feedback!</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Share your thoughts, suggestions, or report an issue. We&apos;d love to hear from you.
            </p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What's on your mind?"
              rows={4}
              required
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
            <Button type="submit" className="w-full" disabled={!message.trim()}>
              Send Feedback
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
