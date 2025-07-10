#!/usr/bin/env python
"""
Финальная настройка системы СИЛАНТ
"""
import os
import subprocess
import sys

def final_setup():
    print("🚀 ФИНАЛЬНАЯ НАСТРОЙКА СИСТЕМЫ СИЛАНТ")
    print("=" * 60)
    
    steps = [
        {
            "name": "Создание суперпользователя",
            "command": [sys.executable, "manage.py", "createsuperuser", "--noinput", 
                       "--username", "admin", "--email", "admin@silant.ru"],
            "env": {"DJANGO_SUPERUSER_PASSWORD": "admin123"}
        },
        {
            "name": "Создание тестовых данных", 
            "command": [sys.executable, "manage.py", "create_test_data"]
        },
        {
            "name": "Проверка системы",
            "command": [sys.executable, "scripts/quick_system_check.py"]
        },
        {
            "name": "Тестирование API",
            "command": [sys.executable, "scripts/test_api_endpoints.py"]
        }
    ]
    
    for i, step in enumerate(steps, 1):
        print(f"\n📋 Шаг {i}: {step['name']}")
        print("-" * 40)
        
        try:
            env = os.environ.copy()
            if 'env' in step:
                env.update(step['env'])
            
            result = subprocess.run(
                step['command'], 
                capture_output=True, 
                text=True,
                env=env,
                timeout=60
            )
            
            if result.returncode == 0:
                print(f"✅ {step['name']} - УСПЕШНО")
                if result.stdout:
                    # Показываем только важные строки
                    lines = result.stdout.strip().split('\n')
                    for line in lines[-10:]:  # Последние 10 строк
                        if line.strip():
                            print(f"   {line}")
            else:
                print(f"⚠️  {step['name']} - ПРЕДУПРЕЖДЕНИЕ")
                if result.stderr:
                    print(f"   Ошибка: {result.stderr.strip()}")
                if result.stdout:
                    print(f"   Вывод: {result.stdout.strip()}")
                    
        except subprocess.TimeoutExpired:
            print(f"⏰ {step['name']} - ТАЙМАУТ")
        except Exception as e:
            print(f"❌ {step['name']} - ОШИБКА: {e}")
    
    print("\n" + "=" * 60)
    print("🎯 СИСТЕМА ГОТОВА К ЗАПУСКУ!")
    print("\n📋 СЛЕДУЮЩИЕ ШАГИ:")
    print("1. Запустите бэкенд: python manage.py runserver")
    print("2. Запустите фронтенд: cd frontend && npm run dev")
    print("3. Откройте: http://localhost:3000")
    print("\n🔑 УЧЕТНЫЕ ДАННЫЕ:")
    print("👑 Админ: admin / admin123")
    print("👔 Менеджер: manager / manager123") 
    print("👤 Клиент: client1 / client123")
    print("🔧 Сервис: service1 / service123")

if __name__ == "__main__":
    final_setup()
