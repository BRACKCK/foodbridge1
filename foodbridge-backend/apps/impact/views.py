from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Sum

from .models import ImpactLog


class TotalImpactView(APIView):
    """Platform-wide environmental impact summary."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        totals = ImpactLog.objects.aggregate(
            total_kg=Sum("quantity_kg"),
            total_co2=Sum("co2_saved_kg"),
            total_water=Sum("water_saved_litres"),
            total_meals=Sum("meals_equivalent"),
        )
        return Response({
            "food_rescued_kg": totals["total_kg"] or 0,
            "co2_saved_kg": totals["total_co2"] or 0,
            "water_saved_litres": totals["total_water"] or 0,
            "meals_provided": totals["total_meals"] or 0,
        })


class MyImpactView(APIView):
    """Personal impact for a donor."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        totals = ImpactLog.objects.filter(
            donation__donor=request.user
        ).aggregate(
            total_kg=Sum("quantity_kg"),
            total_co2=Sum("co2_saved_kg"),
            total_water=Sum("water_saved_litres"),
            total_meals=Sum("meals_equivalent"),
        )
        return Response({
            "food_rescued_kg": totals["total_kg"] or 0,
            "co2_saved_kg": totals["total_co2"] or 0,
            "water_saved_litres": totals["total_water"] or 0,
            "meals_provided": totals["total_meals"] or 0,
        })