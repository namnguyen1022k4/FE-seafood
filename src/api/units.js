import axiosInstance from './axiosInstance'

export const getUnits = async () => {
  const response = await axiosInstance.get('/units/')
  return response.data
}

export const createUnit = async (data) => {
  const response = await axiosInstance.post('/units/', data)
  return response.data
}

export const deleteUnit = async (id) => {
  const response = await axiosInstance.delete(`/units/${id}`)
  return response.data
}
