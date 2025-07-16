from django.contrib.auth import authenticate, login, logout
from .models import User  # ✅ Импортируем кастомную модель
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from django.middleware.csrf import get_token
import json

@ensure_csrf_cookie
@require_http_methods(["GET"])
def get_csrf_token(request):
    """Получение CSRF токена"""
    return JsonResponse({'csrfToken': get_token(request)})

@csrf_exempt
@require_http_methods(["POST"])
def login_view(request):
    """Авторизация пользователя"""
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return JsonResponse({'error': 'Логин и пароль обязательны'}, status=400)
        
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            
            # Получаем группы пользователя
            groups = list(user.groups.values_list('name', flat=True))
            
            return JsonResponse({
                'success': True,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'email': user.email,
                    'role': user.role,  # ✅ Добавляем поле role
                    'groups': groups
                }
            })
        else:
            return JsonResponse({'error': 'Неверный логин или пароль'}, status=401)
    
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Неверный формат данных'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def logout_view(request):
    """Выход пользователя"""
    logout(request)
    return JsonResponse({'success': True})

@require_http_methods(["GET"])
def user_info(request):
    """Получение информации о текущем пользователе"""
    if request.user.is_authenticated:
        groups = list(request.user.groups.values_list('name', flat=True))
        return JsonResponse({
            'id': request.user.id,
            'username': request.user.username,
            'first_name': request.user.first_name,
            'last_name': request.user.last_name,
            'email': request.user.email,
            'role': request.user.role,  # ✅ Добавляем поле role
            'groups': groups
        })
    else:
        return JsonResponse({'error': 'Пользователь не авторизован'}, status=401)