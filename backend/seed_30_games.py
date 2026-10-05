import os
import django
import urllib.request
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from catalog.models import Game, Platform, GameVariant

NEW_GAMES = [
    # PS5
    {
        "title": "EA Sports FC 26",
        "slug": "ea-sports-fc-26-ps5",
        "description": "Rasakan revolusi simulasi sepak bola terdepan dengan HyperMotionV generasi terbaru, taktik FC IQ tingkat lanjut, dan lisensi resmi UEFA Champions League & Premier League.",
        "release_year": 2025,
        "platform_slug": "ps5",
        "wiki_file": "File:EA FC 25 Cover.jpg",
        "price_new": 899000,
        "price_used": 699000,
    },
    {
        "title": "Black Myth: Wukong",
        "slug": "black-myth-wukong-ps5",
        "description": "Game aksi RPG spektakuler berlatar mitologi Tiongkok klasik Perjalanan ke Barat. Hadapi dewa dan monster legendaris dengan tongkat sakti Sun Wukong.",
        "release_year": 2024,
        "platform_slug": "ps5",
        "wiki_file": "File:Black Myth Wukong cover art.jpg",
        "price_new": 849000,
        "price_used": 649000,
    },
    {
        "title": "Silent Hill 2 Remake",
        "slug": "silent-hill-2-remake-ps5",
        "description": "Karya horor psikologis legendaris dibangun ulang dari nol dengan Unreal Engine 5. Ikuti James Sunderland menyelami kota berkabut penuh teror Silent Hill.",
        "release_year": 2024,
        "platform_slug": "ps5",
        "wiki_file": "File:Silent Hill 2 Remake.png",
        "price_new": 799000,
        "price_used": 599000,
    },
    {
        "title": "Tekken 8",
        "slug": "tekken-8-ps5",
        "description": "Babak baru pertarungan darah Mishima dengan sistem pertarungan agresif Heat System dan grafis pertarungan visual paling realistis.",
        "release_year": 2024,
        "platform_slug": "ps5",
        "wiki_file": "File:Tekken 8 cover art.jpg",
        "price_new": 799000,
        "price_used": 599000,
    },
    {
        "title": "Dragon's Dogma 2",
        "slug": "dragons-dogma-2-ps5",
        "description": "Petualangan aksi RPG dunia terbuka Capcom yang mendalam bersama Pawn companion cerdas dalam memburu naga raksasa.",
        "release_year": 2024,
        "platform_slug": "ps5",
        "wiki_file": "File:Dragon's Dogma 2 cover art.jpg",
        "price_new": 799000,
        "price_used": 599000,
    },
    # PS4
    {
        "title": "EA Sports FC 26 (PS4)",
        "slug": "ea-sports-fc-26-ps4",
        "description": "Edisi kaset Blu-ray Disc PS4 resmi EA Sports FC 26 dengan update squad lengkap musim terbaru, Ultimate Team, dan Career Mode.",
        "release_year": 2025,
        "platform_slug": "ps4",
        "wiki_file": "File:EA FC 25 Cover.jpg",
        "price_new": 749000,
        "price_used": 549000,
    },
    {
        "title": "Persona 5 Royal",
        "slug": "persona-5-royal-ps4",
        "description": "RPG legendaris Phantom Thieves of Hearts mencuri hati korup Tokyo lengkap dengan semester ketiga tambahan dan karakter baru Kasumi Yoshizawa.",
        "release_year": 2020,
        "platform_slug": "ps4",
        "wiki_file": "File:Persona 5 Royal - Cover Art.jpg",
        "price_new": 549000,
        "price_used": 349000,
    },
    {
        "title": "Monster Hunter: World",
        "slug": "monster-hunter-world-ps4",
        "description": "Berburu monster purba raksasa di ekosistem hidup New World bersama sesama hunter di seluruh dunia.",
        "release_year": 2018,
        "platform_slug": "ps4",
        "wiki_file": "File:Monster Hunter World cover art.jpg",
        "price_new": 399000,
        "price_used": 249000,
    },
    {
        "title": "Sekiro: Shadows Die Twice",
        "slug": "sekiro-shadows-die-twice-ps4",
        "description": "Pemenang Game of the Year FromSoftware. Kuasai pertarungan pedang parry presisi sebagai shinobi satu lengan Wolf di era Sengoku.",
        "release_year": 2019,
        "platform_slug": "ps4",
        "wiki_file": "File:Sekiro art.jpg",
        "price_new": 599000,
        "price_used": 399000,
    },
    {
        "title": "Ghost of Tsushima",
        "slug": "ghost-of-tsushima-ps4",
        "description": "Kisah epik samurai Jin Sakai mempertahankan pulau Tsushima dari invasi Mongol dengan kehormatan pedang katana dan taktik Ghost.",
        "release_year": 2020,
        "platform_slug": "ps4",
        "wiki_file": "File:Ghost of Tsushima.jpg",
        "price_new": 549000,
        "price_used": 349000,
    },
    # PS3
    {
        "title": "Metal Gear Solid 4: Guns of the Patriots",
        "slug": "metal-gear-solid-4-guns-of-the-patriots-ps3",
        "description": "Misi terakhir legendaris Old Snake dalam menghentikan Liquid Ocelot di tengah kekacauan perang proxy dunia.",
        "release_year": 2008,
        "platform_slug": "ps3",
        "wiki_file": "File:Metal Gear Solid 4 Guns of the Patriots.jpg",
        "price_new": 349000,
        "price_used": 199000,
    },
    {
        "title": "God of War Collection (I & II)",
        "slug": "god-of-war-collection-ps3",
        "description": "Remaster HD dua mahakarya awal petualangan Kratos melawan dewa Olympus Ares dalam satu piringan Blu-ray PS3.",
        "release_year": 2009,
        "platform_slug": "ps3",
        "wiki_file": "File:God of War Collection.jpg",
        "price_new": 299000,
        "price_used": 179000,
    },
    {
        "title": "Infamous 2",
        "slug": "infamous-2-ps3",
        "description": "Cole MacGrath bertarung mengendalikan kekuatan listrik super di kota New Marais sebelum monster raksasa The Beast tiba.",
        "release_year": 2011,
        "platform_slug": "ps3",
        "wiki_file": "File:Infamous 2.jpg",
        "price_new": 279000,
        "price_used": 159000,
    },
    {
        "title": "Killzone 2",
        "slug": "killzone-2-ps3",
        "description": "FPS sci-fi legendaris grafis revolusioner PS3 saat pasukan ISA menyerbu planet rumah Helghast.",
        "release_year": 2009,
        "platform_slug": "ps3",
        "wiki_file": "File:Killzone 2 Box Art.jpg",
        "price_new": 249000,
        "price_used": 149000,
    },
    # Xbox Series X
    {
        "title": "EA Sports FC 26 (Xbox Series X)",
        "slug": "ea-sports-fc-26-xbox-series-x",
        "description": "Kaset fisik resmi Xbox Series X EA Sports FC 26 dengan visual 4K Ultra HD 60FPS dan Smart Delivery.",
        "release_year": 2025,
        "platform_slug": "xbox-series-x",
        "wiki_file": "File:EA FC 25 Cover.jpg",
        "price_new": 879000,
        "price_used": 679000,
    },
    {
        "title": "Starfield",
        "slug": "starfield-xbox-series-x",
        "description": "RPG luar angkasa pertama Bethesda Game Studios dalam 25 tahun. Jelajahi lebih dari 1000 planet di galaksi luas.",
        "release_year": 2023,
        "platform_slug": "xbox-series-x",
        "wiki_file": "File:Starfield cover art.jpg",
        "price_new": 699000,
        "price_used": 499000,
    },
    {
        "title": "Cyberpunk 2077: Ultimate Edition",
        "slug": "cyberpunk-2077-ultimate-edition-xbox-series-x",
        "description": "Edisi definitif Night City lengkap dengan ekspansi cerita mata-mata Phantom Liberty dibintangi Idris Elba.",
        "release_year": 2023,
        "platform_slug": "xbox-series-x",
        "wiki_file": "File:Cyberpunk 2077 box art.jpg",
        "price_new": 749000,
        "price_used": 549000,
    },
    {
        "title": "Senua's Saga: Hellblade II",
        "slug": "senuas-saga-hellblade-ii-xbox-series-x",
        "description": "Mahakarya audio visual Unreal Engine 5 Ninja Theory menelusuri mitologi Viking Islandia abad ke-9.",
        "release_year": 2024,
        "platform_slug": "xbox-series-x",
        "wiki_file": "File:Senua's Saga - Hellblade II cover art.jpg",
        "price_new": 699000,
        "price_used": 499000,
    },
    # Xbox One
    {
        "title": "Gears 5",
        "slug": "gears-5-xbox-one",
        "description": "Kait Diaz mengungkap hubungannya yang misterius dengan bangsa Swarm dalam petualangan Gears of War terbesar.",
        "release_year": 2019,
        "platform_slug": "xbox-one",
        "wiki_file": "File:Gears 5 cover art.png",
        "price_new": 449000,
        "price_used": 279000,
    },
    {
        "title": "Quantum Break",
        "slug": "quantum-break-xbox-one",
        "description": "Game aksi manipulasi waktu sinematik Remedy Entertainment yang terintegrasi dengan serial aksi live-action.",
        "release_year": 2016,
        "platform_slug": "xbox-one",
        "wiki_file": "File:Quantum Break cover.jpg",
        "price_new": 349000,
        "price_used": 199000,
    },
    {
        "title": "Ori and the Will of the Wisps",
        "slug": "ori-and-the-will-of-the-wisps-xbox-one",
        "description": "Petualangan platformer magis menyentuh hati di hutan Niwen dengan animasi lukisan tangan memukau.",
        "release_year": 2020,
        "platform_slug": "xbox-one",
        "wiki_file": "File:Ori and the Will of the Wisps.jpg",
        "price_new": 399000,
        "price_used": 249000,
    },
    {
        "title": "Dead Rising 3",
        "slug": "dead-rising-3-xbox-one",
        "description": "Ribuan zombie memenuhi kota Los Perdidos. Ciptakan ratusan kombinasi senjata kustom gila untuk bertahan hidup.",
        "release_year": 2013,
        "platform_slug": "xbox-one",
        "wiki_file": "File:Dead Rising 3 cover.jpg",
        "price_new": 299000,
        "price_used": 179000,
    },
    # Nintendo Switch
    {
        "title": "EA Sports FC 26 (Nintendo Switch)",
        "slug": "ea-sports-fc-26-switch",
        "description": "Mainkan sepak bola kelas dunia di mana saja dengan Frostbite Engine portabel penuh di Nintendo Switch.",
        "release_year": 2025,
        "platform_slug": "switch",
        "wiki_file": "File:EA FC 25 Cover.jpg",
        "price_new": 699000,
        "price_used": 499000,
    },
    {
        "title": "Super Mario Bros. Wonder",
        "slug": "super-mario-bros-wonder-switch",
        "description": "Petualangan 2D Mario terbaru di Flower Kingdom dengan efek Wonder Flower yang mengubah dunia secara ajaib.",
        "release_year": 2023,
        "platform_slug": "switch",
        "wiki_file": "File:Super Mario Bros. Wonder.png",
        "price_new": 699000,
        "price_used": 499000,
    },
    {
        "title": "Pokemon Scarlet and Violet",
        "slug": "pokemon-scarlet-and-violet-switch",
        "description": "Petualangan dunia terbuka luas wilayah Paldea. Tangkap monster legendaris Koraidon dan Miraidon.",
        "release_year": 2022,
        "platform_slug": "switch",
        "wiki_file": "File:Pokemon Scarlet and Violet.jpg",
        "price_new": 699000,
        "price_used": 499000,
    },
    {
        "title": "Metroid Dread",
        "slug": "metroid-dread-switch",
        "description": "Samus Aran diburu oleh robot pembunuh E.M.M.I di planet terpencil ZDR dalam aksi side-scrolling 2D intens.",
        "release_year": 2021,
        "platform_slug": "switch",
        "wiki_file": "File:Metroid Dread banner.jpg",
        "price_new": 649000,
        "price_used": 449000,
    },
    {
        "title": "Animal Crossing: New Horizons",
        "slug": "animal-crossing-new-horizons-switch",
        "description": "Bangun kehidupan pulau surga impianmu dari awal bersama teman-teman satwa yang ramah.",
        "release_year": 2020,
        "platform_slug": "switch",
        "wiki_file": "File:Animal Crossing New Horizons.jpg",
        "price_new": 649000,
        "price_used": 449000,
    },
    # Wii U
    {
        "title": "Bayonetta 2 (Wii U)",
        "slug": "bayonetta-2-wii-u",
        "description": "Aksi klimaks penyihir Umbra Bayonetta bertarung di surga dan neraka dengan kombo rambut iblis dahsyat.",
        "release_year": 2014,
        "platform_slug": "wii-u",
        "wiki_file": "File:Bayonetta 2 box art.jpg",
        "price_new": 399000,
        "price_used": 249000,
    },
    {
        "title": "Pikmin 3 (Wii U)",
        "slug": "pikmin-3-wii-u",
        "description": "Pimpin pasukan makhluk Pikmin mengumpulkan buah dan menjelajahi alam misterius planet PNF-404.",
        "release_year": 2013,
        "platform_slug": "wii-u",
        "wiki_file": "File:Pikmin 3 box art.jpg",
        "price_new": 349000,
        "price_used": 199000,
    },
    {
        "title": "The Wonderful 101 (Wii U)",
        "slug": "the-wonderful-101-wii-u",
        "description": "Pimpin 100 pahlawan super bergabung menjadi senjata raksasa Unite Morph untuk mengusir invasi alien GEATHJERK.",
        "release_year": 2013,
        "platform_slug": "wii-u",
        "wiki_file": "File:The Wonderful 101.jpg",
        "price_new": 299000,
        "price_used": 179000,
    }
]

