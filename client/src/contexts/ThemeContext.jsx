import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    primaryColor: '#9B7EDE', // Default lavender
    secondaryColor: '#E8D5FF',
    accentColor: '#FFD700',
    fontFamily: 'Inter',
    animationsEnabled: true,
  })

  const updateTheme = (newTheme) => {
    setTheme(prev => ({ ...prev, ...newTheme }))
    // Apply theme to CSS variables
    if (newTheme.primaryColor) {
      document.documentElement.style.setProperty('--color-primary', newTheme.primaryColor)
    }
  }

  useEffect(() => {
    // Initialize CSS variables
    document.documentElement.style.setProperty('--color-primary', theme.primaryColor)
    document.documentElement.style.setProperty('--color-secondary', theme.secondaryColor)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}



