import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createChildSchema } from '@/lib/validators/child'
import { z } from 'zod'

async function getChildAndVerifyOwnership(childId: string, userId: string) {
  const child = await prisma.child.findUnique({ where: { id: childId } })
  if (!child) return null
  if (child.userId !== userId) return null
  return child
}

export async function GET(
  _req: Request,
  { params }: { params: { childId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const child = await getChildAndVerifyOwnership(params.childId, session.user.id)
  if (!child) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({
    ...child,
    strengths: JSON.parse(child.strengths),
    challenges: JSON.parse(child.challenges),
    sensoryPreferences: JSON.parse(child.sensoryPreferences),
    interests: JSON.parse(child.interests),
    dateOfBirth: child.dateOfBirth.toISOString(),
    createdAt: child.createdAt.toISOString(),
    updatedAt: child.updatedAt.toISOString(),
  })
}

export async function PUT(
  req: Request,
  { params }: { params: { childId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const child = await getChildAndVerifyOwnership(params.childId, session.user.id)
  if (!child) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    const body = await req.json()
    const data = createChildSchema.parse(body)

    const updated = await prisma.child.update({
      where: { id: params.childId },
      data: {
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

    return NextResponse.json({
      ...updated,
      strengths: data.strengths,
      challenges: data.challenges,
      sensoryPreferences: data.sensoryPreferences,
      interests: data.interests,
      dateOfBirth: updated.dateOfBirth.toISOString(),
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { childId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const child = await getChildAndVerifyOwnership(params.childId, session.user.id)
  if (!child) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await prisma.child.delete({ where: { id: params.childId } })
  return NextResponse.json({ success: true })
}
