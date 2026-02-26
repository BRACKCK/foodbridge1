"""
FoodBridge AI Matching Engine
------------------------------
Scores each NGO candidate against a donation using a weighted
multi-factor algorithm. All sub-scores are normalized to [0, 1].

Weights:
  - distance    0.35
  - urgency     0.25
  - quantity    0.20
  - reliability 0.20
"""

import math
from dataclasses import dataclass
from typing import List

WEIGHTS = {
    "distance": 0.35,
    "urgency": 0.25,
    "quantity": 0.20,
    "reliability": 0.20,
}

MAX_DISTANCE_KM = 50


@dataclass
class MatchCandidate:
    ngo_id: int
    ngo_username: str
    distance_km: float
    capacity_kg: float
    reliability: float
    total_score: float = 0.0
    distance_score: float = 0.0
    urgency_score: float = 0.0
    quantity_score: float = 0.0
    reliability_score: float = 0.0


def haversine_km(lat1, lon1, lat2, lon2):
    R = 6371
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    a = (math.sin(d_lat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(d_lon / 2) ** 2)
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def score_distance(distance_km):
    if distance_km >= MAX_DISTANCE_KM:
        return 0.0
    return 1.0 - (distance_km / MAX_DISTANCE_KM)


def score_quantity(donation_kg, capacity_kg):
    if capacity_kg <= 0:
        return 0.0
    ratio = capacity_kg / donation_kg
    return 1.0 if ratio >= 1.0 else ratio


def run_matching(donation, ngo_queryset) -> List[MatchCandidate]:
    urgency = donation.urgency_score
    donation_kg = float(donation.quantity_kg)
    d_lat = float(donation.latitude or 0)
    d_lon = float(donation.longitude or 0)

    candidates = []

    for ngo in ngo_queryset:
        if not ngo.latitude or not ngo.longitude:
            continue

        distance_km = haversine_km(d_lat, d_lon, float(ngo.latitude), float(ngo.longitude))
        capacity_kg = float(getattr(ngo, "capacity_kg", 50))

        total = ngo.matches.count()
        accepted = ngo.matches.filter(status="accepted").count()
        reliability = (accepted / total) if total > 0 else 0.5

        d_score = score_distance(distance_km)
        u_score = urgency
        q_score = score_quantity(donation_kg, capacity_kg)
        r_score = reliability

        total_score = (
            WEIGHTS["distance"] * d_score +
            WEIGHTS["urgency"] * u_score +
            WEIGHTS["quantity"] * q_score +
            WEIGHTS["reliability"] * r_score
        )

        candidates.append(MatchCandidate(
            ngo_id=ngo.id,
            ngo_username=ngo.username,
            distance_km=distance_km,
            capacity_kg=capacity_kg,
            reliability=reliability,
            total_score=round(total_score, 4),
            distance_score=round(d_score, 4),
            urgency_score=round(u_score, 4),
            quantity_score=round(q_score, 4),
            reliability_score=round(r_score, 4),
        ))

    candidates.sort(key=lambda c: c.total_score, reverse=True)
    return candidates