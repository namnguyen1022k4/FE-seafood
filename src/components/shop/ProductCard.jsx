import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import useCartStore from '../../stores/cartStore'
import useAuthStore from '../../stores/authStore'

export default function ProductCard({ product }) {
  const user = useAuthStore((s) => s.user)
  const addItem = useCartStore((s) => s.addItem)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Vui lòng đăng nhập')
      return
    }
    try {
      await addItem(product.id)
      toast.success('Đã thêm vào giỏ!')
    } catch {
      toast.error('Thêm vào giỏ thất bại')
    }
  }

  const isLowStock = product.stock > 0 && product.stock <= 5
  const isOutOfStock = product.stock === 0

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden group">
      <Link to={`/product/${product.id}`} className="block relative">
        <img
          src={product.image_url || 'https://placehold.co/600x400?text=No+Image'}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className={`absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded-md ${
          isOutOfStock ? 'bg-red-100 text-red-600' :
          isLowStock ? 'bg-amber-100 text-amber-700' :
          'bg-white/90 text-emerald-600'
        }`}>
          {isOutOfStock ? '✗ Hết hàng' : isLowStock ? `⚡ Còn ${product.stock}` : '✓ Còn hàng'}
        </span>
        {!isOutOfStock && (
          <div className="absolute inset-0 bg-sky-900/0 group-hover:bg-sky-900/30 transition-all duration-200 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
            <button
              onClick={handleAddToCart}
              className="bg-white text-sky-700 font-bold text-sm px-5 py-2 rounded-xl shadow-lg hover:bg-sky-500 hover:text-white transition-colors"
            >
              🛒 Thêm vào giỏ
            </button>
          </div>
        )}
      </Link>
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-slate-900 hover:text-sky-600 truncate transition-colors">{product.name}</h3>
        </Link>
        <div className="flex items-center justify-between mt-3">
          <div className="flex flex-col">
            <p className={`text-lg font-extrabold ${product.sales_price ? 'text-rose-500' : 'text-sky-900'}`}>
              ${(product.sales_price || product.price).toFixed(2)}
            </p>
            {product.sales_price && (
              <p className="text-xs font-bold text-slate-400 line-through">
                ${product.price.toFixed(2)}
              </p>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
          >
            + Thêm
          </button>
        </div>
      </div>
    </div>
  )
}
