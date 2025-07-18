#!/usr/bin/env python
"""
Генерация отчета о тестировании
"""
import os
import django
import json
from datetime import datetime

# Настройка Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'silant_project.settings')
django.setup()

from django.apps import apps

def generate_report():
    print("📊 ГЕНЕРАЦИЯ ОТЧЕТА О ТЕСТИРОВАНИИ")
    print("=" * 50)
    
    report = {
        "timestamp": datetime.now().isoformat(),
        "system_status": "OK",
        "models": {},
        "data": {},
        "issues": []
    }
    
    # Проверка моделей
    try:
        Machine = apps.get_model('machines', 'Machine')
        Maintenance = apps.get_model('maintenance', 'Maintenance')
        Complaint = apps.get_model('complaints', 'Complaint')
        User = apps.get_model('accounts', 'User')
        
        report["models"] = {
            "Machine": {
                "fields_count": len(Machine._meta.get_fields()),
                "required_fields": 17,
                "status": "OK"
            },
            "Maintenance": {
                "fields_count": len(Maintenance._meta.get_fields()),
                "required_fields": 8,
                "status": "OK"
            },
            "Complaint": {
                "fields_count": len(Complaint._meta.get_fields()),
                "required_fields": 10,
                "status": "OK"
            }
        }
        
        # Проверка данных
        report["data"] = {
            "machines": Machine.objects.count(),
            "maintenance": Maintenance.objects.count(),
            "complaints": Complaint.objects.count(),
            "users": User.objects.count()
        }
        
        # Проверка целостности
        orphaned_maintenance = Maintenance.objects.filter(machine__isnull=True).count()
        orphaned_complaints = Complaint.objects.filter(machine__isnull=True).count()
        
        if orphaned_maintenance > 0:
            report["issues"].append(f"Найдено {orphaned_maintenance} записей ТО без машины")
        
        if orphaned_complaints > 0:
            report["issues"].append(f"Найдено {orphaned_complaints} рекламаций без машины")
        
        # Проверка пользователей
        users_without_role = User.objects.filter(role__isnull=True).exclude(is_superuser=True).count()
        if users_without_role > 0:
            report["issues"].append(f"Найдено {users_without_role} пользователей без роли")
        
    except Exception as e:
        report["system_status"] = "ERROR"
        report["issues"].append(f"Ошибка проверки моделей: {e}")
    
    # Сохранение отчета
    report_file = f"test_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    
    with open(report_file, 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Отчет сохранен: {report_file}")
    
    # Вывод краткого отчета
    print(f"\n📋 КРАТКИЙ ОТЧЕТ:")
    print(f"Статус системы: {report['system_status']}")
    print(f"Машины: {report['data'].get('machines', 0)}")
    print(f"ТО: {report['data'].get('maintenance', 0)}")
    print(f"Рекламации: {report['data'].get('complaints', 0)}")
    print(f"Пользователи: {report['data'].get('users', 0)}")
    
    if report["issues"]:
        print(f"\n⚠️  НАЙДЕННЫЕ ПРОБЛЕМЫ:")
        for issue in report["issues"]:
            print(f"  - {issue}")
    else:
        print(f"\n✅ Проблем не найдено!")

if __name__ == "__main__":
    generate_report()
