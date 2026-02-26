from django.db import models
from apps.users.models import User


class Badge(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    icon = models.CharField(max_length=10, default="🏅")
    points_required = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.icon} {self.name}"


class UserBadge(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="badges")
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["user", "badge"]


class PointLog(models.Model):
    class Action(models.TextChoices):
        DONATION_POSTED = "donation_posted", "Donation Posted"
        MATCH_ACCEPTED = "match_accepted", "Match Accepted"
        DELIVERY_COMPLETED = "delivery_completed", "Delivery Completed"
        STREAK_BONUS = "streak_bonus", "Streak Bonus"

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="point_logs")
    action = models.CharField(max_length=30, choices=Action.choices)
    points = models.IntegerField()
    description = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} +{self.points} ({self.action})"