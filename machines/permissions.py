from rest_framework import permissions

class MachinePermission(permissions.BasePermission):
    """
    Разрешения для машин:
    - Неавторизованные пользователи могут только просматривать (GET)
    - Авторизованные пользователи имеют доступ в зависимости от роли
    """
    
    def has_permission(self, request, view):
        # Неавторизованные пользователи могут только просматривать
        if not request.user.is_authenticated:
            return request.method in permissions.SAFE_METHODS
        
        # Авторизованные пользователи имеют доступ в зависимости от роли
        return True
    
    def has_object_permission(self, request, view, obj):
        """
        Проверка доступа к конкретной машине
        """
        # Неавторизованные пользователи могут только просматривать
        if not request.user.is_authenticated:
            return request.method in permissions.SAFE_METHODS
        
        # Пока разрешаем доступ всем авторизованным пользователям
        # Позже добавим проверку ролей
        return True
