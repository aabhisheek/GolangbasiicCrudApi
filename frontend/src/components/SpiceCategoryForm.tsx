import { useState, useEffect } from 'react'

export interface SpiceCategoryData {
  name: string
  description: string
}

interface Props {
  initial?: SpiceCategoryData
  onSubmit: (data: SpiceCategoryData) => void
  onCancel: () => void
  submitting: boolean
  title: string
}

export default function SpiceCategoryForm({ initial, onSubmit, onCancel, submitting, title }: Props) {
  const [form, setForm] = useState<SpiceCategoryData>(
    initial ?? { name: '', description: '' }
  )

  useEffect(() => {
    if (initial) setForm(initial)
  }, [initial])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>{title}</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Name *</label>
          <input name="name" value={form.name} onChange={handleChange} required style={styles.input} placeholder="e.g. Turmeric" />

          <label style={styles.label}>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} style={{ ...styles.input, resize: 'vertical' }} placeholder="Optional description…" />

          <div style={styles.actions}>
            <button type="button" onClick={onCancel} style={styles.cancelBtn}>Cancel</button>
            <button type="submit" disabled={submitting} style={styles.submitBtn}>
              {submitting ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 100,
  },
  modal: {
    background: '#fff', borderRadius: '10px',
    padding: '2rem', width: '100%', maxWidth: '480px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
  },
  title: { marginTop: 0, marginBottom: '1.25rem', color: '#1e293b' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  label: { fontSize: '0.85rem', fontWeight: 600, color: '#475569' },
  input: {
    padding: '0.5rem 0.75rem', border: '1px solid #cbd5e1',
    borderRadius: '6px', fontSize: '0.95rem', outline: 'none',
  },
  actions: { display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' },
  cancelBtn: {
    padding: '0.5rem 1.1rem', background: '#f1f5f9',
    border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer',
  },
  submitBtn: {
    padding: '0.5rem 1.1rem', background: '#f59e0b',
    color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer',
  },
}
