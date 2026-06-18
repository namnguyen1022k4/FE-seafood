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

  if (loading) return <p className="text-center py-16 text-slate-400">Đang tải...</p>
  if (!product) return <p className="text-center py-16 text-slate-400">Không tìm thấy sản phẩm.</p>

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
      <div className="flex flex-col md:flex-row gap-8">
        <img
          src={product.image_url ? `http://localhost:8000${product.image_url}` : 'https://placehold.co/400x300'}
          alt={product.name}
          className="w-full md:w-80 h-64 object-cover rounded-xl"
        />
        <div className="flex-1">
          {category && (
            <span className="inline-block text-xs bg-sky-100 text-sky-700 font-semibold px-3 py-1 rounded-full mb-3">
              {category.name}
            </span>
          )}
          <h1 className="text-2xl font-extrabold text-sky-900 mb-2">{product.name}</h1>
          <p className="text-3xl font-extrabold text-sky-500 mb-3">${product.price.toFixed(2)}</p>
          <p className="text-slate-600 leading-relaxed mb-3">{product.description}</p>
          <p className={`text-sm font-medium mb-4 ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {product.stock > 0 ? `✓ Còn ${product.stock} sản phẩm` : '✗ Hết hàng'}
          </p>
          <div className="flex items-center gap-3 mb-5">
            <label className="text-sm font-semibold text-slate-700">Số lượng:</label>
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-16 border-2 border-sky-200 rounded-lg px-2 py-1.5 text-center focus:outline-none focus:border-sky-500"
            />
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-8 py-3 rounded-xl transition-colors disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
          >
            🛒 Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
