import { PROGRAM, getPhase, parsePrescription } from '@/lib/program-data'

export default function ProgresionPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--accent)' }}>
        📈 Guía de Progresión
      </h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text2)' }}>
        Plan completo de 12 semanas — cada microciclo y su prescripción por ejercicio.
      </p>

      {/* Phase overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {PROGRAM.phases.map((ph) => (
          <div
            key={ph.label}
            className="rounded-xl p-4"
            style={{ background: ph.bg, border: `1px solid ${ph.color}44` }}
          >
            <div className="font-bold text-sm mb-1" style={{ color: ph.color }}>
              {ph.label}
            </div>
            <div className="text-xs mb-2" style={{ color: 'var(--text2)' }}>
              Semanas {ph.weeks[0]}–{ph.weeks[ph.weeks.length - 1]}
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text)' }}>
              {ph.tip}
            </p>
          </div>
        ))}
      </div>

      {/* Per-day progression tables */}
      {PROGRAM.days.map((day) => (
        <section key={day.id} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{day.icon}</span>
            <h2 className="text-lg font-bold" style={{ color: day.color }}>
              Día {day.num} — {day.name}
            </h2>
            <span className="text-sm" style={{ color: 'var(--text2)' }}>{day.focus}</span>
          </div>

          {day.exercises.map((ex) => (
            <div key={ex.id} className="card mb-3 overflow-x-auto">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-semibold text-sm">{ex.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--bg3)', color: 'var(--text2)' }}>
                  {ex.muscle}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--bg3)', color: 'var(--text2)' }}>
                  ⏱ {ex.rest}
                </span>
                {ex.w !== '— (elegir)' && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--bg3)', color: '#43e97b' }}>
                    Ref: {ex.w}
                  </span>
                )}
              </div>

              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {Array.from({ length: 12 }, (_, i) => {
                      const ph = getPhase(i + 1)
                      return (
                        <th
                          key={i}
                          className="pb-1 px-2 font-semibold whitespace-nowrap"
                          style={{ color: ph.color }}
                        >
                          S{i + 1}
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {ex.m.map((raw, i) => {
                      const { sets, note } = parsePrescription(raw)
                      const ph = getPhase(i + 1)
                      const hasUp   = note.includes('⬆')
                      const hasDown = note.includes('⬇')
                      return (
                        <td
                          key={i}
                          className="px-2 py-2 align-top whitespace-nowrap"
                          style={{ borderLeft: i > 0 ? '1px solid var(--border)' : 'none' }}
                          title={note}
                        >
                          <div className="font-bold" style={{ color: sets === '—' ? 'var(--text2)' : ph.color }}>
                            {sets}
                          </div>
                          {note && (
                            <div
                              className="mt-0.5 text-xs leading-tight max-w-[80px] whitespace-normal"
                              style={{
                                color: hasUp ? '#43e97b' : hasDown ? '#fc5c65' : 'var(--text2)',
                              }}
                            >
                              {note}
                            </div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}
