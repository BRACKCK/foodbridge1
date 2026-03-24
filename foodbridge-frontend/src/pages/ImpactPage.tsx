import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { getTotalImpact, getMyImpact } from "../api/impact"
import { ImpactStats } from "../types"

export default function ImpactPage() {
  const [total, setTotal] = useState<ImpactStats | null>(null)
  const [mine, setMine] = useState<ImpactStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getTotalImpact(), getMyImpact()])
      .then(([t, m]) => {
        setTotal(t)
        setMine(m)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const StatCard = ({
    icon,
    label,
    value,
    unit,
    color,
  }: {
    icon: string
    label: string
    value: number
    unit: string
    color: string
  }) => (
    <div className="bg-white rounded-xl p-5 shadow-sm text-center">
      <p className="text-3xl mb-2">{icon}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-1">{unit}</p>
      <p className="text-sm text-gray-600 mt-1">{label}</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Environmental Impact</h1>
        <p className="text-gray-500 text-sm mb-8">
          Every kilogram of food rescued saves CO₂, water, and feeds someone in need.
        </p>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading impact data...</div>
        ) : (
          <>
            {/* Platform Total */}
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              🌍 Platform Total Impact
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <StatCard icon="🍱" label="Food Rescued" value={Number(total?.food_rescued_kg ?? 0)} unit="kg" color="text-green-600" />
              <StatCard icon="🌿" label="CO₂ Saved" value={Number(total?.co2_saved_kg ?? 0)} unit="kg CO₂" color="text-emerald-600" />
              <StatCard icon="💧" label="Water Saved" value={Number(total?.water_saved_litres ?? 0)} unit="litres" color="text-blue-500" />
              <StatCard icon="🍽️" label="Meals Provided" value={Number(total?.meals_provided ?? 0)} unit="meals" color="text-orange-500" />
            </div>

            {/* My Impact */}
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              🙋 My Personal Impact
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon="🍱" label="Food Rescued" value={Number(mine?.food_rescued_kg ?? 0)} unit="kg" color="text-green-600" />
              <StatCard icon="🌿" label="CO₂ Saved" value={Number(mine?.co2_saved_kg ?? 0)} unit="kg CO₂" color="text-emerald-600" />
              <StatCard icon="💧" label="Water Saved" value={Number(mine?.water_saved_litres ?? 0)} unit="litres" color="text-blue-500" />
              <StatCard icon="🍽️" label="Meals Provided" value={Number(mine?.meals_provided ?? 0)} unit="meals" color="text-orange-500" />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
