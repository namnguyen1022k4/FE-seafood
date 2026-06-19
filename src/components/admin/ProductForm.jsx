import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { createProduct, updateProduct, uploadImage } from '../../api/products'
import { getCategories } from '../../api/categories'

export default function ProductForm({ product, onSaved, onCancel }) {
  const [form, setForm] = useState({
    name: '', description: '', price: '', stock: '', category_id: '', image_url: '',
  })
  const [categories, setCategories] = useState([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data))
    if (product) {
      setForm({
        name: product.name,
        description: product.description || '',
        price: product.price,
        stock: product.stock,
        category_id: product.category_id || '',
        image_url: product.image_url || '',
      })
    }
  }, [product])

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await uploadImage(fd)
      setForm((f) => ({ ...f, image_url: res.data.url }))
      toast.success('Image uploaded')
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      category_id: form.category_id ? parseInt(form.category_id) : null,
    }
    try {
      if (product) {
        await updateProduct(product.id, payload)
        toast.success('Product updated')
      } else {
        await createProduct(payload)
        toast.success('Product created')
      }
      onSaved()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">{product ? 'Edit Product' : 'New Product'}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <textarea
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="Description"
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
            <input
              type="number"
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Stock"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              required
            />
          </div>
          <select
            className="w-full border rounded px-3 py-2 text-sm"
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <div>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm" />
            {uploading && <p className="text-xs text-gray-400 mt-1">Uploading...</p>}
            {form.image_url && (
              <img
                src={form.image_url}
                alt="preview"
                className="mt-2 h-20 object-cover rounded"
              />
            )}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onCancel} className="px-4 py-2 border rounded text-sm hover:bg-gray-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
