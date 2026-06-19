import { useState, useEffect } from 'react'
import { getProducts, getBestsellers } from '../../api/products'
import { getCategories } from '../../api/categories'
import ProductCard from '../../components/shop/ProductCard'
import ProductFilter from '../../components/shop/ProductFilter'
import SkeletonCard from '../../components/shared/SkeletonCard'

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [bestsellers, setBestsellers] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({ page: 1, size: 6 })
  const [search, setSearch] = useState('')

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data))
    getBestsellers(4).then((res) => setBestsellers(res.data))
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = { ...filters }
    if (search) params.search = search
    getProducts(params)
      .then((res) => {
        setProducts(res.data.items)
        setTotal(res.data.total)
      })
      .finally(() => setLoading(false))
  }, [filters, search])

  const totalPages = Math.ceil(total / filters.size)

  return (
    <>
      <div>
        {/* Hero */}
        <div className="-mx-4 -mt-6 mb-8 bg-gradient-to-br from-sky-900 via-sky-700 to-sky-500 px-8 py-14 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-300/10 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 right-32 w-48 h-48 bg-sky-300/10 rounded-full translate-y-1/2 pointer-events-none" />
          <div className="relative max-w-2xl">
            <span className="inline-block bg-white/10 text-cyan-300 border border-cyan-300/30 rounded-full px-4 py-1 text-xs font-semibold tracking-wider mb-4">
              🌊 Fresh from the Ocean
            </span>
            <h1 className="text-4xl font-extrabold text-white leading-tight mb-3">
              Hải sản tươi sống<br />
              giao tận <span className="text-cyan-300">cửa nhà</span>
            </h1>
            <p className="text-sky-200 text-base mb-6 leading-relaxed">
              Tôm, cua, cá, mực — chọn lọc mỗi ngày từ ngư dân. Giao hàng nhanh, đảm bảo tươi ngon.
            </p>
            <div className="flex gap-3">
              <a href="#products" className="bg-sky-500 hover:bg-sky-400 text-white font-bold px-6 py-3 rounded-xl transition-colors">
                🛍️ Mua ngay
              </a>
              <a href="#products" className="bg-white/10 hover:bg-white/20 text-cyan-300 border border-cyan-300/40 font-semibold px-6 py-3 rounded-xl transition-colors">
                Xem sản phẩm
              </a>
            </div>
          </div>
          <div className="absolute right-16 top-1/2 -translate-y-1/2 text-8xl hidden md:block select-none animate-bounce pointer-events-none">
            🦐
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { value: '50+', label: 'Loại hải sản' },
            { value: '200+', label: 'Ngư dân hợp tác' },
            { value: '1000+', label: 'Đơn hàng/tháng' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-4 text-center shadow-sm">
              <p className="text-2xl font-extrabold text-sky-600">{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            className="w-full border-2 border-sky-200 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-500 text-slate-700 placeholder:text-slate-400 bg-white transition-colors"
            placeholder="🔍  Tìm kiếm hải sản..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setFilters((f) => ({ ...f, page: 1 }))
            }}
          />
        </div>

        {/* Filter pills */}
        <ProductFilter
          categories={categories}
          filters={filters}
          onFilterChange={setFilters}
        />

        {/* Bestsellers */}
        {bestsellers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-sky-900 flex items-center gap-2 mb-4">
              <span className="w-1 h-5 bg-orange-500 rounded-full block" />
              🔥 Bán chạy nhất
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {bestsellers.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}

        {/* Products */}
        <div id="products">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-sky-900 flex items-center gap-2">
              <span className="w-1 h-5 bg-sky-500 rounded-full block" />
              Sản phẩm
              <span className="text-sm font-normal text-slate-400">({total})</span>
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <p className="text-center text-slate-400 py-16">Không tìm thấy sản phẩm.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                disabled={filters.page === 1}
                onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
                className="px-4 py-2 border border-sky-200 rounded-lg text-sky-700 hover:bg-sky-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Trước
              </button>
              <span className="px-4 py-2 text-sm text-slate-600 bg-white border border-sky-200 rounded-lg">
                {filters.page} / {totalPages}
              </span>
              <button
                disabled={filters.page === totalPages}
                onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
                className="px-4 py-2 border border-sky-200 rounded-lg text-sky-700 hover:bg-sky-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Sau →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 -mx-4 bg-sky-900 text-sky-200 px-8 py-10">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <p className="text-cyan-300 font-extrabold text-lg mb-2">🦞 SeaFresh</p>
            <p className="text-sm text-sky-300 leading-relaxed">Hải sản tươi sống giao tận cửa nhà. Chọn lọc mỗi ngày từ ngư dân.</p>
          </div>
          <div>
            <p className="font-semibold text-white mb-3">Hỗ trợ</p>
            <ul className="space-y-1.5 text-sm">
              <li>📞 1800-SEAFRESH</li>
              <li>📧 hello@seafresh.vn</li>
              <li>🕗 7:00 – 22:00 hàng ngày</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white mb-3">Cam kết</p>
            <ul className="space-y-1.5 text-sm">
              <li>✅ Hải sản tươi 100%</li>
              <li>✅ Giao hàng trong 2 giờ</li>
              <li>✅ Hoàn tiền nếu không ưng</li>
            </ul>
          </div>
        </div>
        <p className="text-center text-sky-500 text-xs mt-8">© 2026 SeaFresh. All rights reserved.</p>
      </footer>
    </>
  )
}
