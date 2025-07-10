#!/usr/bin/env python
"""
Запуск системы СИЛАНТ
"""
import subprocess
import sys
import time
import threading
import os

def run_backend():
    """Запуск Django сервера"""
    print("🚀 Запуск Django сервера...")
    try:
        subprocess.run([sys.executable, "manage.py", "runserver", "0.0.0.0:8000"])
    except KeyboardInterrupt:
        print("\n🛑 Django сервер остановлен")

def run_frontend():
    """Запуск React сервера"""
    print("🚀 Запуск React сервера...")
    try:
        os.chdir("frontend")
        subprocess.run(["npm", "run", "dev"])
    except KeyboardInterrupt:
        print("\n🛑 React сервер остановлен")
    except FileNotFoundError:
        print("❌ npm не найден. Установите Node.js")

def start_system():
    print("🚀 ЗАПУСК СИСТЕМЫ СИЛАНТ")
    print("=" * 50)
    
    print("\n📋 Выберите режим запуска:")
    print("1. Только бэкенд (Django)")
    print("2. Только фронтенд (React)")
    print("3. Полная система (Django + React)")
    print("4. Проверка системы")
    
    choice = input("\nВведите номер (1-4): ").strip()
    
    if choice == "1":
        run_backend()
    elif choice == "2":
        run_frontend()
    elif choice == "3":
        print("\n🚀 Запуск полной системы...")
        print("📝 Для остановки нажмите Ctrl+C")
        
        # Запускаем бэкенд в отдельном потоке
        backend_thread = threading.Thread(target=run_backend, daemon=True)
        backend_thread.start()
        
        # Ждем немного для запуска бэкенда
        time.sleep(3)
        
        # Запускаем фронтенд
        run_frontend()
        
    elif choice == "4":
        subprocess.run([sys.executable, "scripts/quick_system_check.py"])
    else:
        print("❌ Неверный выбор")

if __name__ == "__main__":
    start_system()
