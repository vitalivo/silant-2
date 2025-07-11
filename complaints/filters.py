import django_filters
from .models import Complaint
from directories.models import FailureNode, RecoveryMethod, ServiceCompany

class ComplaintFilter(django_filters.FilterSet):
    """Фильтры для таблицы рекламаций согласно техническому заданию"""
    
    # Узел отказа
    failure_node = django_filters.ModelChoiceFilter(
        queryset=FailureNode.objects.all(),
        field_name='failure_node',
        empty_label="Все узлы отказов"
    )
    
    # Способ восстановления
    recovery_method = django_filters.ModelChoiceFilter(
        queryset=RecoveryMethod.objects.all(),
        field_name='recovery_method',
        empty_label="Все способы восстановления"
    )
    
    # Сервисная компания
    service_company = django_filters.ModelChoiceFilter(
        queryset=ServiceCompany.objects.all(),
        field_name='service_company',
        empty_label="Все сервисные компании"
    )
    
    # Заводской номер машины
    machine_serial = django_filters.CharFilter(
        field_name='machine__serial_number',
        lookup_expr='icontains',
        label='Заводской номер машины'
    )
    
    # Фильтрация по датам отказа
    failure_date_from = django_filters.DateFilter(
        field_name='failure_date',
        lookup_expr='gte',
        label='Дата отказа от'
    )
    
    failure_date_to = django_filters.DateFilter(
        field_name='failure_date',
        lookup_expr='lte',
        label='Дата отказа до'
    )
    
    class Meta:
        model = Complaint
        fields = [
            'failure_node',
            'recovery_method',
            'service_company',
            'machine_serial',
            'failure_date_from',
            'failure_date_to'
        ]
