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
        
        # Пока возвращаем все машины для авторизованных пользователей
        # Позже добавим фильтрацию по ролям
        return Machine.objects.all()
