from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from .models import Complaint
from .serializers import ComplaintSerializer
from .filters import ComplaintFilter
from .permissions import ComplaintPermission

class ComplaintViewSet(viewsets.ModelViewSet):
    """ViewSet для рекламаций с учетом ролей пользователей"""
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    permission_classes = [ComplaintPermission]
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_class = ComplaintFilter
    ordering_fields = ['failure_date', 'machine__serial_number']
    ordering = ['-failure_date']  # Сортировка по умолчанию по дате отказа
    search_fields = ['machine__serial_number', 'failure_description']
    
    def get_queryset(self):
        """Фильтрация рекламаций в зависимости от роли пользователя"""
        user = self.request.user
        queryset = Complaint.objects.all()
        
        if not user.is_authenticated:
            return queryset.none()
        
        if hasattr(user, 'role'):
            if user.role == 'client':
                # Клиент видит рекламации только своих машин
                queryset = queryset.filter(machine__client=user)
            elif user.role == 'service':
                # Сервисная компания видит рекламации машин, которые она обслуживает
                queryset = queryset.filter(service_company=user)
            elif user.role == 'manager':
                # Менеджер видит все рекламации
                pass
        
        return queryset
    
    def perform_create(self, serializer):
        """Автоматически устанавливаем создателя при создании рекламации"""
        serializer.save(created_by=self.request.user)