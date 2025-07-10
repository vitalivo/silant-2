from rest_framework import serializers
from .models import Machine
from directories.serializers import (
    TechniqueModelSerializer, EngineModelSerializer, TransmissionModelSerializer,
    DriveAxleModelSerializer, SteerAxleModelSerializer
)


class MachinePublicSerializer(serializers.ModelSerializer):
    """Сериализатор для неавторизованных пользователей (поля 1-10)"""
    technique_model_name = serializers.CharField(source='technique_model.name', read_only=True)
    engine_model_name = serializers.CharField(source='engine_model.name', read_only=True)
    transmission_model_name = serializers.CharField(source='transmission_model.name', read_only=True)
    drive_axle_model_name = serializers.CharField(source='drive_axle_model.name', read_only=True)
    steer_axle_model_name = serializers.CharField(source='steer_axle_model.name', read_only=True)
    
    class Meta:
        model = Machine
        fields = [
            'id',
            'serial_number',
            'technique_model_name',
            'engine_model_name',
            'engine_serial',
            'transmission_model_name',
            'transmission_serial',
            'drive_axle_model_name',
            'drive_axle_serial',
            'steer_axle_model_name',
            'steer_axle_serial',
        ]
        read_only_fields = fields  # Все поля только для чтения


class MachineDetailSerializer(serializers.ModelSerializer):
    """Полный сериализатор для авторизованных пользователей"""
    technique_model = TechniqueModelSerializer(read_only=True)
    engine_model = EngineModelSerializer(read_only=True)
    transmission_model = TransmissionModelSerializer(read_only=True)
    drive_axle_model = DriveAxleModelSerializer(read_only=True)
    steer_axle_model = SteerAxleModelSerializer(read_only=True)
    client_name = serializers.SerializerMethodField()
    service_company_name = serializers.CharField(source='service_company.name', read_only=True)
    
    class Meta:
        model = Machine
        fields = [
            'id', 'serial_number', 'technique_model', 'engine_model', 
            'engine_serial', 'transmission_model', 'transmission_serial',
            'drive_axle_model', 'drive_axle_serial', 'steer_axle_model', 
            'steer_axle_serial', 'supply_contract', 'shipment_date',
            'consignee', 'delivery_address', 'equipment', 'client_name',
            'service_company_name'
        ]
    
    def get_client_name(self, obj):
        """Получаем имя клиента"""
        if obj.client:
            if hasattr(obj.client, 'get_full_name'):
                full_name = obj.client.get_full_name()
                return full_name if full_name.strip() else obj.client.username
            else:
                return str(obj.client)
        return None
