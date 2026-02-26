from rest_framework import serializers
from .models import Donation


class DonationSerializer(serializers.ModelSerializer):
    donor_name = serializers.CharField(source="donor.username", read_only=True)
    urgency_score = serializers.FloatField(read_only=True)

    class Meta:
        model = Donation
        fields = [
            "id", "donor", "donor_name", "title", "food_type", "quantity_kg",
            "description", "expiry_time", "pickup_address", "latitude", "longitude",
            "status", "dietary_notes", "urgency_score", "created_at", "updated_at",
        ]
        read_only_fields = ["donor", "status", "created_at", "updated_at"]

    def create(self, validated_data):
        validated_data["donor"] = self.context["request"].user
        return super().create(validated_data)