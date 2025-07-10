from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MaintenanceViewSet

app_name = 'maintenance'

router = DefaultRouter()
router.register(r'maintenance', MaintenanceViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
