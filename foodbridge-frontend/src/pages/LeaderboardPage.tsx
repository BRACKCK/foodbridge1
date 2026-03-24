import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { getLeaderboard } from "../api/gamification"
import { useAuth } from "../context/AuthContext"

export default function LeaderboardPage() {
  const { user } = useAuth()
  const [leaders, setLeaders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLeaderboard()
      .then(setLeaders)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const medal = (index: number) => {
    if (index === 0) return "🥇"
    if (index === 1) return "🥈"
    if (index === 2) return "🥉"
    return `#${index + 1}`
  }

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Leaderboard</h1>
        <p className="text-gray-500 text-sm mb-6">Top contributors on FoodBridge</p>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading leaderboard...</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {leaders.map((leader, index) => (
              <div
                key={leader.id}
                className={`flex items-center justify-between px-6 py-4 border-b border-gray-100 last:border-0 ${
                  leader.username === user?.username ? "bg-green-50" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-xl w-8 text-center">{medal(index)}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {leader.username}
                      {leader.username === user?.username && (
                        <span className="ml-2 text-xs text-green-600">(you)</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">{leader.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">{leader.points}</p>
                  <p className="text-xs text-gray-400">points</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}