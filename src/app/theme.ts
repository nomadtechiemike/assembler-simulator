import { useEffect, useState } from 'react'

export type ThemeChoice = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'assembler-simulator-theme'

const readTheme = (): ThemeChoice => {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    if (value === 'light' || value === 'dark' || value === 'system') {
      return value
    }
  }
  catch {
    // Private browsing can make local storage unavailable.
  }
  return 'system'
}

export const useTheme = () => {
  const [choice, setChoice] = useState<ThemeChoice>(readTheme)

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      document.documentElement.dataset.theme =
        choice === 'system' ? (media.matches ? 'dark' : 'light') : choice
    }
    apply()
    media.addEventListener('change', apply)
    try {
      window.localStorage.setItem(STORAGE_KEY, choice)
    }
    catch {
      // The selected theme still works for this session.
    }
    return () => media.removeEventListener('change', apply)
  }, [choice])

  return { choice, setChoice }
}
