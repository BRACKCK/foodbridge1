from django.db import models
from apps.users.models import User
from apps.donations.models import Donation


class Match(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        ACCEPTED = "accepted", "Accepted"
        REJECTED = "rejected", "Rejected"
        COMPLETED = "completed", "Completed"

    donation = models.ForeignKey(Donation, on_delete=models.CASCADE, related_name="matches")
    ngo = models.ForeignKey(User, on_delete=models.CASCADE, related_name="matches")
    score = models.FloatField()

    # Score breakdown
    distance_score = models.FloatField(default=0)
    urgency_score = models.FloatField(default=0)
    quantity_score = models.FloatField(default=0)
    reliability_score = models.FloatField(default=0)

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    matched_at = models.DateTimeField(auto_now_add=True)
    responded_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-score"]

    def __str__(self):
        return f"Match: {self.donation} → {self.ngo.username} (score={self.score:.2f})"