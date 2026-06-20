'use client'
import { useState } from 'react'
import { notFound } from 'next/navigation'
import { PROGRAM, getDayBySlug, getPhase, getWarmupYouTubeUrl } from '@/lib/program-data'
import ExerciseCard from '@/components/ExerciseCard'
import PhaseBar from '@/components/PhaseBar'
import { useSessionStore } from '@/store/sessionStore'

interface Props {
  params: { slug: string }
}

export default function EntrenamientoPage({ params }: Props) {
  const day = getDayBySlug(params.slug)
  if (!day) notFound()

  const currentMicro = useSessionStore((s) => s.currentMicro)
  const [micro, setMicro] = useState(currentMicro)

  const phase = getPhase(micro)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-5">
        <span className="text-4xl">{day.icon}</span>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: day.color }}>
            Día {day.num} — {day.name}
          </h1>
          <p className="text-sm" style={{ color: 'var(--text2)' }}>{day.focus}</p>
        </div>
      </div>

      {/* Phase bar + micro selector */}
      <PhaseBar currentMicro={micro} onSelectMicro={setMicro} />

      {/* Phase tip */}
      <div
        className="rounded-xl px-4 py-3 mb-5 text-sm"
        style={{ background: phase.bg, borderLeft: `3px solid ${phase.color}`, color: phase.color }}
      >
        <span className="font-semibold">Semana {micro} · {phase.label}:</span>{' '}
        <span style={{ color: 'var(--text)' }}>{phase.tip}</span>
      </div>

      {/* Warmup */}
      <div className="card mb-5">
        <div className="font-semibold mb-3" style={{ color: 'var(--orange, #fd9644)' }}>
          🔥 Entrada en calor
        </div>
        <div className="flex flex-col gap-1.5">
          {day.warmup.map((w, i) => {
            const url = getWarmupYouTubeUrl(w)
            return (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span style={{ color: 'var(--text2)' }}>✦</span>
                <span>{w}</span>
                {url && (
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs px-1.5 py-0.5 rounded ml-1"
                    style={{ background: 'rgba(255,0,0,0.15)', color: '#ff4444' }}
                  >
                    ▶ Ver técnica
                  </a>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Exercises */}
      <div className="flex flex-col gap-3 mb-5">
        <h2 className="font-bold text-sm uppercase tracking-wider" style={{ color: 'var(--text2)' }}>
          Ejercicios — {day.exercises.length} movimientos
        </h2>
        {day.exercises.map((ex, i) => (
          <ExerciseCard
            key={ex.id}
            exercise={ex}
            micro={micro}
            dayColor={day.color}
            index={i}
          />
        ))}
      </div>

      {/* Finisher */}
      {day.finisher && (
        <div
          className="card text-sm"
          style={{ borderColor: day.color + '44', color: day.color }}
        >
          🏃 {day.finisher}
        </div>
      )}
    </div>
  )
}
