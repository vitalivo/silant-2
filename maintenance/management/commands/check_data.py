from django.core.management.base import BaseCommand
from maintenance.models import Maintenance
from complaints.models import Complaint
from machines.models import Machine
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Проверка данных в базе'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("=== ПРОВЕРКА ДАННЫХ В БАЗЕ ==="))
        
        # Проверяем пользователей
        users = User.objects.all()
        self.stdout.write(f"\n📊 Всего пользователей: {users.count()}")
        
        for user in users:
            groups = list(user.groups.values_list('name', flat=True))
            self.stdout.write(f"  👤 {user.username} | {user.get_full_name()} | Группы: {groups}")
        
        # Проверяем машины
        machines = Machine.objects.all()
        self.stdout.write(f"\n🚛 Всего машин: {machines.count()}")
        
        if machines.exists():
            machine = machines.first()
            self.stdout.write(f"  Пример машины: {machine.serial_number}")
            self.stdout.write(f"  Клиент: {machine.client}")
            self.stdout.write(f"  Сервисная компания: {machine.service_company}")
        
        # Проверяем ТО
        maintenance = Maintenance.objects.all()
        self.stdout.write(f"\n🔧 Всего записей ТО: {maintenance.count()}")
        
        if maintenance.exists():
            for i, m in enumerate(maintenance[:3], 1):
                self.stdout.write(f"  ТО #{i}:")
                self.stdout.write(f"    Машина: {m.machine}")
                self.stdout.write(f"    Сервисная компания: {m.service_company}")
                self.stdout.write(f"    Тип сервисной компании: {type(m.service_company)}")
                
                # Безопасная проверка атрибутов
                if m.service_company:
                    if hasattr(m.service_company, 'get_full_name'):
                        self.stdout.write(f"    Имя (get_full_name): '{m.service_company.get_full_name()}'")
                    if hasattr(m.service_company, 'username'):
                        self.stdout.write(f"    Username: '{m.service_company.username}'")
                    if hasattr(m.service_company, 'name'):
                        self.stdout.write(f"    Name: '{m.service_company.name}'")
                    self.stdout.write(f"    Строковое представление: '{str(m.service_company)}'")
        
        # Проверяем рекламации
        complaints = Complaint.objects.all()
        self.stdout.write(f"\n📋 Всего рекламаций: {complaints.count()}")
        
        if complaints.exists():
            complaint = complaints.first()
            self.stdout.write(f"  Пример рекламации: {complaint.failure_description[:50]}...")
            self.stdout.write(f"  Машина: {complaint.machine}")
            self.stdout.write(f"  Сервисная компания: {complaint.service_company}")
            self.stdout.write(f"  Тип: {type(complaint.service_company)}")
        
        self.stdout.write(self.style.SUCCESS("\n✅ Проверка завершена!"))
