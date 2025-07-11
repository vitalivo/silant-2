from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Complaint
from .serializers import ComplaintSerializer
from .permissions import ComplaintPermission

class ComplaintViewSet(viewsets.ModelViewSet):
    queryset = Complaint.objects.select_related(
        'machine', 'failure_node', 'recovery_method', 'service_company'
    ).all()
    serializer_class = ComplaintSerializer
    permission_classes = [ComplaintPermission]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['failure_node', 'recovery_method', 'machine', 'service_company']
    search_fields = ['failure_description', 'machine__serial_number']
    ordering_fields = ['failure_date', 'operating_hours', 'downtime']
    ordering = ['-failure_date']

    def get_queryset(self):
        """
        Фильтрация рекламаций в зависимости от роли пользователя
        """
        user = self.request.user
        
        # Неавторизованные пользователи не имеют доступа
        if not user.is_authenticated:
            return Complaint.objects.none()
        
        # Суперпользователь видит все рекламации
        if user.is_superuser:
            return Complaint.objects.select_related(
                'machine', 'failure_node', 'recovery_method', 'service_company'
            )
        
        # Проверяем, есть ли у пользователя атрибут role
        if hasattr(user, 'role'):
            # Менеджер видит все рекламации
            if user.role == 'manager':
                return Complaint.objects.select_related(
                    'machine', 'failure_node', 'recovery_method', 'service_company'
                )
            
            # Клиент видит рекламации только своих машин (только просмотр)
            if user.role == 'client':
                return Complaint.objects.filter(
                    machine__client=user
                ).select_related('machine', 'failure_node', 'recovery_method', 'service_company')
            
            # Сервисная организация видит рекламации обслуживаемых машин
            if user.role == 'service':
                return Complaint.objects.filter(
                    machine__service_organization=user
                ).select_related('machine', 'failure_node', 'recovery_method', 'service_company')
        
        return Complaint.objects.none()
    
    def get_permissions(self):
        """
        Клиенты могут только просматривать рекламации
        """
        permission_classes = super().get_permissions()
        
        # Проверяем роль пользователя
        if (self.request.user.is_authenticated and 
            hasattr(self.request.user, 'role') and
            self.request.user.role == 'client' and 
            self.action not in ['list', 'retrieve']):
            # Клиенты не могут создавать/редактировать рекламации
            return [permissions.IsAdminUser()]
        
        return permission_classes
    
    def perform_create(self, serializer):
        """
        Автоматически устанавливаем создателя при создании рекламации
        """
        serializer.save(created_by=self.request.user)
