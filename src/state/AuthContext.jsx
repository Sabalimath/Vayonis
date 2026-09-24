import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

const AUTH_STORAGE_KEY = 'vayonis:auth'

function readStoredUser() {
  try {
    const storedUser = window.localStorage.getItem(AUTH_STORAGE_KEY)
    return storedUser ? JSON.parse(storedUser) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)

  useEffect(() => {
    if (user) window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
    else window.localStorage.removeItem(AUTH_STORAGE_KEY)
  }, [user])

  const login = async ({ email }) => {
    await new Promise((resolve) => setTimeout(resolve, 900))
    const nextUser = {
      email,
      name: email.split('@')[0],
    }
    setUser(nextUser)
    return nextUser
  }

  const register = async ({ firstName, lastName, email }) => {
    await new Promise((resolve) => setTimeout(resolve, 1100))
    const nextUser = { firstName, lastName, email, name: `${firstName} ${lastName}` }
    setUser(nextUser)
    return nextUser
  }

  const logout = () => setUser(null)
  const isAuthenticated = Boolean(user)

  return <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider')
  }

  return context
}
