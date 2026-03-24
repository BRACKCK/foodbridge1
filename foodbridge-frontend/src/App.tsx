import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"


import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import DashboardPage from "./pages/DashboardPage"
import DonationsPage from "./pages/DonationsPage"
import NewDonationPage from "./pages/NewDonationPage"
import LeaderboardPage from "./pages/LeaderboardPage"
import ImpactPage from "./pages/ImpactPage"

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/donations" element={<ProtectedRoute><DonationsPage /></ProtectedRoute>} />
      <Route path="/donations/new" element={<ProtectedRoute><NewDonationPage /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
      <Route path="/impact" element={<ProtectedRoute><ImpactPage /></ProtectedRoute>} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}