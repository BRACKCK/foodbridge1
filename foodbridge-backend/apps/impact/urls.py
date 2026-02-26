from django.urls import path
from .views import TotalImpactView, MyImpactView

urlpatterns = [
    path("total/", TotalImpactView.as_view(), name="total-impact"),
    path("me/", MyImpactView.as_view(), name="my-impact"),
]