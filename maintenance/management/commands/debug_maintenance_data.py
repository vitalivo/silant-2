#!/usr/bin/env python
"""
Скрипт для отладки данных о техническом обслуживании
"""
import os
import sys
import django

# Настройка Django
sys.path.append('/workspaces/silant-project')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'silant.settings')
django.setup()

from maintenance.models import Maintenance
from complaints.models import Complaint
from django.contrib.auth.models import User

def debug_maintenance():
    print("=== ОТЛАДКА ДАННЫХ ТЕХНИЧЕСКОГО ОБСЛУЖИВАНИЯ ===")
    
    # Проверяем общее количество записей
    maintenance_count = Maintenance.objects.count()
    print(f"Всего записей ТО: {maintenance_count}")
    
    if maintenance_count > 0:
        # Берем первые 5 записей для анализа
        maintenances = Maintenance.objects.select_related('service_company', 'machine').all()[:5]
        
        for i, maintenance in enumerate(maintenances, 1):
            print(f"\n--- Запись ТО #{i} ---")
            print(f"ID: {maintenance.id}")
            print(f"Вид ТО: {maintenance.maintenance_type}")
            print(f"Дата ТО: {maintenance.maintenance_date}")
            print(f"Машина: {maintenance.machine}")
            print(f"Сервисная компания (объект): {maintenance.service_company}")
            
            if maintenance.service_company:
                print(f"Сервисная компания (ID): {maintenance.service_company.id}")
                print(f"Сервисная компания (username): {maintenance.service_company.username}")
                print(f"Сервисная компания (full_name): {maintenance.service_company.get_full_name()}")
                print(f"Сервисная компания (first_name): {maintenance.service_company.first_name}")
                print(f"Сервисная компания (last_name): {maintenance.service_company.last_name}")
            else:
                print("Сервисная компания: НЕ УКАЗАНА")
    
    print("\n=== ПРОВЕРКА ПОЛЬЗОВАТЕЛЕЙ ===")
    users = User.objects.all()
    print(f"Всего пользователей: {users.count()}")
    
    for user in users:
        print(f"User ID: {user.id}, Username: {user.username}, Full name: '{user.get_full_name()}'")
        groups = user.groups.values_list('name', flat=True)
        print(f"  Группы: {list(groups)}")

def debug_complaints():
    print("\n=== ОТЛАДКА ДАННЫХ РЕКЛАМАЦИЙ ===")
    
    complaints_count = Complaint.objects.count()
    print(f"Всего рекламаций: {complaints_count}")
    
    if complaints_count > 0:
        complaints = Complaint.objects.select_related('service_company', 'machine').all()[:3]
        
        for i, complaint in enumerate(complaints, 1):
            print(f"\n--- Рекламация #{i} ---")
            print(f"ID: {complaint.id}")
            print(f"Описание: {complaint.failure_description[:50]}...")
            print(f"Машина: {complaint.machine}")
            print(f"Сервисная компания: {complaint.service_company}")
            
            if complaint.service_company:
                print(f"Сервисная компания (username): {complaint.service_company.username}")
                print(f"Сервисная компания (full_name): {complaint.service_company.get_full_name()}")

if __name__ == "__main__":
    debug_maintenance()
    debug_complaints()
