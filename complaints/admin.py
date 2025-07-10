from django.contrib import admin
from .models import Complaint

@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = [
        'machine', 'failure_date', 'failure_node', 
        'recovery_date', 'downtime', 'service_company'
    ]
    list_filter = [
        'failure_node', 'recovery_method', 'failure_date', 'service_company'
    ]
    search_fields = ['machine__serial_number', 'failure_description']
    date_hierarchy = 'failure_date'
    ordering = ['-failure_date']