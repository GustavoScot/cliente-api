import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute/PrivateRoute'
import Login from './pages/Login/Login'
import ClientesLista from './pages/Clientes/ClientesLista'
import ClienteForm from './pages/ClienteForm/ClienteForm'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '8px',
              fontSize: '0.9rem',
            },
          }}
        />

        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/clientes"
            element={
              <PrivateRoute>
                <ClientesLista />
              </PrivateRoute>
            }
          />

          <Route
            path="/clientes/novo"
            element={
              <PrivateRoute apenasAdmin>
                <ClienteForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/clientes/:id/editar"
            element={
              <PrivateRoute apenasAdmin>
                <ClienteForm />
              </PrivateRoute>
            }
          />

          <Route path="/" element={<Navigate to="/clientes" replace />} />
          <Route path="*" element={<Navigate to="/clientes" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}