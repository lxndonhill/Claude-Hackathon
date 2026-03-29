'use client'

import { Suspense, useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const DEMO_EMAIL = 'demo@lumio.app'
const DEMO_PASSWORD = 'demo1234'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (searchParams.get('demo') === 'true') {
      setEmail(DEMO_EMAIL)
      setPassword(DEMO_PASSWORD)
    }
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('Invalid email or password')
    } else {
      router.push('/dashboard')
    }
  }

  async function signInAsDemo() {
    setError('')
    setLoading(true)
    const result = await signIn('credentials', {
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      redirect: false,
    })
    setLoading(false)
    if (result?.error) {
      setError('Demo account not found. Please run: npm run seed')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 flex flex-col items-center">
        <Link href="/" className="mb-3 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-sm">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-2xl font-extrabold text-foreground">Lumio</span>
        </Link>
      </div>

      {/* Demo shortcut */}
      <div className="mb-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <p className="mb-2 text-sm font-semibold text-foreground">Try the demo instantly</p>
        <p className="mb-3 text-xs text-muted-foreground">
          3 pre-built student profiles with plans, schedules &amp; progress data.
        </p>
        <Button
          type="button"
          variant="default"
          className="w-full gap-2 font-bold"
          onClick={signInAsDemo}
          disabled={loading}
        >
          <Sparkles className="h-4 w-4" />
          Sign in as Demo Teacher
        </Button>
      </div>

      <div className="relative my-4">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-warm-gradient px-2 text-xs text-muted-foreground">
          or sign in with your account
        </span>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Welcome back</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="font-semibold">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="h-11"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="font-semibold">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="h-11"
              />
            </div>
            {error && <p className="rounded-lg bg-destructive/10 p-2 text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full h-11 font-bold" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Create one
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-warm-gradient px-4">
      <Suspense fallback={
        <div className="w-full max-w-sm animate-pulse space-y-4">
          <div className="mx-auto h-10 w-32 rounded-lg bg-muted" />
          <div className="h-40 rounded-xl bg-muted" />
          <div className="h-64 rounded-xl bg-muted" />
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  )
}
