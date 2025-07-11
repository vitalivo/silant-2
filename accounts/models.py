from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """Кастомная модель пользователя с ролями"""
    
    ROLE_CHOICES = [
        ('client', 'Клиент'),
        ('service', 'Сервисная организация'),
        ('manager', 'Менеджер'),
    ]
    
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        null=True,
        blank=True,
        verbose_name='Роль'
    )
    
    def is_client(self):
        return self.role == 'client'
    
    def is_service_organization(self):
        return self.role == 'service'
    
    def is_manager(self):
        return self.role == 'manager'
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display() or 'Без роли'})"

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'

class ClientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='client_profile')
    company_name = models.CharField(max_length=255, verbose_name='Название компании')
    
    def __str__(self):
        return self.company_name
    
    class Meta:
        verbose_name = 'Профиль клиента'
        verbose_name_plural = 'Профили клиентов'

class ServiceOrganizationProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='service_profile')
    organization_name = models.CharField(max_length=255, verbose_name='Название организации')
    
    def __str__(self):
        return self.organization_name
    
    class Meta:
        verbose_name = 'Профиль сервисной организации'
        verbose_name_plural = 'Профили сервисных организаций'
