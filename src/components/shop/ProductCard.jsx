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
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden">
      <Link to={`/product/${product.id}`}>
        <img
          src={product.image_url ? `http://localhost:8000${product.image_url}` : 'https://placehold.co/300x200'}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-800 hover:text-blue-600 truncate">{product.name}</h3>
        </Link>
        <p className="text-blue-600 font-bold mt-1">${product.price.toFixed(2)}</p>
        <p className="text-xs text-gray-400 mt-1">
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </p>
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="mt-3 w-full bg-blue-600 text-white py-1.5 rounded text-sm hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}
