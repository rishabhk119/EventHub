import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('eventhub_user')
      return storedUser ? JSON.parse(storedUser) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('eventhub_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('eventhub_user')
    }
  }, [user])

  function login(email, customRole) {
    const role =
      customRole ||
      (email.toLowerCase().includes('admin') ? 'admin' : 'student')
    setUser({ email, role })
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('eventhub_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
