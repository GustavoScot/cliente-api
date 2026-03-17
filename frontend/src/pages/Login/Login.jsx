import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import styles from './Login.module.css'
import logoImagem from '../../assets/logo.png';

export default function Login() {
  const [form, setForm] = useState({ login: '', senha: '' })
  const [errors, setErrors] = useState({})
  const [erroGeral, setErroGeral] = useState('')
  const { login, usuario, carregando } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (usuario) {
      navigate('/clientes', { replace: true })
    }
  }, [usuario, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
    setErroGeral('')
  }

  const validar = () => {
    const novosErros = {}
    if (!form.login.trim()) novosErros.login = 'Usuário é obrigatório'
    if (!form.senha.trim()) novosErros.senha = 'Senha é obrigatória'
    setErrors(novosErros)
    return Object.keys(novosErros).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErroGeral('')
    if (!validar()) return

    try {
      await login({ login: form.login, senha: form.senha })

    } catch (error) {
      const status = error.response?.status
      if (status === 401) {
        setErroGeral('Usuário ou senha incorretos. Verifique e tente novamente.')
      } else if (status >= 500) {
        setErroGeral('Erro no servidor. Tente novamente em instantes.')
      } else {
        setErroGeral('Não foi possível conectar. Verifique sua conexão.')
      }
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <img src={logoImagem} alt="Logo Sea Tecnologia" className={styles.logoImg} />
          <p>Faça login para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} autoComplete="off">

          {erroGeral && (
            <div className={styles.erroGeral}>
              {erroGeral}
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="login">Usuário</label>
            <input
              id="login"
              name="login"
              type="text"
              placeholder="admin ou user"
              value={form.login}
              onChange={handleChange}
              className={errors.login ? styles.inputError : ''}
              autoComplete="off"
              autoFocus
            />
            {errors.login && (
              <span className={styles.error}>{errors.login}</span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              name="senha"
              type="password"
              placeholder="••••••••"
              value={form.senha}
              onChange={handleChange}
              className={errors.senha ? styles.inputError : ''}
              autoComplete="new-password"
            />
            {errors.senha && (
              <span className={styles.error}>{errors.senha}</span>
            )}
          </div>

          <button
            type="submit"
            className={styles.btnSubmit}
            disabled={carregando}
          >
            {carregando ? 'Verificando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}