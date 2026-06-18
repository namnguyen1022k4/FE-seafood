export default function ProductFilter({ categories, filters, onFilterChange }) {
  const set = (key, value) =>
    onFilterChange({ ...filters, [key]: value || undefined, page: 1 })

  return (
    <aside className="w-64 shrink-0 space-y-6">
      <div>
        <h3 className="font-semibold mb-2">Category</h3>
        <select
          className="w-full border rounded px-2 py-1 text-sm"
          value={filters.category_id || ''}
          onChange={(e) => set('category_id', e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Price Range</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            className="w-full border rounded px-2 py-1 text-sm"
            value={filters.min_price || ''}
            onChange={(e) => set('min_price', e.target.value)}
          />
          <input
            type="number"
            placeholder="Max"
            className="w-full border rounded px-2 py-1 text-sm"
            value={filters.max_price || ''}
            onChange={(e) => set('max_price', e.target.value)}
          />
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Sort</h3>
        <select
          className="w-full border rounded px-2 py-1 text-sm"
          value={filters.sort || ''}
          onChange={(e) => set('sort', e.target.value)}
        >
          <option value="">Default</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      <button
        onClick={() => onFilterChange({ page: 1, size: 12 })}
        className="w-full text-sm text-gray-500 hover:text-red-500 underline"
      >
        Clear filters
      </button>
    </aside>
  )
}
