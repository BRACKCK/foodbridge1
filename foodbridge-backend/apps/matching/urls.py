from django.urls import path
from .views import RunMatchingView, RespondToMatchView, MatchListView

urlpatterns = [
    path("", MatchListView.as_view(), name="match-list"),
    path("run/<int:donation_id>/", RunMatchingView.as_view(), name="run-matching"),
    path("<int:match_id>/respond/", RespondToMatchView.as_view(), name="respond-match"),
]