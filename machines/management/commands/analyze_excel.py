import pandas as pd
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Analyze Excel file before loading data'

    def add_arguments(self, parser):
        parser.add_argument('filename', type=str, help='Excel filename to analyze')

    def handle(self, *args, **options):
        filename = options['filename']
        self.stdout.write(f'Анализируем Excel файл: {filename}')
        
        try:
            # Читаем Excel файл и получаем все листы
            excel_file = pd.ExcelFile(filename)
            
            self.stdout.write(f'\nНайдено листов в файле: {len(excel_file.sheet_names)}')
            self.stdout.write('Названия листов:')
            for i, sheet_name in enumerate(excel_file.sheet_names, 1):
                self.stdout.write(f'{i}. "{sheet_name}"')
            
            # Анализируем каждый лист
            for sheet_name in excel_file.sheet_names:
                self.analyze_sheet(excel_file, sheet_name)
                
        except Exception as e:
            self.stdout.write(f'Ошибка при анализе файла: {e}')

    def analyze_sheet(self, excel_file, sheet_name):
        """Анализ конкретного листа"""
        self.stdout.write(f'\n{"="*50}')
        self.stdout.write(f'АНАЛИЗ ЛИСТА: "{sheet_name}"')
        self.stdout.write(f'{"="*50}')
        
        try:
            df = pd.read_excel(excel_file, sheet_name=sheet_name)
            
            self.stdout.write(f'Количество строк: {len(df)}')
            self.stdout.write(f'Количество столбцов: {len(df.columns)}')
            
            self.stdout.write('\nНазвания столбцов:')
            for i, col in enumerate(df.columns, 1):
                self.stdout.write(f'{i}. "{col}"')
            
            self.stdout.write('\nПервые 3 строки данных:')
            for index, row in df.head(3).iterrows():
                self.stdout.write(f'\n--- Строка {index + 1} ---')
                for col in df.columns:
                    value = row[col]
                    if pd.isna(value):
                        value = "ПУСТО"
                    self.stdout.write(f'  {col}: {value}')
            
            # Проверяем на пустые значения
            self.stdout.write('\nПроверка на пустые значения:')
            for col in df.columns:
                null_count = df[col].isnull().sum()
                if null_count > 0:
                    self.stdout.write(f'  {col}: {null_count} пустых значений')
            
            # Показываем типы данных
            self.stdout.write('\nТипы данных столбцов:')
            for col in df.columns:
                self.stdout.write(f'  {col}: {df[col].dtype}')
                
        except Exception as e:
            self.stdout.write(f'Ошибка при анализе листа {sheet_name}: {e}')