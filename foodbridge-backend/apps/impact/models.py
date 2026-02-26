from django.db import models
from apps.donations.models import Donation

# Environmental constants per kg of food rescued
CO2_PER_KG = 2.5        # kg of CO2 saved
WATER_PER_KG = 1000     # litres of water saved
MEALS_PER_KG = 2.5      # average meals per kg


class ImpactLog(models.Model):
    donation = models.OneToOneField(Donation, on_delete=models.CASCADE, related_name="impact")
    quantity_kg = models.DecimalField(max_digits=8, decimal_places=2)
    co2_saved_kg = models.DecimalField(max_digits=10, decimal_places=2)
    water_saved_litres = models.DecimalField(max_digits=12, decimal_places=2)
    meals_equivalent = models.DecimalField(max_digits=8, decimal_places=1)
    calculated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Impact: {self.quantity_kg}kg → {self.co2_saved_kg}kg CO2 saved"


def calculate_and_save_impact(donation):
    kg = float(donation.quantity_kg)
    log, _ = ImpactLog.objects.update_or_create(
        donation=donation,
        defaults={
            "quantity_kg": kg,
            "co2_saved_kg": round(kg * CO2_PER_KG, 2),
            "water_saved_litres": round(kg * WATER_PER_KG, 2),
            "meals_equivalent": round(kg * MEALS_PER_KG, 1),
        }
    )
    return log