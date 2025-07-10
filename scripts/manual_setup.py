#!/usr/bin/env python
"""
Ручная настройка системы (исправленная версия)
"""
import os
import sys
import django

# Настройка Django
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'silant.settings')
django.setup()

from django.contrib.auth.models import User, Group
from machines.management.commands.create_test_data import Command

def manual_setup():
    print("🔧 РУЧНАЯ НАСТРОЙКА СИСТЕМЫ СИЛАНТ")
    print("=" * 50)
    
    # 1. Проверяем суперпользователя
    print("\n1️⃣ ПРОВЕРКА СУПЕРПОЛЬЗОВАТЕЛЯ")
    if User.objects.filter(username='admin').exists():
        print("✅ Суперпользователь 'admin' уже существует")
    else:
        try:
            User.objects.create_superuser(
                username='admin',
                email='admin@silant.ru',
                password='admin123'
            )
            print("✅ Суперпользователь 'admin' создан")
        except Exception as e:
            print(f"❌ Ошибка создания суперпользователя: {e}")
    
    # 2. Создаем тестовые данные
    print("\n2️⃣ СОЗДАНИЕ ТЕСТОВЫХ ДАННЫХ")
    try:
        command = Command()
        command.handle()
        print("✅ Тестовые данные созданы")
    except Exception as e:
        print(f"❌ Ошибка создания тестовых данных: {e}")
    
    # 3. Проверяем данные
    print("\n3️⃣ ПРОВЕРКА ДАННЫХ")
    try:
        from machines.models import Machine
        from maintenance.models import Maintenance
        from complaints.models import Complaint
        
        print(f"   👥 Пользователей: {User.objects.count()}")
        print(f"   🚛 Машин: {Machine.objects.count()}")
        print(f"   🔧 Записей ТО: {Maintenance.objects.count()}")
        print(f"   📋 Рекламаций: {Complaint.objects.count()}")
        
        if Machine.objects.exists():
            print("   📱 Доступные серийные номера:")
            for machine in Machine.objects.all()[:5]:
                print(f"      - {machine.serial_number}")
        
    except Exception as e:
        print(f"❌ Ошибка проверки данных: {e}")
    
    print("\n" + "=" * 50)
    print("🎯 НАСТРОЙКА ЗАВЕРШЕНА!")
    print("\n🔑 УЧЕТНЫЕ ДАННЫЕ:")
    print("👑 Админ: admin / admin123")
    print("👔 Менеджер: manager / manager123")
    print("👤 Клиент: client1 / client123")
    print("🔧 Сервис: service1 / service123")

if __name__ == "__main__":
    manual_setup()
