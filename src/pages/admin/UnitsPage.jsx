import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getUnits, createUnit, deleteUnit } from '../../api/units'

export default function AdminUnitsPage() {
  const [units, setUnits] = useState([])
  const [newName, setNewName] = useState('')

  const load = () => getUnits().then((res) => setUnits(res))

  useEffect(() => { load() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    try {
      await createUnit({ name: newName.trim() })
      toast.success('Unit created')
      setNewName('')
      load()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to create')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this unit?')) return
    try {
      await deleteUnit(id)
      toast.success('Unit deleted')
      load()
    } catch (err) {
      toast.error('Delete failed')
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Units of Measurement</h1>
      <form onSubmit={handleAdd} className="flex gap-3 mb-6 bg-gray-50 p-4 rounded-md">
        <input
          className="border rounded px-3 py-2 text-sm flex-1 max-w-sm"
          placeholder="e.g. kg, box, bottle"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 font-medium transition-colors">
          + Add Unit
        </button>
      </form>
      
      <div className="overflow-x-auto max-w-2xl">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-gray-100 text-gray-600 border-b">
            <tr>
              <th className="p-3 font-medium w-16">ID</th>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {units.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="p-3 text-gray-500">{u.id}</td>
                <td className="p-3 font-medium">{u.name}</td>
                <td className="p-3">
                  <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:text-red-700 font-medium">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {units.length === 0 && (
              <tr>
                <td colSpan="3" className="p-6 text-center text-gray-500">No units found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
