import { create } from 'zustand'

export interface WorkoutEntry {
  id: number
  exerciseId: string
  micro: number
  date: string
  weight: number | null
  sets: number[]   // parsed from JSON string in DB
  rpe: number
  notes: string
  savedAt: string
}

interface ProgressState {
  entries: Record<string, WorkoutEntry[]>  // keyed by exerciseId
  loading: boolean
  error: string | null

  fetchEntries: (exerciseId: string) => Promise<void>
  addEntry: (data: Omit<WorkoutEntry, 'id' | 'savedAt'>) => Promise<void>
  deleteEntry: (id: number, exerciseId: string) => Promise<void>
}

export const useProgressStore = create<ProgressState>()((set, get) => ({
  entries: {},
  loading: false,
  error: null,

  fetchEntries: async (exerciseId) => {
    set({ loading: true, error: null })
    try {
      const res = await fetch(`/api/entries?exerciseId=${encodeURIComponent(exerciseId)}`)
      if (!res.ok) throw new Error('Error fetching entries')
      const data: WorkoutEntry[] = await res.json()
      set((s) => ({ entries: { ...s.entries, [exerciseId]: data }, loading: false }))
    } catch (e) {
      set({ error: String(e), loading: false })
    }
  },

  addEntry: async (data) => {
    set({ loading: true, error: null })
    try {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Error saving entry')
      const saved: WorkoutEntry = await res.json()
      set((s) => ({
        loading: false,
        entries: {
          ...s.entries,
          [data.exerciseId]: [saved, ...(s.entries[data.exerciseId] ?? [])],
        },
      }))
    } catch (e) {
      set({ error: String(e), loading: false })
    }
  },

  deleteEntry: async (id, exerciseId) => {
    try {
      await fetch(`/api/entries/${id}`, { method: 'DELETE' })
      set((s) => ({
        entries: {
          ...s.entries,
          [exerciseId]: (s.entries[exerciseId] ?? []).filter((e) => e.id !== id),
        },
      }))
    } catch (e) {
      set({ error: String(e) })
    }
  },
}))
