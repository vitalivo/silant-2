import pandas as pd
import requests
from io import StringIO

def analyze_csv_data():
    """Анализ данных из CSV файлов"""
    
    # URLs файлов
    urls = {
        'machines': 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/table1-szhyEKU1p7u1wb30XdntFriXNHzgoT.csv',
        'maintenance': 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/table2-MQCPe2lJageIdE12KZvCmDZaJAgEZr.csv',
        'complaints': 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/table3-TqiQ1BKsf9ZIxL3eVBdIbZ9jKuM1Un.csv'
    }
    
    data = {}
    
    # Загружаем и анализируем каждый файл
    for name, url in urls.items():
        print(f"\n📊 Анализ файла: {name}")
        print("=" * 50)
        
        try:
            # Загружаем данные
            response = requests.get(url)
            response.raise_for_status()
            
            # Читаем CSV
            df = pd.read_csv(StringIO(response.text))
            data[name] = df
            
            print(f"Количество строк: {len(df)}")
            print(f"Количество столбцов: {len(df.columns)}")
            print("\nСтолбцы:")
            for i, col in enumerate(df.columns):
                print(f"  {i}: '{col}'")
            
            print(f"\nПервые 3 строки:")
            print(df.head(3).to_string())
            
            # Специфический анализ для каждого типа данных
            if name == 'machines':
                print(f"\n🏭 Уникальные машины:")
                if 'Зав. № \nмашины' in df.columns:
                    unique_machines = df['Зав. № \nмашины'].nunique()
                    print(f"  Количество уникальных машин: {unique_machines}")
                    print(f"  Серийные номера: {sorted(df['Зав. № \nмашины'].unique())}")
                
                if 'Сервисная компания' in df.columns:
                    unique_services = df['Сервисная компания'].nunique()
                    print(f"  Количество сервисных компаний: {unique_services}")
                    print(f"  Сервисные компании: {df['Сервисная компания'].unique()}")
            
            elif name == 'maintenance':
                print(f"\n🔧 Анализ ТО:")
                if 'Вид ТО' in df.columns:
                    unique_types = df['Вид ТО'].nunique()
                    print(f"  Количество уникальных видов ТО: {unique_types}")
                    print(f"  Виды ТО: {df['Вид ТО'].unique()}")
                    
                    # Подсчет по видам ТО
                    print(f"\n  Распределение по видам ТО:")
                    maintenance_counts = df['Вид ТО'].value_counts()
                    for maintenance_type, count in maintenance_counts.items():
                        print(f"    {maintenance_type}: {count} записей")
                
                if 'Зав. № машины' in df.columns:
                    unique_machines_in_maintenance = df['Зав. № машины'].nunique()
                    print(f"  Количество машин с ТО: {unique_machines_in_maintenance}")
                    print(f"  Машины: {sorted(df['Зав. № машины'].unique())}")
            
            elif name == 'complaints':
                print(f"\n⚠️ Анализ рекламаций:")
                if 'Узел отказа' in df.columns:
                    unique_nodes = df['Узел отказа'].nunique()
                    print(f"  Количество уникальных узлов отказа: {unique_nodes}")
                    print(f"  Узлы отказа: {df['Узел отказа'].unique()}")
                
                if 'Зав. № машины' in df.columns:
                    unique_machines_in_complaints = df['Зав. № машины'].nunique()
                    print(f"  Количество машин с рекламациями: {unique_machines_in_complaints}")
                    print(f"  Машины: {sorted(df['Зав. № машины'].unique())}")
        
        except Exception as e:
            print(f"❌ Ошибка при обработке файла {name}: {e}")
    
    # Сводный анализ
    print(f"\n📈 СВОДНЫЙ АНАЛИЗ")
    print("=" * 50)
    
    if 'machines' in data and 'maintenance' in data and 'complaints' in data:
        machines_df = data['machines']
        maintenance_df = data['maintenance']
        complaints_df = data['complaints']
        
        print(f"Общее количество записей:")
        print(f"  Машины: {len(machines_df)}")
        print(f"  ТО: {len(maintenance_df)}")
        print(f"  Рекламации: {len(complaints_df)}")
        
        # Проверяем соответствие машин
        if 'Зав. № \nмашины' in machines_df.columns:
            machines_in_main = set(machines_df['Зав. № \nмашины'].astype(str))
        else:
            machines_in_main = set()
            
        if 'Зав. № машины' in maintenance_df.columns:
            machines_in_maintenance = set(maintenance_df['Зав. № машины'].astype(str))
        else:
            machines_in_maintenance = set()
            
        if 'Зав. № машины' in complaints_df.columns:
            machines_in_complaints = set(complaints_df['Зав. № машины'].astype(str))
        else:
            machines_in_complaints = set()
        
        print(f"\nСоответствие машин:")
        print(f"  Машины в основной таблице: {len(machines_in_main)}")
        print(f"  Машины в ТО: {len(machines_in_maintenance)}")
        print(f"  Машины в рекламациях: {len(machines_in_complaints)}")
        
        # Машины, которые есть в ТО, но нет в основной таблице
        missing_in_main = machines_in_maintenance - machines_in_main
        if missing_in_main:
            print(f"  ⚠️ Машины в ТО, но не в основной таблице: {missing_in_main}")
        
        # Машины, которые есть в рекламациях, но нет в основной таблице
        missing_complaints = machines_in_complaints - machines_in_main
        if missing_complaints:
            print(f"  ⚠️ Машины в рекламациях, но не в основной таблице: {missing_complaints}")

if __name__ == "__main__":
    analyze_csv_data()
