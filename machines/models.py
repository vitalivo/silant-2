from django.db import models
from django.conf import settings
from directories.models import (
    TechniqueModel, EngineModel, TransmissionModel,
    DriveAxleModel, SteerAxleModel, ServiceCompany
)

class Machine(models.Model):
    """Модель машины"""
    
    # 1. Зав. № машины
    serial_number = models.CharField(max_length=50, unique=True, verbose_name='Заводской номер машины')
    
    # 2. Модель техники (справочник)
    technique_model = models.ForeignKey(TechniqueModel, on_delete=models.CASCADE, verbose_name='Модель техники')
    
    # 3. Модель двигателя (справочник)
    engine_model = models.ForeignKey(EngineModel, on_delete=models.CASCADE, verbose_name='Модель двигателя')
    
    # 4. Зав. № двигателя
    engine_serial = models.CharField(max_length=50, verbose_name='Заводской номер двигателя')
    
    # 5. Модель трансмиссии (справочник)
    transmission_model = models.ForeignKey(TransmissionModel, on_delete=models.CASCADE, verbose_name='Модель трансмиссии')
    
    # 6. Зав. № трансмиссии
    transmission_serial = models.CharField(max_length=50, verbose_name='Заводской номер трансмиссии')
    
    # 7. Модель ведущего моста (справочник)
    drive_axle_model = models.ForeignKey(DriveAxleModel, on_delete=models.CASCADE, verbose_name='Модель ведущего моста')
    
    # 8. Зав. № ведущего моста
    drive_axle_serial = models.CharField(max_length=50, verbose_name='Заводской номер ведущего моста')
    
    # 9. Модель управляемого моста (справочник)
    steer_axle_model = models.ForeignKey(SteerAxleModel, on_delete=models.CASCADE, verbose_name='Модель управляемого моста')
    
    # 10. Зав. № управляемого моста
    steer_axle_serial = models.CharField(max_length=50, verbose_name='Заводской номер управляемого моста')
    
    # 11. Договор поставки №, дата
    supply_contract = models.CharField(max_length=200, blank=True, verbose_name='Договор поставки')
    
    # 12. Дата отгрузки с завода
    shipment_date = models.DateField(verbose_name='Дата отгрузки с завода')
    
    # 13. Грузополучатель (конечный потребитель)
    consignee = models.CharField(max_length=200, blank=True, verbose_name='Грузополучатель')
    
    # 14. Адрес поставки (эксплуатации)
    delivery_address = models.TextField(blank=True, verbose_name='Адрес поставки')
    
    # 15. Комплектация (доп. опции)
    equipment = models.TextField(blank=True, verbose_name='Комплектация')
    
    # 16. Клиент (кастомная модель пользователя)
    client = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL,  # Изменено с CASCADE на SET_NULL
        related_name='owned_machines',
        null=True, 
        blank=True,
        verbose_name='Клиент'
    )
    
    # 17. Сервисная организация (кастомная модель пользователя)
    service_organization = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,  # Изменено с CASCADE на SET_NULL
        related_name='serviced_machines',
        null=True,
        blank=True,
        verbose_name='Сервисная организация'
    )
    
    class Meta:
        verbose_name = 'Машина'
        verbose_name_plural = 'Машины'
        ordering = ['-shipment_date']
    
    def __str__(self):
        return f"Машина №{self.serial_number}"
