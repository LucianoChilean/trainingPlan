import SessionView from '@/components/SessionView'

export default function SesionPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--accent)' }}>
        📅 Hoy me toca
      </h1>
      <p className="text-sm mb-5" style={{ color: 'var(--text2)' }}>
        Seguí tu sesión del día, marcá ejercicios completados y registrá tu progreso.
      </p>
      <SessionView />
    </div>
  )
}
