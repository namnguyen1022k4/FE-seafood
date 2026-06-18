# UI Redesign — Ocean Fresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign toàn bộ shop-facing pages theo phong cách Ocean Fresh (navy/teal/white), thêm Hero section ở homepage, chuyển filter sidebar thành horizontal pills.

**Architecture:** Direct Tailwind class replacement trên từng file — không tạo abstraction mới. Tailwind v4 có sẵn sky/cyan color scale khớp hoàn toàn với palette Ocean Fresh. Không thay đổi logic hoặc state.

**Tech Stack:** React 19, Tailwind CSS v4, Vite 8

---

## Color Reference

| Role | Tailwind class | Hex |
|------|---------------|-----|
| Navy (dark bg) | `bg-sky-900` | #0c4a6e |
| Blue (hover/secondary) | `bg-sky-700` | #0369a1 |
| Primary (CTA) | `bg-sky-500` | #0ea5e9 |
| Cyan (brand accent) | `text-cyan-300` | #67e8f9 |
| Light border/bg | `border-sky-200` / `bg-sky-100` | #bae6fd / #e0f2fe |
| Page background | `bg-sky-50` | #f0f9ff |
| Orange badge | `bg-orange-500` | #f97316 |
| Body text | `text-slate-900` | #0f172a |

---

## File Map

| File | Action | What changes |
|------|--------|-------------|
| `src/layouts/ShopLayout.jsx` | Modify | bg-gray-50 → bg-sky-50 |
| `src/components/shop/Navbar.jsx` | Modify | Full redesign: navy bg, cyan brand, sky CTA |
| `src/components/shop/ProductCard.jsx` | Modify | rounded-2xl, hover lift, sky price/button |
| `src/components/shop/ProductFilter.jsx` | Modify | Sidebar → horizontal pills + selects |
| `src/pages/shop/HomePage.jsx` | Modify | Add Hero, remove flex sidebar layout, update search/pagination |
| `src/pages/shop/LoginPage.jsx` | Modify | Full-page gradient, centered card, sky inputs |
| `src/pages/shop/RegisterPage.jsx` | Modify | Same pattern as LoginPage |
| `src/pages/shop/ProductDetailPage.jsx` | Modify | sky/slate color updates |
| `src/pages/shop/CartPage.jsx` | Modify | rounded-2xl cards, sky colors |
| `src/components/shop/CartItem.jsx` | Modify | sky borders/colors, rounded-xl image |
| `src/pages/shop/OrdersPage.jsx` | Modify | sky heading, empty state with emoji |
| `src/components/shop/OrderCard.jsx` | Modify | rounded-2xl, Vietnamese status labels |

---

## Task 1: Foundation — ShopLayout + Navbar

**Files:**
- Modify: `src/layouts/ShopLayout.jsx`
- Modify: `src/components/shop/Navbar.jsx`

- [ ] **Step 1: Update ShopLayout**

Replace entire file content:

```jsx
import { Outlet } from 'react-router-dom'
import Navbar from '../components/shop/Navbar'

export default function ShopLayout() {
  return (
    <div className="min-h-screen bg-sky-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Update Navbar**

Replace entire file content:

```jsx
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAuthStore from '../../stores/authStore'
import useCartStore from '../../stores/cartStore'

