#!/usr/bin/env python
"""
Простая проверка системы
"""
import os
import sys
import django

# Настройка Django
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'silant.settings')
django.setup()

def check_system():
    print("🔍 ПРОВЕРКА СИСТЕМЫ СИЛАНТ")
    print("=" * 40)
    
    try:
        from django.contrib.auth.models import User
        from machines.models import Machine
        from maintenance.models import Maintenance
        from complaints.models import Complaint
        
        print(f"\n📊 СТАТИСТИКА:")
        print(f"   👥 Пользователей: {User.objects.count()}")
        print(f"   🚛 Машин: {Machine.objects.count()}")
        print(f"   🔧 Записей ТО: {Maintenance.objects.count()}")
        print(f"   📋 Рекламаций: {Complaint.objects.count()}")
        
        print(f"\n👥 ПОЛЬЗОВАТЕЛИ:")
        for user in User.objects.all():
            groups = list(user.groups.values_list('name', flat=True))
            print(f"   👤 {user.username} | {user.get_full_name()} | {groups}")
        
        if Machine.objects.exists():
            print(f"\n🚛 МАШИНЫ:")
            for machine in Machine.objects.all()[:5]:
                print(f"   📱 {machine.serial_number} - {machine.technique_model}")
        
        print(f"\n✅ Система работает корректно!")
        
    except Exception as e:
        print(f"❌ Ошибка: {e}")

if __name__ == "__main__":
    check_system()
