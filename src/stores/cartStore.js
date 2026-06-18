import { create } from 'zustand'
import {
  getCart,
  addToCart as apiAdd,
  updateCart as apiUpdate,
  removeFromCart as apiRemove,
  clearCart as apiClear,
} from '../api/cart'
import { getProduct } from '../api/products'

const useCartStore = create((set, get) => ({
  items: [],
  products: {},

  async fetchCart() {
    const res = await getCart()
    const cartItems = res.data
    const products = { ...get().products }

    await Promise.all(
      cartItems.map(async (item) => {
        if (!products[item.product_id]) {
          const p = await getProduct(item.product_id)
          products[item.product_id] = p.data
        }
      })
    )
    set({ items: cartItems, products })
  },

  async addItem(product_id, quantity = 1) {
    await apiAdd(product_id, quantity)
    await get().fetchCart()
  },

  async updateItem(product_id, quantity) {
    await apiUpdate(product_id, quantity)
    await get().fetchCart()
  },

  async removeItem(product_id) {
    await apiRemove(product_id)
    await get().fetchCart()
  },

  async clearCart() {
    await apiClear()
    set({ items: [], products: {} })
  },
}))

export default useCartStore
