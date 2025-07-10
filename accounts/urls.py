from django.urls import path
from .views import login_view, logout_view, user_info, get_csrf_token

app_name = 'accounts'

urlpatterns = [
    path('auth/csrf/', get_csrf_token, name='csrf'),
    path('auth/login/', login_view, name='login'),
    path('auth/logout/', logout_view, name='logout'),
    path('auth/user/', user_info, name='user_info'),
]
