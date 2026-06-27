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
    <div className="flex items-center gap-4 px-5 py-4 border-b border-sky-50 last:border-b-0">
      <img
        src={product.image_url || 'https://placehold.co/100x100?text=No+Image'}
        alt={product.name}
        className="w-16 h-16 object-cover rounded-xl"
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-800 truncate">{product.name}</p>
        <p className="text-sky-500 font-bold text-sm">${(product.sales_price || product.price).toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => handleQtyChange(item.quantity - 1)}
          className="w-8 h-8 border-2 border-sky-200 rounded-lg text-sky-700 hover:bg-sky-50 font-bold transition-colors flex items-center justify-center"
        >−</button>
        <span className="w-8 text-center font-semibold text-slate-700">{item.quantity}</span>
        <button
          onClick={() => handleQtyChange(item.quantity + 1)}
          className="w-8 h-8 border-2 border-sky-200 rounded-lg text-sky-700 hover:bg-sky-50 font-bold transition-colors flex items-center justify-center"
        >+</button>
      </div>
      <p className="w-20 text-right font-bold text-sky-900">
        ${((product.sales_price || product.price) * item.quantity).toFixed(2)}
      </p>
      <button
        onClick={() => handleQtyChange(0)}
        className="text-slate-300 hover:text-red-400 transition-colors text-lg leading-none"
      >✕</button>
    </div>
  )
}
