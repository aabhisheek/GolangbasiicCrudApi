import { useState, useEffect, useCallback } from 'react'
import Navbar from '../components/Navbar'
import SpiceCategoryForm, { SpiceCategoryData } from '../components/SpiceCategoryForm'
import api from '../api/client'

interface SpiceCategory extends SpiceCategoryData {
  ID: number
  CreatedAt: string
  UpdatedAt: string
}

export default function Spices() {
  const [spices, setSpices] = useState<SpiceCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [editSpice, setEditSpice] = useState<SpiceCategory | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchSpices = useCallback(async () => {
    try {
      const { data } = await api.get<SpiceCategory[]>('/spices')
      setSpices(data ?? [])
    } catch {
      setError('Failed to load spice categories')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchSpices() }, [fetchSpices])

  const handleCreate = async (data: SpiceCategoryData) => {
    setSubmitting(true)
    try {
      await api.post('/spices', data)
      setShowCreate(false)
      await fetchSpices()
    } catch {
      setError('Failed to create spice category')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdate = async (data: SpiceCategoryData) => {
    if (!editSpice) return
    setSubmitting(true)
    try {
      await api.put(`/spices/${editSpice.ID}`, data)
      setEditSpice(null)
      await fetchSpices()
    } catch {
      setError('Failed to update spice category')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this spice category?')) return
    try {
      await api.delete(`/spices/${id}`)
      await fetchSpices()
    } catch {
      setError('Failed to delete spice category')
    }
  }

  return (
    <div style={styles.page}>
      <Navbar />
      <main style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.title}>🌶 Spice Categories</h1>
          <button onClick={() => setShowCreate(true)} style={styles.newBtn}>+ New Spice Category</button>
        </div>

        {error && (
          <div style={styles.error}>
            {error}
            <button onClick={() => setError('')} style={styles.closeErr}>✕</button>
          </div>
        )}

        {loading ? (
          <p style={styles.empty}>Loading…</p>
        ) : spices.length === 0 ? (
          <div style={styles.emptyCard}>
            <p>No spice categories yet.</p>
            <button onClick={() => setShowCreate(true)} style={styles.newBtn}>Add your first spice category</button>
          </div>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Created At</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {spices.map((s) => (
                  <tr key={s.ID} style={styles.tr}>
                    <td style={styles.td}>{s.name}</td>
                    <td style={{ ...styles.td, color: '#64748b', maxWidth: '240px' }}>{s.description || '—'}</td>
                    <td style={{ ...styles.td, color: '#94a3b8', fontSize: '0.8rem' }}>
                      {new Date(s.CreatedAt).toLocaleDateString()}
                    </td>
                    <td style={styles.td}>
                      <button onClick={() => setEditSpice(s)} style={styles.editBtn}>Edit</button>
                      <button onClick={() => handleDelete(s.ID)} style={styles.deleteBtn}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {showCreate && (
        <SpiceCategoryForm
          title="New Spice Category"
          onSubmit={handleCreate}
          onCancel={() => setShowCreate(false)}
          submitting={submitting}
        />
      )}

      {editSpice && (
        <SpiceCategoryForm
          title="Edit Spice Category"
          initial={{ name: editSpice.name, description: editSpice.description }}
          onSubmit={handleUpdate}
          onCancel={() => setEditSpice(null)}
          submitting={submitting}
        />
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f8fafc' },
  main: { padding: '2rem 1.5rem', maxWidth: '960px', margin: '0 auto' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' },
  title: { margin: 0, color: '#1e293b', fontSize: '1.5rem' },
  newBtn: {
    padding: '0.5rem 1.1rem', background: '#f59e0b', color: '#fff',
    border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem',
  },
  error: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    background: '#fef2f2', color: '#ef4444', padding: '0.75rem 1rem',
    borderRadius: '8px', marginBottom: '1rem',
  },
  closeErr: { background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '1rem' },
  empty: { textAlign: 'center', color: '#94a3b8', marginTop: '3rem' },
  emptyCard: {
    textAlign: 'center', padding: '3rem', background: '#fff',
    borderRadius: '10px', border: '1px dashed #cbd5e1', color: '#64748b',
  },
  tableWrap: { background: '#fff', borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '0.75rem 1rem', textAlign: 'left', background: '#fffbeb', color: '#92400e', fontSize: '0.8rem', textTransform: 'uppercase', borderBottom: '1px solid #fde68a' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '0.75rem 1rem', color: '#1e293b', fontSize: '0.9rem' },
  editBtn: {
    padding: '0.3rem 0.75rem', background: '#e0f2fe', color: '#0369a1',
    border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '0.4rem', fontSize: '0.8rem',
  },
  deleteBtn: {
    padding: '0.3rem 0.75rem', background: '#fee2e2', color: '#dc2626',
    border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem',
  },
}
