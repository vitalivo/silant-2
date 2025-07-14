from django.core.management.base import BaseCommand
from directories.models import (
    Directory, TechniqueModel, EngineModel, TransmissionModel,
    DriveAxleModel, SteerAxleModel, MaintenanceType,
    FailureNode, RecoveryMethod, ServiceCompany
)

class Command(BaseCommand):
    help = 'Проверка данных в справочниках'

    def handle(self, *args, **options):
        self.stdout.write('📚 Проверяем данные в справочниках:\n')
        
        # Проверяем каждый справочник
        directories_data = [
            ('Общий справочник', Directory),
            ('Модели техники', TechniqueModel),
            ('Модели двигателей', EngineModel),
            ('Модели трансмиссий', TransmissionModel),
            ('Модели ведущих мостов', DriveAxleModel),
            ('Модели управляемых мостов', SteerAxleModel),
            ('Типы ТО', MaintenanceType),
            ('Узлы отказов', FailureNode),
            ('Способы восстановления', RecoveryMethod),
            ('Сервисные компании', ServiceCompany),
        ]
        
        total_empty = 0
        total_with_data = 0
        
        for name, model in directories_data:
            count = model.objects.count()
            if count == 0:
                self.stdout.write(f'❌ {name}: {count} записей (ПУСТО)')
                total_empty += 1
            else:
                self.stdout.write(f'✅ {name}: {count} записей')
                total_with_data += 1
                
                # Показываем первые 3 записи
                first_records = model.objects.all()[:3]
                for record in first_records:
                    self.stdout.write(f'   - {record}')
                if count > 3:
                    self.stdout.write(f'   ... и еще {count - 3} записей')
        
        self.stdout.write(f'\n📊 ИТОГО:')
        self.stdout.write(f'  Справочников с данными: {total_with_data}')
        self.stdout.write(f'  Пустых справочников: {total_empty}')
        
        if total_empty > 0:
            self.stdout.write(
                self.style.WARNING(
                    f'\n⚠️  Обнаружено {total_empty} пустых справочников!'
                    f'\nДанные должны были загрузиться при выполнении команды load_excel_data_final'
                )
            )
            self.stdout.write(
                '\n🔧 Для исправления выполните:'
                '\n1. python manage.py clear_database --confirm'
                '\n2. python manage.py load_excel_data_final silant_data.xlsx'
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(
                    '\n🎉 Все справочники содержат данные!'
                )
            )
