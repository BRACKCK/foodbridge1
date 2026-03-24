import api from "./index"

export const getTotalImpact = async () => {
  const res = await api.get("/impact/total/")
  return res.data
}

export const getMyImpact = async () => {
  const res = await api.get("/impact/me/")
  return res.data
}

