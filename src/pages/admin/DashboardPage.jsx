import { useState, useEffect } from 'react'
import { getProducts } from '../../api/products'
import { getCategories } from '../../api/categories'
import { getAllOrders } from '../../api/orders'

function StatCard({ title, value, color }) {
  return (
    <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${color}`}>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  )
}

export default function DashboardPage() {
  const [stats, setStats] = useState({ products: 0, categories: 0, orders: 0, pending: 0 })

  useEffect(() => {
    Promise.all([getProducts({ size: 1 }), getCategories(), getAllOrders()]).then(
      ([pRes, cRes, oRes]) => {
        const orders = oRes.data
        setStats({
          products: pRes.data.total,
          categories: cRes.data.length,
          orders: orders.length,
          pending: orders.filter((o) => o.status === 'PENDING').length,
        })
      }
    )
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Products" value={stats.products} color="border-blue-500" />
        <StatCard title="Categories" value={stats.categories} color="border-green-500" />
        <StatCard title="Total Orders" value={stats.orders} color="border-purple-500" />
        <StatCard title="Pending Orders" value={stats.pending} color="border-yellow-500" />
      </div>
    </div>
  )
}
