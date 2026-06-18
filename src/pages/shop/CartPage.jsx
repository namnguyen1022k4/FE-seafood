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
    return <p className="text-center text-gray-400 py-16 text-lg">Your cart is empty.</p>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Cart</h1>
      {items.map((item) => (
        <CartItem key={item.product_id} item={item} />
      ))}
      <div className="flex justify-between items-center mt-6 py-4 border-t">
        <p className="text-lg font-bold">Total: ${total.toFixed(2)}</p>
        <button
          onClick={handleCheckout}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Checkout
        </button>
      </div>
    </div>
  )
}
