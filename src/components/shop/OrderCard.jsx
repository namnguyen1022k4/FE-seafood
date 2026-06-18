const STATUS_COLORS = {
  PENDING: 'bg-amber-100 text-amber-700',
  SHIPPING: 'bg-sky-100 text-sky-700',
  DELIVERED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-600',
}

const STATUS_LABELS = {
  PENDING: '⏳ Chờ xử lý',
  SHIPPING: '🚚 Đang giao',
  DELIVERED: '✅ Đã giao',
  CANCELLED: '✕ Đã hủy',
}

export default function OrderCard({ order }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex justify-between items-center hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm text-slate-400 font-medium">Order #{order.id}</p>
        <p className="text-2xl font-extrabold text-sky-900 mt-0.5">${order.total_price.toFixed(2)}</p>
      </div>
      <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${STATUS_COLORS[order.status] || 'bg-slate-100 text-slate-600'}`}>
        {STATUS_LABELS[order.status] || order.status}
      </span>
    </div>
  )
}
