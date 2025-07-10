import pandas as pd
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Debug Excel file loading'

    def add_arguments(self, parser):
        parser.add_argument('filename', type=str, help='Excel filename to debug')

    def handle(self, *args, **options):
        filename = options['filename']
        self.stdout.write(f'Отладка Excel файла: {filename}')
        
        # Читаем лист "машины"
        df = pd.read_excel(filename, sheet_name='машины')
        
        self.stdout.write('\n=== ОТЛАДКА ПЕРВОЙ СТРОКИ ===')
        first_row = df.iloc[0]
        
        for col in df.columns:
            value = first_row[col]
            self.stdout.write(f'Столбец: "{col}" = "{value}" (тип: {type(value)})')
        
        # Попробуем получить значение по индексу
        self.stdout.write('\n=== ДОСТУП ПО ИНДЕКСУ ===')
        try:
            model_tech = df.iloc[0]['Модельтехники']
            self.stdout.write(f'Модель техники: {model_tech}')
        except Exception as e:
            self.stdout.write(f'Ошибка доступа: {e}')
        
        # Попробуем разные варианты названий
        self.stdout.write('\n=== ПРОВЕРКА ВАРИАНТОВ НАЗВАНИЙ ===')
        possible_names = ['Модельтехники', 'Модель техники', 'Модель\nтехники']
        for name in possible_names:
            if name in df.columns:
                self.stdout.write(f'Найден столбец: "{name}"')
                value = df.iloc[0][name]
                self.stdout.write(f'Значение: {value}')