from django.db import models
from apps.users.models import User
from apps.matching.models import Match


class Delivery(models.Model):
    class Status(models.TextChoices):
        ASSIGNED = "assigned", "Assigned"
        PICKED_UP = "picked_up", "Picked Up"
        DELIVERED = "delivered", "Delivered"
        FAILED = "failed", "Failed"

    match = models.OneToOneField(Match, on_delete=models.CASCADE, related_name="delivery")
    volunteer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="deliveries")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ASSIGNED)
    notes = models.TextField(blank=True)
    assigned_at = models.DateTimeField(auto_now_add=True)
    picked_up_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Delivery for {self.match} [{self.status}]"