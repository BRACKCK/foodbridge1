from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    # Auth
    path("api/auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # Apps
    path("api/users/", include("apps.users.urls")),
    path("api/donations/", include("apps.donations.urls")),
    path("api/matching/", include("apps.matching.urls")),
    path("api/volunteers/", include("apps.volunteers.urls")),
    path("api/gamification/", include("apps.gamification.urls")),
    path("api/impact/", include("apps.impact.urls")),
    path("api/analytics/", include("apps.analytics.urls")),
]