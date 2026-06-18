import toast from 'react-hot-toast'
import { deleteProduct } from '../../api/products'

export default function ProductTable({ products, onEdit, onDeleted }) {
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await deleteProduct(id)
      toast.success('Deleted')
      onDeleted()
    } catch {
      toast.error('Delete failed')
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm bg-white rounded-lg shadow">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">Image</th>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Price</th>
            <th className="px-4 py-3 text-left">Stock</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">{p.id}</td>
              <td className="px-4 py-3">
                <img
                  src={p.image_url ? `http://localhost:8000${p.image_url}` : 'https://placehold.co/40x40'}
                  alt={p.name}
                  className="w-10 h-10 object-cover rounded"
                />
              </td>
              <td className="px-4 py-3 font-medium">{p.name}</td>
              <td className="px-4 py-3">${p.price.toFixed(2)}</td>
              <td className="px-4 py-3">{p.stock}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button onClick={() => onEdit(p)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
