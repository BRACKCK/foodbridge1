from rest_framework import permissions, serializers
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Badge, UserBadge, PointLog
from apps.users.models import User

POINT_VALUES = {
    "donation_posted": 10,
    "match_accepted": 20,
    "delivery_completed": 30,
    "streak_bonus": 15,
}

BADGE_THRESHOLDS = [
    (50,  "First Steps",    "🌱", "Earn your first 50 points"),
    (150, "Food Hero",      "🦸", "Earn 150 points"),
    (300, "Community Star", "⭐", "Earn 300 points"),
    (500, "Legend",         "🏆", "Earn 500 points"),
]


def award_points(user, action, description=""):
    points = POINT_VALUES.get(action, 0)
    if points == 0:
        return 0
    PointLog.objects.create(user=user, action=action, points=points, description=description)
    user.points += points
    user.save(update_fields=["points"])
    _check_badges(user)
    return points


def _check_badges(user):
    for threshold, name, icon, desc in BADGE_THRESHOLDS:
        if user.points >= threshold:
            badge, _ = Badge.objects.get_or_create(
                name=name,
                defaults={"description": desc, "icon": icon, "points_required": threshold}
            )
            UserBadge.objects.get_or_create(user=user, badge=badge)


def _get_level(points):
    levels = [
        (0,   "Newcomer",    "🤝"),
        (50,  "Contributor", "🌱"),
        (150, "Champion",    "🦸"),
        (300, "Hero",        "⭐"),
        (500, "Legend",      "🏆"),
    ]
    current = levels[0]
    for threshold, name, icon in levels:
        if points >= threshold:
            current = (threshold, name, icon)
    return {"name": current[1], "icon": current[2], "points": points}


# --- Serializers ---
class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = ["id", "name", "description", "icon", "points_required"]


class UserBadgeSerializer(serializers.ModelSerializer):
    badge = BadgeSerializer()

    class Meta:
        model = UserBadge
        fields = ["badge", "earned_at"]


class PointLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = PointLog
        fields = ["action", "points", "description", "created_at"]


# --- Views ---
class MyGamificationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        badges = UserBadge.objects.filter(user=user).select_related("badge")
        logs = PointLog.objects.filter(user=user).order_by("-created_at")[:20]
        return Response({
            "points": user.points,
            "level": _get_level(user.points),
            "badges": UserBadgeSerializer(badges, many=True).data,
            "recent_activity": PointLogSerializer(logs, many=True).data,
        })


class LeaderboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        top_users = User.objects.order_by("-points")[:10].values(
            "id", "username", "role", "points"
        )
        return Response(list(top_users))