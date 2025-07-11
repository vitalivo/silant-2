from django.core.management.base import BaseCommand
from accounts.models import User

class Command(BaseCommand):
    help = 'Создать пользователя с ролью менеджера'

    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='Имя пользователя')
        parser.add_argument('--password', type=str, help='Пароль', default='manager123')
        parser.add_argument('--email', type=str, help='Email', default='manager@example.com')

    def handle(self, *args, **options):
        username = options['username']
        password = options['password']
        email = options['email']
        
        if User.objects.filter(username=username).exists():
            self.stdout.write(
                self.style.ERROR(f'Пользователь {username} уже существует')
            )
            return
        
        user = User.objects.create_user(
            username=username,
            password=password,
            email=email,
            role='manager',
            is_staff=True,
            is_superuser=True
        )
        
        self.stdout.write(
            self.style.SUCCESS(f'Менеджер {username} успешно создан')
        )
