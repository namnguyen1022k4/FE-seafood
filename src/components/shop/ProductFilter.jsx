export default function ProductFilter({ categories, filters, onFilterChange }) {
  const set = (key, value) =>
    onFilterChange({ ...filters, [key]: value || undefined, page: 1 })

  const hasActiveFilters = filters.category_id || filters.sort || filters.min_price || filters.max_price

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <button
        onClick={() => set('category_id', '')}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
          !filters.category_id
            ? 'bg-sky-900 text-cyan-300'
            : 'bg-sky-100 text-sky-700 hover:bg-sky-200'
        }`}
      >
        All
      </button>
      {categories.map((c) => (
        <button
          key={c.id}
          onClick={() => set('category_id', c.id)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            String(filters.category_id) === String(c.id)
              ? 'bg-sky-900 text-cyan-300'
              : 'bg-sky-100 text-sky-700 hover:bg-sky-200'
          }`}
        >
          {c.name}
        </button>
      ))}

      <div className="hidden sm:block w-px h-6 bg-sky-200 mx-1" />

      <select
        className="border border-sky-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white"
        value={filters.sort || ''}
        onChange={(e) => set('sort', e.target.value)}
      >
        <option value="">Sort: Default</option>
        <option value="price_asc">Price: Low → High</option>
        <option value="price_desc">Price: High → Low</option>
        <option value="newest">Newest</option>
      </select>

      <div className="flex items-center gap-1.5">
        <input
          type="number"
          placeholder="Min $"
          className="w-20 border border-sky-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
          value={filters.min_price || ''}
          onChange={(e) => set('min_price', e.target.value)}
        />
        <span className="text-slate-400 text-sm">—</span>
        <input
          type="number"
          placeholder="Max $"
          className="w-20 border border-sky-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
          value={filters.max_price || ''}
          onChange={(e) => set('max_price', e.target.value)}
        />
      </div>

      {hasActiveFilters && (
        <button
          onClick={() => onFilterChange({ page: 1, size: 12 })}
          className="text-sm text-slate-400 hover:text-red-500 transition-colors"
        >
          ✕ Clear
        </button>
      )}
    </div>
  )
}
