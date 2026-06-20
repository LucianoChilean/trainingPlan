'use client'
import { useState } from 'react'
import Link from 'next/link'
import { PROGRAM, getPhase, getWarmupYouTubeUrl, parsePrescription } from '@/lib/program-data'
import { useSessionStore } from '@/store/sessionStore'
import ProgressModal from './ProgressModal'
import Toast from './Toast'

export default function SessionView() {
  const { currentMicro, currentDayIdx, checked, setMicro, setDayIdx, toggleCheck, advanceDay } =
    useSessionStore()

  const [modal,    setModal]    = useState<{ id: string; name: string } | null>(null)
  const [toast,    setToast]    = useState<string | null>(null)

  const day   = PROGRAM.days[currentDayIdx]
  const phase = getPhase(currentMicro)

  const doneKeys = day.exercises.map((_, i) => `${day.id}_m${currentMicro}_ex${i}`)
  const doneCount = doneKeys.filter((k) => checked[k]).length
  const total     = day.exercises.length
  const pct       = Math.round((doneCount / total) * 100)

  function handleCompleteDay() {
    const nextDayIdx  = (currentDayIdx + 1) % 4
    const isNewWeek   = nextDayIdx === 0
    const nextMicro   = isNewWeek ? Math.min(currentMicro + 1, 12) : currentMicro

    const msg = isNewWeek && currentMicro < 12
      ? `¿Avanzar a la Semana ${nextMicro}?`
      : isNewWeek && currentMicro === 12
      ? '¡Completaste el macro de 12 semanas! 🎉'
      : `Siguiente: Día ${nextDayIdx + 1} — ${PROGRAM.days[nextDayIdx].name}`

    if (confirm(`✅ ¡Sesión completada!\n\n${msg}`)) {
      advanceDay()
      setToast(`✓ Avanzando al Día ${nextDayIdx + 1} — ${PROGRAM.days[nextDayIdx].name}`)
    }
  }

  return (
    <>
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {/* ── Phase & micro selector ── */}
      <div className="card mb-4">
        <div
          className="phase-badge mb-3"
          style={{ background: phase.bg, borderColor: phase.color, color: phase.color }}
        >
          <span>●</span> Semana {currentMicro} — {phase.label}
        </div>
        <p className="text-sm mb-3" style={{ color: 'var(--text2)' }}>{phase.tip}</p>

        <div className="flex flex-wrap gap-1">
          {PROGRAM.phases.map((ph) =>
            ph.weeks.map((w) => (
              <button
                key={w}
                onClick={() => setMicro(w)}
                className="micro-btn"
                style={
                  w === currentMicro
                    ? { background: ph.color, borderColor: ph.color, color: '#000' }
                    : { borderColor: ph.color + '55', color: ph.color }
                }
                title={`Semana ${w} — ${ph.label}`}
              >
                {w}
              </button>
            ))
          )}
        </div>
      </div>

      {/* ── Day rotation strip ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {PROGRAM.days.map((d, i) => {
          const isCur = i === currentDayIdx
          return (
            <button
              key={d.id}
              onClick={() => setDayIdx(i)}
              className="rounded-xl p-3 text-left transition-all border"
              style={{
                background: isCur ? d.color + '18' : 'var(--card)',
                borderColor: isCur ? d.color : 'var(--border)',
              }}
            >
              <div className="text-xl">{d.icon}</div>
              <div className="text-xs font-bold mt-1" style={{ color: isCur ? d.color : 'var(--text)' }}>
                Día {d.num} — {d.name}
              </div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text2)' }}>{d.focus}</div>
            </button>
          )
        })}
      </div>

      {/* ── Workout card ── */}
      <div className="card">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{day.icon}</span>
            <div>
              <div className="font-bold text-lg" style={{ color: day.color }}>
                Día {day.num} — {day.name}
              </div>
              <div className="text-sm" style={{ color: 'var(--text2)' }}>{day.focus}</div>
            </div>
          </div>
          <Link
            href={`/entrenamiento/${day.id}`}
            className="btn-ghost text-sm"
            style={{ color: day.color, borderColor: day.color + '55' }}
          >
            Ver detalle completo →
          </Link>
        </div>

        {/* Warmup */}
        <div
          className="rounded-xl p-3 mb-4"
          style={{ background: 'var(--bg3)' }}
        >
          <div className="text-xs font-bold mb-2" style={{ color: 'var(--orange, #fd9644)' }}>
            🔥 Entrada en calor
          </div>
          <div className="flex flex-col gap-1">
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
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{ background: 'rgba(255,0,0,0.15)', color: '#ff4444' }}
                    >
                      ▶
                    </a>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Exercises */}
        <div className="flex flex-col gap-2 mb-4">
          {day.exercises.map((ex, i) => {
            const chkKey = `${day.id}_m${currentMicro}_ex${i}`
            const isDone = !!checked[chkKey]
            const { sets, note } = parsePrescription(ex.m[currentMicro - 1] ?? '—|')
            const isSkip = sets === '—'
            const hasArrow = note.includes('⬆') || note.includes('⬇')

            return (
              <div
                key={ex.id}
                className="flex items-start gap-3 rounded-xl p-3 transition-all border"
                style={{
                  background: isDone ? day.color + '0f' : 'var(--bg3)',
                  borderColor: isDone ? day.color + '44' : 'transparent',
                  opacity: isSkip ? 0.6 : 1,
                }}
              >
                {/* checkbox */}
                <button
                  onClick={() => toggleCheck(chkKey)}
                  className="w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all"
                  style={{
                    background: isDone ? day.color : 'transparent',
                    borderColor: isDone ? day.color : 'var(--border)',
                    color: '#fff',
                    fontSize: '0.7rem',
                  }}
                >
                  {isDone ? '✓' : ''}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{ex.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text2)' }}>
                    ⏱ {ex.rest} · {ex.muscle}
                  </div>
                  {!isSkip && (
                    <div className="mt-1 flex items-center gap-2 flex-wrap">
                      <span className="font-bold" style={{ color: day.color }}>{sets}</span>
                      {note && (
                        <span
                          className="text-xs"
                          style={{
                            color: hasArrow
                              ? note.includes('⬆') ? '#43e97b' : '#fc5c65'
                              : 'var(--text2)',
                          }}
                        >
                          {note}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setModal({ id: ex.id, name: ex.name })}
                  className="text-xs px-2 py-1 rounded-lg shrink-0"
                  style={{ background: 'rgba(108,99,255,0.15)', color: 'var(--accent)' }}
                >
                  📝
                </button>
              </div>
            )
          })}
        </div>

        {/* Finisher */}
        {day.finisher && (
          <div
            className="rounded-xl p-3 mb-4 text-sm"
            style={{ background: 'rgba(108,99,255,0.1)', color: 'var(--accent)' }}
          >
            🏃 {day.finisher}
          </div>
        )}

        {/* Progress bar */}
        <div className="mt-2">
          <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text2)' }}>
            <span>{doneCount}/{total} ejercicios</span>
            <span>{pct}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${pct}%`, background: day.color }} />
          </div>
          {doneCount === total && (
            <button
              onClick={handleCompleteDay}
              className="w-full mt-3 py-2 rounded-xl text-sm font-bold transition-all"
              style={{ background: day.color, color: '#fff' }}
            >
              ✓ Sesión completa → Avanzar
            </button>
          )}
        </div>
      </div>

      {modal && (
        <ProgressModal
          exerciseId={modal.id}
          exerciseName={modal.name}
          defaultMicro={currentMicro}
          onClose={() => setModal(null)}
          onSaved={() => setToast('✓ Entrada guardada')}
        />
      )}
    </>
  )
}
