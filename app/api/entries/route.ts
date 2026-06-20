import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import type { WorkoutEntry } from '@prisma/client'

// GET /api/entries?exerciseId=torsoA_ex0
export async function GET(req: NextRequest) {
  const exerciseId = req.nextUrl.searchParams.get('exerciseId')
  if (!exerciseId) {
    return NextResponse.json({ error: 'exerciseId required' }, { status: 400 })
  }

  const rows = await prisma.workoutEntry.findMany({
    where: { exerciseId },
    orderBy: { savedAt: 'desc' },
  })

  const entries = rows.map((r: WorkoutEntry) => ({
    ...r,
    sets: JSON.parse(r.sets) as number[],
    savedAt: r.savedAt.toISOString(),
  }))

  return NextResponse.json(entries)
}

// POST /api/entries
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { exerciseId, micro, date, weight, sets, rpe, notes } = body

  if (!exerciseId || !micro || !date || !Array.isArray(sets)) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const entry = await prisma.workoutEntry.create({
    data: {
      exerciseId,
      micro: Number(micro),
      date,
      weight: weight != null ? Number(weight) : null,
      sets: JSON.stringify(sets),
      rpe: Number(rpe ?? 7),
      notes: notes ?? '',
    },
  })

  return NextResponse.json({
    ...entry,
    sets: JSON.parse(entry.sets) as number[],
    savedAt: entry.savedAt.toISOString(),
  })
}
