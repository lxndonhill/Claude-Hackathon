'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState<{ name: string; email: string; password: string; role: string }>({ name: '', email: '', password: '', role: 'TEACHER' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Registration failed')
      setLoading(false)
      return
    }

    await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    })

    router.push('/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-warm-gradient px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <Link href="/" className="mb-3 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-sm">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-extrabold text-foreground">Lumio</span>
          </Link>
        </div>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Create an account</CardTitle>
            <CardDescription>Start building personalized learning support plans</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="font-semibold">Full name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="Jane Smith"
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="font-semibold">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="font-semibold">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  placeholder="Minimum 8 characters"
                  required
                  minLength={8}
                  className="h-11"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-semibold">I am a</Label>
                <Select value={form.role} onValueChange={(v) => update('role', v ?? 'TEACHER')}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TEACHER">Teacher / Educator</SelectItem>
                    <SelectItem value="PARENT">Parent / Caregiver</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {error && <p className="rounded-lg bg-destructive/10 p-2 text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full h-11 font-bold" disabled={loading}>
                {loading ? 'Creating account…' : 'Create account'}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
