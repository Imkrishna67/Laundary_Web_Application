import { useEffect, useMemo, useState } from 'react'
import { ThemeContext } from './ThemeContextValues.jsx'

export function ThemeProvider({ children }) {
  const getInitial = () => {
    try {
      const stored = localStorage.getItem('quickwashTheme')
      if (stored === 'light' || stored === 'dark') return stored
    } catch {
      return
    }
    return 'dark'
  }

  const [theme, setTheme] = useState(getInitial)

  useEffect(() => {
    try {
      localStorage.setItem('quickwashTheme', theme)
    } catch {
      return
    }
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [theme])

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  const value = useMemo(() => ({ theme, toggle }), [theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

