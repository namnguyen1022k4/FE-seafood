import { NavLink, Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAuthStore from '../../stores/authStore'

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/suppliers', label: 'Suppliers' },
  { to: '/admin/units', label: 'Units' },
  { to: '/admin/users', label: 'Users' },
]

export default function AdminSidebar() {
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out')
    navigate('/login')
  }

  return (
    <aside className="w-56 shrink-0 bg-white shadow-md flex flex-col">
      <div className="p-4 border-b">
        <p className="font-bold text-blue-600 text-lg">Admin Panel</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              `block px-3 py-2 rounded text-sm font-medium ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t space-y-2">
        <Link
          to="/"
          className="block text-sm text-sky-600 hover:text-sky-800 font-medium"
        >
          ← Về shop
        </Link>
        <button
          onClick={handleLogout}
          className="w-full text-sm text-red-500 hover:text-red-700"
        >
          Logout
        </button>
      </div>
    </aside>
  )
}
