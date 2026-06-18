import toast from 'react-hot-toast'
import useCartStore from '../../stores/cartStore'

export default function CartItem({ item }) {
  const updateItem = useCartStore((s) => s.updateItem)
  const removeItem = useCartStore((s) => s.removeItem)
  const products = useCartStore((s) => s.products)
  const product = products[item.product_id]

  if (!product) return null

  const handleQtyChange = async (newQty) => {
    if (newQty <= 0) {
      await removeItem(item.product_id)
      toast.success('Removed from cart')
    } else {
      await updateItem(item.product_id, newQty)
    }
  }

  return (
    <div className="flex items-center gap-4 py-4 border-b">
      <img
        src={product.image_url ? `http://localhost:8000${product.image_url}` : 'https://placehold.co/80x80'}
        alt={product.name}
        className="w-20 h-20 object-cover rounded"
      />
      <div className="flex-1">
        <p className="font-semibold">{product.name}</p>
        <p className="text-blue-600">${product.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleQtyChange(item.quantity - 1)}
          className="w-7 h-7 border rounded hover:bg-gray-100"
        >-</button>
        <span className="w-8 text-center">{item.quantity}</span>
        <button
          onClick={() => handleQtyChange(item.quantity + 1)}
          className="w-7 h-7 border rounded hover:bg-gray-100"
        >+</button>
      </div>
      <p className="w-20 text-right font-semibold">
        ${(product.price * item.quantity).toFixed(2)}
      </p>
      <button
        onClick={() => handleQtyChange(0)}
        className="text-red-500 hover:text-red-700 text-sm"
      >
        Remove
      </button>
    </div>
  )
}
