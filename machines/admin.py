from django.contrib import admin
from .models import Machine

@admin.register(Machine)
class MachineAdmin(admin.ModelAdmin):
    list_display = [
        'serial_number',
        'technique_model',
        'engine_model',
        'client_display',  # ИЗМЕНЕНО: вместо 'client'
        'service_organization_display',  # ИЗМЕНЕНО: вместо 'service_organization'
        'shipment_date'
    ]
    list_filter = [
        'technique_model',
        'engine_model',
        'transmission_model',
        'service_organization',
        'shipment_date'
    ]
    search_fields = [
        'serial_number',
        'engine_serial',
        'transmission_serial',
        # ДОБАВЛЕНО: поиск по именам клиентов и сервисных организаций
        'client__first_name',
        'client__client_profile__company_name',
        'service_organization__first_name',
        'service_organization__service_profile__organization_name',
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
    
    # ДОБАВЛЕНО: Методы для отображения имен вместо ID
    def client_display(self, obj):
        """Отображение имени клиента"""
        if obj.client:
            if hasattr(obj.client, 'client_profile') and obj.client.client_profile:
                return obj.client.client_profile.company_name
            else:
                return f"{obj.client.first_name} {obj.client.last_name}".strip() or obj.client.username
        return '-'
    client_display.short_description = 'Клиент'
    client_display.admin_order_field = 'client__client_profile__company_name'
    
    def service_organization_display(self, obj):
        """Отображение названия сервисной организации"""
        if obj.service_organization:
            if hasattr(obj.service_organization, 'service_profile') and obj.service_organization.service_profile:
                return obj.service_organization.service_profile.organization_name
            else:
                return f"{obj.service_organization.first_name} {obj.service_organization.last_name}".strip() or obj.service_organization.username
        return '-'
    service_organization_display.short_description = 'Сервисная организация'
    service_organization_display.admin_order_field = 'service_organization__service_profile__organization_name'
    
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
