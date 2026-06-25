import { useState } from 'react'
import toast from 'react-hot-toast'
import { updateOrderStatus } from '../../api/orders'
import { updatePaymentStatus } from '../../api/payments'
import { updateShipmentStatus } from '../../api/shipments'

const STATUSES = ['PENDING', 'SHIPPING', 'DELIVERED', 'CANCELLED']
const PAYMENT_STATUSES = ['PENDING', 'SUCCESS', 'FAILED']
const SHIPMENT_STATUSES = ['PENDING', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED']

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  SHIPPING: 'bg-blue-100 text-blue-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  SUCCESS: 'bg-green-100 text-green-700',
  FAILED: 'bg-red-100 text-red-700',
  PICKED_UP: 'bg-purple-100 text-purple-700',
  IN_TRANSIT: 'bg-blue-100 text-blue-700',
}

function OrderRow({ order, onChanged }) {
  const [status, setStatus] = useState(order.status)
  const [paymentStatus, setPaymentStatus] = useState(order.payment?.status || 'PENDING')
  const [shipmentStatus, setShipmentStatus] = useState(order.shipment?.status || 'PENDING')
  const [saving, setSaving] = useState(false)

  const handleStatusChange = async (newStatus) => {
    setSaving(true)
    try {
      await updateOrderStatus(order.id, newStatus)
      setStatus(newStatus)
      toast.success('Order status updated')
      onChanged()
    } catch {
      toast.error('Update failed')
    } finally {
      setSaving(false)
    }
  }

  const handlePaymentChange = async (newStatus) => {
    if (!order.payment) return
    setSaving(true)
    try {
      await updatePaymentStatus(order.payment.id, newStatus)
      setPaymentStatus(newStatus)
      toast.success('Payment status updated')
      onChanged()
    } catch {
      toast.error('Payment update failed')
    } finally {
      setSaving(false)
    }
  }

  const handleShipmentChange = async (newStatus) => {
    if (!order.shipment) return
    setSaving(true)
    try {
      await updateShipmentStatus(order.shipment.id, newStatus)
      setShipmentStatus(newStatus)
      toast.success('Shipment status updated')
      onChanged()
    } catch {
      toast.error('Shipment update failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <tr className="hover:bg-gray-50 border-b">
      <td className="px-4 py-3">{order.id}</td>
      <td className="px-4 py-3">${order.total_price.toFixed(2)}</td>
      
      {/* Order Status */}
      <td className="px-4 py-3">
        <div className="flex flex-col gap-1">
          <span className={`text-xs px-2 py-0.5 rounded font-medium w-max ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-600'}`}>
            {status}
          </span>
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={saving}
            className="border rounded px-2 py-1 text-xs max-w-[120px]"
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </td>

      {/* Payment Status */}
      <td className="px-4 py-3">
        {order.payment ? (
          <div className="flex flex-col gap-1">
            <span className={`text-xs px-2 py-0.5 rounded font-medium w-max ${STATUS_COLORS[paymentStatus] || 'bg-gray-100 text-gray-600'}`}>
              {paymentStatus}
            </span>
            <select
              value={paymentStatus}
              onChange={(e) => handlePaymentChange(e.target.value)}
              disabled={saving}
              className="border rounded px-2 py-1 text-xs max-w-[120px]"
            >
              {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        ) : <span className="text-gray-400 text-xs">N/A</span>}
      </td>

      {/* Shipment Status */}
      <td className="px-4 py-3">
        {order.shipment ? (
          <div className="flex flex-col gap-1">
            <span className={`text-xs px-2 py-0.5 rounded font-medium w-max ${STATUS_COLORS[shipmentStatus] || 'bg-gray-100 text-gray-600'}`}>
              {shipmentStatus}
            </span>
            <select
              value={shipmentStatus}
              onChange={(e) => handleShipmentChange(e.target.value)}
              disabled={saving}
              className="border rounded px-2 py-1 text-xs max-w-[120px]"
            >
              {SHIPMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        ) : <span className="text-gray-400 text-xs">N/A</span>}
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
            <th className="px-4 py-3 text-left">Order ID</th>
            <th className="px-4 py-3 text-left">Total</th>
            <th className="px-4 py-3 text-left">Order Status</th>
            <th className="px-4 py-3 text-left">Payment Status</th>
            <th className="px-4 py-3 text-left">Shipment Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.map((o) => <OrderRow key={o.id} order={o} onChanged={onChanged} />)}
        </tbody>
      </table>
    </div>
  )
}
