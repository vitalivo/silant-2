#!/usr/bin/env python
"""
Скрипт для полного сброса и пересоздания базы данных
"""
import os
import sys
import django
from pathlib import Path

# Настройка Django
sys.path.append('/workspaces/silant-project')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'silant.settings')

def reset_database():
    print("🗑️  ПОЛНЫЙ СБРОС БАЗЫ ДАННЫХ")
    
    # Удаляем файл базы данных
    db_path = Path('db.sqlite3')
    if db_path.exists():
        db_path.unlink()
        print("✅ База данных удалена")
    else:
        print("ℹ️  База данных не найдена")
    
    # Удаляем файлы миграций (кроме __init__.py)
    apps_to_clean = ['machines', 'maintenance', 'complaints', 'directories', 'accounts']
    
    for app in apps_to_clean:
        migrations_dir = Path(f'apps/{app}/migrations')
        if migrations_dir.exists():
            for file in migrations_dir.glob('*.py'):
                if file.name != '__init__.py':
                    file.unlink()
                    print(f"🗑️  Удален файл миграции: {file}")
    
    print("\n🔄 База данных полностью очищена!")
    print("\n📋 Следующие шаги:")
    print("1. python manage.py makemigrations")
    print("2. python manage.py migrate")
    print("3. python manage.py create_test_data")

if __name__ == "__main__":
    reset_database()
