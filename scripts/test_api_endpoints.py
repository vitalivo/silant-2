#!/usr/bin/env python
"""
Тестирование API endpoints
"""
import requests
import json

def test_api_endpoints():
    print("🔌 ТЕСТИРОВАНИЕ API ENDPOINTS")
    print("=" * 50)
    
    base_url = "http://localhost:8000"
    
    # Список endpoints для тестирования
    endpoints = [
        # Основные данные
        ("/api/machines/", "GET", "Список машин"),
        ("/api/maintenance/", "GET", "Список ТО"),
        ("/api/complaints/", "GET", "Список рекламаций"),
        
        # Справочники
        ("/api/technique-models/", "GET", "Модели техники"),
        ("/api/engine-models/", "GET", "Модели двигателей"),
        ("/api/transmission-models/", "GET", "Модели трансмиссий"),
        ("/api/drive-axle-models/", "GET", "Модели ведущих мостов"),
        ("/api/steer-axle-models/", "GET", "Модели управляемых мостов"),
        ("/api/maintenance-types/", "GET", "Типы ТО"),
        ("/api/failure-nodes/", "GET", "Узлы отказов"),
        ("/api/recovery-methods/", "GET", "Способы восстановления"),
        
        # Аутентификация
        ("/api/auth/user/", "GET", "Информация о пользователе"),
        ("/api/auth/csrf/", "GET", "CSRF токен"),
        
        # Поиск
        ("/api/machines/search_by_serial/?serial=17", "GET", "Поиск по серийному номеру"),
    ]
    
    session = requests.Session()
    
    for endpoint, method, description in endpoints:
        try:
            url = f"{base_url}{endpoint}"
            
            if method == "GET":
                response = session.get(url, timeout=10)
            elif method == "POST":
                response = session.post(url, timeout=10)
            else:
                continue
            
            # Анализ ответа
            status_icon = "✅" if response.status_code == 200 else "⚠️" if response.status_code in [401, 403] else "❌"
            
            print(f"{status_icon} {description}")
            print(f"   URL: {endpoint}")
            print(f"   Статус: {response.status_code}")
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    if isinstance(data, dict):
                        if 'results' in data:
                            print(f"   Записей: {len(data['results'])}")
                        elif 'count' in data:
                            print(f"   Всего: {data['count']}")
                        else:
                            print(f"   Ключи: {list(data.keys())}")
                    elif isinstance(data, list):
                        print(f"   Записей: {len(data)}")
                except:
                    print(f"   Размер ответа: {len(response.content)} байт")
            elif response.status_code in [401, 403]:
                print("   (Требует авторизации)")
            else:
                print(f"   Ошибка: {response.text[:100]}")
            
            print()
            
        except requests.exceptions.ConnectionError:
            print(f"❌ {description}")
            print(f"   URL: {endpoint}")
            print("   Ошибка: Сервер недоступен")
            print()
        except Exception as e:
            print(f"❌ {description}")
            print(f"   URL: {endpoint}")
            print(f"   Ошибка: {e}")
            print()
    
    print("🎯 Тестирование API завершено!")

if __name__ == "__main__":
    test_api_endpoints()
