'use client'
import { useEffect, useState } from 'react'

interface Props {
  exerciseName: string
  wikiSlug: string
  onClose: () => void
}

export default function ExerciseImageModal({ exerciseName, wikiSlug, onClose }: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiSlug)}`)
      .then(r => r.json())
      .then((data: { thumbnail?: { source: string } }) => {
        const src = data.thumbnail?.source
        if (src) {
          setImageUrl(src.replace(/\/\d+px-/, '/640px-'))
        } else {
          setError(true)
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [wikiSlug])

  const searchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(exerciseName + ' ejercicio gym')}`

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)' }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl overflow-hidden w-full max-w-sm"
        style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <span className="font-semibold text-sm truncate pr-4">{exerciseName}</span>
          <button
            onClick={onClose}
            className="text-xl leading-none shrink-0"
            style={{ color: 'var(--text2)' }}
          >
            ×
          </button>
        </div>

        {/* Image area */}
        <div className="flex items-center justify-center p-4" style={{ minHeight: 260 }}>
          {loading && (
            <div className="flex flex-col items-center gap-2" style={{ color: 'var(--text2)' }}>
              <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
              <span className="text-xs">Cargando imagen…</span>
            </div>
          )}

          {!loading && error && (
            <div className="text-center" style={{ color: 'var(--text2)' }}>
              <div className="text-4xl mb-2">🖼️</div>
              <div className="text-sm mb-3">Sin ilustración disponible</div>
              <a
                href={searchUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs px-3 py-1.5 rounded-lg"
                style={{ background: 'rgba(108,99,255,0.15)', color: 'var(--accent)' }}
              >
                Buscar imágenes →
              </a>
            </div>
          )}

          {!loading && imageUrl && (
            <img
              src={imageUrl}
              alt={exerciseName}
              className="rounded-xl object-contain max-h-64 w-full"
            />
          )}
        </div>

        {/* Footer */}
        {!loading && !error && (
          <div
            className="flex items-center justify-between px-4 py-3 text-xs"
            style={{ borderTop: '1px solid var(--border)', color: 'var(--text2)' }}
          >
            <span>Fuente: Wikipedia</span>
            <a
              href={`https://en.wikipedia.org/wiki/${wikiSlug}`}
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--accent)' }}
            >
              Ver artículo →
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
