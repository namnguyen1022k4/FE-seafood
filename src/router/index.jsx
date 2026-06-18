import { createBrowserRouter } from 'react-router-dom'
import ShopLayout from '../layouts/ShopLayout'
import AdminLayout from '../layouts/AdminLayout'
import { RequireAuth, RequireAdmin } from '../components/shared/ProtectedRoute'

import HomePage from '../pages/shop/HomePage'
import ProductDetailPage from '../pages/shop/ProductDetailPage'
import CartPage from '../pages/shop/CartPage'
import OrdersPage from '../pages/shop/OrdersPage'
import LoginPage from '../pages/shop/LoginPage'
import RegisterPage from '../pages/shop/RegisterPage'

import DashboardPage from '../pages/admin/DashboardPage'
import AdminProductsPage from '../pages/admin/ProductsPage'
import AdminCategoriesPage from '../pages/admin/CategoriesPage'
import AdminOrdersPage from '../pages/admin/OrdersPage'

const router = createBrowserRouter([
  {
    element: <ShopLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/product/:id', element: <ProductDetailPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/cart', element: <RequireAuth><CartPage /></RequireAuth> },
      { path: '/orders', element: <RequireAuth><OrdersPage /></RequireAuth> },
    ],
  },
  {
    element: <RequireAdmin><AdminLayout /></RequireAdmin>,
    children: [
      { path: '/admin', element: <DashboardPage /> },
      { path: '/admin/products', element: <AdminProductsPage /> },
      { path: '/admin/categories', element: <AdminCategoriesPage /> },
      { path: '/admin/orders', element: <AdminOrdersPage /> },
    ],
  },
])

export default router
