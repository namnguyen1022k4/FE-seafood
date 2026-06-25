import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getSuppliers, createSupplier, deleteSupplier } from '../../api/suppliers'

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState([])
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '' })

  const load = () => getSuppliers().then((res) => setSuppliers(res))

  useEffect(() => { load() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return
    try {
      await createSupplier(formData)
      toast.success('Supplier created')
      setFormData({ name: '', phone: '', email: '', address: '' })
      load()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to create')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this supplier?')) return
    try {
      await deleteSupplier(id)
      toast.success('Supplier deleted')
      load()
    } catch (err) {
      toast.error('Delete failed')
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Suppliers</h1>
      <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6 bg-gray-50 p-4 rounded-md">
        <input
          className="border rounded px-3 py-2 text-sm"
          placeholder="Name *"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          className="border rounded px-3 py-2 text-sm"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <input
          className="border rounded px-3 py-2 text-sm"
          placeholder="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          className="border rounded px-3 py-2 text-sm"
          placeholder="Address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 font-medium transition-colors">
          + Add Supplier
        </button>
      </form>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3 font-medium">ID</th>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Phone</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Address</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {suppliers.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="p-3">{s.id}</td>
                <td className="p-3 font-medium">{s.name}</td>
                <td className="p-3">{s.phone}</td>
                <td className="p-3">{s.email}</td>
                <td className="p-3">{s.address}</td>
                <td className="p-3">
                  <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-700 font-medium">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {suppliers.length === 0 && (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">No suppliers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
