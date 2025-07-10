from rest_framework import serializers
from .models import (
    TechniqueModel, EngineModel, TransmissionModel,
    DriveAxleModel, SteerAxleModel, MaintenanceType,
    FailureNode, RecoveryMethod, ServiceCompany
)

class TechniqueModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = TechniqueModel
        fields = ['id', 'name', 'description']

class EngineModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = EngineModel
        fields = ['id', 'name', 'description']

class TransmissionModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransmissionModel
        fields = ['id', 'name', 'description']

class DriveAxleModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriveAxleModel
        fields = ['id', 'name', 'description']

class SteerAxleModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = SteerAxleModel
        fields = ['id', 'name', 'description']

class MaintenanceTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaintenanceType
        fields = ['id', 'name', 'description']

class FailureNodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FailureNode
        fields = ['id', 'name', 'description']

class RecoveryMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecoveryMethod
        fields = ['id', 'name', 'description']

class ServiceCompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCompany
        fields = ['id', 'name', 'description']
