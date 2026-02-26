from django.urls import path
from .views import MyGamificationView, LeaderboardView

urlpatterns = [
    path("me/", MyGamificationView.as_view(), name="my-gamification"),
    path("leaderboard/", LeaderboardView.as_view(), name="leaderboard"),
]