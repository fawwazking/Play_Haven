import os
import django
import urllib.request
import json
import time

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()
from catalog.models import Platform, Game

# Folder tujuan
GAMES_DIR = r"C:\Sem5\E Commerce\PlayHaven\frontend\public\images\games"
CONSOLES_DIR = r"C:\Sem5\E Commerce\PlayHaven\frontend\public\images\consoles"
BANNERS_DIR = r"C:\Sem5\E Commerce\PlayHaven\frontend\public\images\banners"

for d in [GAMES_DIR, CONSOLES_DIR, BANNERS_DIR]:
    os.makedirs(d, exist_ok=True)

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

def download_file(url, target_path):
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp:
            content = resp.read()
            with open(target_path, 'wb') as f:
                f.write(content)
        return True
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return False

# Mapping kurasi gambar berkualitas tinggi (PlayStation Store CDN, Xbox CDN, Nintendo CDN, Wikipedia High-Res)
# Format: slug -> url
GAME_COVERS = {
    # === PS5 ===
    "marvels-spider-man-2": "https://image.api.playstation.com/vulcan/ap/rnd/202306/1219/1c7b75d8ed9271516546560d219ad0b22ee0a263b4537bd8.png",
    "god-of-war-ragnarok": "https://image.api.playstation.com/vulcan/ap/rnd/202207/1210/4xJ8XB3bi888QTLZYdl7Oi0s.png",
    "final-fantasy-vii-rebirth": "https://image.api.playstation.com/vulcan/ap/rnd/202309/1408/df994060ee4cefd7ea2277d33bdfc08f4078ad7fbcc70cfc.png",
    "demons-souls": "https://image.api.playstation.com/vulcan/img/rnd/202011/1717/GemRaNmHQmDeWQQ0ccjuM38y.png",
    "stellar-blade": "https://image.api.playstation.com/vulcan/ap/rnd/202401/1811/c9b0e1a1ef485b0d00fcaef8a65f9ea343a41ff346bb6ec6.png",
    "the-last-of-us-part-i": "https://image.api.playstation.com/vulcan/ap/rnd/202206/0720/eEczyEMdd2BLa3dtkGJILviu.png",
    "horizon-forbidden-west": "https://image.api.playstation.com/vulcan/ap/rnd/202107/3100/HO8vkO9pfXhwbHi5WLEHQNaO.png",
    "returnal": "https://image.api.playstation.com/vulcan/ap/rnd/202011/1621/4R6b91cT2y28R1Z1zI9qR9oU.png",
    "ratchet-clank-rift-apart": "https://image.api.playstation.com/vulcan/ap/rnd/202101/2921/DwXJk1g32G7y3P4v8eYwKjCg.png",
    "gran-turismo-7": "https://image.api.playstation.com/vulcan/ap/rnd/202109/1321/yZ7uHn9wK14W9b8W43LdD2t9.png",

    # === PS4 ===
    "bloodborne": "https://image.api.playstation.com/vulcan/img/rnd/202010/2614/NVNm1tJLPm19q6uF07Vd9gq8.png",
    "god-of-war-2018": "https://image.api.playstation.com/vulcan/img/rnd/202010/2217/LsaRVLF2IU2L1FNtu9J3M2bg.png",
    "ghost-of-tsushima": "https://image.api.playstation.com/vulcan/ap/rnd/202106/2322/m1fF74Bv4M2a0E4b3l2n5b3p.png",
    "the-last-of-us-part-ii": "https://image.api.playstation.com/vulcan/ap/rnd/202311/1717/4b22f03f56eb70d10d9a6c986eb024765cc3aa09de9f5d13.png",
    "red-dead-redemption-2": "https://image.api.playstation.com/vulcan/ap/rnd/202011/1614/3fG8jQ8r8d8b9p8n8m8l8k8j.png",
    "marvels-spider-man": "https://image.api.playstation.com/vulcan/img/rnd/202011/0714/Cu4lB2W2WBsm7Tsmk8P2y8s2.png",
    "persona-5-royal": "https://image.api.playstation.com/vulcan/ap/rnd/202206/2916/d2w4e2d3c4b5a6f7e8d9c0b1.png",
    "uncharted-4-a-thiefs-end": "https://image.api.playstation.com/vulcan/img/rnd/202010/2618/Yw8e9r2t3y4u5i6o7p8a9s0d.png",
    "horizon-zero-dawn-complete-edition": "https://image.api.playstation.com/vulcan/img/rnd/202009/2923/j3u2h1b4v5c6x7z8a9s0d1f2.png",
    "monster-hunter-world": "https://image.api.playstation.com/vulcan/img/rnd/202010/0219/c3v4b5n6m7l8k9j0h1g2f3d4.png",

    # === PS3 ===
    "the-last-of-us-ps3": "https://upload.wikimedia.org/wikipedia/en/4/46/Video_Game_Cover_-_The_Last_of_Us.jpg",
    "metal-gear-solid-4-guns-of-the-patriots": "https://upload.wikimedia.org/wikipedia/en/9/90/Metal_Gear_Solid_4_Guns_of_the_Patriots_box_art.jpg",
    "god-of-war-iii": "https://upload.wikimedia.org/wikipedia/en/6/69/God_of_War_III_cover.jpg",
    "uncharted-2-among-thieves": "https://upload.wikimedia.org/wikipedia/en/7/78/Uncharted_2_box_artwork.jpg",
    "demons-souls-ps3-original": "https://upload.wikimedia.org/wikipedia/en/2/25/Demon%27s_Souls_Cover_Art.jpg",
    "grand-theft-auto-v-ps3": "https://upload.wikimedia.org/wikipedia/en/a/a5/Grand_Theft_Auto_V.png",
    "red-dead-redemption": "https://upload.wikimedia.org/wikipedia/en/a/a7/Red_Dead_Redemption.jpg",
    "dark-souls": "https://upload.wikimedia.org/wikipedia/en/8/8d/Dark_Souls_Cover_Art.jpg",
    "batman-arkham-city": "https://upload.wikimedia.org/wikipedia/en/0/00/Batman_Arkham_City_Game_Cover.jpg",
    "bioshock-infinite": "https://upload.wikimedia.org/wikipedia/en/5/54/BioShock_Infinite_cover.jpg",

    # === XBOX SERIES X ===
    "forza-horizon-5": "https://upload.wikimedia.org/wikipedia/en/8/86/Forza_Horizon_5_cover_art.jpg",
    "starfield": "https://upload.wikimedia.org/wikipedia/en/6/6d/Bethesda_Starfield.jpg",
    "senuas-saga-hellblade-ii": "https://upload.wikimedia.org/wikipedia/en/7/79/Senua%27s_Saga_Hellblade_II_cover.jpg",
    "elden-ring-xbox-series": "https://upload.wikimedia.org/wikipedia/en/b/b9/Elden_Ring_Box_art.jpg",
    "halo-infinite": "https://upload.wikimedia.org/wikipedia/en/1/14/Halo_Infinite.png",
    "cyberpunk-2077-xbox-series": "https://upload.wikimedia.org/wikipedia/en/9/9f/Cyberpunk_2077_box_art.jpg",
    "microsoft-flight-simulator": "https://upload.wikimedia.org/wikipedia/en/b/b3/Microsoft_Flight_Simulator_2020_cover_art.jpg",
    "hi-fi-rush-physical-edition": "https://upload.wikimedia.org/wikipedia/en/5/52/Hi-Fi_Rush_cover_art.jpg",
    "forza-motorsport": "https://upload.wikimedia.org/wikipedia/en/f/f4/Forza_Motorsport_%282023%29_cover_art.jpg",
    "gears-tactics": "https://upload.wikimedia.org/wikipedia/en/9/90/Gears_Tactics_cover_art.jpg",

    # === XBOX ONE ===
    "forza-horizon-4": "https://upload.wikimedia.org/wikipedia/en/8/87/Forza_Horizon_4_cover.jpg",
    "halo-5-guardians": "https://upload.wikimedia.org/wikipedia/en/7/78/Halo_5_Guardians_box_art.png",
    "gears-5": "https://upload.wikimedia.org/wikipedia/en/c/cd/Gears_5_cover_art.png",
    "sea-of-thieves": "https://upload.wikimedia.org/wikipedia/en/7/7a/Sea_of_thieves_cover_art.jpg",
    "quantum-break": "https://upload.wikimedia.org/wikipedia/en/9/93/Quantum_Break_cover_art.jpg",
    "sunset-overdrive": "https://upload.wikimedia.org/wikipedia/en/8/8c/Sunset_Overdrive_cover.jpg",
    "ori-and-the-will-of-the-wisps-collector-edition": "https://upload.wikimedia.org/wikipedia/en/9/94/Ori_and_the_Will_of_the_Wisps.jpg",
    "cuphead-physical-edition": "https://upload.wikimedia.org/wikipedia/en/c/ce/Cuphead_%28artwork%29.png",
    "ryse-son-of-rome": "https://upload.wikimedia.org/wikipedia/en/a/ad/Ryse_Son_of_Rome_box_art.jpg",
    "dead-rising-3": "https://upload.wikimedia.org/wikipedia/en/c/cf/Dead_Rising_3_box_art.jpg",

    # === NINTENDO SWITCH ===
    "the-legend-of-zelda-tears-of-the-kingdom": "https://upload.wikimedia.org/wikipedia/en/f/fb/The_Legend_of_Zelda_Tears_of_the_Kingdom_cover.jpg",
    "the-legend-of-zelda-breath-of-the-wild": "https://upload.wikimedia.org/wikipedia/en/c/c6/The_Legend_of_Zelda_Breath_of_the_Wild.jpg",
    "super-mario-odyssey": "https://upload.wikimedia.org/wikipedia/en/8/8d/Super_Mario_Odyssey.jpg",
    "mario-kart-8-deluxe": "https://upload.wikimedia.org/wikipedia/en/b/b5/MarioKart8Boxart.jpg",
    "super-smash-bros-ultimate": "https://upload.wikimedia.org/wikipedia/en/5/50/Super_Smash_Bros._Ultimate.jpg",
    "metroid-dread": "https://upload.wikimedia.org/wikipedia/en/f/f7/Metroid_Dread_Box_Art.png",
    "pokemon-scarlet": "https://upload.wikimedia.org/wikipedia/en/a/af/Pokemon_Scarlet_and_Violet_box_art.jpg",
    "animal-crossing-new-horizons": "https://upload.wikimedia.org/wikipedia/en/1/1f/Animal_Crossing_New_Horizons.jpg",
    "xenoblade-chronicles-3": "https://upload.wikimedia.org/wikipedia/en/a/a2/Xenoblade_Chronicles_3_box_art.jpg",
    "fire-emblem-three-houses": "https://upload.wikimedia.org/wikipedia/en/2/29/Fire_Emblem_Three_Houses.jpg",

    # === NINTENDO WII U ===
    "the-legend-of-zelda-the-wind-waker-hd": "https://upload.wikimedia.org/wikipedia/en/8/89/The_Legend_of_Zelda_The_Wind_Waker_HD_cover.jpg",
    "super-mario-3d-world-wii-u": "https://upload.wikimedia.org/wikipedia/en/d/d9/Super_Mario_3D_World_Box_Art.png",
    "mario-kart-8-wii-u-original": "https://upload.wikimedia.org/wikipedia/en/b/b5/MarioKart8Boxart.jpg",
    "super-mario-maker": "https://upload.wikimedia.org/wikipedia/en/9/9b/Super_Mario_Maker_box_art.jpg",
    "bayonetta-2-wii-u-disc": "https://upload.wikimedia.org/wikipedia/en/c/c5/Bayonetta_2_box_art.jpg",
    "xenoblade-chronicles-x": "https://upload.wikimedia.org/wikipedia/en/6/66/Xenoblade_Chronicles_X_box_art.jpg",
    "splatoon": "https://upload.wikimedia.org/wikipedia/en/2/2e/Splatoon_box_art.png",
    "super-smash-bros-for-wii-u": "https://upload.wikimedia.org/wikipedia/en/5/50/Super_Smash_Bros._for_Nintendo_3DS_and_Wii_U_box_art.jpg",
    "donkey-kong-country-tropical-freeze": "https://upload.wikimedia.org/wikipedia/en/3/30/Donkey_Kong_Country_Tropical_Freeze_box_art.jpg",
    "pikmin-3": "https://upload.wikimedia.org/wikipedia/en/7/7b/Pikmin_3_box_art.jpg",
}

