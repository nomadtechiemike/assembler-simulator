import { useSyncExternalStore } from 'react'

export type Level = 'igcse' | 'alevel'

const STORAGE_KEY = 'assembler-simulator-level'

const readLevel = (): Level => {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    if (value === 'igcse' || value === 'alevel') {
      return value
    }
  }
  catch {
    // Local storage can be unavailable; fall back to the default.
  }
  return 'igcse'
}

let current: Level = readLevel()
const listeners = new Set<() => void>()

export const setLevel = (level: Level): void => {
  current = level
  try {
    window.localStorage.setItem(STORAGE_KEY, level)
  }
  catch {
    // The chosen level still applies for this session.
  }
  listeners.forEach((listener) => listener())
}

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const useLevel = (): Level => useSyncExternalStore(subscribe, () => current)
