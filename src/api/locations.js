import axiosInstance from './axiosInstance'

export const createLocation = async (data) => {
  const response = await axiosInstance.post('/locations', data)
  return response.data
}
