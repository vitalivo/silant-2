import django_filters
from .models import Maintenance
from directories.models import MaintenanceType, ServiceCompany
from machines.models import Machine

class MaintenanceFilter(django_filters.FilterSet):
    """Фильтры для таблицы ТО согласно техническому заданию"""
    
    # Вид ТО
    maintenance_type = django_filters.ModelChoiceFilter(
        queryset=MaintenanceType.objects.all(),
        field_name='maintenance_type',
        empty_label="Все виды ТО"
    )
    
    # Заводской номер машины
    machine_serial = django_filters.CharFilter(
        field_name='machine__serial_number',
        lookup_expr='icontains',
        label='Заводской номер машины'
    )
    
    # Сервисная компания
    service_company = django_filters.ModelChoiceFilter(
        queryset=ServiceCompany.objects.all(),
        field_name='service_company',
        empty_label="Все сервисные компании"
    )
    
    # Фильтрация по датам проведения ТО
    maintenance_date_from = django_filters.DateFilter(
        field_name='maintenance_date',
        lookup_expr='gte',
        label='Дата ТО от'
    )
    
    maintenance_date_to = django_filters.DateFilter(
        field_name='maintenance_date',
        lookup_expr='lte',
        label='Дата ТО до'
    )
    
    class Meta:
        model = Maintenance
        fields = [
            'maintenance_type',
            'machine_serial',
            'service_company',
            'maintenance_date_from',
            'maintenance_date_to'
        ]
