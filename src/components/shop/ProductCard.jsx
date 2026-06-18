import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import useCartStore from '../../stores/cartStore'
import useAuthStore from '../../stores/authStore'

export default function ProductCard({ product }) {
  const user = useAuthStore((s) => s.user)
  const addItem = useCartStore((s) => s.addItem)

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add to cart')
      return
    }
    try {
      await addItem(product.id)
      toast.success('Added to cart!')
    } catch {
      toast.error('Failed to add to cart')
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden">
      <Link to={`/product/${product.id}`} className="block relative">
        <img
          src={product.image_url ? `http://localhost:8000${product.image_url}` : 'https://placehold.co/300x200'}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <span className={`absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded-md ${
          product.stock > 0 ? 'bg-white/90 text-emerald-600' : 'bg-white/90 text-red-500'
        }`}>
          {product.stock > 0 ? `✓ ${product.stock} in stock` : '✗ Out of stock'}
        </span>
      </Link>
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-slate-900 hover:text-sky-600 truncate transition-colors">{product.name}</h3>
        </Link>
        <div className="flex items-center justify-between mt-3">
          <p className="text-lg font-extrabold text-sky-900">${product.price.toFixed(2)}</p>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  )
}
