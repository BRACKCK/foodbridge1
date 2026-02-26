from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone

from apps.users.models import User
from apps.donations.models import Donation
from .models import Match
from .engine import run_matching
from .serializers import MatchSerializer


class RunMatchingView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, donation_id):
        try:
            donation = Donation.objects.get(pk=donation_id, status="available")
        except Donation.DoesNotExist:
            return Response({"error": "Donation not found or not available."}, status=404)

        if request.user != donation.donor and request.user.role != "admin":
            return Response({"error": "Not authorized."}, status=403)

        ngos = User.objects.filter(role="ngo").prefetch_related("matches")
        candidates = run_matching(donation, ngos)

        if not candidates:
            return Response({"message": "No matching NGOs found."}, status=200)

        created_matches = []
        for candidate in candidates[:3]:
            ngo = User.objects.get(pk=candidate.ngo_id)
            match, _ = Match.objects.get_or_create(
                donation=donation,
                ngo=ngo,
                defaults={
                    "score": candidate.total_score,
                    "distance_score": candidate.distance_score,
                    "urgency_score": candidate.urgency_score,
                    "quantity_score": candidate.quantity_score,
                    "reliability_score": candidate.reliability_score,
                }
            )
            created_matches.append(match)

        serializer = MatchSerializer(created_matches, many=True)
        return Response({"matches": serializer.data}, status=201)


class RespondToMatchView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, match_id):
        try:
            match = Match.objects.select_related("donation", "ngo").get(pk=match_id)
        except Match.DoesNotExist:
            return Response({"error": "Match not found."}, status=404)

        if request.user != match.ngo:
            return Response({"error": "Only the matched NGO can respond."}, status=403)

        action = request.data.get("action")
        if action not in ("accept", "reject"):
            return Response({"error": "action must be 'accept' or 'reject'."}, status=400)

        match.status = "accepted" if action == "accept" else "rejected"
        match.responded_at = timezone.now()
        match.save()

        if match.status == "accepted":
            match.donation.status = "matched"
            match.donation.save()

        return Response(MatchSerializer(match).data)


class MatchListView(generics.ListAPIView):
    serializer_class = MatchSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "ngo":
            return Match.objects.filter(ngo=user).select_related("donation", "ngo")
        return Match.objects.filter(donation__donor=user).select_related("donation", "ngo")