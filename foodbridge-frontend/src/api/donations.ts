import api from "./index"

export const getDonations = async (params?: {
  status?: string
  food_type?: string
  search?: string
}) => {
  const res = await api.get("/donations/", { params })
  return res.data
}

export const getMyDonations = async () => {
  const res = await api.get("/donations/mine/")
  return res.data
}

export const createDonation = async (data: {
  title: string
  food_type: string
  quantity_kg: string
  description?: string
  expiry_time: string
  pickup_address: string
  latitude?: number
  longitude?: number
  dietary_notes?: string
}) => {
  const res = await api.post("/donations/", data)
  return res.data
}

export const getDonation = async (id: number) => {
  const res = await api.get(`/donations/${id}/`)
  return res.data
}