def get_wikimedia_image_url(filename):
    url = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(filename)}&prop=imageinfo&iiprop=url&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'PlayHavenStore/1.0'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, pdata in pages.items():
                infos = pdata.get('imageinfo', [])
                if infos:
                    return infos[0].get('url')
    except Exception as e:
        print(f"Error fetching wiki url for {filename}: {e}")
    return None

def download_image(url, target_path):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            content = resp.read()
            with open(target_path, 'wb') as f:
                f.write(content)
            return True
    except Exception as e:
        print(f"Failed download {url}: {e}")
        return False

def make_fallback_svg(title, platform_name, target_path):
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="50%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
  </defs>
  <rect width="600" height="800" fill="url(#bg)" rx="24" />
  <rect x="20" y="20" width="560" height="760" fill="none" stroke="#38bdf8" stroke-width="2" rx="16" opacity="0.4" />
  
  <rect x="40" y="40" width="160" height="36" rx="8" fill="#38bdf8" />
  <text x="120" y="63" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#0f172a" text-anchor="middle">{platform_name}</text>
  
  <circle cx="300" cy="360" r="140" fill="#1e293b" stroke="#38bdf8" stroke-width="4" />
  <circle cx="300" cy="360" r="45" fill="#0f172a" stroke="#38bdf8" stroke-width="2" />
  
  <text x="300" y="580" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#f8fafc" text-anchor="middle">{title[:28]}</text>
  <text x="300" y="620" font-family="Arial, sans-serif" font-size="18" fill="#94a3b8" text-anchor="middle">Official Physical Disc / Cartridge</text>
  <rect x="200" y="660" width="200" height="40" rx="20" fill="#0284c7" />
  <text x="300" y="685" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">PLAYHAVEN VERIFIED</text>
