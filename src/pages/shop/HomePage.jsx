import { useState, useEffect } from 'react'
import { getProducts } from '../../api/products'
import { getCategories } from '../../api/categories'
import ProductCard from '../../components/shop/ProductCard'
import ProductFilter from '../../components/shop/ProductFilter'

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({ page: 1, size: 12 })
  const [search, setSearch] = useState('')

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data))
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
    <div>
      <div className="mb-4">
        <input
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setFilters((f) => ({ ...f, page: 1 }))
          }}
        />
      </div>

      <div className="flex gap-6">
        <ProductFilter
          categories={categories}
          filters={filters}
          onFilterChange={setFilters}
        />
        <div className="flex-1">
          {loading ? (
            <p className="text-center text-gray-400 py-16">Loading...</p>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-400 py-16">No products found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                disabled={filters.page === 1}
                onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                Prev
              </button>
              <span className="px-3 py-1 text-sm text-gray-600">
                {filters.page} / {totalPages}
              </span>
              <button
                disabled={filters.page === totalPages}
                onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
