import { Navigate } from 'react-router-dom'
import useAuthStore from '../../stores/authStore'

export function RequireAuth({ children }) {
  const user = useAuthStore((s) => s.user)
  if (!user) return <Navigate to="/login" replace />
  return children
}

export function RequireAdmin({ children }) {
  const user = useAuthStore((s) => s.user)
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'ADMIN') return <Navigate to="/" replace />
  return children
}
