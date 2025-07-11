from django.contrib import admin
from .models import Complaint

@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = [
        'machine',
        'failure_node',
        'failure_date',
        'recovery_date',
        'downtime',
        'created_by'
    ]
    list_filter = [
        'failure_node',
        'recovery_method',
        'failure_date',
        'service_company'
    ]
    search_fields = [
        'machine__serial_number',
        'failure_description'
    ]
    readonly_fields = ['created_by', 'downtime']
    
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
