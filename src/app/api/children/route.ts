import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createChildSchema } from '@/lib/validators/child'
import { z } from 'zod'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const children = await prisma.child.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(
    children.map((c) => ({
      ...c,
      strengths: JSON.parse(c.strengths),
      challenges: JSON.parse(c.challenges),
      sensoryPreferences: JSON.parse(c.sensoryPreferences),
      interests: JSON.parse(c.interests),
      dateOfBirth: c.dateOfBirth.toISOString(),
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    }))
  )
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = createChildSchema.parse(body)

    const child = await prisma.child.create({
      data: {
        userId: session.user.id,
        name: data.name,
        dateOfBirth: new Date(data.dateOfBirth),
        ageGroup: data.ageGroup,
        diagnosisDetails: data.diagnosisDetails,
        supportLevel: data.supportLevel,
        strengths: JSON.stringify(data.strengths),
        challenges: JSON.stringify(data.challenges),
        sensoryPreferences: JSON.stringify(data.sensoryPreferences),
        communicationStyle: data.communicationStyle,
        learningStyle: data.learningStyle,
        interests: JSON.stringify(data.interests),
        notes: data.notes,
      },
    })

    return NextResponse.json(
      {
        ...child,
        strengths: data.strengths,
        challenges: data.challenges,
        sensoryPreferences: data.sensoryPreferences,
        interests: data.interests,
        dateOfBirth: child.dateOfBirth.toISOString(),
        createdAt: child.createdAt.toISOString(),
        updatedAt: child.updatedAt.toISOString(),
      },
      { status: 201 }
    )
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
