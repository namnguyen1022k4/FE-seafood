import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useCartStore from '../../stores/cartStore'
import CartItem from '../../components/shop/CartItem'
import { createOrder } from '../../api/orders'
import { getLocations, createLocation } from '../../api/locations'

export default function CartPage() {
  const items = useCartStore((s) => s.items)
  const products = useCartStore((s) => s.products)
  const fetchCart = useCartStore((s) => s.fetchCart)
  const clearCart = useCartStore((s) => s.clearCart)
  const navigate = useNavigate()

  const [locations, setLocations] = useState([])
  const [selectedLocationId, setSelectedLocationId] = useState('')
  const [newAddress, setNewAddress] = useState('')

  useEffect(() => {
    fetchCart()
    loadLocations()
  }, [])

  const loadLocations = async () => {
    try {
      const data = await getLocations()
      setLocations(data)
      if (data.length > 0) setSelectedLocationId(data[0].id)
    } catch (err) {}
  }

  const handleAddLocation = async () => {
    if (!newAddress) return
    try {
      const loc = await createLocation({ address: newAddress, is_default: false })
      setLocations([...locations, loc])
      setSelectedLocationId(loc.id)
      setNewAddress('')
      toast.success('Address added!')
    } catch (err) {
      toast.error('Failed to add address')
    }
  }

  const total = items.reduce((sum, i) => {
    const p = products[i.product_id]
    const priceToUse = p ? (p.sales_price || p.price) : 0
    return sum + (priceToUse * i.quantity)
  }, 0)

  const handleCheckout = async () => {
    if (!selectedLocationId) {
      toast.error('Vui lòng chọn hoặc thêm địa chỉ giao hàng.')
      return
    }
    try {
      await createOrder(selectedLocationId)
      await clearCart()
      toast.success('Order placed!')
      navigate('/orders')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Checkout failed')
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-5xl mb-4">🛒</p>
        <p className="text-slate-400 text-lg">Giỏ hàng trống.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-extrabold text-sky-900 mb-6 flex items-center gap-2">
        <span className="w-1 h-6 bg-sky-500 rounded-full block" />
        Giỏ hàng
      </h1>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
        {items.map((item) => (
          <CartItem key={item.product_id} item={item} />
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6 p-5">
        <h2 className="text-xl font-bold text-sky-900 mb-4">Giao hàng đến</h2>
        {locations.length > 0 ? (
          <select 
            value={selectedLocationId} 
            onChange={e => setSelectedLocationId(e.target.value)}
            className="w-full p-3 border border-slate-200 rounded-xl mb-4"
          >
            {locations.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.address}</option>
            ))}
          </select>
        ) : (
          <p className="text-sm text-slate-500 mb-4">Bạn chưa có địa chỉ nào.</p>
        )}
        
        <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Nhập địa chỉ mới..." 
              value={newAddress}
              onChange={e => setNewAddress(e.target.value)}
              className="flex-1 p-3 border border-slate-200 rounded-xl"
            />
            <button onClick={handleAddLocation} className="bg-slate-800 text-white px-4 py-2 rounded-xl">Thêm</button>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4 p-5 bg-white rounded-2xl shadow-sm">
        <div>
          <p className="text-sm text-slate-500">Tổng cộng</p>
          <p className="text-2xl font-extrabold text-sky-900">${total.toFixed(2)}</p>
        </div>
        <button
          onClick={handleCheckout}
          className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-8 py-3 rounded-xl transition-colors"
        >
          Đặt hàng →
        </button>
      </div>
    </div>
  )
}
