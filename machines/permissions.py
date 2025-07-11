from rest_framework import permissions

class MachinePermission(permissions.BasePermission):
    """
    Разрешения для машин в зависимости от роли пользователя
    """
    
    def has_permission(self, request, view):
        # Неавторизованные пользователи могут только просматривать
        if not request.user.is_authenticated:
            return request.method in permissions.SAFE_METHODS
        
        # Авторизованные пользователи имеют доступ в зависимости от роли
        return True
    
    def has_object_permission(self, request, view, obj):
        # Неавторизованные пользователи могут только просматривать
        if not request.user.is_authenticated:
            return request.method in permissions.SAFE_METHODS
    
        # Суперпользователь имеет полный доступ
        if request.user.is_superuser:
            return True
    
        # Проверяем, есть ли у пользователя атрибут role
        if hasattr(request.user, 'role'):
            # Менеджер имеет полный доступ
            if request.user.role == 'manager':
                return True
        
            # Клиент имеет доступ только к своим машинам
            if request.user.role == 'client':
                return obj.client == request.user
        
            # Сервисная организация имеет доступ к обслуживаемым машинам
            if request.user.role == 'service':
                return obj.service_organization == request.user
    
        return False
