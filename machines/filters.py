import django_filters
from .models import Machine
from directories.models import (
    TechniqueModel, EngineModel, TransmissionModel,
    DriveAxleModel, SteerAxleModel
)

class MachineFilter(django_filters.FilterSet):
    """Фильтры для таблицы машин согласно техническому заданию"""
    
    # Фильтрация по моделям (справочники)
    technique_model = django_filters.ModelChoiceFilter(
        queryset=TechniqueModel.objects.all(),
        field_name='technique_model',
        empty_label="Все модели техники"
    )
    
    engine_model = django_filters.ModelChoiceFilter(
        queryset=EngineModel.objects.all(),
        field_name='engine_model',
        empty_label="Все модели двигателей"
    )
    
    transmission_model = django_filters.ModelChoiceFilter(
        queryset=TransmissionModel.objects.all(),
        field_name='transmission_model',
        empty_label="Все модели трансмиссий"
    )
    
    drive_axle_model = django_filters.ModelChoiceFilter(
        queryset=DriveAxleModel.objects.all(),
        field_name='drive_axle_model',
        empty_label="Все модели ведущих мостов"
    )
    
    steer_axle_model = django_filters.ModelChoiceFilter(
        queryset=SteerAxleModel.objects.all(),
        field_name='steer_axle_model',
        empty_label="Все модели управляемых мостов"
    )
    
    # Поиск по серийному номеру
    serial_number = django_filters.CharFilter(
        field_name='serial_number',
        lookup_expr='icontains',
        label='Заводской номер машины'
    )
    
    # Фильтрация по датам отгрузки
    shipment_date_from = django_filters.DateFilter(
        field_name='shipment_date',
        lookup_expr='gte',
        label='Дата отгрузки от'
    )
    
    shipment_date_to = django_filters.DateFilter(
        field_name='shipment_date',
        lookup_expr='lte',
        label='Дата отгрузки до'
    )
    
    class Meta:
        model = Machine
        fields = [
            'technique_model',
            'engine_model', 
            'transmission_model',
            'drive_axle_model',
            'steer_axle_model',
            'serial_number',
            'shipment_date_from',
            'shipment_date_to'
        ]
