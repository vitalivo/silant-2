#!/usr/bin/env python
"""
Скрипт для создания миграций после изменения моделей
"""
import os
import sys
import django

# Настройка Django
sys.path.append('/workspaces/silant-project')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'silant.settings')
django.setup()

from django.core.management import execute_from_command_line

def create_migrations():
    print("🔄 СОЗДАНИЕ МИГРАЦИЙ")
    
    # Создаем миграции для всех приложений
    apps = ['directories', 'machines', 'maintenance', 'complaints']
    
    for app in apps:
        print(f"\n📦 Создание миграций для {app}...")
        try:
            execute_from_command_line(['manage.py', 'makemigrations', app])
            print(f"✅ Миграции для {app} созданы")
        except Exception as e:
            print(f"❌ Ошибка создания миграций для {app}: {e}")
    
    print("\n🚀 Применение миграций...")
    try:
        execute_from_command_line(['manage.py', 'migrate'])
        print("✅ Миграции применены")
    except Exception as e:
        print(f"❌ Ошибка применения миграций: {e}")

if __name__ == "__main__":
    create_migrations()
