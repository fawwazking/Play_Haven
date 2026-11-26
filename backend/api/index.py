import os
import sys
from pathlib import Path

# Vercel serverless entry: backend/api/index.py
# Vercel Python runtime mounts the repo at /var/task, so:
#   /var/task/backend/   = project root
#   /var/task/backend/core/ = Django app
# We need to put /var/task/backend on sys.path so `import core.settings` works.
BASE_DIR = Path(__file__).resolve().parent.parent  # -> /var/task/backend
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

# Vercel sets its own DJANGO_SETTINGS_MODULE sometimes; force ours.
os.environ['DJANGO_SETTINGS_MODULE'] = 'core.settings'

from django.core.wsgi import get_wsgi_application
app = get_wsgi_application()  # noqa: F401  (Vercel looks for `app`)
