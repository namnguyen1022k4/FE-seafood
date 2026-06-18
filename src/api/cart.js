import api from './axiosInstance'

export const getCart = () => api.get('/cart')
export const addToCart = (product_id, quantity = 1) =>
  api.post('/cart/add', null, { params: { product_id, quantity } })
export const updateCart = (product_id, quantity) =>
  api.put('/cart/update', null, { params: { product_id, quantity } })
export const removeFromCart = (product_id) =>
  api.delete('/cart/remove', { params: { product_id } })
export const clearCart = () => api.delete('/cart/clear')
