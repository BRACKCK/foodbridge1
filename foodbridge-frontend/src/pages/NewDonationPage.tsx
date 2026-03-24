import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { createDonation } from "../api/donations"

export default function NewDonationPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    title: "",
    food_type: "cooked",
    quantity_kg: "",
    description: "",
    expiry_time: "",
    pickup_address: "",
    dietary_notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await createDonation(form)
      navigate("/donations")
    } catch {
      setError("Failed to post donation. Please check your inputs.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Post a Donation</h1>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Donation Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={form.title}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="e.g. Leftover Rice and Beans"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="food_type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Food Type
                </label>
                <select
                  id="food_type"
                  name="food_type"
                  value={form.food_type}
                  onChange={handleSelectChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="cooked">Cooked Meal</option>
                  <option value="perishable">Perishable</option>
                  <option value="non_perishable">Non-Perishable</option>
                  <option value="produce">Fresh Produce</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="quantity_kg"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Quantity (kg)
                </label>
                <input
                  id="quantity_kg"
                  name="quantity_kg"
                  type="number"
                  required
                  min="0.1"
                  step="0.1"
                  value={form.quantity_kg}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="e.g. 10.5"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleTextareaChange}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Describe the food, quantity, serving size..."
              />
            </div>

            <div>
              <label
                htmlFor="expiry_time"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Expiry Time
              </label>
              <input
                id="expiry_time"
                name="expiry_time"
                type="datetime-local"
                required
                value={form.expiry_time}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label
                htmlFor="pickup_address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Pickup Address
              </label>
              <input
                id="pickup_address"
                name="pickup_address"
                type="text"
                required
                value={form.pickup_address}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="e.g. Westlands, Nairobi"
              />
            </div>

            <div>
              <label
                htmlFor="dietary_notes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Dietary Notes
              </label>
              <input
                id="dietary_notes"
                name="dietary_notes"
                type="text"
                value={form.dietary_notes}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="e.g. halal, vegan, contains nuts"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/donations")}
                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? "Posting..." : "Post Donation"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}