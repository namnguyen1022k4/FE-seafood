import { Outlet } from 'react-router-dom'
import Navbar from '../components/shop/Navbar'

export default function ShopLayout() {
  return (
    <div className="min-h-screen bg-sky-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
