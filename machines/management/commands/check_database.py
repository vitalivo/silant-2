from django.core.management.base import BaseCommand
from accounts.models import User, ClientProfile, ServiceOrganizationProfile
from machines.models import Machine
from maintenance.models import Maintenance
from complaints.models import Complaint
from directories.models import (
    TechniqueModel, EngineModel, TransmissionModel,
    DriveAxleModel, SteerAxleModel, MaintenanceType,
    FailureNode, RecoveryMethod, ServiceCompany, Directory
)

class Command(BaseCommand):
    help = 'Проверка состояния базы данных'

    def handle(self, *args, **options):
        self.stdout.write('📊 Состояние базы данных:\n')
        
        # Основные данные
        self.stdout.write('🏭 Основные данные:')
        self.stdout.write(f'  Машины: {Machine.objects.count()}')
        self.stdout.write(f'  ТО: {Maintenance.objects.count()}')
        self.stdout.write(f'  Рекламации: {Complaint.objects.count()}')
        
        # Пользователи
        self.stdout.write('\n👥 Пользователи:')
        total_users = User.objects.count()
        superusers = User.objects.filter(is_superuser=True).count()
        regular_users = total_users - superusers
        self.stdout.write(f'  Всего пользователей: {total_users}')
        self.stdout.write(f'  Суперпользователи: {superusers}')
        self.stdout.write(f'  Обычные пользователи: {regular_users}')
        
        # Пользователи по ролям
        clients = User.objects.filter(role='client').count()
        services = User.objects.filter(role='service').count()
        managers = User.objects.filter(role='manager').count()
        no_role = User.objects.filter(role__isnull=True).count()
        
        self.stdout.write(f'  Клиенты: {clients}')
        self.stdout.write(f'  Сервисные организации: {services}')
        self.stdout.write(f'  Менеджеры: {managers}')
        self.stdout.write(f'  Без роли: {no_role}')
        
        # Профили
        self.stdout.write('\n📋 Профили:')
        self.stdout.write(f'  Профили клиентов: {ClientProfile.objects.count()}')
        self.stdout.write(f'  Профили сервисных организаций: {ServiceOrganizationProfile.objects.count()}')
        
        # Справочники
        self.stdout.write('\n📚 Справочники:')
        self.stdout.write(f'  Модели техники: {TechniqueModel.objects.count()}')
        self.stdout.write(f'  Модели двигателей: {EngineModel.objects.count()}')
        self.stdout.write(f'  Модели трансмиссий: {TransmissionModel.objects.count()}')
        self.stdout.write(f'  Модели ведущих мостов: {DriveAxleModel.objects.count()}')
        self.stdout.write(f'  Модели управляемых мостов: {SteerAxleModel.objects.count()}')
        self.stdout.write(f'  Типы ТО: {MaintenanceType.objects.count()}')
        self.stdout.write(f'  Узлы отказов: {FailureNode.objects.count()}')
        self.stdout.write(f'  Способы восстановления: {RecoveryMethod.objects.count()}')
        self.stdout.write(f'  Сервисные компании: {ServiceCompany.objects.count()}')
        self.stdout.write(f'  Общий справочник: {Directory.objects.count()}')
        
        # Проверка связей в машинах
        self.stdout.write('\n🔗 Связи в машинах:')
        machines_with_client = Machine.objects.filter(client__isnull=False).count()
        machines_with_service = Machine.objects.filter(service_organization__isnull=False).count()
        machines_without_client = Machine.objects.filter(client__isnull=True).count()
        machines_without_service = Machine.objects.filter(service_organization__isnull=True).count()
        
        self.stdout.write(f'  Машины с клиентом: {machines_with_client}')
        self.stdout.write(f'  Машины с сервисной организацией: {machines_with_service}')
        self.stdout.write(f'  Машины БЕЗ клиента: {machines_without_client}')
        self.stdout.write(f'  Машины БЕЗ сервисной организации: {machines_without_service}')
        
        if machines_without_client > 0 or machines_without_service > 0:
            self.stdout.write(
                self.style.WARNING(
                    '\n⚠️  Обнаружены машины без связей! Возможно, нужно перезагрузить данные.'
                )
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(
                    '\n✅ Все машины имеют необходимые связи!'
                )
            )
