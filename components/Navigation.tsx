'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PROGRAM } from '@/lib/program-data'

const NAV_ITEMS = [
  { href: '/sesion',     label: '📅 Hoy me toca' },
  ...PROGRAM.days.map((d) => ({
    href: `/entrenamiento/${d.id}`,
    label: `${d.icon} ${d.name}`,
  })),
  { href: '/progresion', label: '📈 Progresión' },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav
      style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)' }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-1 overflow-x-auto">
        <span
          className="font-bold text-sm mr-3 whitespace-nowrap"
          style={{ color: 'var(--accent)' }}
        >
          🏋️ Macro Luciano
        </span>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link whitespace-nowrap ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
