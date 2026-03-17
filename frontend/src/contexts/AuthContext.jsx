import { createContext, useContext, useState, useCallback } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem('usuario')
    return salvo ? JSON.parse(salvo) : null
  })

  const [carregando, setCarregando] = useState(false)

  const login = useCallback(async (credenciais) => {
    setCarregando(true)
    try {
      const { data } = await api.post('/auth/login', credenciais)

      localStorage.setItem('token', data.token)

      const payload = JSON.parse(atob(data.token.split('.')[1]))
      const dadosUsuario = {
        login: payload.sub,
        roles: payload.roles,
        isAdmin: payload.roles?.includes('ROLE_ADMIN'),
      }

      localStorage.setItem('usuario', JSON.stringify(dadosUsuario))
      setUsuario(dadosUsuario)

      return dadosUsuario
    } finally {
      setCarregando(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuario(null)
  }, [])

  const value = { usuario, login, logout, carregando }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}