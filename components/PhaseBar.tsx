'use client'
import { PROGRAM } from '@/lib/program-data'

interface PhaseBarProps {
  currentMicro: number
  onSelectMicro?: (m: number) => void
}

export default function PhaseBar({ currentMicro, onSelectMicro }: PhaseBarProps) {
  return (
    <div
      className="rounded-xl p-4 mb-4"
      style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center gap-1 flex-wrap">
        {PROGRAM.phases.map((ph) =>
          ph.weeks.map((w) => (
            <button
              key={w}
              onClick={() => onSelectMicro?.(w)}
              className="micro-btn"
              style={
                w === currentMicro
                  ? { background: ph.color, borderColor: ph.color, color: '#000' }
                  : { borderColor: ph.color + '44', color: ph.color }
              }
              title={`Semana ${w} — ${ph.label}`}
            >
              {w}
            </button>
          ))
        )}
      </div>
      <div className="flex gap-3 mt-3 flex-wrap">
        {PROGRAM.phases.map((ph) => (
          <span
            key={ph.label}
            className="text-xs flex items-center gap-1"
            style={{ color: ph.color }}
          >
            <span>●</span> {ph.label} (S{ph.weeks[0]}
            {ph.weeks.length > 1 ? `–${ph.weeks[ph.weeks.length - 1]}` : ''})
          </span>
        ))}
      </div>
    </div>
  )
}
