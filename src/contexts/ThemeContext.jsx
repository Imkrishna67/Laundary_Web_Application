import { useEffect, useMemo, useState } from 'react'
import { ThemeContext } from './ThemeContextValues.jsx'

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    try {
      localStorage.setItem('quickwashTheme', theme)
    } catch {
      // ignore storage errors
    }
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  const value = useMemo(() => ({ theme, toggle }), [theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

