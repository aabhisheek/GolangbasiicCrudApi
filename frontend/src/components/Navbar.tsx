import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { email, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <span style={styles.brand}>🛒 Manager</span>
        <Link to="/products" style={{ ...styles.navLink, ...(location.pathname === '/products' ? styles.navLinkActive : {}) }}>
          📦 Products
        </Link>
        <Link to="/spices" style={{ ...styles.navLink, ...(location.pathname === '/spices' ? styles.navLinkActive : {}) }}>
          🌶 Spices
        </Link>
      </div>
      <div style={styles.right}>
        {email && <span style={styles.email}>{email}</span>}
        <button onClick={handleLogout} style={styles.btn}>Logout</button>
      </div>
    </nav>
  )
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem 1.5rem',
    background: '#1e293b',
    color: '#f1f5f9',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
  left: { display: 'flex', alignItems: 'center', gap: '1.5rem' },
  brand: { fontSize: '1.1rem', fontWeight: 700 },
  navLink: {
    color: '#94a3b8',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
    padding: '0.3rem 0.6rem',
    borderRadius: '6px',
  },
  navLinkActive: {
    color: '#f1f5f9',
    background: 'rgba(255,255,255,0.1)',
  },
  right: { display: 'flex', alignItems: 'center', gap: '1rem' },
  email: { fontSize: '0.875rem', color: '#94a3b8' },
  btn: {
    padding: '0.4rem 0.9rem',
    background: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.875rem',
  },
}
