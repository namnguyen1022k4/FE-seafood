import api from './axiosInstance'

export const getProducts = (params) => api.get('/products', { params })
export const getProduct = (id) => api.get(`/products/${id}`)
export const createProduct = (data) => api.post('/products', data)
export const updateProduct = (id, data) => api.put(`/products/${id}`, data)
export const deleteProduct = (id) => api.delete(`/products/${id}`)
export const uploadImage = (formData) => {
  const token = localStorage.getItem('access_token')
  return api.post('/products/upload', formData, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    _skipAuthRedirect: true,
  })
}

export const getBestsellers = (limit = 8) => api.get('/products/bestsellers', { params: { limit } })
