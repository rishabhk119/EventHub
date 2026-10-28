import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { apiRequest } from '../lib/api'

const AuthContext = createContext(null)
const STORAGE_KEY = 'eventhub_auth'

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now()
  } catch {
    return true
  }
}

function loadStoredAuth() {
  try {
    // Drop the old fake-login entry from before real auth existed
    localStorage.removeItem('eventhub_user')
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (stored?.user && stored?.token && !isTokenExpired(stored.token)) {
      return stored
    }
  } catch {
    // ignore unreadable storage
  }
  return null
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(loadStoredAuth)

  useEffect(() => {
    try {
      if (auth) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      // storage unavailable (private mode etc.); session still works in memory
    }
  }, [auth])

  // Both endpoints respond with { success, data: { user, token } }
  async function login(email, password) {
    const payload = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    setAuth(payload.data)
    return payload.data.user
  }

  async function register(name, email, password) {
    const payload = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: { name, email, password },
    })
    setAuth(payload.data)
    return payload.data.user
  }

  const logout = useCallback(() => {
    setAuth(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user: auth?.user ?? null, token: auth?.token ?? null, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
