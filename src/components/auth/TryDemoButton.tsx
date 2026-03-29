'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function TryDemoButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    const result = await signIn('credentials', {
      email: 'demo@lumio.app',
      password: 'demo1234',
      redirect: false,
    })
    if (result?.error) {
      router.push('/login?demo=true')
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <Button
      size="lg"
      variant="outline"
      className="gap-2 px-8 text-base font-bold border-primary/30 hover:bg-primary/5"
      onClick={handleClick}
      disabled={loading}
    >
      <Sparkles className="h-4 w-4 text-primary" />
      {loading ? 'Signing in…' : 'Try the demo'}
    </Button>
  )
}
