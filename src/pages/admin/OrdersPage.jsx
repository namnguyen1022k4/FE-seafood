import { useState, useEffect } from 'react'
import { getAllOrders } from '../../api/orders'
import OrderTable from '../../components/admin/OrderTable'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    getAllOrders()
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  if (loading) return <p className="text-center py-16 text-gray-400">Loading...</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>
      {orders.length === 0 ? (
        <p className="text-center text-gray-400 py-16">No orders yet.</p>
      ) : (
        <OrderTable orders={orders} onChanged={load} />
      )}
    </div>
  )
}
