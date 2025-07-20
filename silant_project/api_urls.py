from django.urls import path, include

urlpatterns = [
        path('api/', include('machines.urls')),
        path('api/', include('maintenance.urls')),
        path('api/', include('complaints.urls')),
        path('api/', include('directories.urls')),
        path('api/', include('accounts.urls')),
]