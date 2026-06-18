import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getCategories, createCategory } from '../../api/categories'
import CategoryTable from '../../components/admin/CategoryTable'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([])
  const [newName, setNewName] = useState('')

  const load = () => getCategories().then((res) => setCategories(res.data))

  useEffect(() => { load() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    try {
      await createCategory(newName.trim())
      toast.success('Category created')
      setNewName('')
      load()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to create')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          className="border rounded px-3 py-2 text-sm"
          placeholder="New category name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
          + Add
        </button>
      </form>
      <CategoryTable categories={categories} onChanged={load} />
    </div>
  )
}
