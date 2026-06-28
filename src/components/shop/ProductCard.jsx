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
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-slate-100">
      <Link to={`/product/${product.id}`} className="block relative">
        <img
          src={product.image_url || 'https://placehold.co/400x300?text=No+Image'}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded-full ${
          isOutOfStock ? 'bg-red-50 text-red-600' :
          isLowStock ? 'bg-amber-50 text-amber-700' :
          'bg-emerald-50 text-emerald-600'
        }`}>
          {isOutOfStock ? '✗ Hết hàng' : isLowStock ? `⚡ Còn ${product.stock}` : '✓ Còn hàng'}
        </span>
        {!isOutOfStock && (
          <div className="absolute inset-0 bg-sky-900/10 group-hover:bg-sky-900/20 transition-all duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
            <button
              onClick={handleAddToCart}
              className="bg-white text-sky-700 font-bold text-xs px-4 py-2 rounded-xl shadow-lg hover:bg-sky-600 hover:text-white transition-all transform hover:scale-105"
            >
              🛒 Thêm
            </button>
          </div>
        )}
      </Link>
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-sm text-slate-900 hover:text-sky-600 truncate transition-colors">{product.name}</h3>
        </Link>
        <div className="flex items-center justify-between mt-3">
          <div className="flex flex-col">
            <p className={`text-base font-bold ${product.sales_price ? 'text-rose-500' : 'text-sky-950'}`}>
              ${(product.sales_price || product.price).toFixed(2)}
            </p>
            {product.sales_price && (
              <p className="text-xs font-semibold text-slate-400 line-through">
                ${product.price.toFixed(2)}
              </p>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors disabled:bg-slate-100 disabled:text-slate-400"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}
