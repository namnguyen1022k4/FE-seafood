import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getProduct, getProducts } from '../../api/products'
import { getCategories } from '../../api/categories'
import useAuthStore from '../../stores/authStore'
import useCartStore from '../../stores/cartStore'
import ProductCard from '../../components/shop/ProductCard'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [category, setCategory] = useState(null)
  const [related, setRelated] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const user = useAuthStore((s) => s.user)
  const addItem = useCartStore((s) => s.addItem)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    setQuantity(1)
    Promise.all([getProduct(id), getCategories()]).then(([pRes, cRes]) => {
      const p = pRes.data
      const cat = cRes.data.find((c) => c.id === p.category_id) || null
      setProduct(p)
      setCategory(cat)
      setLoading(false)
      if (cat) {
        getProducts({ category_id: cat.id, size: 5 }).then((r) => {
          setRelated(r.data.items.filter((item) => item.id !== p.id).slice(0, 4))
        })
      }
    })
  }, [id])

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập')
      navigate('/login')
      return
    }
    try {
      await addItem(product.id, quantity)
      toast.success('Đã thêm vào giỏ!')
    } catch {
      toast.error('Thêm vào giỏ thất bại')
    }
  }

  if (loading) return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 animate-pulse">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-80 h-64 bg-slate-200 rounded-xl" />
        <div className="flex-1 space-y-4">
          <div className="h-4 bg-slate-200 rounded w-1/4" />
          <div className="h-8 bg-slate-200 rounded w-3/4" />
          <div className="h-10 bg-slate-200 rounded w-1/3" />
          <div className="h-20 bg-slate-200 rounded" />
          <div className="h-12 bg-slate-200 rounded w-40" />
        </div>
      </div>
    </div>
  )

  if (!product) return <p className="text-center py-16 text-slate-400">Không tìm thấy sản phẩm.</p>

  const isLowStock = product.stock > 0 && product.stock <= 5

  return (
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-400 mb-4">
        <Link to="/" className="hover:text-sky-600 transition-colors">Trang chủ</Link>
        <span>/</span>
        {category && (
          <>
            <span className="text-slate-400">{category.name}</span>
            <span>/</span>
          </>
        )}
        <span className="text-slate-700 font-medium truncate">{product.name}</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-8">
          <img
            src={product.image_url || 'https://res.cloudinary.com/diblzcbla/image/upload/products/default.jpg'}
            alt={product.name}
            className="w-full md:w-80 h-64 object-cover rounded-xl hover:scale-105 transition-transform duration-300 cursor-zoom-in"
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
            <p className={`text-sm font-medium mb-4 ${product.stock > 0 ? (isLowStock ? 'text-amber-600' : 'text-emerald-600') : 'text-red-500'}`}>
              {product.stock === 0
                ? '✗ Hết hàng'
                : isLowStock
                  ? `⚡ Chỉ còn ${product.stock} sản phẩm!`
                  : `✓ Còn ${product.stock} sản phẩm`}
            </p>
            <div className="flex items-center gap-3 mb-5">
              <label className="text-sm font-semibold text-slate-700">Số lượng:</label>
              <div className="flex items-center border-2 border-sky-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-sky-700 hover:bg-sky-50 font-bold transition-colors"
                >−</button>
                <span className="px-4 py-1.5 font-semibold text-slate-700 border-x-2 border-sky-200">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-1.5 text-sky-700 hover:bg-sky-50 font-bold transition-colors"
                >+</button>
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-8 py-3 rounded-xl transition-colors disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              🛒 Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-sky-900 flex items-center gap-2 mb-4">
            <span className="w-1 h-5 bg-sky-500 rounded-full block" />
            Sản phẩm liên quan
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  )
}
