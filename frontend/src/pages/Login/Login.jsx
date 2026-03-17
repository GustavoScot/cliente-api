import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import styles from './Login.module.css'
import logoImagem from '../../assets/logo.png';

export default function Login() {
  const [form, setForm] = useState({ login: '', senha: '' })
  const [errors, setErrors] = useState({})
  const { login, carregando } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validar = () => {
    const novosErros = {}
    if (!form.login.trim()) novosErros.login = 'Login é obrigatório'
    if (!form.senha.trim()) novosErros.senha = 'Senha é obrigatória'
    setErrors(novosErros)
    return Object.keys(novosErros).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validar()) return

    try {
      await login({ login: form.login, senha: form.senha })
      toast.success('Login realizado com sucesso!')
      navigate('/clientes')
    } catch (error) {
      const msg =
        error.response?.data?.mensagem || 'Login ou senha inválidos'
      toast.error(msg)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.header}>
            <img src={logoImagem} alt="Logo Sea Tecnologia" className={styles.logoImg} />
            <p>Faça login para continuar</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
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
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}