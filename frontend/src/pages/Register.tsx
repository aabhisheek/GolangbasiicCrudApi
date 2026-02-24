import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/client'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/auth/register', { email, password })
      navigate('/login')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      setError(msg ?? 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>📦 Products Manager</h1>
        <h2 style={styles.subheading}>Create account</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            required style={styles.input}
          />
          <input
            type="password" placeholder="Password (min 6 chars)" value={password}
            onChange={(e) => setPassword(e.target.value)}
            required minLength={6} style={styles.input}
          />
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Creating…' : 'Create account'}
          </button>
        </form>
        <p style={styles.link}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    background: '#f1f5f9',
  },
  card: {
    background: '#fff', padding: '2.5rem 2rem',
    borderRadius: '12px', width: '100%', maxWidth: '400px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
  },
  heading: { textAlign: 'center', margin: '0 0 0.25rem', color: '#1e293b' },
  subheading: { textAlign: 'center', margin: '0 0 1.5rem', color: '#64748b', fontWeight: 400, fontSize: '1rem' },
  error: { color: '#ef4444', background: '#fef2f2', padding: '0.5rem 0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  input: {
    padding: '0.6rem 0.9rem', border: '1px solid #cbd5e1',
    borderRadius: '8px', fontSize: '1rem', outline: 'none',
  },
  btn: {
    padding: '0.65rem', background: '#10b981', color: '#fff',
    border: 'none', borderRadius: '8px', fontSize: '1rem',
    cursor: 'pointer', marginTop: '0.25rem',
  },
  link: { textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: '#64748b' },
}