export default function Navbar() {
  const user = useAuthStore((s) => s.user)
  const logoutStore = useAuthStore((s) => s.logout)
  const items = useCartStore((s) => s.items)
  const navigate = useNavigate()

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

  const handleLogout = async () => {
    await logoutStore()
    toast.success('Logged out')
    navigate('/login')
  }

  return (
    <nav className="bg-sky-900 shadow-lg sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-extrabold text-cyan-300 tracking-tight flex items-center gap-2">
          🦞 SeaFresh
        </Link>
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <span className="text-sm text-sky-200">Hi, {user.username || user.email}</span>
              <Link to="/orders" className="text-sm text-sky-200 hover:text-white transition-colors">Orders</Link>
              {user.role === 'ADMIN' && (
                <Link to="/admin" className="text-sm font-medium text-sky-200 hover:text-white transition-colors">Admin</Link>
              )}
              <Link to="/cart" className="relative inline-flex items-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                🛒 Cart
                {totalItems > 0 && (
                  <span className="bg-orange-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 leading-none">
                    {totalItems}
                  </span>
                )}
              </Link>
              <button onClick={handleLogout} className="text-sm text-sky-300 hover:text-red-400 transition-colors">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-sky-200 hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="text-sm bg-sky-500 hover:bg-sky-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
```

- [ ] **Step 3: Verify in browser**

Run `npm run dev`, open http://localhost:3000. Check:
- Navbar: navy background, cyan "🦞 SeaFresh" logo, sky blue Cart button
- Page background: light sky blue (not grey)

- [ ] **Step 4: Commit**

```bash
git add src/layouts/ShopLayout.jsx src/components/shop/Navbar.jsx
git commit -m "feat: ocean fresh navbar and layout background"
```

---

## Task 2: ProductCard + ProductFilter

**Files:**
- Modify: `src/components/shop/ProductCard.jsx`
- Modify: `src/components/shop/ProductFilter.jsx`

- [ ] **Step 1: Update ProductCard**

Replace entire file content:

```jsx
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
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden">
      <Link to={`/product/${product.id}`} className="block relative">
        <img
          src={product.image_url ? `http://localhost:8000${product.image_url}` : 'https://placehold.co/300x200'}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <span className={`absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded-md ${
          product.stock > 0 ? 'bg-white/90 text-emerald-600' : 'bg-white/90 text-red-500'
        }`}>
          {product.stock > 0 ? `✓ ${product.stock} in stock` : '✗ Out of stock'}
        </span>
      </Link>
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-slate-900 hover:text-sky-600 truncate transition-colors">{product.name}</h3>
        </Link>
        <div className="flex items-center justify-between mt-3">
          <p className="text-lg font-extrabold text-sky-900">${product.price.toFixed(2)}</p>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Update ProductFilter to horizontal pills**

Replace entire file content:

```jsx
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
```

- [ ] **Step 3: Verify in browser**

Open http://localhost:3000. Check:
- Product cards: rounded corners, hover lift + shadow effect, stock badge top-left, sky price + Add button
- Filter: horizontal pills row (not sidebar), active pill navy/cyan, sort + price selects inline

- [ ] **Step 4: Commit**

```bash
git add src/components/shop/ProductCard.jsx src/components/shop/ProductFilter.jsx
git commit -m "feat: ocean fresh product card and horizontal filter pills"
```

---

## Task 3: HomePage with Hero Section

**Files:**
- Modify: `src/pages/shop/HomePage.jsx`

- [ ] **Step 1: Replace HomePage**

Replace entire file content:

```jsx
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
          <p className="text-center text-slate-400 py-16">Đang tải...</p>
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
  )
}
```

- [ ] **Step 2: Verify in browser**

Open http://localhost:3000. Check:
- Hero banner: navy-to-teal gradient, badge, headline with cyan accent, 2 buttons, bouncing 🦐 emoji on desktop
- Horizontal filter pills below search bar (no more left sidebar)
- 4-column grid on wide screens

- [ ] **Step 3: Commit**

```bash
git add src/pages/shop/HomePage.jsx
git commit -m "feat: add hero section and redesign homepage layout"
```

---

## Task 4: Auth Pages — Login + Register

**Files:**
- Modify: `src/pages/shop/LoginPage.jsx`
- Modify: `src/pages/shop/RegisterPage.jsx`

- [ ] **Step 1: Update LoginPage**

Replace entire file content:

```jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { login } from '../../api/auth'
import useAuthStore from '../../stores/authStore'

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const loginStore = useAuthStore((s) => s.login)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await login(form)
      loginStore(res.data)
      toast.success('Logged in!')
      navigate(res.data.role === 'ADMIN' ? '/admin' : '/')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-sky-50 to-sky-100 -mx-4 -my-6 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-sm">
        <h1 className="text-2xl font-extrabold text-sky-900 mb-1">Chào mừng trở lại 👋</h1>
        <p className="text-slate-500 text-sm mb-8">Đăng nhập để tiếp tục mua sắm</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Username</label>
            <input
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-sky-500 text-slate-800 transition-colors"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
            <input
              type="password"
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-sky-500 text-slate-800 transition-colors"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-900 hover:bg-sky-800 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? 'Logging in...' : 'Đăng nhập'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-sky-500 font-semibold hover:underline">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Update RegisterPage**

Replace entire file content:

```jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { register } from '../../api/auth'

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(form)
      toast.success('Registered! Please log in.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-sky-50 to-sky-100 -mx-4 -my-6 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-sm">
        <h1 className="text-2xl font-extrabold text-sky-900 mb-1">Tạo tài khoản 🎉</h1>
        <p className="text-slate-500 text-sm mb-8">Tham gia SeaFresh ngay hôm nay</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Username</label>
            <input
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-sky-500 text-slate-800 transition-colors"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
            <input
              type="email"
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-sky-500 text-slate-800 transition-colors"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
            <input
              type="password"
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-sky-500 text-slate-800 transition-colors"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-900 hover:bg-sky-800 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? 'Registering...' : 'Đăng ký'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-sky-500 font-semibold hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify in browser**

Navigate to http://localhost:3000/login and http://localhost:3000/register. Check:
- Full-page sky gradient background
- White card centered, rounded-2xl, shadow
- Sky-500 focus ring on inputs, navy submit button

- [ ] **Step 4: Commit**

```bash
git add src/pages/shop/LoginPage.jsx src/pages/shop/RegisterPage.jsx
git commit -m "feat: ocean fresh auth pages with gradient background"
```

---

## Task 5: Product Detail Page

**Files:**
- Modify: `src/pages/shop/ProductDetailPage.jsx`

- [ ] **Step 1: Replace ProductDetailPage**

Replace entire file content:

```jsx
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
```

- [ ] **Step 2: Verify in browser**

Click any product card. Check:
- White card with rounded-2xl, good shadow
- Category pill in sky-100
- Sky-500 price, emerald/red stock text
- Sky-500 Add to Cart button

- [ ] **Step 3: Commit**

```bash
git add src/pages/shop/ProductDetailPage.jsx
git commit -m "feat: ocean fresh product detail page"
```

---

## Task 6: Cart Page + CartItem

**Files:**
- Modify: `src/pages/shop/CartPage.jsx`
- Modify: `src/components/shop/CartItem.jsx`

- [ ] **Step 1: Update CartPage**

Replace entire file content:

```jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useCartStore from '../../stores/cartStore'
import CartItem from '../../components/shop/CartItem'
import { createOrder } from '../../api/orders'

export default function CartPage() {
  const items = useCartStore((s) => s.items)
  const products = useCartStore((s) => s.products)
  const fetchCart = useCartStore((s) => s.fetchCart)
  const clearCart = useCartStore((s) => s.clearCart)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCart()
  }, [])

  const total = items.reduce((sum, i) => {
    const p = products[i.product_id]
    return sum + (p ? p.price * i.quantity : 0)
  }, 0)

  const handleCheckout = async () => {
    try {
      await createOrder()
      await clearCart()
      toast.success('Order placed!')
      navigate('/orders')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Checkout failed')
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-5xl mb-4">🛒</p>
        <p className="text-slate-400 text-lg">Giỏ hàng trống.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-extrabold text-sky-900 mb-6 flex items-center gap-2">
        <span className="w-1 h-6 bg-sky-500 rounded-full block" />
        Giỏ hàng
      </h1>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {items.map((item) => (
          <CartItem key={item.product_id} item={item} />
        ))}
      </div>
      <div className="flex justify-between items-center mt-4 p-5 bg-white rounded-2xl shadow-sm">
        <div>
          <p className="text-sm text-slate-500">Tổng cộng</p>
          <p className="text-2xl font-extrabold text-sky-900">${total.toFixed(2)}</p>
        </div>
        <button
          onClick={handleCheckout}
          className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-8 py-3 rounded-xl transition-colors"
        >
          Đặt hàng →
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Update CartItem**

Replace entire file content:

```jsx
import toast from 'react-hot-toast'
import useCartStore from '../../stores/cartStore'

export default function CartItem({ item }) {
  const updateItem = useCartStore((s) => s.updateItem)
  const removeItem = useCartStore((s) => s.removeItem)
  const products = useCartStore((s) => s.products)
  const product = products[item.product_id]

  if (!product) return null

  const handleQtyChange = async (newQty) => {
    if (newQty <= 0) {
      await removeItem(item.product_id)
      toast.success('Removed from cart')
    } else {
      await updateItem(item.product_id, newQty)
    }
  }

  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b border-sky-50 last:border-b-0">
      <img
        src={product.image_url ? `http://localhost:8000${product.image_url}` : 'https://placehold.co/80x80'}
        alt={product.name}
        className="w-16 h-16 object-cover rounded-xl"
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-800 truncate">{product.name}</p>
        <p className="text-sky-500 font-bold text-sm">${product.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => handleQtyChange(item.quantity - 1)}
          className="w-8 h-8 border-2 border-sky-200 rounded-lg text-sky-700 hover:bg-sky-50 font-bold transition-colors flex items-center justify-center"
        >−</button>
        <span className="w-8 text-center font-semibold text-slate-700">{item.quantity}</span>
        <button
          onClick={() => handleQtyChange(item.quantity + 1)}
          className="w-8 h-8 border-2 border-sky-200 rounded-lg text-sky-700 hover:bg-sky-50 font-bold transition-colors flex items-center justify-center"
        >+</button>
      </div>
      <p className="w-20 text-right font-bold text-sky-900">
        ${(product.price * item.quantity).toFixed(2)}
      </p>
      <button
        onClick={() => handleQtyChange(0)}
        className="text-slate-300 hover:text-red-400 transition-colors text-lg leading-none"
      >✕</button>
    </div>
  )
}
```

- [ ] **Step 3: Verify in browser**

Navigate to http://localhost:3000/cart (must be logged in with items). Check:
- Items inside a white rounded-2xl container
- Sky-200 quantity buttons, sky price text
- Total + Checkout section in separate card below

- [ ] **Step 4: Commit**

```bash
git add src/pages/shop/CartPage.jsx src/components/shop/CartItem.jsx
git commit -m "feat: ocean fresh cart page and cart items"
```

---

## Task 7: Orders Page + OrderCard

**Files:**
- Modify: `src/pages/shop/OrdersPage.jsx`
- Modify: `src/components/shop/OrderCard.jsx`

- [ ] **Step 1: Update OrdersPage**

Replace entire file content:

```jsx
import { useState, useEffect } from 'react'
import { getOrders } from '../../api/orders'
import OrderCard from '../../components/shop/OrderCard'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrders()
      .then((res) => setOrders([...res.data].reverse()))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-center py-16 text-slate-400">Đang tải...</p>

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-extrabold text-sky-900 mb-6 flex items-center gap-2">
        <span className="w-1 h-6 bg-sky-500 rounded-full block" />
        Đơn hàng của tôi
      </h1>
      {orders.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-5xl mb-4">📦</p>
          <p className="text-slate-400 text-lg">Chưa có đơn hàng nào.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => <OrderCard key={o.id} order={o} />)}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Update OrderCard**

Replace entire file content:

```jsx
const STATUS_COLORS = {
  PENDING: 'bg-amber-100 text-amber-700',
  SHIPPING: 'bg-sky-100 text-sky-700',
  DELIVERED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-600',
}

const STATUS_LABELS = {
  PENDING: '⏳ Chờ xử lý',
  SHIPPING: '🚚 Đang giao',
  DELIVERED: '✅ Đã giao',
  CANCELLED: '✕ Đã hủy',
}

export default function OrderCard({ order }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex justify-between items-center hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm text-slate-400 font-medium">Order #{order.id}</p>
        <p className="text-2xl font-extrabold text-sky-900 mt-0.5">${order.total_price.toFixed(2)}</p>
      </div>
      <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${STATUS_COLORS[order.status] || 'bg-slate-100 text-slate-600'}`}>
        {STATUS_LABELS[order.status] || order.status}
      </span>
    </div>
  )
}
```

- [ ] **Step 3: Verify in browser**

Navigate to http://localhost:3000/orders (must be logged in). Check:
- Section header with sky accent bar
- Order cards: rounded-2xl, hover shadow, status pills with Vietnamese labels + emoji

- [ ] **Step 4: Final commit**

```bash
git add src/pages/shop/OrdersPage.jsx src/components/shop/OrderCard.jsx
git commit -m "feat: ocean fresh orders page and order cards"
```
