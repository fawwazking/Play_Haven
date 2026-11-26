import os
import sys
from pathlib import Path

# Fallback WSGI entry (used if Vercel loads wsgi_app.py instead of api/index.py).
# Same sys.path fix: /var/task/backend must be importable so `core.settings` resolves.
BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

os.environ['DJANGO_SETTINGS_MODULE'] = 'core.settings'

from django.core.wsgi import get_wsgi_application
app = get_wsgi_application()
