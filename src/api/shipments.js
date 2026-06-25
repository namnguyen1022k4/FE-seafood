import axiosInstance from './axiosInstance'

export const updateShipmentStatus = async (id, status) => {
  const response = await axiosInstance.put(`/shipments/${id}/status?status=${status}`)
  return response.data
}
