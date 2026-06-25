import { useMemo, useState } from 'react'
import { ThemeContext } from './ThemeContextValues.jsx'

export function ThemeProvider({ children }) {
  const getInitialTheme = () => {
    if (typeof window === 'undefined') return 'dark'
    try {
      return localStorage.getItem('quickwashTheme') === 'light' ? 'light' : 'dark'
    } catch {
      return 'dark'
    }
  }

  const [theme, setTheme] = useState(getInitialTheme)

  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme)
  }

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem('quickwashTheme', next)
    } catch {
      // ignore storage errors
    }
  }

  const value = useMemo(() => ({ theme, toggle }), [theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

