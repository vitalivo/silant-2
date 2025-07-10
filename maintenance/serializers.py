from rest_framework import serializers
from .models import Maintenance
from machines.serializers import MachinePublicSerializer
from directories.serializers import MaintenanceTypeSerializer

class MaintenanceSerializer(serializers.ModelSerializer):
    machine = MachinePublicSerializer(read_only=True)
    maintenance_type = MaintenanceTypeSerializer(read_only=True)
    machine_serial = serializers.CharField(source='machine.serial_number', read_only=True)
    service_company_name = serializers.CharField(source='service_company.name', read_only=True)
    
    class Meta:
        model = Maintenance
        fields = [
            'id', 'maintenance_type', 'maintenance_date', 'operating_hours',
            'work_order_number', 'work_order_date', 'maintenance_company',
            'machine', 'machine_serial', 'service_company_name'
        ]
