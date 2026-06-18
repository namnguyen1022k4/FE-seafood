import { useState } from 'react'
import toast from 'react-hot-toast'
import { updateCategory, deleteCategory } from '../../api/categories'

function CategoryRow({ category, onChanged }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(category.name)

  const handleSave = async () => {
    try {
      await updateCategory(category.id, name)
      toast.success('Updated')
      setEditing(false)
      onChanged()
    } catch {
      toast.error('Update failed')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this category?')) return
    try {
      await deleteCategory(category.id)
      toast.success('Deleted')
      onChanged()
    } catch {
      toast.error('Delete failed')
    }
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3">{category.id}</td>
      <td className="px-4 py-3">
        {editing ? (
          <input
            className="border rounded px-2 py-1 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : (
          category.name
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          {editing ? (
            <>
              <button onClick={handleSave} className="text-green-600 hover:underline text-sm">Save</button>
              <button onClick={() => setEditing(false)} className="text-gray-400 hover:underline text-sm">Cancel</button>
            </>
          ) : (
            <>
              <button onClick={() => setEditing(true)} className="text-blue-600 hover:underline text-sm">Edit</button>
              <button onClick={handleDelete} className="text-red-500 hover:underline text-sm">Delete</button>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}

export default function CategoryTable({ categories, onChanged }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm bg-white rounded-lg shadow">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {categories.map((c) => (
            <CategoryRow key={c.id} category={c} onChanged={onChanged} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
