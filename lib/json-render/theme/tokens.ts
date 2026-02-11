export interface Theme {
  colors: {
    background: string
    surface: string
    surfaceSecondary: string
    text: string
    textSecondary: string
    textTertiary: string
    border: string
    accent: string
    success: string
    error: string
    warning: string
    shadow: string
  }
  spacing: {
    xs: number
    sm: number
    md: number
    lg: number
    xl: number
    xxl: number
  }
  typography: {
    caption: number
    body: number
    bodyLarge: number
    title: number
    display: number
  }
  isDark: boolean
}

export const lightTheme: Theme = {
  colors: {
    background: '#f5f5f5',
    surface: '#ffffff',
    surfaceSecondary: '#fafafa',
    text: '#333333',
    textSecondary: '#888888',
    textTertiary: '#999999',
    border: '#dddddd',
    accent: '#2196F3',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    shadow: '#000000',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  typography: {
    caption: 12,
    body: 14,
    bodyLarge: 16,
    title: 18,
    display: 24,
  },
  isDark: false,
}

export const darkTheme: Theme = {
  colors: {
    background: '#121212',
    surface: '#1e1e1e',
    surfaceSecondary: '#2a2a2a',
    text: '#e0e0e0',
    textSecondary: '#aaaaaa',
    textTertiary: '#777777',
    border: '#333333',
    accent: '#64B5F6',
    success: '#81C784',
    error: '#E57373',
    warning: '#FFB74D',
    shadow: '#000000',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  typography: {
    caption: 12,
    body: 14,
    bodyLarge: 16,
    title: 18,
    display: 24,
  },
  isDark: true,
}
