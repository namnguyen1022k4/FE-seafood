import { useState, useEffect } from 'react'
import { getProducts } from '../../api/products'
import ProductTable from '../../components/admin/ProductTable'
import ProductForm from '../../components/admin/ProductForm'

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [editingProduct, setEditingProduct] = useState(undefined)
  const [showForm, setShowForm] = useState(false)

  const load = () => {
    getProducts({ page, size: 10 }).then((res) => {
      setProducts(res.data.items)
      setTotal(res.data.total)
    })
  }

  useEffect(() => { load() }, [page])

  const handleSaved = () => {
    setShowForm(false)
    setEditingProduct(undefined)
    load()
  }

  const totalPages = Math.ceil(total / 10)

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => { setEditingProduct(undefined); setShowForm(true) }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          + Add Product
        </button>
      </div>

      <ProductTable
        products={products}
        onEdit={(p) => { setEditingProduct(p); setShowForm(true) }}
        onDeleted={load}
      />

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >Prev</button>
          <span className="px-3 py-1 text-sm">{page} / {totalPages}</span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >Next</button>
        </div>
      )}

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSaved={handleSaved}
          onCancel={() => { setShowForm(false); setEditingProduct(undefined) }}
        />
      )}
    </div>
  )
}
