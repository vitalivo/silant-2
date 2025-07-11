from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from .models import Machine
from .serializers import MachinePublicSerializer, MachineDetailSerializer
from .permissions import MachinePermission
from .filters import MachineFilter

class MachineViewSet(viewsets.ModelViewSet):
    queryset = Machine.objects.all()
    permission_classes = [MachinePermission]
    
    # Добавляем фильтрацию, поиск и сортировку
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_class = MachineFilter
    ordering_fields = ['shipment_date', 'serial_number']
    ordering = ['-shipment_date']  # Сортировка по умолчанию по дате отгрузки (по убыванию)
    search_fields = ['serial_number', 'consignee']
    
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
    
    @action(detail=False, methods=['get'], url_path='search-by-serial')
    def search_by_serial(self, request):
        """
        Поиск машины по серийному номеру для неавторизованных пользователей
        Доступно по URL: /api/machines/search-by-serial/?serial_number=123
        """
        serial_number = request.query_params.get('serial_number', '').strip()
        
        if not serial_number:
            return Response(
                {'error': 'Необходимо указать заводской номер машины'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            machine = Machine.objects.get(serial_number=serial_number)
            serializer = MachinePublicSerializer(machine)
            return Response({
                'success': True,
                'data': serializer.data
            })
        except Machine.DoesNotExist:
            return Response(
                {
                    'success': False,
                    'error': f'Данных о машине с заводским номером "{serial_number}" нет в системе'
                }, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {
                    'success': False,
                    'error': 'Произошла ошибка при поиске'
                }, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
