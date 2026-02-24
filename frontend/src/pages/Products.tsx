import { useState, useEffect, useCallback } from 'react'
import Navbar from '../components/Navbar'
import ProductForm, { ProductData } from '../components/ProductForm'
import api from '../api/client'

interface Product extends ProductData {
  ID: number
  CreatedAt: string
  UpdatedAt: string
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchProducts = useCallback(async () => {
    try {
      const { data } = await api.get<Product[]>('/products')
      setProducts(data ?? [])
    } catch {
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const handleCreate = async (data: ProductData) => {
    setSubmitting(true)
    try {
      await api.post('/products', data)
      setShowCreate(false)
      await fetchProducts()
    } catch {
      setError('Failed to create product')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdate = async (data: ProductData) => {
    if (!editProduct) return
    setSubmitting(true)
    try {
      await api.put(`/products/${editProduct.ID}`, data)
      setEditProduct(null)
      await fetchProducts()
    } catch {
      setError('Failed to update product')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return
    try {
      await api.delete(`/products/${id}`)
      await fetchProducts()
    } catch {
      setError('Failed to delete product')
    }
  }

  return (
    <div style={styles.page}>
      <Navbar />
      <main style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.title}>Products</h1>
          <button onClick={() => setShowCreate(true)} style={styles.newBtn}>+ New Product</button>
        </div>

        {error && (
          <div style={styles.error}>
            {error}
            <button onClick={() => setError('')} style={styles.closeErr}>✕</button>
          </div>
        )}

        {loading ? (
          <p style={styles.empty}>Loading…</p>
        ) : products.length === 0 ? (
          <div style={styles.emptyCard}>
            <p>No products yet.</p>
            <button onClick={() => setShowCreate(true)} style={styles.newBtn}>Add your first product</button>
          </div>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Stock</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.ID} style={styles.tr}>
                    <td style={styles.td}>{p.name}</td>
                    <td style={{ ...styles.td, color: '#64748b', maxWidth: '200px' }}>{p.description || '—'}</td>
                    <td style={styles.td}>${p.price.toFixed(2)}</td>
                    <td style={styles.td}>{p.stock}</td>
                    <td style={styles.td}>
                      <button onClick={() => setEditProduct(p)} style={styles.editBtn}>Edit</button>
                      <button onClick={() => handleDelete(p.ID)} style={styles.deleteBtn}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {showCreate && (
        <ProductForm
          title="New Product"
          onSubmit={handleCreate}
          onCancel={() => setShowCreate(false)}
          submitting={submitting}
        />
      )}

      {editProduct && (
        <ProductForm
          title="Edit Product"
          initial={{ name: editProduct.name, description: editProduct.description, price: editProduct.price, stock: editProduct.stock }}
          onSubmit={handleUpdate}
          onCancel={() => setEditProduct(null)}
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
    padding: '0.5rem 1.1rem', background: '#3b82f6', color: '#fff',
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
  th: { padding: '0.75rem 1rem', textAlign: 'left', background: '#f8fafc', color: '#475569', fontSize: '0.8rem', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0' },
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
