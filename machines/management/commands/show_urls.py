from django.core.management.base import BaseCommand
from django.urls import get_resolver
from django.conf import settings

class Command(BaseCommand):
    help = 'Показать все URL-маршруты'

    def handle(self, *args, **options):
        self.stdout.write("=== URL МАРШРУТЫ ===")
        
        resolver = get_resolver()
        
        def show_urls(urlpatterns, prefix=''):
            for pattern in urlpatterns:
                if hasattr(pattern, 'url_patterns'):
                    # Это include()
                    new_prefix = prefix + str(pattern.pattern)
                    show_urls(pattern.url_patterns, new_prefix)
                else:
                    # Это обычный URL
                    url = prefix + str(pattern.pattern)
                    name = getattr(pattern, 'name', 'No name')
                    self.stdout.write(f"{url} -> {name}")
        
        show_urls(resolver.url_patterns)
