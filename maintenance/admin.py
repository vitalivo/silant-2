from django.contrib import admin
from .models import Maintenance

@admin.register(Maintenance)
class MaintenanceAdmin(admin.ModelAdmin):
    list_display = [
        'machine_display',
        'maintenance_type',
        'maintenance_date',
        'operating_hours',
        'work_order_number',
        'service_company_display',
        # Убрали: created_at, created_by_display
    ]
    list_filter = [
        'maintenance_type',
        'maintenance_date',
        'service_company'
    ]
    search_fields = [
        'machine__serial_number',
        'work_order_number',
        'maintenance_company'
    ]
    readonly_fields = ['created_by']
    
    def machine_display(self, obj):
        """Отображение машины с серийным номером и моделью"""
        if obj.machine:
            return f"{obj.machine.serial_number} ({obj.machine.technique_model.name})"
        return '-'
    machine_display.short_description = 'Машина'
    machine_display.admin_order_field = 'machine__serial_number'
    
    def service_company_display(self, obj):
        """Отображение названия сервисной компании"""
        return obj.service_company.name if obj.service_company else '-'
    service_company_display.short_description = 'Сервисная компания'
    service_company_display.admin_order_field = 'service_company__name'
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if hasattr(request.user, 'role') and request.user.role == 'manager':
            return qs
        elif hasattr(request.user, 'role') and request.user.role == 'client':
            return qs.filter(machine__client=request.user)
        elif hasattr(request.user, 'role') and request.user.role == 'service':
            return qs.filter(machine__service_organization=request.user)
        return qs
    
    def save_model(self, request, obj, form, change):
        if not change:  # Только при создании
            obj.created_by = request.user
        super().save_model(request, obj, form, change)
