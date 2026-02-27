from rest_framework import generics, permissions, filters
from .models import Donation
from .serializers import DonationSerializer


class IsDonorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.donor == request.user


class DonationListCreateView(generics.ListCreateAPIView):
    serializer_class = DonationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "food_type", "dietary_notes"]
    ordering_fields = ["created_at", "expiry_time", "quantity_kg"]

    def get_queryset(self):
        qs = Donation.objects.select_related("donor")
        status = self.request.query_params.get("status")
        food_type = self.request.query_params.get("food_type")
        if status:
            qs = qs.filter(status=status)
        if food_type:
            qs = qs.filter(food_type=food_type)
        return qs


class DonationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Donation.objects.select_related("donor")
    serializer_class = DonationSerializer
    permission_classes = [permissions.IsAuthenticated, IsDonorOrReadOnly]


class MyDonationsView(generics.ListAPIView):
    serializer_class = DonationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Donation.objects.filter(donor=self.request.user)