from django.core.management.base import BaseCommand
from django.test import Client
from machines.models import Machine

class Command(BaseCommand):
    help = 'Тестирование API endpoints'

    def handle(self, *args, **options):
        self.stdout.write("=== ТЕСТИРОВАНИЕ API ENDPOINTS ===")
        
        client = Client()
        
        # Проверяем список машин
        self.stdout.write("\n1. Тестируем /api/machines/")
        response = client.get('/api/machines/')
        self.stdout.write(f"Статус: {response.status_code}")
        
        # Проверяем поиск по серийному номеру (DRF action)
        self.stdout.write("\n2. Тестируем /api/machines/search_by_serial/")
        response = client.get('/api/machines/search_by_serial/?serial=17')
        self.stdout.write(f"Статус: {response.status_code}")
        if response.status_code != 200:
            self.stdout.write(f"Ошибка: {response.content.decode()}")
        
        # Проверяем тестовый endpoint
        self.stdout.write("\n3. Тестируем /api/test-search/")
        response = client.get('/api/test-search/?serial=17')
        self.stdout.write(f"Статус: {response.status_code}")
        if response.status_code == 200:
            self.stdout.write("Тестовый endpoint работает!")
        else:
            self.stdout.write(f"Ошибка: {response.content.decode()}")
        
        # Проверяем, есть ли машины в базе
        self.stdout.write(f"\n4. Машин в базе: {Machine.objects.count()}")
        if Machine.objects.filter(serial_number='17').exists():
            self.stdout.write("Машина с номером 17 найдена в базе")
        else:
            self.stdout.write("Машина с номером 17 НЕ найдена в базе")