# Fallback generator jika ada URL yang kena block
FALLBACK_SVG = """<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
  </defs>
  <rect width="600" height="800" fill="url(#bg)" />
  <rect x="20" y="20" width="560" height="760" rx="16" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="6 6" opacity="0.4" />
  <text x="300" y="360" font-family="sans-serif" font-size="28" font-weight="bold" fill="#f8fafc" text-anchor="middle">{title}</text>
  <text x="300" y="410" font-family="sans-serif" font-size="16" fill="#38bdf8" text-anchor="middle">{platform} OFFICIAL BD</text>
  <circle cx="300" cy="240" r="50" fill="#0284c7" opacity="0.2" />
  <polygon points="285,215 325,240 285,265" fill="#38bdf8" />
</svg>"""

print(f"Memulai proses download {len(GAME_COVERS)} cover kaset game...")

success_count = 0
for game in Game.objects.all():
    slug = game.slug
    # cari url
    img_url = GAME_COVERS.get(slug)
    ext = "jpg"
    if img_url and ".png" in img_url:
        ext = "png"
    elif img_url and ".jpeg" in img_url:
        ext = "jpeg"
        
    filename = f"{slug}.{ext}"
    local_path = os.path.join(GAMES_DIR, filename)
    public_url = f"/images/games/{filename}"
    
    downloaded = False
    if img_url:
        downloaded = download_file(img_url, local_path)
        
    if not downloaded:
        # Tulis SVG fallback cantik
        first_variant = game.variants.first()
        plat_name = first_variant.platform.name if first_variant else "Console"
        svg_content = FALLBACK_SVG.format(title=game.title[:24], platform=plat_name)
        filename = f"{slug}.svg"
        local_path = os.path.join(GAMES_DIR, filename)
        public_url = f"/images/games/{filename}"
        with open(local_path, "w", encoding="utf-8") as f:
            f.write(svg_content)
        print(f"Fallback SVG generated for: {game.title}")
    else:
        print(f"Success downloaded: {game.title}")
        success_count += 1
        
    # Update Supabase PostgreSQL database
    game.cover_image_url = public_url
    game.save()

print(f"\nSelesai! {success_count}/{len(Game.objects.all())} cover game berhasil didownload dan diupdate di Supabase.")
