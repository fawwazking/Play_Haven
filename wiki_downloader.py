import os
import django
import urllib.request
import urllib.parse
import json
import time
import re

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()
from catalog.models import Platform, Game

GAMES_DIR = r"C:\Sem5\E Commerce\PlayHaven\frontend\public\images\games"
CONSOLES_DIR = r"C:\Sem5\E Commerce\PlayHaven\frontend\public\images\consoles"
BANNERS_DIR = r"C:\Sem5\E Commerce\PlayHaven\frontend\public\images\banners"

for d in [GAMES_DIR, CONSOLES_DIR, BANNERS_DIR]:
    os.makedirs(d, exist_ok=True)

USER_AGENT = "PlayHavenAcademicBot/1.0 (contact: fawwazwijdan19@gmail.com; Universitas Sultan Ageng Tirtayasa)"

def get_wikipedia_box_art(game_title):
    # Bersihkan judul pencarian
    clean_title = game_title.replace(" (PS3)", "").replace(" (Xbox Series)", "").replace(" (Physical Edition)", "").replace(" (Collector Edition)", "").replace(" (PS3 Original)", "").replace(" (Wii U Disc)", "").replace(" (Wii U Original)", "").replace(" (Wii U)", "")
    
    # Query API Wikipedia mencari halaman artikel
    api_url = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(clean_title)}&prop=images&format=json"
    req = urllib.request.Request(api_url, headers={'User-Agent': USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
        
        pages = data.get('query', {}).get('pages', {})
        target_file = None
        for pid, page in pages.items():
            if pid == "-1":
                continue
            images = page.get('images', [])
            for img in images:
                t = img.get('title', '').lower()
                if any(k in t for k in ['cover', 'box', 'art', 'poster']) and not any(k in t for k in ['icon', 'svg', 'screenshot', 'gameplay', 'actor']):
                    target_file = img.get('title')
                    break
            if not target_file and images:
                for img in images:
                    t = img.get('title', '').lower()
                    if t.endswith(('.jpg', '.jpeg', '.png')) and not any(k in t for k in ['icon', 'svg', 'flag', 'arrow', 'symbol']):
                        target_file = img.get('title')
                        break
        
        if not target_file:
            # Coba search API
            search_url = f"https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(clean_title + ' video game cover')}&format=json"
            req2 = urllib.request.Request(search_url, headers={'User-Agent': USER_AGENT})
            with urllib.request.urlopen(req2, timeout=10) as resp2:
                sdata = json.loads(resp2.read().decode('utf-8'))
            results = sdata.get('query', {}).get('search', [])
            if results:
                top_page = results[0]['title']
                api_url2 = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(top_page)}&prop=images&format=json"
                req3 = urllib.request.Request(api_url2, headers={'User-Agent': USER_AGENT})
                with urllib.request.urlopen(req3, timeout=10) as resp3:
                    data2 = json.loads(resp3.read().decode('utf-8'))
                for pid, page in data2.get('query', {}).get('pages', {}).items():
                    for img in page.get('images', []):
                        t = img.get('title', '').lower()
                        if any(k in t for k in ['cover', 'box', 'art']):
                            target_file = img.get('title')
                            break

        if not target_file:
            return None
        
        # Dapatkan Direct Image URL dari target_file
        info_url = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(target_file)}&prop=imageinfo&iiprop=url&format=json"
        req_info = urllib.request.Request(info_url, headers={'User-Agent': USER_AGENT})
        with urllib.request.urlopen(req_info, timeout=10) as r_info:
            idata = json.loads(r_info.read().decode('utf-8'))
        
        for pid, page in idata.get('query', {}).get('pages', {}).items():
            infos = page.get('imageinfo', [])
            if infos:
                return infos[0].get('url')
    except Exception as e:
        print(f"Error query Wikipedia for {game_title}: {e}")
    return None

def download_img(url, filepath):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
        with urllib.request.urlopen(req, timeout=15) as resp:
            content = resp.read()
            with open(filepath, 'wb') as f:
                f.write(content)
        return True
    except Exception as e:
        print(f"Download error: {e}")
        return False

print("Memulai pencarian dan pengunduhan 70 cover game dari Wikipedia resmi...")

games = Game.objects.all().order_by('title')
updated = 0

for idx, g in enumerate(games, 1):
    # Cek apakah sudah ada file jpg/png lokal yang terdownload
    local_jpg = os.path.join(GAMES_DIR, f"{g.slug}.jpg")
    local_png = os.path.join(GAMES_DIR, f"{g.slug}.png")
    local_jpeg = os.path.join(GAMES_DIR, f"{g.slug}.jpeg")
    
    found_local = None
    for p, ext in [(local_jpg, 'jpg'), (local_png, 'png'), (local_jpeg, 'jpeg')]:
        if os.path.exists(p) and os.path.getsize(p) > 5000:
            found_local = f"/images/games/{g.slug}.{ext}"
            break
            
    if found_local:
        g.cover_image_url = found_local
        g.save()
        updated += 1
        print(f"[{idx}/70] ALREADY EXISTS: {g.title}")
        continue
        
    # Cari di Wikipedia
    img_url = get_wikipedia_box_art(g.title)
    if img_url:
        ext = "png" if ".png" in img_url.lower() else "jpg"
        target_path = os.path.join(GAMES_DIR, f"{g.slug}.{ext}")
        if download_img(img_url, target_path):
            g.cover_image_url = f"/images/games/{g.slug}.{ext}"
            g.save()
            updated += 1
            print(f"[{idx}/70] DOWNLOADED: {g.title}")
        else:
            print(f"[{idx}/70] FAILED DOWNLOAD: {g.title}")
    else:
        print(f"[{idx}/70] NOT FOUND ON WIKI: {g.title}")
        
    time.sleep(0.5) # respect rate limit

print(f"\nSelesai! Total cover tersimpan & terhubung di Supabase: {updated}/{len(games)}")
