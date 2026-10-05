import urllib.request
import urllib.parse
import json
import os
import re
import time

HEADERS = {
    'User-Agent': 'PlayHavenStoreBot/2.0 (Academic Project; contact: fawwazwijdan19@gmail.com)'
}

DEST_DIR = 'C:/Sem5/E Commerce/PlayHaven/frontend/public/images/games'
STATIC_GAMES_PATH = 'C:/Sem5/E Commerce/PlayHaven/frontend/src/data/staticGames.json'

TITLE_OVERRIDES = {
    "demon-s-souls": "Demon's Souls (2020 video game)",
    "demons-souls-ps5": "Demon's Souls (2020 video game)",
    "god-of-war-2018-ps4": "God of War (2018 video game)",
    "god-of-war-collection-ps3": "God of War Collection",
    "the-last-of-us-ps3-ps3": "The Last of Us (video game)",
    "the-last-of-us-part-i-ps5": "The Last of Us Part I",
    "the-last-of-us-part-ii-ps4": "The Last of Us Part II",
    "marvels-spider-man-ps4": "Spider-Man (2018 video game)",
    "marvels-spider-man-2-ps5": "Marvel's Spider-Man 2",
    "grand-theft-auto-v-ps3-ps3": "Grand Theft Auto V",
    "ea-sports-fc-26": "EA Sports FC 24",
    "super-smash-bros-for-wii-u-wii-u": "Super Smash Bros. for Nintendo 3DS and Wii U",
    "mario-kart-8-wii-u-original-wii-u": "Mario Kart 8",
    "super-mario-3d-world-wii-u-wii-u": "Super Mario 3D World",
    "bayonetta-2-wii-u-disc-wii-u": "Bayonetta 2",
    "pikmin-3-wii-u": "Pikmin 3",
    "the-wonderful-101-wii-u": "The Wonderful 101",
    "pokemon-scarlet-switch": "Pokémon Scarlet and Violet",
    "pokemon-scarlet-and-violet-switch": "Pokémon Scarlet and Violet",
    "ori-and-the-will-of-the-wisps-collector-edition-xbox-one": "Ori and the Will of the Wisps",
    "cuphead-physical-edition-xbox-one": "Cuphead",
    "hi-fi-rush-physical-edition-xbox-series-x": "Hi-Fi Rush",
    "senuas-saga-hellblade-ii-xbox-series-x": "Senua's Saga: Hellblade II",
    "cyberpunk-2077-xbox-series-xbox-series-x": "Cyberpunk 2077",
    "cyberpunk-2077-ultimate-edition-xbox-series-x": "Cyberpunk 2077",
    "elden-ring-xbox-series-xbox-series-x": "Elden Ring"
}

def clean_wikitext_image(val):
    val = re.sub(r'^\[\[(File:|Image:)?', '', val, flags=re.IGNORECASE)
    val = re.sub(r'\|.*\]\]$', '', val).strip(']').strip()
    return val

def search_wikipedia_page(title):
    search_url = f'https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(title + " video game")}&format=json'
    req = urllib.request.Request(search_url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=12) as resp:
        data = json.loads(resp.read().decode())
        results = data.get('query', {}).get('search', [])
        if results:
            return results[0]['title']
    return None

def get_infobox_image_from_page(page_title):
    url = f'https://en.wikipedia.org/w/api.php?action=parse&page={urllib.parse.quote(page_title)}&prop=wikitext&format=json'
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=12) as resp:
        data = json.loads(resp.read().decode())
        wikitext = data.get('parse', {}).get('wikitext', {}).get('*', '')
        
        m = re.search(r'\|\s*image\s*=\s*([^|\n}]+)', wikitext, re.IGNORECASE)
        if m:
            raw_img = m.group(1).strip()
            cleaned = clean_wikitext_image(raw_img)
            if cleaned and not cleaned.lower().endswith('.svg'):
                return cleaned
                
        m2 = re.search(r'\|\s*cover\s*=\s*([^|\n}]+)', wikitext, re.IGNORECASE)
        if m2:
            raw_img = m2.group(1).strip()
            cleaned = clean_wikitext_image(raw_img)
            if cleaned and not cleaned.lower().endswith('.svg'):
                return cleaned
    return None

def get_direct_wikimedia_url(file_name):
    title = 'File:' + file_name if not file_name.startswith('File:') else file_name
    url = f'https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url&format=json'
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=12) as resp:
        data = json.loads(resp.read().decode())
        pages = data.get('query', {}).get('pages', {})
        for pid, pdata in pages.items():
            return pdata.get('imageinfo', [{}])[0].get('url')
    return None

def download_image(url, save_path):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15) as resp:
        content = resp.read()
        with open(save_path, 'wb') as f:
            f.write(content)
    return len(content)

def main():
    with open(STATIC_GAMES_PATH, 'r', encoding='utf-8') as f:
        games = json.load(f)

    print(f"Total games to process: {len(games)}")
    success_count = 0
    failed_count = 0

    for idx, game in enumerate(games, 1):
        slug = game['slug']
        title = game['title']

        page_title = TITLE_OVERRIDES.get(slug)
        if not page_title:
            try:
                page_title = search_wikipedia_page(title)
            except Exception as e:
                page_title = title

        if not page_title:
            print(f"[{idx}/{len(games)}] [!] No Wikipedia page: {title}")
            failed_count += 1
            continue

        try:
            image_filename = get_infobox_image_from_page(page_title)
        except Exception as e:
            image_filename = None

        if not image_filename:
            print(f"[{idx}/{len(games)}] [?] No infobox image: {title} ({page_title})")
            failed_count += 1
            continue

        try:
            direct_url = get_direct_wikimedia_url(image_filename)
        except Exception as e:
            direct_url = None

        if not direct_url:
            print(f"[{idx}/{len(games)}] [!] No direct URL for: {image_filename}")
            failed_count += 1
            continue

        ext = os.path.splitext(image_filename)[1].lower()
        if ext not in ['.jpg', '.jpeg', '.png']:
            ext = '.jpg'

        local_filename = f"{slug}{ext}"
        local_path = os.path.join(DEST_DIR, local_filename)

        try:
            bytes_saved = download_image(direct_url, local_path)
            rel_url = f"/images/games/{local_filename}"
            game['cover_image_url'] = rel_url
            print(f"[{idx}/{len(games)}] [✓] {title} -> {image_filename} ({bytes_saved} B)")
            success_count += 1
        except Exception as e:
            print(f"[{idx}/{len(games)}] [!] Download error for {title}: {e}")
            failed_count += 1

        time.sleep(0.15)

    with open(STATIC_GAMES_PATH, 'w', encoding='utf-8') as f:
        json.dump(games, f, ensure_ascii=False, indent=2)

    print("\n==========================================")
    print(f"SELESAI! Sukses: {success_count} | Gagal: {failed_count}")
    print("==========================================")

if __name__ == '__main__':
    main()
