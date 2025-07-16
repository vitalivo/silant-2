from django.core.management.base import BaseCommand
from accounts.models import User

class Command(BaseCommand):
    help = 'Создать тестовых пользователей с разными ролями'

    def handle(self, *args, **options):
        # Создаем клиента
        if not User.objects.filter(username='client').exists():
            client = User.objects.create_user(
                username='client',
                password='client123',
                email='client@test.com',
                role='client',
                first_name='Тестовый',
                last_name='Клиент'
            )
            self.stdout.write(
                self.style.SUCCESS('Клиент client создан (пароль: client123)')
            )
        
        # Создаем сервисную организацию
        if not User.objects.filter(username='service').exists():
            service = User.objects.create_user(
                username='service',
                password='service123',
                email='service@test.com',
                role='service',
                first_name='Тестовая',
                last_name='Сервисная организация'
            )
            self.stdout.write(
                self.style.SUCCESS('Сервисная организация service создана (пароль: service123)')
            )
        
        # Создаем менеджера
        if not User.objects.filter(username='manager').exists():
            manager = User.objects.create_user(
                username='manager',
                password='manager123',
                email='manager@test.com',
                role='manager',
                first_name='Тестовый',
                last_name='Менеджер',
                is_staff=True
            )
            self.stdout.write(
                self.style.SUCCESS('Менеджер manager создан (пароль: manager123)')
            )
        
        self.stdout.write(
            self.style.SUCCESS('Все тестовые пользователи созданы!')
        )
