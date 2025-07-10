from django.db import models

class Directory(models.Model):
    """
    Справочник для хранения различных типов данных
    """
    entity_name = models.CharField(max_length=100, verbose_name='Название сущности')
    name = models.CharField(max_length=200, verbose_name='Название')
    description = models.TextField(blank=True, verbose_name='Описание')
    
    class Meta:
        verbose_name = 'Справочник'
        verbose_name_plural = 'Справочники'
        unique_together = ['entity_name', 'name']
    
    def __str__(self):
        return f"{self.entity_name}: {self.name}"

class TechniqueModel(models.Model):
    """Модель техники"""
    name = models.CharField(max_length=100, unique=True, verbose_name='Название')
    description = models.TextField(blank=True, verbose_name='Описание')
    
    class Meta:
        verbose_name = 'Модель техники'
        verbose_name_plural = 'Модели техники'
    
    def __str__(self):
        return self.name

class EngineModel(models.Model):
    """Модель двигателя"""
    name = models.CharField(max_length=100, unique=True, verbose_name='Название')
    description = models.TextField(blank=True, verbose_name='Описание')
    
    class Meta:
        verbose_name = 'Модель двигателя'
        verbose_name_plural = 'Модели двигателей'
    
    def __str__(self):
        return self.name

class TransmissionModel(models.Model):
    """Модель трансмиссии"""
    name = models.CharField(max_length=100, unique=True, verbose_name='Название')
    description = models.TextField(blank=True, verbose_name='Описание')
    
    class Meta:
        verbose_name = 'Модель трансмиссии'
        verbose_name_plural = 'Модели трансмиссий'
    
    def __str__(self):
        return self.name

class DriveAxleModel(models.Model):
    """Модель ведущего моста"""
    name = models.CharField(max_length=100, unique=True, verbose_name='Название')
    description = models.TextField(blank=True, verbose_name='Описание')
    
    class Meta:
        verbose_name = 'Модель ведущего моста'
        verbose_name_plural = 'Модели ведущих мостов'
    
    def __str__(self):
        return self.name

class SteerAxleModel(models.Model):
    """Модель управляемого моста"""
    name = models.CharField(max_length=100, unique=True, verbose_name='Название')
    description = models.TextField(blank=True, verbose_name='Описание')
    
    class Meta:
        verbose_name = 'Модель управляемого моста'
        verbose_name_plural = 'Модели управляемых мостов'
    
    def __str__(self):
        return self.name

class MaintenanceType(models.Model):
    """Вид ТО"""
    name = models.CharField(max_length=100, unique=True, verbose_name='Название')
    description = models.TextField(blank=True, verbose_name='Описание')
    
    class Meta:
        verbose_name = 'Вид ТО'
        verbose_name_plural = 'Виды ТО'
    
    def __str__(self):
        return self.name

class FailureNode(models.Model):
    """Узел отказа"""
    name = models.CharField(max_length=100, unique=True, verbose_name='Название')
    description = models.TextField(blank=True, verbose_name='Описание')
    
    class Meta:
        verbose_name = 'Узел отказа'
        verbose_name_plural = 'Узлы отказов'
    
    def __str__(self):
        return self.name

class RecoveryMethod(models.Model):
    """Способ восстановления"""
    name = models.CharField(max_length=100, unique=True, verbose_name='Название')
    description = models.TextField(blank=True, verbose_name='Описание')
    
    class Meta:
        verbose_name = 'Способ восстановления'
        verbose_name_plural = 'Способы восстановления'
    
    def __str__(self):
        return self.name

class ServiceCompany(models.Model):
    """Сервисная компания"""
    name = models.CharField(max_length=200, unique=True, verbose_name='Название')
    description = models.TextField(blank=True, verbose_name='Описание')
    
    class Meta:
        verbose_name = 'Сервисная компания'
        verbose_name_plural = 'Сервисные компании'
    
    def __str__(self):
        return self.name
