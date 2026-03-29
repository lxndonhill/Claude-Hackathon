'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck, Lock, Brain, Trash2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const points = [
  {
    icon: Lock,
    title: 'Your data stays private',
    body: 'All child profiles are stored securely in your own database. No child data is shared with third parties.',
  },
  {
    icon: ShieldCheck,
    title: 'Names never leave your device',
    body: "Child names are removed before any information is sent to the AI. Lumen only sees the child's age, support level, interests, and learning profile — never their name.",
  },
  {
    icon: Brain,
    title: 'AI suggestions are educational, not medical',
    body: 'Lumen generates plans based on research-informed strategies. These are starting points for professional educators and families — not clinical diagnoses or prescriptions.',
  },
  {
    icon: Trash2,
    title: 'You are always in control',
    body: 'You can edit, override, reject, or delete any AI suggestion at any time. You can also delete the entire child profile from your account.',
  },
]

export default function ConsentPage() {
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  return (
    <div className="mx-auto max-w-2xl space-y-6 page-enter">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">Before you create a profile</h1>
        <p className="mt-1 text-muted-foreground">
          Please take a moment to understand how Lumio handles information about the children in your care.
        </p>
      </div>

      <div className="space-y-3">
        {points.map(({ icon: Icon, title, body }) => (
          <Card key={title} className="border-border">
            <CardContent className="flex gap-4 p-5">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground">{title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-sm text-amber-800">
        <strong>Educational tool only.</strong> Lumio does not provide medical diagnoses, clinical assessments, or therapeutic recommendations. Always involve qualified professionals when making decisions about a child&apos;s education and wellbeing.
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-card p-4 hover:bg-muted/30 transition-colors">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-primary"
        />
        <span className="text-sm font-semibold text-foreground">
          I understand how Lumio handles information and that it is an educational support tool, not a medical service.
        </span>
      </label>

      <div className="flex items-center gap-3">
        <Button
          onClick={() => router.push('/dashboard/children/new')}
          disabled={!checked}
          className="gap-2 font-bold"
        >
          Continue to profile creation
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Link href="/dashboard">
          <Button variant="ghost">Cancel</Button>
        </Link>
      </div>
    </div>
  )
}
