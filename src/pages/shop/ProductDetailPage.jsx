import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getProduct } from '../../api/products'
import { getCategories } from '../../api/categories'
import useAuthStore from '../../stores/authStore'
import useCartStore from '../../stores/cartStore'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [category, setCategory] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const user = useAuthStore((s) => s.user)
  const addItem = useCartStore((s) => s.addItem)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([getProduct(id), getCategories()]).then(([pRes, cRes]) => {
      setProduct(pRes.data)
      setCategory(cRes.data.find((c) => c.id === pRes.data.category_id) || null)
      setLoading(false)
    })
  }, [id])

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add to cart')
      navigate('/login')
      return
    }
    try {
      await addItem(product.id, quantity)
      toast.success('Added to cart!')
    } catch {
      toast.error('Failed to add to cart')
    }
  }

  if (loading) return <p className="text-center py-16 text-gray-400">Loading...</p>
  if (!product) return <p className="text-center py-16 text-gray-400">Product not found.</p>

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={product.image_url ? `http://localhost:8000${product.image_url}` : 'https://placehold.co/400x300'}
          alt={product.name}
          className="w-full md:w-72 h-64 object-cover rounded"
        />
        <div className="flex-1">
          {category && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
              {category.name}
            </span>
          )}
          <h1 className="text-2xl font-bold mt-2">{product.name}</h1>
          <p className="text-3xl font-bold text-blue-600 mt-2">${product.price.toFixed(2)}</p>
          <p className="text-gray-600 mt-3">{product.description}</p>
          <p className="text-sm text-gray-400 mt-2">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>
          <div className="flex items-center gap-3 mt-4">
            <label className="text-sm font-medium">Qty:</label>
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-16 border rounded px-2 py-1 text-center"
            />
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-40"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
