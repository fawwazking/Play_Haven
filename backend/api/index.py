import os
import sys
from pathlib import Path

# Vercel serverless entry: backend/api/index.py
# Reuse the existing Django WSGI app defined in backend/wsgi_app.py
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

from wsgi_app import app  # noqa: F401  (Vercel looks for `app`)
