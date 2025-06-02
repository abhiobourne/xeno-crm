import { AuthProvider } from './providers/session-provider'
import { MUIProvider } from './providers/theme-provider'
import Navbar from './components/Navbar'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <MUIProvider>
            <Navbar />
            {children}
          </MUIProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
