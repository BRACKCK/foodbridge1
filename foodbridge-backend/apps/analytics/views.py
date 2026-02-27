from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Count, Q

from apps.donations.models import Donation
from apps.matching.models import Match
from apps.volunteers.models import Delivery
from apps.users.models import User


class DashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        donations = Donation.objects.aggregate(
            total=Count("id"),
            available=Count("id", filter=Q(status="available")),
            matched=Count("id", filter=Q(status="matched")),
            delivered=Count("id", filter=Q(status="delivered")),
            expired=Count("id", filter=Q(status="expired")),
        )
        matches = Match.objects.aggregate(
            total=Count("id"),
            accepted=Count("id", filter=Q(status="accepted")),
            rejected=Count("id", filter=Q(status="rejected")),
        )
        users = User.objects.aggregate(
            total=Count("id"),
            donors=Count("id", filter=Q(role="donor")),
            ngos=Count("id", filter=Q(role="ngo")),
            volunteers=Count("id", filter=Q(role="volunteer")),
        )
        deliveries = Delivery.objects.aggregate(
            total=Count("id"),
            completed=Count("id", filter=Q(status="delivered")),
            failed=Count("id", filter=Q(status="failed")),
        )

        match_rate = (
            round(matches["accepted"] / matches["total"] * 100, 1)
            if matches["total"] else 0
        )

        return Response({
            "donations": donations,
            "matches": {**matches, "acceptance_rate_pct": match_rate},
            "users": users,
            "deliveries": deliveries,
        })