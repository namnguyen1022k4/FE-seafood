import { useState, useEffect } from 'react'
import { getAllUsers } from '../../api/users'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    getAllUsers().then((res) => setUsers(res)).catch(console.error)
  }, [])

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Users Directory</h1>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3 font-medium">ID</th>
              <th className="p-3 font-medium">Username</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Phone</th>
              <th className="p-3 font-medium">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="p-3">{u.id}</td>
                <td className="p-3 font-medium">{u.username}</td>
                <td className="p-3">{u.email || '-'}</td>
                <td className="p-3">{u.phone_number || '-'}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                    {u.role}
                  </span>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
