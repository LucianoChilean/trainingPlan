'use client'
import { useState } from 'react'
import { useProgressStore } from '@/store/progressStore'

interface ProgressModalProps {
  exerciseId: string
  exerciseName: string
  defaultMicro: number
  onClose: () => void
  onSaved: () => void
}

export default function ProgressModal({
  exerciseId,
  exerciseName,
  defaultMicro,
  onClose,
  onSaved,
}: ProgressModalProps) {
  const addEntry = useProgressStore((s) => s.addEntry)
  const loading  = useProgressStore((s) => s.loading)

  const [micro,  setMicro]  = useState(defaultMicro)
  const [date,   setDate]   = useState(new Date().toISOString().slice(0, 10))
  const [weight, setWeight] = useState('')
  const [sets,   setSets]   = useState(['', '', ''])
  const [rpe,    setRpe]    = useState(7)
  const [notes,  setNotes]  = useState('')

  async function handleSave() {
    const parsedSets = sets.map(Number).filter((n) => !isNaN(n) && n > 0)
    if (parsedSets.length === 0) { alert('Ingresá al menos una serie'); return }

    await addEntry({
      exerciseId,
      micro,
      date,
      weight: weight ? Number(weight) : null,
      sets: parsedSets,
      rpe,
      notes,
    })
    onSaved()
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="font-bold text-base" style={{ color: 'var(--accent)' }}>
              📝 Registrar progreso
            </div>
            <div className="text-sm mt-0.5" style={{ color: 'var(--text2)' }}>
              {exerciseName}
            </div>
          </div>
          <button onClick={onClose} className="text-xl leading-none" style={{ color: 'var(--text2)' }}>
            ×
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {/* Microcycle + Date */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs mb-1 block" style={{ color: 'var(--text2)' }}>Microciclo</label>
              <select
                className="input"
                value={micro}
                onChange={(e) => setMicro(Number(e.target.value))}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>Semana {i + 1}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs mb-1 block" style={{ color: 'var(--text2)' }}>Fecha</label>
              <input
                type="date"
                className="input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {/* Weight */}
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text2)' }}>
              Carga (kg) — opcional
            </label>
            <input
              type="number"
              className="input"
              placeholder="ej: 95"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>

          {/* Sets */}
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text2)' }}>
              Reps por serie
            </label>
            <div className="flex gap-2">
              {sets.map((s, i) => (
                <input
                  key={i}
                  type="number"
                  className="input text-center"
                  placeholder={`S${i + 1}`}
                  value={s}
                  onChange={(e) => {
                    const next = [...sets]
                    next[i] = e.target.value
                    // auto-add slot when typing in last
                    if (i === sets.length - 1 && e.target.value) next.push('')
                    setSets(next)
                  }}
                />
              ))}
            </div>
          </div>

          {/* RPE */}
          <div>
            <label className="text-xs mb-1 flex justify-between" style={{ color: 'var(--text2)' }}>
              <span>RPE / Esfuerzo percibido</span>
              <span style={{ color: 'var(--accent)' }}>{rpe}/10</span>
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={rpe}
              onChange={(e) => setRpe(Number(e.target.value))}
            />
            <div className="flex justify-between text-xs" style={{ color: 'var(--text2)' }}>
              <span>Fácil</span><span>Máximo</span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text2)' }}>
              Notas (opcional)
            </label>
            <textarea
              className="input resize-none"
              rows={2}
              placeholder="Sensaciones, técnica, comparación..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button className="btn-accent w-full" onClick={handleSave} disabled={loading}>
            {loading ? 'Guardando...' : '✓ Guardar entrada'}
          </button>
        </div>
      </div>
    </div>
  )
}
