from django.db import models
from apps.users.models import User


class Donation(models.Model):
    class FoodType(models.TextChoices):
        PERISHABLE = "perishable", "Perishable"
        NON_PERISHABLE = "non_perishable", "Non-Perishable"
        COOKED = "cooked", "Cooked Meal"
        PRODUCE = "produce", "Fresh Produce"

    class Status(models.TextChoices):
        AVAILABLE = "available", "Available"
        MATCHED = "matched", "Matched"
        IN_TRANSIT = "in_transit", "In Transit"
        DELIVERED = "delivered", "Delivered"
        EXPIRED = "expired", "Expired"

    donor = models.ForeignKey(User, on_delete=models.CASCADE, related_name="donations")
    title = models.CharField(max_length=200)
    food_type = models.CharField(max_length=20, choices=FoodType.choices)
    quantity_kg = models.DecimalField(max_digits=8, decimal_places=2)
    description = models.TextField(blank=True)
    expiry_time = models.DateTimeField()
    pickup_address = models.CharField(max_length=300)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.AVAILABLE)
    dietary_notes = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} by {self.donor.username} [{self.status}]"

    @property
    def urgency_score(self):
        from django.utils import timezone
        import math
        delta = (self.expiry_time - timezone.now()).total_seconds() / 3600
        if delta <= 0:
            return 1.0
        return max(0.0, min(1.0, 1 - math.log(max(delta, 0.1)) / math.log(48)))