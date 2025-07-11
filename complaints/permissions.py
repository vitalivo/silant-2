from rest_framework import permissions

class ComplaintPermission(permissions.BasePermission):
    """
    Разрешения для рекламаций согласно таблице ролей:
    - Неавторизованные: нет доступа
    - Клиент: просмотр (только для своих машин)
    - Сервисная организация: просмотр, внесение данных (только для обслуживаемых машин)
    - Менеджер: просмотр, внесение данных (все)
    """
    
    def has_permission(self, request, view):
        # Неавторизованные пользователи НЕ имеют доступа к рекламациям
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
        
            # Клиент имеет доступ только для просмотра рекламаций своих машин
            if user.role == 'client':
                # Клиенты могут только просматривать, не создавать/редактировать
                if request.method not in permissions.SAFE_METHODS:
                    return False
                return obj.machine.client == user
        
            # Сервисная организация имеет полный доступ к рекламациям обслуживаемых машин
            if user.role == 'service':
                return obj.machine.service_organization == user
    
        return False
