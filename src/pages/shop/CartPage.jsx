import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useCartStore from '../../stores/cartStore'
import CartItem from '../../components/shop/CartItem'
import { createOrder } from '../../api/orders'

export default function CartPage() {
  const items = useCartStore((s) => s.items)
  const products = useCartStore((s) => s.products)
  const fetchCart = useCartStore((s) => s.fetchCart)
  const clearCart = useCartStore((s) => s.clearCart)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCart()
  }, [])

  const total = items.reduce((sum, i) => {
    const p = products[i.product_id]
    return sum + (p ? p.price * i.quantity : 0)
  }, 0)

  const handleCheckout = async () => {
    try {
      await createOrder()
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
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {items.map((item) => (
          <CartItem key={item.product_id} item={item} />
        ))}
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
