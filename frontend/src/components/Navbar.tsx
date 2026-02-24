import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { email, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={styles.nav}>
      <span style={styles.brand}>📦 Products Manager</span>
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
  brand: { fontSize: '1.1rem', fontWeight: 700 },
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
