import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/export  — download full progress as JSON
export async function GET() {
  const rows = await prisma.workoutEntry.findMany({ orderBy: { savedAt: 'asc' } })

  const progress: Record<string, object[]> = {}
  for (const r of rows) {
    const entry = {
      id: r.id,
      micro: r.micro,
      date: r.date,
      weight: r.weight,
      sets: JSON.parse(r.sets),
      rpe: r.rpe,
      notes: r.notes,
      savedAt: r.savedAt.toISOString(),
    }
    if (!progress[r.exerciseId]) progress[r.exerciseId] = []
    progress[r.exerciseId].push(entry)
  }

  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    athlete: 'Luciano',
    totalEntries: rows.length,
    progress,
  }

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="macro-luciano-${new Date().toISOString().slice(0,10)}.json"`,
    },
  })
}
