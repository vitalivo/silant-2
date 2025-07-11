from django.contrib import admin
from .models import Machine

@admin.register(Machine)
class MachineAdmin(admin.ModelAdmin):
    list_display = [
        'serial_number',
        'technique_model',  # Исправлено название поля
        'engine_model',
        'client',
        'service_organization',  # Исправлено название поля
        'shipment_date'
    ]
    list_filter = [
        'technique_model',  # Исправлено название поля
        'engine_model',
        'transmission_model',
        'service_organization',  # Исправлено название поля
        'shipment_date'
    ]
    search_fields = [
        'serial_number',
        'engine_serial',
        'transmission_serial'
    ]
    readonly_fields = []
    
    fieldsets = (
        ('Основная информация', {
            'fields': (
                'serial_number',
                'technique_model',
                'engine_model',
                'engine_serial',
                'transmission_model',
                'transmission_serial',
                'drive_axle_model',
                'drive_axle_serial',
                'steer_axle_model',
                'steer_axle_serial',
            )
        }),
        ('Дополнительная информация', {
            'fields': (
                'supply_contract',
                'shipment_date',
                'consignee',
                'delivery_address',
                'equipment',
            )
        }),
        ('Связи', {
            'fields': (
                'client',
                'service_organization',
            )
        }),
    )
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        # Менеджер видит все машины
        if hasattr(request.user, 'role') and request.user.role == 'manager':
            return qs
        # Клиент видит только свои машины
        elif hasattr(request.user, 'role') and request.user.role == 'client':
            return qs.filter(client=request.user)
        # Сервисная организация видит обслуживаемые машины
        elif hasattr(request.user, 'role') and request.user.role == 'service':
            return qs.filter(service_organization=request.user)
        return qs
