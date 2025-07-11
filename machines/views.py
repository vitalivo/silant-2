from rest_framework import viewsets
from .models import Machine
from .serializers import MachinePublicSerializer, MachineDetailSerializer
from .permissions import MachinePermission

class MachineViewSet(viewsets.ModelViewSet):
    queryset = Machine.objects.all()
    permission_classes = [MachinePermission]
    
    def get_serializer_class(self):
        # Для неавторизованных пользователей используем ограниченный сериализатор
        if not self.request.user.is_authenticated:
            return MachinePublicSerializer
        # Для авторизованных - полный сериализатор
        return MachineDetailSerializer
    
    def get_queryset(self):
        """
        Фильтрация машин в зависимости от роли пользователя
        """
        user = self.request.user
    
        # Неавторизованные пользователи видят все машины (но ограниченные поля)
        if not user.is_authenticated:
            return Machine.objects.all()
    
        # Проверяем, есть ли у пользователя атрибут role и методы ролей
        if hasattr(user, 'role'):
            # Менеджер видит все машины
            if user.role == 'manager':
                return Machine.objects.all()
        
            # Клиент видит только свои машины
            if user.role == 'client':
                return Machine.objects.filter(client=user)
        
            # Сервисная организация видит обслуживаемые машины
            if user.role == 'service':
                return Machine.objects.filter(service_organization=user)
    
        # Суперпользователь видит все машины
        if user.is_superuser:
            return Machine.objects.all()
    
        # По умолчанию показываем все машины
        return Machine.objects.all()
