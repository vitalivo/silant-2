from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TechniqueModelViewSet, EngineModelViewSet, TransmissionModelViewSet,
    DriveAxleModelViewSet, SteerAxleModelViewSet, MaintenanceTypeViewSet,
    FailureNodeViewSet, RecoveryMethodViewSet
)

app_name = 'directories'

router = DefaultRouter()
router.register(r'technique-models', TechniqueModelViewSet)
router.register(r'engine-models', EngineModelViewSet)
router.register(r'transmission-models', TransmissionModelViewSet)
router.register(r'drive-axle-models', DriveAxleModelViewSet)
router.register(r'steer-axle-models', SteerAxleModelViewSet)
router.register(r'maintenance-types', MaintenanceTypeViewSet)
router.register(r'failure-nodes', FailureNodeViewSet)
router.register(r'recovery-methods', RecoveryMethodViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
