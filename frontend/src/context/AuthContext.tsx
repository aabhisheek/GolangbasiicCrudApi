import { createContext, useContext, useState, ReactNode } from 'react'

interface AuthContextType {
  token: string | null
  email: string | null
  isAuthenticated: boolean
  login: (token: string, email: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [email, setEmail] = useState<string | null>(localStorage.getItem('email'))

  const login = (newToken: string, newEmail: string) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('email', newEmail)
    setToken(newToken)
    setEmail(newEmail)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    setToken(null)
    setEmail(null)
  }

  return (
    <AuthContext.Provider value={{ token, email, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
