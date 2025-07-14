import pandas as pd
from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group
from datetime import datetime
from directories.models import (
    TechniqueModel, EngineModel, TransmissionModel,
    DriveAxleModel, SteerAxleModel, MaintenanceType,
    FailureNode, RecoveryMethod, ServiceCompany
)
from machines.models import Machine
from maintenance.models import Maintenance
from complaints.models import Complaint
from accounts.models import User, ClientProfile, ServiceOrganizationProfile

class Command(BaseCommand):
    help = 'Load data from Excel file (FINAL VERSION with correct models)'

    def add_arguments(self, parser):
        parser.add_argument('filename', type=str, help='Excel filename to load')

    def handle(self, *args, **options):
        filename = options['filename']
        self.stdout.write(f'Загружаем данные из Excel файла: {filename}')
        
        try:
            # Создаем группы пользователей
            self.create_user_groups()
            
            # Загружаем данные из листа "машины"
            self.load_machines_data(filename)
            
            # Загружаем данные из листа "ТО output"
            self.load_maintenance_data(filename)
            
            # Загружаем данные из листа "рекламация output"
            self.load_complaints_data(filename)
            
            self.stdout.write(self.style.SUCCESS('Данные успешно загружены!'))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Ошибка при загрузке: {e}'))
            import traceback
            traceback.print_exc()

    def create_user_groups(self):
        """Создание групп пользователей"""
        groups = ['Клиенты', 'Сервисные организации', 'Менеджеры']
        for group_name in groups:
            group, created = Group.objects.get_or_create(name=group_name)
            if created:
                self.stdout.write(f'Создана группа: {group_name}')

    def load_machines_data(self, filename):
        """Загрузка данных о машинах"""
        self.stdout.write('Загружаем данные о машинах...')
        
        # Читаем лист "машины"
        df = pd.read_excel(filename, sheet_name='машины')
        
        # Выводим столбцы для проверки
        self.stdout.write('Доступные столбцы:')
        for i, col in enumerate(df.columns):
            self.stdout.write(f'{i}: "{col}"')
        
        for index, row in df.iterrows():
            try:
                # Используем доступ по индексу столбцов
                technique_name = str(df.iloc[index, 1])  # Модель техники
                engine_name = str(df.iloc[index, 3])     # Модель двигателя
                transmission_name = str(df.iloc[index, 5])  # Модель трансмиссии
                drive_axle_name = str(df.iloc[index, 7])    # Модель ведущего моста
                steer_axle_name = str(df.iloc[index, 9])    # Модель управляемого моста
                service_company_name = str(df.iloc[index, 16])  # Сервисная компания
                serial_number = str(df.iloc[index, 2])      # Зав. № машины
                buyer_name = str(df.iloc[index, 12])  # Покупатель
                
                self.stdout.write(f'Обрабатываем машину {serial_number}...')
                
                # Создаем или получаем модели из справочников
                technique_model, created = TechniqueModel.objects.get_or_create(
                    name=technique_name,
                    defaults={'description': ''}
                )
                if created:
                    self.stdout.write(f'  Создана модель техники: {technique_name}')
                
                engine_model, created = EngineModel.objects.get_or_create(
                    name=engine_name,
                    defaults={'description': ''}
                )
                if created:
                    self.stdout.write(f'  Создана модель двигателя: {engine_name}')
                
                transmission_model, created = TransmissionModel.objects.get_or_create(
                    name=transmission_name,
                    defaults={'description': ''}
                )
                if created:
                    self.stdout.write(f'  Создана модель трансмиссии: {transmission_name}')
                
                drive_axle_model, created = DriveAxleModel.objects.get_or_create(
                    name=drive_axle_name,
                    defaults={'description': ''}
                )
                if created:
                    self.stdout.write(f'  Создана модель ведущего моста: {drive_axle_name}')
                
                steer_axle_model, created = SteerAxleModel.objects.get_or_create(
                    name=steer_axle_name,
                    defaults={'description': ''}
                )
                if created:
                    self.stdout.write(f'  Создана модель управляемого моста: {steer_axle_name}')
                
                # Создаем клиента как пользователя с ролью 'client'
                client_username = f"client_{serial_number}"
                client, created = User.objects.get_or_create(
                    username=client_username,
                    defaults={
                        'first_name': buyer_name[:30],
                        'is_active': True,
                        'role': 'client'
                    }
                )
                
                # Создаем профиль клиента
                if created:
                    ClientProfile.objects.get_or_create(
                        user=client,
                        defaults={'company_name': buyer_name}
                    )
                    client_group = Group.objects.get(name='Клиенты')
                    client.groups.add(client_group)
                    self.stdout.write(f'  Создан клиент: {client_username}')
                
                # Создаем сервисную организацию как пользователя с ролью 'service'
                service_username = f"service_{service_company_name.replace(' ', '_').lower()}"
                service_user, created = User.objects.get_or_create(
                    username=service_username,
                    defaults={
                        'first_name': service_company_name[:30],
                        'is_active': True,
                        'role': 'service'
                    }
                )
                
                # Создаем профиль сервисной организации
                if created:
                    ServiceOrganizationProfile.objects.get_or_create(
                        user=service_user,
                        defaults={'organization_name': service_company_name}
                    )
                    service_group = Group.objects.get(name='Сервисные организации')
                    service_user.groups.add(service_group)
                    self.stdout.write(f'  Создана сервисная организация: {service_username}')
                
                # Создаем запись в справочнике ServiceCompany (для ТО и рекламаций)
                service_company, created = ServiceCompany.objects.get_or_create(
                    name=service_company_name,
                    defaults={'description': ''}
                )
                if created:
                    self.stdout.write(f'  Создана запись в справочнике: {service_company_name}')
                
                # Получаем дату отгрузки
                shipment_date = df.iloc[index, 11].date()  # Дата отгрузки с завода
                
                # Создаем машину с правильными связями
                machine, created = Machine.objects.get_or_create(
                    serial_number=serial_number,
                    defaults={
                        'technique_model': technique_model,
                        'engine_model': engine_model,
                        'engine_serial': str(df.iloc[index, 4]),   # Зав. № двигателя
                        'transmission_model': transmission_model,
                        'transmission_serial': str(df.iloc[index, 6]),  # Зав. № трансмиссии
                        'drive_axle_model': drive_axle_model,
                        'drive_axle_serial': str(df.iloc[index, 8]),    # Зав. № ведущего моста
                        'steer_axle_model': steer_axle_model,
                        'steer_axle_serial': str(df.iloc[index, 10]),   # Зав. № управляемого моста
                        'supply_contract': f"Договор с {buyer_name}",
                        'shipment_date': shipment_date,
                        'consignee': str(df.iloc[index, 13]),      # Грузополучатель
                        'delivery_address': str(df.iloc[index, 14]), # Адрес поставки
                        'equipment': str(df.iloc[index, 15]),      # Комплектация
                        'client': client,  # Связываем с пользователем-клиентом
                        'service_organization': service_user,  # Связываем с пользователем-сервисом
                    }
                )
                
                if created:
                    self.stdout.write(f'✓ Создана машина: {machine.serial_number}')
                else:
                    self.stdout.write(f'- Машина {machine.serial_number} уже существует')
                    
            except Exception as e:
                self.stdout.write(f'✗ Ошибка при создании машины в строке {index + 1}: {e}')
                import traceback
                traceback.print_exc()

    def load_maintenance_data(self, filename):
        """Загрузка данных о ТО"""
        self.stdout.write('\nЗагружаем данные о ТО...')
        
        df = pd.read_excel(filename, sheet_name='ТО output')
        
        for index, row in df.iterrows():
            try:
                # Находим машину - используем доступ по индексу
                serial_number = str(df.iloc[index, 0])  # Зав. № машины
                machine = Machine.objects.get(serial_number=serial_number)
                
                # Создаем или получаем тип ТО
                maintenance_type_name = str(df.iloc[index, 1])  # Вид ТО
                maintenance_type, created = MaintenanceType.objects.get_or_create(
                    name=maintenance_type_name,
                    defaults={'description': ''}
                )
                if created:
                    self.stdout.write(f'  Создан тип ТО: {maintenance_type_name}')
                
                # Получаем даты
                maintenance_date = df.iloc[index, 2].date()  # Дата проведения ТО
                work_order_date = df.iloc[index, 5].date()   # дата заказ-наряда
                
                # Получаем ServiceCompany из справочника
                service_company = None
                if machine.service_organization and hasattr(machine.service_organization, 'service_profile'):
                    service_company_name = machine.service_organization.service_profile.organization_name
                    service_company, _ = ServiceCompany.objects.get_or_create(
                        name=service_company_name,
                        defaults={'description': ''}
                    )
                
                # Создаем ТО
                maintenance, created = Maintenance.objects.get_or_create(
                    machine=machine,
                    maintenance_date=maintenance_date,
                    work_order_number=str(df.iloc[index, 4]),  # № заказ-наряда
                    defaults={
                        'maintenance_type': maintenance_type,
                        'operating_hours': int(df.iloc[index, 3]),  # Наработка, м/час
                        'work_order_date': work_order_date,
                        'maintenance_company': str(df.iloc[index, 6]),  # Организация, проводившая ТО
                        'service_company': service_company,  # ServiceCompany из справочника
                        'created_by': machine.service_organization,  # Связываем с пользователем-сервисом
                    }
                )
                
                if created:
                    self.stdout.write(f'✓ Создано ТО для машины: {machine.serial_number}')
                    
            except Machine.DoesNotExist:
                self.stdout.write(f'✗ Машина {serial_number} не найдена')
            except Exception as e:
                self.stdout.write(f'✗ Ошибка при создании ТО в строке {index + 1}: {e}')

    def load_complaints_data(self, filename):
        """Загрузка данных о рекламациях"""
        self.stdout.write('\nЗагружаем данные о рекламациях...')
        
        df = pd.read_excel(filename, sheet_name='рекламация output')
        
        for index, row in df.iterrows():
            try:
                # Находим машину - используем доступ по индексу
                serial_number = str(df.iloc[index, 0])  # Зав. № машины
                machine = Machine.objects.get(serial_number=serial_number)
                
                # Создаем или получаем узел отказа
                failure_node_name = str(df.iloc[index, 3])  # Узел отказа
                failure_node, created = FailureNode.objects.get_or_create(
                    name=failure_node_name,
                    defaults={'description': ''}
                )
                if created:
                    self.stdout.write(f'  Создан узел отказа: {failure_node_name}')
                
                # Создаем или получаем способ восстановления
                recovery_method_name = str(df.iloc[index, 5])  # Способ восстановления
                recovery_method, created = RecoveryMethod.objects.get_or_create(
                    name=recovery_method_name,
                    defaults={'description': ''}
                )
                if created:
                    self.stdout.write(f'  Создан способ восстановления: {recovery_method_name}')
                
                # Получаем даты
                failure_date = df.iloc[index, 1].date()    # Дата отказа
                recovery_date = df.iloc[index, 7].date()   # Дата восстановления
                
                # Обрабатываем запасные части (может быть пустым)
                spare_parts = df.iloc[index, 6]  # Используемые запасные части
                if pd.isna(spare_parts):
                    spare_parts = ''
                else:
                    spare_parts = str(spare_parts)
                
                # Получаем ServiceCompany из справочника
                service_company = None
                if machine.service_organization and hasattr(machine.service_organization, 'service_profile'):
                    service_company_name = machine.service_organization.service_profile.organization_name
                    service_company, _ = ServiceCompany.objects.get_or_create(
                        name=service_company_name,
                        defaults={'description': ''}
                    )
                
                # Создаем рекламацию
                complaint, created = Complaint.objects.get_or_create(
                    machine=machine,
                    failure_date=failure_date,
                    failure_node=failure_node,
                    defaults={
                        'operating_hours': int(df.iloc[index, 2]),  # Наработка, м/час
                        'failure_description': str(df.iloc[index, 4]),  # Описание отказа
                        'recovery_method': recovery_method,
                        'spare_parts': spare_parts,
                        'recovery_date': recovery_date,
                        'downtime': int(df.iloc[index, 8]),  # Время простоя техники
                        'service_company': service_company,  # ServiceCompany из справочника
                        'created_by': machine.service_organization,  # Связываем с пользователем-сервисом
                    }
                )
                
                if created:
                    self.stdout.write(f'✓ Создана рекламация для машины: {machine.serial_number}')
                    
            except Machine.DoesNotExist:
                self.stdout.write(f'✗ Машина {serial_number} не найдена')
            except Exception as e:
                self.stdout.write(f'✗ Ошибка при создании рекламации в строке {index + 1}: {e}')
