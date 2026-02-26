from django.urls import path
from .views import MyDeliveriesView, UpdateDeliveryStatusView

urlpatterns = [
    path("", MyDeliveriesView.as_view(), name="my-deliveries"),
    path("<int:delivery_id>/status/", UpdateDeliveryStatusView.as_view(), name="update-delivery"),
]