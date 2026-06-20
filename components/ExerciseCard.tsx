'use client'
import { useState } from 'react'
import { Exercise, parsePrescription, EXERCISE_WIKI_SLUG } from '@/lib/program-data'
import { useProgressStore, WorkoutEntry } from '@/store/progressStore'
import ProgressModal from './ProgressModal'
import ExerciseImageModal from './ExerciseImageModal'
import Toast from './Toast'

interface ExerciseCardProps {
  exercise: Exercise
  micro: number
  dayColor: string
  index: number
}

export default function ExerciseCard({ exercise, micro, dayColor, index }: ExerciseCardProps) {
  const [open,           setOpen]           = useState(false)
  const [showModal,      setShowModal]      = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [toast,          setToast]          = useState<string | null>(null)

  const wikiSlug = EXERCISE_WIKI_SLUG[exercise.id]

  const fetchEntries  = useProgressStore((s) => s.fetchEntries)
  const deleteEntry   = useProgressStore((s) => s.deleteEntry)
  const entriesMap    = useProgressStore((s) => s.entries)
  const entries: WorkoutEntry[] = entriesMap[exercise.id] ?? []

  const raw = exercise.m[micro - 1] ?? '—|'
  const { sets, note } = parsePrescription(raw)
  const isSkip = sets === '—'
  const hasArrow = note.includes('⬆') || note.includes('⬇')

  // YT search link
  const ytSearch = `https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.name + ' técnica gym')}`

  function handleToggle() {
    if (!open && entries.length === 0) fetchEntries(exercise.id)
    setOpen((v) => !v)
  }

  return (
    <>
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      <div className="exercise-card">
        {/* ── Header row ── */}
        <div
          className="flex items-start gap-3 p-4 cursor-pointer"
          onClick={handleToggle}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
            style={{ background: dayColor + '22', color: dayColor }}
          >
            {index + 1}
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm">{exercise.name}</div>
            <div className="flex flex-wrap gap-1.5 mt-1">
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--bg3)', color: 'var(--text2)' }}>
                ⏱ {exercise.rest}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--bg3)', color: 'var(--text2)' }}>
                {exercise.muscle}
              </span>
              {exercise.w !== '— (elegir)' && (
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--bg3)', color: 'var(--cgreen, #43e97b)' }}>
                  Ref: {exercise.w}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {wikiSlug && (
              <button
                onClick={(e) => { e.stopPropagation(); setShowImageModal(true) }}
                className="text-xs px-2 py-1 rounded-lg"
                style={{ background: 'rgba(253,150,68,0.15)', color: '#fd9644' }}
                title="Ver ilustración del ejercicio"
              >
                🖼 Img
              </button>
            )}
            <a
              href={ytSearch}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs px-2 py-1 rounded-lg"
              style={{ background: 'rgba(255,0,0,0.15)', color: '#ff4444' }}
              title="Ver técnica en YouTube"
            >
              ▶ Ver
            </a>
            <button
              onClick={(e) => { e.stopPropagation(); setShowModal(true) }}
              className="text-xs px-2 py-1 rounded-lg"
              style={{ background: 'rgba(108,99,255,0.15)', color: 'var(--accent)' }}
            >
              📝 Log
            </button>
            <span className="text-xs" style={{ color: 'var(--text2)' }}>{open ? '▲' : '▼'}</span>
          </div>
        </div>

        {/* ── Prescription ── */}
        <div
          className="px-4 pb-3 flex items-center gap-3"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          {isSkip ? (
            <span className="text-sm italic" style={{ color: 'var(--text2)' }}>
              — Opcional / descanso esta semana
            </span>
          ) : (
            <>
              <span className="text-xl font-bold" style={{ color: dayColor }}>{sets}</span>
              {note && (
                <span
                  className="text-sm"
                  style={{ color: hasArrow ? (note.includes('⬆') ? 'var(--green, #43e97b)' : 'var(--red, #fc5c65)') : 'var(--text2)' }}
                >
                  {note}
                </span>
              )}
            </>
          )}
        </div>

        {/* ── History (expandable) ── */}
        {open && (
          <div
            className="px-4 pb-4"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <div className="text-xs font-semibold mt-3 mb-2" style={{ color: 'var(--text2)' }}>
              Historial ({entries.length} entradas)
            </div>
            {entries.length === 0 ? (
              <div className="text-xs italic" style={{ color: 'var(--text2)' }}>
                Sin entradas aún. ¡Logeá tu primera sesión!
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-lg p-3 text-xs"
                    style={{ background: 'var(--bg3)' }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-semibold" style={{ color: 'var(--accent)' }}>
                          S{entry.micro}
                        </span>
                        <span className="ml-2" style={{ color: 'var(--text2)' }}>{entry.date}</span>
                        {entry.weight && (
                          <span className="ml-2 font-semibold" style={{ color: 'var(--cgreen, #43e97b)' }}>
                            {entry.weight} kg
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span style={{ color: 'var(--text2)' }}>RPE {entry.rpe}</span>
                        <button
                          onClick={() => deleteEntry(entry.id, exercise.id).then(() => setToast('Entrada eliminada'))}
                          className="text-red-400 hover:text-red-300"
                          title="Eliminar"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    <div className="mt-1">
                      Series: {entry.sets.map((r, i) => (
                        <span key={i} className="inline-block px-1.5 py-0.5 rounded mr-1" style={{ background: 'var(--bg2)' }}>
                          {r}
                        </span>
                      ))}
                    </div>
                    {entry.notes && (
                      <div className="mt-1 italic" style={{ color: 'var(--text2)' }}>{entry.notes}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <ProgressModal
          exerciseId={exercise.id}
          exerciseName={exercise.name}
          defaultMicro={micro}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            fetchEntries(exercise.id)
            setToast('✓ Entrada guardada')
          }}
        />
      )}

      {showImageModal && wikiSlug && (
        <ExerciseImageModal
          exerciseName={exercise.name}
          wikiSlug={wikiSlug}
          onClose={() => setShowImageModal(false)}
        />
      )}
    </>
  )
}
