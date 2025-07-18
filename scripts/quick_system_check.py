#!/usr/bin/env python
"""
Быстрая проверка системы
"""
import os
import django

# Настройка Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'silant_project.settings')
django.setup()

from django.apps import apps

def quick_check():
    print("⚡ БЫСТРАЯ ПРОВЕРКА СИСТЕМЫ")
    print("-" * 40)
    
    try:
        # Проверка основных моделей
        Machine = apps.get_model('machines', 'Machine')
        Maintenance = apps.get_model('maintenance', 'Maintenance')
        Complaint = apps.get_model('complaints', 'Complaint')
        User = apps.get_model('accounts', 'User')
        
        # Подсчет записей
        machines = Machine.objects.count()
        maintenance = Maintenance.objects.count()
        complaints = Complaint.objects.count()
        users = User.objects.count()
        
        print(f"🚛 Машины: {machines}")
        print(f"🔧 ТО: {maintenance}")
        print(f"📋 Рекламации: {complaints}")
        print(f"👥 Пользователи: {users}")
        
        # Проверка справочников
        directories = [
            'TechniqueModel', 'EngineModel', 'TransmissionModel',
            'DriveAxleModel', 'SteerAxleModel', 'MaintenanceType',
            'FailureNode', 'RecoveryMethod'
        ]
        
        print("\n📚 Справочники:")
        for directory in directories:
            try:
                model = apps.get_model('directories', directory)
                count = model.objects.count()
                print(f"  {directory}: {count}")
            except:
                print(f"  {directory}: ❌ не найден")
        
        # Общий статус
        if machines > 0 and users > 0:
            print("\n✅ Система готова к работе")
        else:
            print("\n⚠️  Система требует настройки")
            
    except Exception as e:
        print(f"❌ Ошибка: {e}")

if __name__ == "__main__":
    quick_check()
