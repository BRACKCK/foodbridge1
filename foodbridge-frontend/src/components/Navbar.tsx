import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { logout } from "../api/auth"

export default function Navbar() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const isActive = (path: string) =>
    location.pathname === path
      ? "text-green-600 font-semibold"
      : "text-gray-600 hover:text-green-600"

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-green-600">
          🍱 FoodBridge
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/" className={isActive("/")}>Dashboard</Link>
          <Link to="/donations" className={isActive("/donations")}>Donations</Link>
          <Link to="/impact" className={isActive("/impact")}>Impact</Link>
          <Link to="/leaderboard" className={isActive("/leaderboard")}>Leaderboard</Link>
          {user?.role === "donor" && (
            <Link
              to="/donations/new"
              className="bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700 transition text-sm font-medium"
            >
              + Donate Food
            </Link>
          )}
        </div>

        {/* User Info */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-700">{user?.username}</p>
            <p className="text-xs text-green-600 capitalize">{user?.role} · {user?.points} pts</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-500 transition"
          >
            Logout
          </button>
        </div>

      </div>
    </nav>
  )
}