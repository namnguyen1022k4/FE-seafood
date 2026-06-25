import axiosInstance from './axiosInstance'

export const updatePaymentStatus = async (id, status) => {
  const response = await axiosInstance.put(`/payments/${id}/status?status=${status}`)
  return response.data
}
