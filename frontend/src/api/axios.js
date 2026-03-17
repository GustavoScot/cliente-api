import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const isLoginRoute = config.url?.includes('/auth/login')

    if (!isLoginRoute) {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isRotaDeLogin = error.config?.url?.includes('/auth/login')
    const tokenExpirado = error.response?.status === 401 && !isRotaDeLogin

    if (tokenExpirado) {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default api