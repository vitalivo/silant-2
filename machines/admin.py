from django.contrib import admin
from .models import Machine

@admin.register(Machine)
class MachineAdmin(admin.ModelAdmin):
    list_display = [
        'serial_number', 'technique_model', 'shipment_date', 
        'client', 'service_company'
    ]
    list_filter = [
        'technique_model', 'engine_model', 'shipment_date', 
        'service_company'
    ]
    search_fields = ['serial_number', 'consignee']
    date_hierarchy = 'shipment_date'
    ordering = ['-shipment_date']