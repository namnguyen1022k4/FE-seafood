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

  if (loading) return <p className="text-center py-16 text-slate-400">Đang tải...</p>

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-extrabold text-sky-900 mb-6 flex items-center gap-2">
        <span className="w-1 h-6 bg-sky-500 rounded-full block" />
        Đơn hàng của tôi
      </h1>
      {orders.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-5xl mb-4">📦</p>
          <p className="text-slate-400 text-lg">Chưa có đơn hàng nào.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => <OrderCard key={o.id} order={o} />)}
        </div>
      )}
    </div>
  )
}
