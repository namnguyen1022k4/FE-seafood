const STEPS = ['PENDING', 'SHIPPING', 'DELIVERED']

const STEP_LABELS = {
  PENDING: '⏳ Chờ xử lý',
  SHIPPING: '🚚 Đang giao',
  DELIVERED: '✅ Đã giao',
}

const STATUS_COLORS = {
  PENDING: 'bg-amber-100 text-amber-700',
  SHIPPING: 'bg-sky-100 text-sky-700',
  DELIVERED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-600',
}

export default function OrderCard({ order }) {
  const isCancelled = order.status === 'CANCELLED'
  const currentStep = STEPS.indexOf(order.status)

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-slate-400 font-medium">Order #{order.id}</p>
          <p className="text-2xl font-extrabold text-sky-900 mt-0.5">${order.total_price.toFixed(2)}</p>
        </div>
        <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${STATUS_COLORS[order.status] || 'bg-slate-100 text-slate-600'}`}>
          {isCancelled ? '✕ Đã hủy' : STEP_LABELS[order.status] || order.status}
        </span>
      </div>

      {!isCancelled && (
        <div className="flex items-center mt-2">
          {STEPS.map((step, i) => {
            const done = i <= currentStep
            const active = i === currentStep
            return (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    done ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-400'
                  } ${active ? 'ring-2 ring-sky-300 ring-offset-1' : ''}`}>
                    {done ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs mt-1 whitespace-nowrap ${done ? 'text-sky-600 font-semibold' : 'text-slate-400'}`}>
                    {STEP_LABELS[step].split(' ').slice(1).join(' ')}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 mb-4 transition-colors ${i < currentStep ? 'bg-sky-400' : 'bg-slate-200'}`} />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
