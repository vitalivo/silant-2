from rest_framework import serializers
from .models import Machine
from accounts.models import User
from maintenance.models import Maintenance


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
        # ИСПРАВЛЕНО: Указываем конкретные поля вместо '__all__'
        fields = [
            'id',
            'serial_number',
            'technique_model_name',
            'technique_model_description',
            'engine_model_name', 
            'engine_model_description',
            'engine_serial',
            'transmission_model_name',
            'transmission_model_description', 
            'transmission_serial',
            'drive_axle_model_name',
            'drive_axle_model_description',
            'drive_axle_serial',
            'steer_axle_model_name',
            'steer_axle_model_description',
            'steer_axle_serial',
            'supply_contract',
            'shipment_date',
            'consignee',
            'delivery_address',
            'equipment',
            'client_name',  # Только имя клиента
            'service_organization_name',  # Только имя сервисной организации
            # Исключаем: 'client', 'service_organization', 'technique_model', 'engine_model', etc.
        ]
    
    def get_client_name(self, obj):
        """Безопасное получение имени клиента"""
        try:
            if obj.client:
                # Проверяем, есть ли профиль клиента
                if hasattr(obj.client, 'client_profile'):
                    return obj.client.client_profile.company_name
                else:
                    return f"{obj.client.first_name} {obj.client.last_name}".strip()
            return "Не указан"
        except Exception:
            return "Клиент не найден"
    
    def get_service_organization_name(self, obj):
        """Безопасное получение названия сервисной организации"""
        try:
            if obj.service_organization:
                # Проверяем, есть ли профиль сервисной организации
                if hasattr(obj.service_organization, 'service_profile'):
                    return obj.service_organization.service_profile.organization_name
                else:
                    return f"{obj.service_organization.first_name} {obj.service_organization.last_name}".strip()
            return "Не указана"
        except Exception:
            return "Сервисная организация не найдена"

class MachineSerializer(serializers.ModelSerializer):
    """Базовый сериализатор машины"""
    
    class Meta:
        model = Machine
        fields = '__all__'
