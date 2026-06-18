import { useState, useEffect } from 'react'
import { getOrders } from '../../api/orders'
import OrderCard from '../../components/shop/OrderCard'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrders()
      .then((res) => setOrders([...res.data].reverse()))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-center py-16 text-gray-400">Loading...</p>

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-center text-gray-400 py-16">No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => <OrderCard key={o.id} order={o} />)}
        </div>
      )}
    </div>
  )
}
