const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  SHIPPING: 'bg-blue-100 text-blue-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

export default function OrderCard({ order }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
      <div>
        <p className="font-semibold text-gray-700">Order #{order.id}</p>
        <p className="text-2xl font-bold text-blue-600 mt-1">${order.total_price.toFixed(2)}</p>
      </div>
      <span className={`text-xs px-2 py-1 rounded font-medium ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
        {order.status}
      </span>
    </div>
  )
}
