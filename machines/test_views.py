from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Machine
from .serializers import MachineListSerializer

@csrf_exempt
@require_http_methods(["GET"])
def test_search_by_serial(request):
    """Простой view для тестирования поиска по серийному номеру"""
    serial = request.GET.get('serial', '')
    if not serial:
        return JsonResponse({'error': 'Параметр serial обязателен'}, status=400)
    
    try:
        machine = Machine.objects.select_related(
            'technique_model', 'engine_model', 'transmission_model',
            'drive_axle_model', 'steer_axle_model'
        ).get(serial_number=serial)
        
        serializer = MachineListSerializer(machine)
        return JsonResponse(serializer.data)
    except Machine.DoesNotExist:
        return JsonResponse({'error': 'Машина не найдена'}, status=404)
