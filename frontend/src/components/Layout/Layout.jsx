import { Link} from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import styles from './Layout.module.css'
import logo2Imagem from '../../assets/logo2.png';

export default function Layout({ children }) {
  const { usuario, logout } = useAuth()

  const handleLogout = () => {
  logout()
}

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.brand}>
          <img src={logo2Imagem} alt="Logo Cliente API" className={styles.logoImg} />
          <Link to="/clientes" className={styles.brandName}>
            Gerenciamento de clientes
          </Link>
        </div>

        <div className={styles.userArea}>
          <span className={styles.userInfo}>
            <strong>{usuario?.login}</strong>
            <span className={styles.badge}>
              {usuario?.isAdmin ? 'Admin' : 'Leitor'}
            </span>
          </span>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Sair
          </button>
        </div>
      </nav>

      <main className={styles.main}>{children}</main>
    </div>
  )
}