'use client'

import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'

const theme = createTheme()

export function MUIProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
