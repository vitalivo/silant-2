from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import (
    TechniqueModel, EngineModel, TransmissionModel,
    DriveAxleModel, SteerAxleModel, MaintenanceType,
    FailureNode, RecoveryMethod
)
from .serializers import (
    TechniqueModelSerializer, EngineModelSerializer, TransmissionModelSerializer,
    DriveAxleModelSerializer, SteerAxleModelSerializer, MaintenanceTypeSerializer,
    FailureNodeSerializer, RecoveryMethodSerializer
)

class TechniqueModelViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TechniqueModel.objects.all()
    serializer_class = TechniqueModelSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class EngineModelViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EngineModel.objects.all()
    serializer_class = EngineModelSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class TransmissionModelViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TransmissionModel.objects.all()
    serializer_class = TransmissionModelSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class DriveAxleModelViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DriveAxleModel.objects.all()
    serializer_class = DriveAxleModelSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class SteerAxleModelViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SteerAxleModel.objects.all()
    serializer_class = SteerAxleModelSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class MaintenanceTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MaintenanceType.objects.all()
    serializer_class = MaintenanceTypeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class FailureNodeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FailureNode.objects.all()
    serializer_class = FailureNodeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class RecoveryMethodViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = RecoveryMethod.objects.all()
    serializer_class = RecoveryMethodSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
