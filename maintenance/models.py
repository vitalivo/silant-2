from django.db import models
from django.conf import settings
from machines.models import Machine
from directories.models import MaintenanceType, ServiceCompany

class Maintenance(models.Model):
    """Модель технического обслуживания"""
    
    # 1. Вид ТО (справочник)
    maintenance_type = models.ForeignKey(MaintenanceType, on_delete=models.CASCADE, verbose_name='Вид ТО')
    
    # 2. Дата проведения ТО
    maintenance_date = models.DateField(verbose_name='Дата проведения ТО')
    
    # 3. Наработка, м/час
    operating_hours = models.PositiveIntegerField(verbose_name='Наработка, м/час')
    
    # 4. № заказ-наряда
    work_order_number = models.CharField(max_length=100, verbose_name='№ заказ-наряда')
    
    # 5. Дата заказ-наряда
    work_order_date = models.DateField(verbose_name='Дата заказ-наряда')
    
    # 6. Организация, проводившая ТО
    maintenance_company = models.CharField(max_length=200, verbose_name='Организация, проводившая ТО')
    
    # 7. Машина (база данных машин)
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE, verbose_name='Машина')
    
    # 8. Сервисная компания (справочник)
    service_company = models.ForeignKey(
        ServiceCompany, 
        on_delete=models.CASCADE, 
        related_name='maintenance_records',
        verbose_name='Сервисная компания'
    )
    
    # Добавляем связь с пользователем для ролевого доступа
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        verbose_name='Создано пользователем',
        null=True,
        blank=True
    )
    
    class Meta:
        verbose_name = 'Техническое обслуживание'
        verbose_name_plural = 'Техническое обслуживание'
        ordering = ['-maintenance_date']
    
    def __str__(self):
        return f"ТО {self.maintenance_type} - {self.machine.serial_number}"
