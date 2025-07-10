from rest_framework import serializers
from .models import Complaint
from machines.serializers import MachinePublicSerializer
from directories.serializers import FailureNodeSerializer, RecoveryMethodSerializer

class ComplaintSerializer(serializers.ModelSerializer):
    machine = MachinePublicSerializer(read_only=True)
    failure_node = FailureNodeSerializer(read_only=True)
    recovery_method = RecoveryMethodSerializer(read_only=True)
    machine_serial = serializers.CharField(source='machine.serial_number', read_only=True)
    service_company_name = serializers.CharField(source='service_company.name', read_only=True)
    
    class Meta:
        model = Complaint
        fields = [
            'id', 'failure_date', 'operating_hours', 'failure_node',
            'failure_description', 'recovery_method', 'spare_parts',
            'recovery_date', 'downtime', 'machine', 'machine_serial',
            'service_company_name'
        ]
