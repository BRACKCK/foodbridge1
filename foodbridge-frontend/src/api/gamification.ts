import api from "./index"

export const getMyGamification = async () => {
  const res = await api.get("/gamification/me/")
  return res.data
}

export const getLeaderboard = async () => {
  const res = await api.get("/gamification/leaderboard/")
  return res.data
}