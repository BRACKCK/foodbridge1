from rest_framework import generics, permissions, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone

from .models import Delivery


class DeliverySerializer(serializers.ModelSerializer):
    volunteer_name = serializers.CharField(source="volunteer.username", read_only=True)
    donation_title = serializers.CharField(source="match.donation.title", read_only=True)

    class Meta:
        model = Delivery
        fields = [
            "id", "match", "donation_title", "volunteer", "volunteer_name",
            "status", "notes", "assigned_at", "picked_up_at", "delivered_at",
        ]
        read_only_fields = ["assigned_at", "picked_up_at", "delivered_at"]


class MyDeliveriesView(generics.ListAPIView):
    serializer_class = DeliverySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Delivery.objects.filter(
            volunteer=self.request.user
        ).select_related("match__donation", "volunteer")


class UpdateDeliveryStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, delivery_id):
        try:
            delivery = Delivery.objects.get(pk=delivery_id, volunteer=request.user)
        except Delivery.DoesNotExist:
            return Response({"error": "Delivery not found."}, status=404)

        new_status = request.data.get("status")
        valid = {
            "picked_up": ("assigned",),
            "delivered": ("picked_up",),
            "failed": ("assigned", "picked_up"),
        }

        if new_status not in valid:
            return Response({"error": f"Invalid status. Choose: {list(valid.keys())}"}, status=400)

        if delivery.status not in valid[new_status]:
            return Response({"error": f"Cannot move from '{delivery.status}' to '{new_status}'."}, status=400)

        delivery.status = new_status
        if new_status == "picked_up":
            delivery.picked_up_at = timezone.now()
        elif new_status == "delivered":
            delivery.delivered_at = timezone.now()
            delivery.match.donation.status = "delivered"
            delivery.match.donation.save()
            delivery.match.status = "completed"
            delivery.match.save()
        delivery.save()

        return Response(DeliverySerializer(delivery).data)