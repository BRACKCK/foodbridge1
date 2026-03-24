import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useAuth } from "../context/AuthContext"
import { getMyDonations } from "../api/donations"
import { getMyGamification } from "../api/gamification"
import { getMyImpact } from "../api/impact"
import { Donation, ImpactStats } from "../types"

export default function DashboardPage() {
  const { user } = useAuth()
  const [donations, setDonations] = useState<Donation[]>([])
  const [gamification, setGamification] = useState<any>(null)
  const [impact, setImpact] = useState<ImpactStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [don, gam, imp] = await Promise.all([
          getMyDonations(),
          getMyGamification(),
          getMyImpact(),
        ])
        setDonations(don)
        setGamification(gam)
        setImpact(imp)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50">
        <Navbar />
        <div className="flex items-center justify-center h-96 text-gray-500">
          Loading dashboard...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back, {user?.username} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1 capitalize">
            {user?.role} · {user?.location}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-3xl font-bold text-green-600">{donations.length}</p>
            <p className="text-sm text-gray-500 mt-1">Total Donations</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-3xl font-bold text-yellow-500">{gamification?.points ?? 0}</p>
            <p className="text-sm text-gray-500 mt-1">Points Earned</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-3xl font-bold text-blue-500">
              {impact?.meals_provided ?? 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">Meals Provided</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-3xl font-bold text-emerald-500">
              {impact?.co2_saved_kg ?? 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">kg CO₂ Saved</p>
          </div>
        </div>

        {/* Level & Badges */}
        {gamification && (
          <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-700">Your Level</h2>
              <span className="text-2xl">{gamification.level.icon}</span>
            </div>
            <p className="text-xl font-bold text-green-600">{gamification.level.name}</p>
            <p className="text-sm text-gray-500 mt-1">{gamification.points} points earned</p>

            {gamification.badges.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-600 mb-2">Badges earned:</p>
                <div className="flex gap-3 flex-wrap">
                  {gamification.badges.map((ub: any) => (
                    <div
                      key={ub.badge.id}
                      className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-center"
                    >
                      <p className="text-xl">{ub.badge.icon}</p>
                      <p className="text-xs text-gray-600 mt-1">{ub.badge.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recent Donations */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Recent Donations</h2>
            <Link to="/donations" className="text-sm text-green-600 hover:underline">
              View all
            </Link>
          </div>

          {donations.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-4xl mb-2">🍱</p>
              <p className="text-sm">No donations yet.</p>
              {user?.role === "donor" && (
                <Link
                  to="/donations/new"
                  className="mt-3 inline-block bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Post your first donation
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {donations.slice(0, 5).map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between border border-gray-100 rounded-lg px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-700">{d.title}</p>
                    <p className="text-xs text-gray-400">{d.quantity_kg}kg · {d.food_type}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    d.status === "available" ? "bg-green-100 text-green-700" :
                    d.status === "matched" ? "bg-blue-100 text-blue-700" :
                    d.status === "delivered" ? "bg-gray-100 text-gray-600" :
                    "bg-red-100 text-red-600"
                  }`}>
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}