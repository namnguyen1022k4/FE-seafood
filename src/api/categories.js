import api from './axiosInstance'

export const getCategories = () => api.get('/categories')
export const createCategory = (name) =>
  api.post('/categories', null, { params: { name } })
export const updateCategory = (id, name) =>
  api.put(`/categories/${id}`, null, { params: { name } })
export const deleteCategory = (id) => api.delete(`/categories/${id}`)
