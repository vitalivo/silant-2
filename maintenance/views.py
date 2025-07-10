from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Maintenance
from .serializers import MaintenanceSerializer

class MaintenancePermission(permissions.BasePermission):
    """
    Разрешения для ТО:
    - Только авторизованные пользователи могут просматривать ТО
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated

class MaintenanceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Maintenance.objects.select_related(
        'machine', 'maintenance_type', 'service_company'
    ).all()
    serializer_class = MaintenanceSerializer
    permission_classes = [MaintenancePermission]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['maintenance_type', 'machine', 'service_company']
    search_fields = ['work_order_number', 'machine__serial_number']
    ordering_fields = ['maintenance_date', 'operating_hours']
    ordering = ['-maintenance_date']  # Сортировка по дате ТО по умолчанию

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Фильтрация по пользователю
        user_groups = self.request.user.groups.values_list('name', flat=True)
        
        if 'Клиенты' in user_groups:
            # Клиент видит ТО только своих машин
            queryset = queryset.filter(machine__client=self.request.user)
        elif 'Сервисные организации' in user_groups:
            # Сервисная организация видит ТО машин, которые она обслуживает
            queryset = queryset.filter(service_company=self.request.user)
        
        return queryset
