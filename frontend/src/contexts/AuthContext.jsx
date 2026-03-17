import { createContext, useContext, useState, useCallback } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

function decodificarToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const rolesStr = payload.roles || ''

    const isAdmin = rolesStr.includes('ROLE_ADMIN')

    return {
      login: payload.sub,
      roles: rolesStr,
      isAdmin,
    }
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    try {
      const token = localStorage.getItem('token')

      if (token) return decodificarToken(token)
      return null
    } catch {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      return null
    }
  })

  const [carregando, setCarregando] = useState(false)

  const login = useCallback(async (credenciais) => {
    setCarregando(true)
    try {
      const { data } = await api.post('/auth/login', credenciais)

      localStorage.setItem('token', data.token)

      const dadosUsuario = decodificarToken(data.token)
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

  return (
    <AuthContext.Provider value={{ usuario, login, logout, carregando }}>
      {children}
    </AuthContext.Provider>
  )
}
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return context
}