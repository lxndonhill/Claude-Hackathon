import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { DashboardShell } from './shell'
import { TextSizeProvider } from '@/components/providers/TextSizeProvider'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { textSizePreference: true },
  })
  const textSize = (user?.textSizePreference ?? 'medium') as 'small' | 'medium' | 'large'

  return (
    <TextSizeProvider initialSize={textSize}>
      <DashboardShell>{children}</DashboardShell>
    </TextSizeProvider>
  )
}
