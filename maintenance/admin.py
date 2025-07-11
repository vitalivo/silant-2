from django.contrib import admin
from .models import Maintenance

@admin.register(Maintenance)
class MaintenanceAdmin(admin.ModelAdmin):
    list_display = [
        'machine',
        'maintenance_type',
        'maintenance_date',
        'operating_hours',
        'work_order_number',
        'created_by'
    ]
    list_filter = [
        'maintenance_type',
        'maintenance_date',
        'service_company'
    ]
    search_fields = [
        'machine__serial_number',
        'work_order_number'
    ]
    readonly_fields = ['created_by']
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        # Менеджер видит все ТО
        if hasattr(request.user, 'role') and request.user.role == 'manager':
            return qs
        # Клиент видит ТО только своих машин
        elif hasattr(request.user, 'role') and request.user.role == 'client':
            return qs.filter(machine__client=request.user)
        # Сервисная организация видит ТО обслуживаемых машин
        elif hasattr(request.user, 'role') and request.user.role == 'service':
            return qs.filter(machine__service_organization=request.user)
        return qs
    
    def save_model(self, request, obj, form, change):
        if not change:  # Только при создании
            obj.created_by = request.user
        super().save_model(request, obj, form, change)
