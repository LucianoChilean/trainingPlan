import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SessionState {
  currentMicro: number
  currentDayIdx: number
  checked: Record<string, boolean>

  setMicro: (micro: number) => void
  setDayIdx: (idx: number) => void
  toggleCheck: (key: string) => void
  clearChecked: () => void
  advanceDay: () => void
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      currentMicro: 1,
      currentDayIdx: 0,
      checked: {},

      setMicro: (micro) => set({ currentMicro: micro }),
      setDayIdx: (idx) => set({ currentDayIdx: idx }),

      toggleCheck: (key) =>
        set((s) => ({ checked: { ...s.checked, [key]: !s.checked[key] } })),

      clearChecked: () => set({ checked: {} }),

      advanceDay: () => {
        const { currentDayIdx, currentMicro } = get()
        const nextDayIdx = (currentDayIdx + 1) % 4
        const isNewWeek = nextDayIdx === 0
        const nextMicro = isNewWeek ? Math.min(currentMicro + 1, 12) : currentMicro
        set({ currentDayIdx: nextDayIdx, currentMicro: nextMicro })
      },
    }),
    { name: 'luciano-session' }
  )
)
