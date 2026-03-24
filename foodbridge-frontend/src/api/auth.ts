import api from "./index"

export const login = async (username: string, password: string) => {
  const res = await api.post("/auth/login/", { username, password })
  localStorage.setItem("access_token", res.data.access)
  localStorage.setItem("refresh_token", res.data.refresh)
  return res.data
}

export const register = async (data: {
  username: string
  email: string
  password: string
  role: string
  phone?: string
  organization?: string
  location?: string
}) => {
  const res = await api.post("/users/register/", data)
  return res.data
}

export const getProfile = async () => {
  const res = await api.get("/users/profile/")
  return res.data
}

export const logout = () => {
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
  window.location.href = "/login"
}