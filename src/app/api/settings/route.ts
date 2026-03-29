import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateSettingsSchema = z.object({
  textSizePreference: z.enum(['small', 'medium', 'large']),
})

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { textSizePreference: true },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({ textSizePreference: user.textSizePreference })
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = updateSettingsSchema.parse(body)

    await prisma.user.update({
      where: { id: session.user.id },
      data: { textSizePreference: data.textSizePreference },
    })

    return NextResponse.json({ textSizePreference: data.textSizePreference })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid settings value' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
