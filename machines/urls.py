from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MachineViewSet

app_name = 'machines'

router = DefaultRouter()
router.register(r'machines', MachineViewSet, basename='machine')

urlpatterns = [
    path('', include(router.urls)),
]
