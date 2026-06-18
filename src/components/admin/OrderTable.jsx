import { useState } from 'react'
import toast from 'react-hot-toast'
import { updateOrderStatus } from '../../api/orders'

const STATUSES = ['PENDING', 'SHIPPING', 'DELIVERED', 'CANCELLED']

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  SHIPPING: 'bg-blue-100 text-blue-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

function OrderRow({ order, onChanged }) {
  const [status, setStatus] = useState(order.status)
  const [saving, setSaving] = useState(false)

  const handleStatusChange = async (newStatus) => {
    setSaving(true)
    try {
      await updateOrderStatus(order.id, newStatus)
      setStatus(newStatus)
      toast.success('Status updated')
      onChanged()
    } catch {
      toast.error('Update failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3">{order.id}</td>
      <td className="px-4 py-3">{order.user_id}</td>
      <td className="px-4 py-3">${order.total_price.toFixed(2)}</td>
      <td className="px-4 py-3">
        <span className={`text-xs px-2 py-0.5 rounded font-medium ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-600'}`}>
          {status}
        </span>
      </td>
      <td className="px-4 py-3">
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={saving}
          className="border rounded px-2 py-1 text-sm"
        >
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </td>
    </tr>
  )
}

export default function OrderTable({ orders, onChanged }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm bg-white rounded-lg shadow">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">User ID</th>
            <th className="px-4 py-3 text-left">Total</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Change Status</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {orders.map((o) => <OrderRow key={o.id} order={o} onChanged={onChanged} />)}
        </tbody>
      </table>
    </div>
  )
}
