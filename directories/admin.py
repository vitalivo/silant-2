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

@admin.register(TechniqueModel)
class TechniqueModelAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    search_fields = ['name']

@admin.register(EngineModel)
class EngineModelAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    search_fields = ['name']

@admin.register(TransmissionModel)
class TransmissionModelAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    search_fields = ['name']

@admin.register(DriveAxleModel)
class DriveAxleModelAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    search_fields = ['name']

@admin.register(SteerAxleModel)
class SteerAxleModelAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    search_fields = ['name']

@admin.register(MaintenanceType)
class MaintenanceTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    search_fields = ['name']

@admin.register(FailureNode)
class FailureNodeAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    search_fields = ['name']

@admin.register(RecoveryMethod)
class RecoveryMethodAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    search_fields = ['name']

@admin.register(ServiceCompany)
class ServiceCompanyAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    search_fields = ['name']
