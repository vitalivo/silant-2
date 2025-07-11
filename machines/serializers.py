from rest_framework import serializers
from .models import Machine
from accounts.models import User

class MachinePublicSerializer(serializers.ModelSerializer):
    """Публичный сериализатор для неавторизованных пользователей"""
    technique_model_name = serializers.CharField(source='technique_model.name', read_only=True)
    engine_model_name = serializers.CharField(source='engine_model.name', read_only=True)
    transmission_model_name = serializers.CharField(source='transmission_model.name', read_only=True)
    drive_axle_model_name = serializers.CharField(source='drive_axle_model.name', read_only=True)
    steer_axle_model_name = serializers.CharField(source='steer_axle_model.name', read_only=True)
    
    class Meta:
        model = Machine
        fields = [
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

class MachineDetailSerializer(serializers.ModelSerializer):
    """Детальный сериализатор для авторизованных пользователей"""
    technique_model_name = serializers.CharField(source='technique_model.name', read_only=True)
    technique_model_description = serializers.CharField(source='technique_model.description', read_only=True)
    
    engine_model_name = serializers.CharField(source='engine_model.name', read_only=True)
    engine_model_description = serializers.CharField(source='engine_model.description', read_only=True)
    
    transmission_model_name = serializers.CharField(source='transmission_model.name', read_only=True)
    transmission_model_description = serializers.CharField(source='transmission_model.description', read_only=True)
    
    drive_axle_model_name = serializers.CharField(source='drive_axle_model.name', read_only=True)
    drive_axle_model_description = serializers.CharField(source='drive_axle_model.description', read_only=True)
    
    steer_axle_model_name = serializers.CharField(source='steer_axle_model.name', read_only=True)
    steer_axle_model_description = serializers.CharField(source='steer_axle_model.description', read_only=True)
    
    client_name = serializers.SerializerMethodField()
    service_organization_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Machine
        fields = '__all__'
    
    def get_client_name(self, obj):
        """Безопасное получение имени клиента"""
        try:
            if obj.client:
                return f"{obj.client.first_name} {obj.client.last_name}".strip()
            return "Не указан"
        except Exception:
            return "Клиент не найден"
    
    def get_service_organization_name(self, obj):
        """Безопасное получение названия сервисной организации"""
        try:
            if obj.service_organization:
                return f"{obj.service_organization.first_name} {obj.service_organization.last_name}".strip()
            return "Не указана"
        except Exception:
            return "Сервисная организация не найдена"

class MachineSerializer(serializers.ModelSerializer):
    """Базовый сериализатор машины"""
    
    class Meta:
        model = Machine
        fields = '__all__'
