from rest_framework import permissions

class MaintenancePermission(permissions.BasePermission):
    """
    Разрешения для ТО согласно таблице ролей:
    - Неавторизованные: нет доступа
    - Клиент: просмотр, внесение данных (только для своих машин)
    - Сервисная организация: просмотр, внесение данных (только для обслуживаемых машин)
    - Менеджер: просмотр, внесение данных (все)
    """
    
    def has_permission(self, request, view):
        # Неавторизованные пользователи НЕ имеют доступа к ТО
        if not request.user.is_authenticated:
            return False
        
        # Все авторизованные пользователи имеют базовый доступ
        return True
    
    def has_object_permission(self, request, view, obj):
        user = request.user
    
        # Суперпользователь имеет полный доступ
        if user.is_superuser:
            return True
    
        # Проверяем, есть ли у пользователя атрибут role
        if hasattr(user, 'role'):
            # Менеджер имеет полный доступ
            if user.role == 'manager':
                return True
        
            # Клиент имеет доступ к ТО своих машин
            if user.role == 'client':
                return obj.machine.client == user
        
            # Сервисная организация имеет доступ к ТО обслуживаемых машин
            if user.role == 'service':
                return obj.machine.service_organization == user
    
        return False
