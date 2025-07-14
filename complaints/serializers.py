from rest_framework import serializers
from .models import Complaint

class ComplaintSerializer(serializers.ModelSerializer):
    machine_serial = serializers.CharField(source='machine.serial_number', read_only=True)
    machine_model = serializers.CharField(source='machine.technique_model.name', read_only=True)
    service_company_name = serializers.CharField(source='service_company.name', read_only=True)
    failure_node_name = serializers.CharField(source='failure_node.name', read_only=True)
    recovery_method_name = serializers.CharField(source='recovery_method.name', read_only=True)
    
    class Meta:
        model = Complaint
        # ИСПРАВЛЕНО: Убираем поля с ID, оставляем только читаемые имена
        fields = [
            'id', 
            'failure_date', 
            'operating_hours', 
            'failure_node_name',  # Только название узла отказа
            'failure_description', 
            'recovery_method_name',  # Только название способа восстановления
            'spare_parts',
            'recovery_date', 
            'downtime', 
            'machine_serial',  # Только серийный номер машины
            'machine_model',   # Только модель машины
            'service_company_name',  # Только название сервисной компании
            # Исключаем: 'failure_node', 'recovery_method', 'machine', 'service_company', 'created_by'
        ]
        read_only_fields = ['downtime']
    
    def create(self, validated_data):
        """
        Валидация при создании рекламации
        """
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            machine = validated_data.get('machine')
            
            # Проверяем, есть ли у пользователя атрибут role
            if hasattr(request.user, 'role'):
                # Только сервисные организации и менеджеры могут создавать рекламации
                if request.user.role == 'client':
                    raise serializers.ValidationError("Клиенты не могут создавать рекламации")
                
                # Сервисная организация может создавать рекламации только для обслуживаемых машин
                if request.user.role == 'service' and machine.service_organization != request.user:
                    raise serializers.ValidationError("Вы можете создавать рекламации только для обслуживаемых машин")
        
        return super().create(validated_data)
