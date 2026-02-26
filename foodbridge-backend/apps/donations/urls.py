from django.urls import path
from .views import DonationListCreateView, DonationDetailView, MyDonationsView

urlpatterns = [
    path("", DonationListCreateView.as_view(), name="donations-list"),
    path("<int:pk>/", DonationDetailView.as_view(), name="donation-detail"),
    path("mine/", MyDonationsView.as_view(), name="my-donations"),
]
