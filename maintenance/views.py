from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Maintenance
from .serializers import MaintenanceSerializer
from .permissions import MaintenancePermission

class MaintenanceViewSet(viewsets.ModelViewSet):
    queryset = Maintenance.objects.select_related(
        'machine', 'maintenance_type', 'service_company'
    ).all()
    serializer_class = MaintenanceSerializer
    permission_classes = [MaintenancePermission]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['maintenance_type', 'machine', 'service_company']
    search_fields = ['work_order_number', 'machine__serial_number']
    ordering_fields = ['maintenance_date', 'operating_hours']
    ordering = ['-maintenance_date']

    def get_queryset(self):
        """
        Фильтрация ТО в зависимости от роли пользователя
        """
        user = self.request.user
        
        # Неавторизованные пользователи не имеют доступа
        if not user.is_authenticated:
            return Maintenance.objects.none()
        
        # Суперпользователь видит все ТО
        if user.is_superuser:
            return Maintenance.objects.select_related(
                'machine', 'maintenance_type', 'service_company'
            )
        
        # Проверяем, есть ли у пользователя атрибут role
        if hasattr(user, 'role'):
            # Менеджер видит все ТО
            if user.role == 'manager':
                return Maintenance.objects.select_related(
                    'machine', 'maintenance_type', 'service_company'
                )
            
            # Клиент видит ТО только своих машин
            if user.role == 'client':
                return Maintenance.objects.filter(
                    machine__client=user
                ).select_related('machine', 'maintenance_type', 'service_company')
            
            # Сервисная организация видит ТО обслуживаемых машин
            if user.role == 'service':
                return Maintenance.objects.filter(
                    machine__service_organization=user
                ).select_related('machine', 'maintenance_type', 'service_company')
    
        return Maintenance.objects.none()
    
    def perform_create(self, serializer):
        """
        Автоматически устанавливаем создателя при создании ТО
        """
        serializer.save(created_by=self.request.user)
