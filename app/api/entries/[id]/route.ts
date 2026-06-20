import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// DELETE /api/entries/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params
  const id = Number(rawId)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  await prisma.workoutEntry.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
