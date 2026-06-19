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
    <nav className="bg-sky-900 shadow-lg sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-extrabold text-cyan-300 tracking-tight flex items-center gap-2">
          🦞 SeaFresh
        </Link>
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <span className="text-sm text-sky-200">Hi, {user.username || user.email}</span>
              <Link to="/orders" className="text-sm text-sky-200 hover:text-white transition-colors">Orders</Link>
              {user.role === 'ADMIN' && (
                <Link to="/admin" className="text-sm font-medium text-sky-200 hover:text-white transition-colors">Admin</Link>
              )}
              <Link to="/cart" className="relative inline-flex items-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                🛒 Cart
                {totalItems > 0 && (
                  <span
                    key={totalItems}
                    className="bg-orange-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 leading-none animate-bounce"
                    style={{ animationDuration: '0.4s', animationIterationCount: 3 }}
                  >
                    {totalItems}
                  </span>
                )}
              </Link>
              <button onClick={handleLogout} className="text-sm text-sky-300 hover:text-red-400 transition-colors">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-sky-200 hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="text-sm bg-sky-500 hover:bg-sky-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
