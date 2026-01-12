/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }, [])

  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get('/me')
      if (response.data.success) {
        const userData = response.data.data
        console.log('[AuthContext] User data loaded:', { id: userData.id, email: userData.email, role: userData.role })
        setUser(userData)
      } else {
        logout()
      }
    } catch (error) {
      console.error('Gagal mengambil data user:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }, [logout])

  useEffect(() => {
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [token, fetchUser])

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      if (response.data.success) {
        const { access_token, user: userData } = response.data.data
        console.log('[AuthContext] Login success:', { id: userData.id, email: userData.email, role: userData.role })
        localStorage.setItem('token', access_token)
        setToken(access_token)
        setUser(userData)
        return { success: true, data: response.data.data }
      } else {
        return { success: false, error: response.data.error?.message || 'Login gagal' }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 'Terjadi kesalahan saat login'
      return { success: false, error: errorMessage }
    }
  }

  const register = async (name, email, password, role = 'user') => {
    try {
      const response = await api.post('/auth/register', { name, email, password, role })
      if (response.data.success) {
        const { access_token, user: userData } = response.data.data
        localStorage.setItem('token', access_token)
        setToken(access_token)
        setUser(userData)
        return { success: true, data: response.data.data }
      } else {
        return { success: false, error: response.data.error?.message || 'Registrasi gagal' }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 'Terjadi kesalahan saat registrasi'
      return { success: false, error: errorMessage }
    }
  }

  const refreshUser = async () => {
    if (!token) return
    setLoading(true)
    await fetchUser()
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin',
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider')
  }
  return context
}
