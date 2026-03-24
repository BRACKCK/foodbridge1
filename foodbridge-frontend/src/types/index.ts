export interface User {
  id: number
  username: string
  email: string
  role: "donor" | "ngo" | "volunteer" | "admin"
  phone: string
  organization: string
  location: string
  latitude: number | null
  longitude: number | null
  points: number
  created_at: string
}

export interface Donation {
  id: number
  donor: number
  donor_name: string
  title: string
  food_type: "perishable" | "non_perishable" | "cooked" | "produce"
  quantity_kg: string
  description: string
  expiry_time: string
  pickup_address: string
  latitude: number | null
  longitude: number | null
  status: "available" | "matched" | "in_transit" | "delivered" | "expired"
  dietary_notes: string
  urgency_score: number
  created_at: string
  updated_at: string
}

export interface Match {
  id: number
  donation: number
  donation_title: string
  ngo: number
  ngo_name: string
  score: number
  distance_score: number
  urgency_score: number
  quantity_score: number
  reliability_score: number
  status: "pending" | "accepted" | "rejected" | "completed"
  matched_at: string
  responded_at: string | null
}

export interface Delivery {
  id: number
  match: number
  donation_title: string
  volunteer: number
  volunteer_name: string
  status: "assigned" | "picked_up" | "delivered" | "failed"
  notes: string
  assigned_at: string
  picked_up_at: string | null
  delivered_at: string | null
}

export interface ImpactStats {
  food_rescued_kg: number
  co2_saved_kg: number
  water_saved_litres: number
  meals_provided: number
}

export interface Badge {
  id: number
  name: string
  description: string
  icon: string
  points_required: number
}

export interface UserBadge {
  badge: Badge
  earned_at: string
}