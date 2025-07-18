#!/usr/bin/env python
"""
Полное тестирование системы
"""
import subprocess
import sys
import requests
import time

def complete_test():
    print("🧪 ПОЛНОЕ ТЕСТИРОВАНИЕ СИСТЕМЫ СИЛАНТ")
    print("=" * 60)
    
    # 1. Проверка базы данных
    print("\n1️⃣ ПРОВЕРКА БАЗЫ ДАННЫХ")
    try:
        result = subprocess.run([
            sys.executable, "manage.py", "check", "--database", "default"
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ База данных в порядке")
        else:
            print("❌ Проблемы с базой данных:")
            print(result.stderr)
    except Exception as e:
        print(f"❌ Ошибка проверки БД: {e}")
    
    # 2. Проверка моделей
    print("\n2️⃣ ПРОВЕРКА МОДЕЛЕЙ")
    try:
        result = subprocess.run([
            sys.executable, "manage.py", "check"
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Модели корректны")
        else:
            print("❌ Проблемы с моделями:")
            print(result.stderr)
    except Exception as e:
        print(f"❌ Ошибка проверки моделей: {e}")
    
    # 3. Проверка данных
    print("\n3️⃣ ПРОВЕРКА ДАННЫХ")
    try:
        subprocess.run([sys.executable, "scripts/quick_system_check.py"])
    except Exception as e:
        print(f"❌ Ошибка проверки данных: {e}")
    
    # 4. Проверка API (если сервер запущен)
    print("\n4️⃣ ПРОВЕРКА API")
    try:
        response = requests.get("http://127.0.0.1:8000/api/", timeout=5)
        if response.status_code == 200:
            print("✅ API доступно")
            
            # Тестируем основные endpoints
            endpoints = [
                "machines/",
            ]
            
            for endpoint in endpoints:
                try:
                    resp = requests.get(f"http://127.0.0.1:8000{endpoint}", timeout=5)
                    print(f"   {endpoint}: {resp.status_code}")
                except:
                    print(f"   {endpoint}: ❌")
        else:
            print(f"⚠️  API отвечает с кодом {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("⚠️  API сервер не запущен")
        print("   Запустите: python manage.py runserver")
    except Exception as e:
        print(f"❌ Ошибка проверки API: {e}")
    
    # 5. Проверка фронтенда
    print("\n5️⃣ ПРОВЕРКА ФРОНТЕНДА")
    try:
        response = requests.get("http://127.0.0.1:8000", timeout=5)
        if response.status_code == 200:
            print("✅ Фронтенд доступен")
        else:
            print(f"⚠️  Фронтенд отвечает с кодом {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("⚠️  Фронтенд сервер не запущен")
        print("   Запустите: cd frontend && npm run dev")
    except Exception as e:
        print(f"❌ Ошибка проверки фронтенда: {e}")
    
    print("\n" + "=" * 60)
    print("🎯 ТЕСТИРОВАНИЕ ЗАВЕРШЕНО!")

if __name__ == "__main__":
    complete_test()
