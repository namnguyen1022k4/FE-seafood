import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAuthStore from '../../stores/authStore'
import useCartStore from '../../stores/cartStore'

export default function Navbar() {
  const user = useAuthStore((s) => s.user)
  const logoutStore = useAuthStore((s) => s.logout)
  const items = useCartStore((s) => s.items)
  const navigate = useNavigate()

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

  const handleLogout = async () => {
    await logoutStore()
    toast.success('Logged out')
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600">Shop</Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-600">Hi, {user.username || user.email}</span>
              <Link to="/orders" className="text-sm hover:text-blue-600">Orders</Link>
              {user.role === 'ADMIN' && (
                <Link to="/admin" className="text-sm font-medium hover:text-blue-600">Admin</Link>
              )}
              <Link to="/cart" className="relative text-sm hover:text-blue-600">
                Cart
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-3 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
              <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm hover:text-blue-600">Login</Link>
              <Link to="/register" className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
