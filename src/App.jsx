import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import router from './router'
import useAuthStore from './stores/authStore'

export default function App() {
  const restoreSession = useAuthStore((s) => s.restoreSession)

  useEffect(() => {
    restoreSession()
  }, [])

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </>
  )
}
