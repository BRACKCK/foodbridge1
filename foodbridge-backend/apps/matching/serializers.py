from rest_framework import serializers
from .models import Match


class MatchSerializer(serializers.ModelSerializer):
    donation_title = serializers.CharField(source="donation.title", read_only=True)
    ngo_name = serializers.CharField(source="ngo.username", read_only=True)

    class Meta:
        model = Match
        fields = [
            "id", "donation", "donation_title", "ngo", "ngo_name",
            "score", "distance_score", "urgency_score", "quantity_score", "reliability_score",
            "status", "matched_at", "responded_at",
        ]
        read_only_fields = fields