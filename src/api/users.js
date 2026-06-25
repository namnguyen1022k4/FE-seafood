import axiosInstance from './axiosInstance'

export const getMe = async () => {
  const response = await axiosInstance.get('/users/me')
  return response.data
}

export const updateMe = async (data) => {
  const response = await axiosInstance.put('/users/me', data)
  return response.data
}

export const getAllUsers = async () => {
  const response = await axiosInstance.get('/users/')
  return response.data
}
