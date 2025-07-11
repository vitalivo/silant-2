from django.db import models
from django.conf import settings
from machines.models import Machine
from directories.models import FailureNode, RecoveryMethod, ServiceCompany

class Complaint(models.Model):
    """Модель рекламации"""
    
    # 1. Дата отказа
    failure_date = models.DateField(verbose_name='Дата отказа')
    
    # 2. Наработка, м/час
    operating_hours = models.PositiveIntegerField(verbose_name='Наработка, м/час')
    
    # 3. Узел отказа (справочник)
    failure_node = models.ForeignKey(FailureNode, on_delete=models.CASCADE, verbose_name='Узел отказа')
    
    # 4. Описание отказа
    failure_description = models.TextField(verbose_name='Описание отказа')
    
    # 5. Способ восстановления (справочник)
    recovery_method = models.ForeignKey(RecoveryMethod, on_delete=models.CASCADE, verbose_name='Способ восстановления')
    
    # 6. Используемые запасные части
    spare_parts = models.TextField(blank=True, verbose_name='Используемые запасные части')
    
    # 7. Дата восстановления
    recovery_date = models.DateField(verbose_name='Дата восстановления')
    
    # 8. Время простоя техники (расчетное поле: [п.7] - [п.1])
    downtime = models.PositiveIntegerField(verbose_name='Время простоя техники (дни)')
    
    # 9. Машина (база данных машин)
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE, verbose_name='Машина')
    
    # 10. Сервисная компания (справочник)
    service_company = models.ForeignKey(
        ServiceCompany, 
        on_delete=models.CASCADE, 
        related_name='complaint_records',
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
        verbose_name = 'Рекламация'
        verbose_name_plural = 'Рекламации'
        ordering = ['-failure_date']
    
    def save(self, *args, **kwargs):
        # Автоматический расчет времени простоя
        if self.failure_date and self.recovery_date:
            self.downtime = (self.recovery_date - self.failure_date).days
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Рекламация {self.failure_node} - {self.machine.serial_number}"
