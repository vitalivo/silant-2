from rest_framework import permissions

class ComplaintPermission(permissions.BasePermission):
    """Разрешения для рекламаций в зависимости от роли пользователя"""
    
    def has_permission(self, request, view):
        # Только авторизованные пользователи имеют доступ к рекламациям
        return request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True
        
        if hasattr(request.user, 'role'):
            if request.user.role == 'manager':
                return True
            elif request.user.role == 'client':
                # Клиент имеет доступ только к рекламациям своих машин
                return obj.machine.client == request.user
            elif request.user.role == 'service':
                # Сервисная компания имеет доступ к рекламациям машин, которые она обслуживает
                return obj.service_company == request.user
        
        return False