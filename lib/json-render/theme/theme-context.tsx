import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { lightTheme, darkTheme } from './tokens'
import type { Theme } from './tokens'

interface ThemeContextValue {
  theme: Theme
  isDark: boolean
  toggleTheme: () => void
  setDark: (dark: boolean) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
  setDark: () => {},
})

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false)

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev)
  }, [])

  const setDark = useCallback((dark: boolean) => {
    setIsDark(dark)
  }, [])

  const value = useMemo(
    () => ({
      theme: isDark ? darkTheme : lightTheme,
      isDark,
      toggleTheme,
      setDark,
    }),
    [isDark, toggleTheme, setDark],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}
