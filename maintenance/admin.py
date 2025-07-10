from django.contrib import admin
from .models import Maintenance

@admin.register(Maintenance)
class MaintenanceAdmin(admin.ModelAdmin):
    list_display = [
        'machine', 'maintenance_type', 'maintenance_date', 
        'operating_hours', 'service_company'
    ]
    list_filter = [
        'maintenance_type', 'maintenance_date', 'service_company'
    ]
    search_fields = ['machine__serial_number', 'work_order_number']
    date_hierarchy = 'maintenance_date'
    ordering = ['-maintenance_date']