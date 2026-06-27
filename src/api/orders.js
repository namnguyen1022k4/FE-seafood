import api from './axiosInstance'

export const createOrder = (location_id) => api.post('/orders', null, { params: { location_id } })
export const getOrders = () => api.get('/orders')
export const getOrder = (id) => api.get(`/orders/${id}`)
export const cancelOrder = (id) => api.put(`/orders/${id}/cancel`)
export const getAllOrders = () => api.get('/orders/admin/all')
export const updateOrderStatus = (id, status) =>
  api.put(`/orders/${id}/status`, null, { params: { status } })
