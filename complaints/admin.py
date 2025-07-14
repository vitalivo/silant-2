from django.contrib import admin
from .models import Complaint

@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = [
        'machine_display',  # ИЗМЕНЕНО: вместо 'machine'
        'failure_node',
        'failure_date',
        'recovery_date',
        'downtime',
        'service_company_display',  # ДОБАВЛЕНО: отображение сервисной компании
        'created_by_display'  # ИЗМЕНЕНО: вместо 'created_by'
    ]
    list_filter = [
        'failure_node',
        'recovery_method',
        'failure_date',
        'service_company'
    ]
    search_fields = [
        'machine__serial_number',
        'failure_description',
        'spare_parts'
    ]
    readonly_fields = ['created_by', 'downtime']
    
    # ДОБАВЛЕНО: Методы для отображения связанных объектов
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
    
    def created_by_display(self, obj):
        """Отображение создателя записи"""
        if obj.created_by:
            if hasattr(obj.created_by, 'service_profile') and obj.created_by.service_profile:
                return obj.created_by.service_profile.organization_name
            elif hasattr(obj.created_by, 'client_profile') and obj.created_by.client_profile:
                return obj.created_by.client_profile.company_name
            else:
                return f"{obj.created_by.first_name} {obj.created_by.last_name}".strip() or obj.created_by.username
        return '-'
    created_by_display.short_description = 'Создал'
    created_by_display.admin_order_field = 'created_by__username'
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        # Менеджер видит все рекламации
        if hasattr(request.user, 'role') and request.user.role == 'manager':
            return qs
        # Клиент видит рекламации только своих машин
        elif hasattr(request.user, 'role') and request.user.role == 'client':
            return qs.filter(machine__client=request.user)
        # Сервисная организация видит рекламации обслуживаемых машин
        elif hasattr(request.user, 'role') and request.user.role == 'service':
            return qs.filter(machine__service_organization=request.user)
        return qs
    
    def save_model(self, request, obj, form, change):
        if not change:  # Только при создании
            obj.created_by = request.user
        super().save_model(request, obj, form, change)
