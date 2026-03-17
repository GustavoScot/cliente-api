// src/components/PrivateRoute/PrivateRoute.jsx

import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function PrivateRoute({ children, apenasAdmin = false }) {
  const { usuario } = useAuth()

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  if (apenasAdmin && !usuario.isAdmin) {
    return <Navigate to="/clientes" replace />
  }

  return children
}