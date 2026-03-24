import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import { getDonations } from "../api/donations"
import { useAuth } from "../context/AuthContext"
import type { Donation } from "../types"

export default function DonationsPage() {
  const { user } = useAuth()
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [foodTypeFilter, setFoodTypeFilter] = useState("")

  const fetchDonations = async () => {
    setLoading(true)
    try {
      const data = await getDonations({
        search,
        status: statusFilter,
        food_type: foodTypeFilter,
      })
      setDonations(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDonations()
  }, [statusFilter, foodTypeFilter])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value)
  }

  const handleFoodTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFoodTypeFilter(e.target.value)
  }

  const urgencyColor = (score: number) => {
    if (score >= 0.7) return "bg-red-100 text-red-600"
    if (score >= 0.4) return "bg-yellow-100 text-yellow-600"
    return "bg-green-100 text-green-600"
  }

  const urgencyLabel = (score: number) => {
    if (score >= 0.7) return "Urgent"
    if (score >= 0.4) return "Moderate"
    return "Fresh"
  }

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">All Donations</h1>
          {user?.role === "donor" && (
            <Link
              to="/donations/new"
              className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              + Donate Food
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6 flex flex-wrap gap-3">
          <input
            id="search"
            name="search"
            type="text"
            placeholder="Search donations..."
            value={search}
            onChange={handleSearchChange}
            onKeyDown={(e) => e.key === "Enter" && fetchDonations()}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <select
            id="status-filter"
            name="status-filter"
            title="Filter by status"
            value={statusFilter}
            onChange={handleStatusChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="">All Statuses</option>
            <option value="available">Available</option>
            <option value="matched">Matched</option>
            <option value="delivered">Delivered</option>
            <option value="expired">Expired</option>
          </select>
          <select
            id="food-type-filter"
            name="food-type-filter"
            title="Filter by food type"
            value={foodTypeFilter}
            onChange={handleFoodTypeChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="">All Food Types</option>
            <option value="perishable">Perishable</option>
            <option value="non_perishable">Non-Perishable</option>
            <option value="cooked">Cooked Meal</option>
            <option value="produce">Fresh Produce</option>
          </select>
        </div>

        {/* Donations List */}
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading donations...</div>
        ) : donations.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-2">🍱</p>
            <p>No donations found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {donations.map((d) => (
              <div
                key={d.id}
                className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition"
              >
                {/* Title & Urgency */}
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-gray-800 text-sm">{d.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${urgencyColor(d.urgency_score)}`}>
                    {urgencyLabel(d.urgency_score)}
                  </span>
                </div>

                {/* Details */}
                <div className="text-xs text-gray-500 space-y-1">
                  <p>🥡 {d.food_type.replace("_", " ")} · {d.quantity_kg}kg</p>
                  <p>📍 {d.pickup_address}</p>
                  <p>⏰ Expires: {new Date(d.expiry_time).toLocaleString()}</p>
                  {d.dietary_notes && <p>🌿 {d.dietary_notes}</p>}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-400">By {d.donor_name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    d.status === "available" ? "bg-green-100 text-green-700" :
                    d.status === "matched" ? "bg-blue-100 text-blue-700" :
                    d.status === "delivered" ? "bg-gray-100 text-gray-600" :
                    "bg-red-100 text-red-600"
                  }`}>
                    {d.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}