</svg>'''
    with open(target_path, 'w', encoding='utf-8') as f:
        f.write(svg_content)

dest_dir = "C:/Sem5/E Commerce/PlayHaven/frontend/public/images/games"
os.makedirs(dest_dir, exist_ok=True)

print(f"Adding {len(NEW_GAMES)} new games...")

created_count = 0
for item in NEW_GAMES:
    plat = Platform.objects.get(slug=item["platform_slug"])
    
    # 1. Image cover handling
    img_url = get_wikimedia_image_url(item["wiki_file"])
    target_img_name = f"{item['slug']}.jpg"
    target_path = os.path.join(dest_dir, target_img_name)
    
    saved_rel_url = f"/images/games/{target_img_name}"
    
    success = False
    if img_url:
        success = download_image(img_url, target_path)
    
    if not success or not os.path.exists(target_path) or os.path.getsize(target_path) < 1000:
        # Fallback to high quality SVG
        target_img_name = f"{item['slug']}.svg"
        target_path = os.path.join(dest_dir, target_img_name)
        make_fallback_svg(item["title"], plat.name, target_path)
        saved_rel_url = f"/images/games/{target_img_name}"
        print(f"  [SVG Cover] {item['title']} -> {target_img_name}")
    else:
        print(f"  [Downloaded] {item['title']} -> {target_img_name}")

    # 2. Database Record
    game, created = Game.objects.update_or_create(
        slug=item["slug"],
        defaults={
            "title": item["title"],
            "description": item["description"],
            "release_year": item["release_year"],
            "cover_image_url": saved_rel_url
        }
    )

    # 3. Variants (New & Pre-owned)
    # Varian Baru
    sku_new = f"{item['slug']}-NEW"[:50]
    sku_used = f"{item['slug']}-USED"[:50]

    GameVariant.objects.update_or_create(
        game=game,
        platform=plat,
        condition="NEW",
        region="REG3",
        defaults={
            "price": item["price_new"],
            "stock": 20,
            "sku": sku_new
        }
    )

    # Varian Bekas
    GameVariant.objects.update_or_create(
        game=game,
        platform=plat,
        condition="USED",
        region="REG3",
        defaults={
            "price": item["price_used"],
            "stock": 20,
            "sku": sku_used
        }
    )

    created_count += 1

print(f"\nSukses menambahkan/memperbarui {created_count} game ke database!")
print(f"Total Games sekarang: {Game.objects.count()}")
print(f"Total Variants sekarang: {GameVariant.objects.count()}")
