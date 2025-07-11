from rest_framework import serializers
from .models import Maintenance

class MaintenanceSerializer(serializers.ModelSerializer):
    machine_serial = serializers.CharField(source='machine.serial_number', read_only=True)
    machine_model = serializers.CharField(source='machine.technique_model.name', read_only=True)
    service_company_name = serializers.CharField(source='service_company.name', read_only=True)
    maintenance_type_name = serializers.CharField(source='maintenance_type.name', read_only=True)
    
    class Meta:
        model = Maintenance
        fields = [
            'id', 'maintenance_type', 'maintenance_type_name', 'maintenance_date', 
            'operating_hours', 'work_order_number', 'work_order_date', 
            'maintenance_company', 'machine', 'machine_serial', 'machine_model',
            'service_company', 'service_company_name', 'created_by'
        ]
        read_only_fields = ['created_by']
    
    def create(self, validated_data):
        """
        Валидация при создании ТО
        """
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            machine = validated_data.get('machine')
            
            # Проверяем, есть ли у пользователя атрибут role
            if hasattr(request.user, 'role'):
                # Клиент может создавать ТО только для своих машин
                if request.user.role == 'client' and machine.client != request.user:
                    raise serializers.ValidationError("Вы можете создавать ТО только для своих машин")
                
                # Сервисная организация может создавать ТО только для обслуживаемых машин
                if request.user.role == 'service' and machine.service_organization != request.user:
                    raise serializers.ValidationError("Вы можете создавать ТО только для обслуживаемых машин")
        
        return super().create(validated_data)
