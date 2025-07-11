from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, ClientProfile, ServiceOrganizationProfile

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'role', 'is_staff']
    list_filter = ['role', 'is_staff', 'is_superuser', 'is_active']
    search_fields = ['username', 'first_name', 'last_name', 'email']
    
    fieldsets = UserAdmin.fieldsets + (
        ('Роль', {'fields': ('role',)}),
    )
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Роль', {'fields': ('role',)}),
    )

@admin.register(ClientProfile)
class ClientProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'company_name']
    search_fields = ['user__username', 'company_name']

@admin.register(ServiceOrganizationProfile)
class ServiceOrganizationProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'organization_name']
    search_fields = ['user__username', 'organization_name']
