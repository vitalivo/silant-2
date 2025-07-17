from django.contrib import admin
from .models import (
    Directory, TechniqueModel, EngineModel, TransmissionModel,
    DriveAxleModel, SteerAxleModel, MaintenanceType, FailureNode, 
    RecoveryMethod, ServiceCompany
)

@admin.register(Directory)
class DirectoryAdmin(admin.ModelAdmin):
    list_display = ['entity_name', 'name', 'description']
    list_filter = ['entity_name']
    search_fields = ['name', 'description']
    list_per_page = 50

@admin.register(TechniqueModel)
class TechniqueModelAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'machines_count']
    search_fields = ['name', 'description']
    list_per_page = 50
    ordering = ['name']
    
    def machines_count(self, obj):
        """Показываем количество машин с этой моделью техники"""
        return obj.machine_set.count()
    machines_count.short_description = 'Количество машин'

@admin.register(EngineModel)
class EngineModelAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'machines_count']
    search_fields = ['name', 'description']
    list_per_page = 50
    ordering = ['name']
    
    def machines_count(self, obj):
        """Показываем количество машин с этой моделью двигателя"""
        return obj.machine_set.count()
    machines_count.short_description = 'Количество машин'

@admin.register(TransmissionModel)
class TransmissionModelAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'machines_count']
    search_fields = ['name', 'description']
    list_per_page = 50
    ordering = ['name']
    
    def machines_count(self, obj):
        """Показываем количество машин с этой моделью трансмиссии"""
        return obj.machine_set.count()
    machines_count.short_description = 'Количество машин'

@admin.register(DriveAxleModel)
class DriveAxleModelAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'machines_count']
    search_fields = ['name', 'description']
    list_per_page = 50
    ordering = ['name']
    
    def machines_count(self, obj):
        """Показываем количество машин с этой моделью ведущего моста"""
        return obj.machine_set.count()
    machines_count.short_description = 'Количество машин'

@admin.register(SteerAxleModel)
class SteerAxleModelAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'machines_count']
    search_fields = ['name', 'description']
    list_per_page = 50
    ordering = ['name']
    
    def machines_count(self, obj):
        """Показываем количество машин с этой моделью управляемого моста"""
        return obj.machine_set.count()
    machines_count.short_description = 'Количество машин'

@admin.register(MaintenanceType)
class MaintenanceTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'maintenance_count']
    search_fields = ['name', 'description']
    list_per_page = 50
    ordering = ['name']
    
    def maintenance_count(self, obj):
        """Показываем количество ТО этого типа"""
        return obj.maintenance_set.count()
    maintenance_count.short_description = 'Количество ТО'

@admin.register(FailureNode)
class FailureNodeAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'complaints_count']
    search_fields = ['name', 'description']
    list_per_page = 50
    ordering = ['name']
    
    def complaints_count(self, obj):
        """Показываем количество рекламаций по этому узлу"""
        return obj.complaint_set.count()
    complaints_count.short_description = 'Количество рекламаций'

@admin.register(RecoveryMethod)
class RecoveryMethodAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'complaints_count']
    search_fields = ['name', 'description']
    list_per_page = 50
    ordering = ['name']
    
    def complaints_count(self, obj):
        """Показываем количество рекламаций с этим способом восстановления"""
        return obj.complaint_set.count()
    complaints_count.short_description = 'Количество рекламаций'

@admin.register(ServiceCompany)
class ServiceCompanyAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    search_fields = ['name', 'description']
    list_per_page = 50
    ordering = ['name']
    

