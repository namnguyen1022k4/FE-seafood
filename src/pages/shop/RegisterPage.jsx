import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { register } from '../../api/auth'

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(form)
      toast.success('Registered! Please log in.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-sky-50 to-sky-100 -mx-4 -my-6 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-sm">
        <h1 className="text-2xl font-extrabold text-sky-900 mb-1">Tạo tài khoản 🎉</h1>
        <p className="text-slate-500 text-sm mb-8">Tham gia SeaFresh ngay hôm nay</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Username</label>
            <input
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-sky-500 text-slate-800 transition-colors"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
            <input
              type="email"
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-sky-500 text-slate-800 transition-colors"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
            <input
              type="password"
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-sky-500 text-slate-800 transition-colors"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-900 hover:bg-sky-800 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? 'Registering...' : 'Đăng ký'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-sky-500 font-semibold hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  )
}
