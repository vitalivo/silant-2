from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Complaint
from .serializers import ComplaintSerializer

class ComplaintPermission(permissions.BasePermission):
    """
    Разрешения для рекламаций:
    - Только авторизованные пользователи могут просматривать рекламации
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated

class ComplaintViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Complaint.objects.select_related(
        'machine', 'failure_node', 'recovery_method', 'service_company'
    ).all()
    serializer_class = ComplaintSerializer
    permission_classes = [ComplaintPermission]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['failure_node', 'recovery_method', 'machine', 'service_company']
    search_fields = ['failure_description', 'machine__serial_number']
    ordering_fields = ['failure_date', 'operating_hours', 'downtime']
    ordering = ['-failure_date']  # Сортировка по дате отказа по умолчанию

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Фильтрация по пользователю
        user_groups = self.request.user.groups.values_list('name', flat=True)
        
        if 'Клиенты' in user_groups:
            # Клиент видит рекламации только своих машин
            queryset = queryset.filter(machine__client=self.request.user)
        elif 'Сервисные организации' in user_groups:
            # Сервисная организация видит рекламации машин, которые она обслуживает
            queryset = queryset.filter(service_company=self.request.user)
        
        return queryset
