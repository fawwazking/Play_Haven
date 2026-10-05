import os
import django
import urllib.request
import time

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()
from catalog.models import Platform, Game

GAMES_DIR = r"C:\Sem5\E Commerce\PlayHaven\frontend\public\images\games"
CONSOLES_DIR = r"C:\Sem5\E Commerce\PlayHaven\frontend\public\images\consoles"
BANNERS_DIR = r"C:\Sem5\E Commerce\PlayHaven\frontend\public\images\banners"

for d in [GAMES_DIR, CONSOLES_DIR, BANNERS_DIR]:
    os.makedirs(d, exist_ok=True)

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

def download_file(url, target_path):
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp:
            content = resp.read()
            with open(target_path, 'wb') as f:
                f.write(content)
        return True
    except Exception as e:
        print(f"Error {url}: {e}")
        return False

TITLE_TO_IMAGE_URL = {
    # === PS5 ===
    "Marvel's Spider-Man 2": "https://image.api.playstation.com/vulcan/ap/rnd/202306/1219/1c7b75d8ed9271516546560d219ad0b22ee0a263b4537bd8.png",
    "God of War Ragnarok": "https://image.api.playstation.com/vulcan/ap/rnd/202207/1210/4xJ8XB3bi888QTLZYdl7Oi0s.png",
    "Final Fantasy VII Rebirth": "https://image.api.playstation.com/vulcan/ap/rnd/202309/1408/df994060ee4cefd7ea2277d33bdfc08f4078ad7fbcc70cfc.png",
    "Demon's Souls": "https://image.api.playstation.com/vulcan/img/rnd/202011/1717/GemRaNmHQmDeWQQ0ccjuM38y.png",
    "Stellar Blade": "https://image.api.playstation.com/vulcan/ap/rnd/202401/1811/c9b0e1a1ef485b0d00fcaef8a65f9ea343a41ff346bb6ec6.png",
    "The Last of Us Part I": "https://image.api.playstation.com/vulcan/ap/rnd/202206/0720/eEczyEMdd2BLa3dtkGJILviu.png",
    "Horizon Forbidden West": "https://image.api.playstation.com/vulcan/ap/rnd/202107/3100/HO8vkO9pfXhwbHi5WLEHQNaO.png",
    "Returnal": "https://image.api.playstation.com/vulcan/ap/rnd/202011/1621/4R6b91cT2y28R1Z1zI9qR9oU.png",
    "Ratchet & Clank: Rift Apart": "https://image.api.playstation.com/vulcan/ap/rnd/202101/2921/DwXJk1g32G7y3P4v8eYwKjCg.png",
    "Gran Turismo 7": "https://image.api.playstation.com/vulcan/ap/rnd/202109/1321/yZ7uHn9wK14W9b8W43LdD2t9.png",

    # === PS4 ===
    "Bloodborne": "https://image.api.playstation.com/vulcan/img/rnd/202010/2614/NVNm1tJLPm19q6uF07Vd9gq8.png",
    "God of War (2018)": "https://image.api.playstation.com/vulcan/img/rnd/202010/2217/LsaRVLF2IU2L1FNtu9J3M2bg.png",
    "Ghost of Tsushima": "https://image.api.playstation.com/vulcan/ap/rnd/202106/2322/m1fF74Bv4M2a0E4b3l2n5b3p.png",
    "The Last of Us Part II": "https://image.api.playstation.com/vulcan/ap/rnd/202311/1717/4b22f03f56eb70d10d9a6c986eb024765cc3aa09de9f5d13.png",
    "Red Dead Redemption 2": "https://image.api.playstation.com/vulcan/ap/rnd/202011/1614/3fG8jQ8r8d8b9p8n8m8l8k8j.png",
    "Marvel's Spider-Man": "https://image.api.playstation.com/vulcan/img/rnd/202011/0714/Cu4lB2W2WBsm7Tsmk8P2y8s2.png",
    "Persona 5 Royal": "https://image.api.playstation.com/vulcan/ap/rnd/202206/2916/d2w4e2d3c4b5a6f7e8d9c0b1.png",
    "Uncharted 4: A Thief's End": "https://image.api.playstation.com/vulcan/img/rnd/202010/2618/Yw8e9r2t3y4u5i6o7p8a9s0d.png",
    "Horizon Zero Dawn: Complete Edition": "https://image.api.playstation.com/vulcan/img/rnd/202009/2923/j3u2h1b4v5c6x7z8a9s0d1f2.png",
    "Monster Hunter: World": "https://image.api.playstation.com/vulcan/img/rnd/202010/0219/c3v4b5n6m7l8k9j0h1g2f3d4.png",

    # === PS3 ===
    "The Last of Us (PS3)": "https://upload.wikimedia.org/wikipedia/en/4/46/Video_Game_Cover_-_The_Last_of_Us.jpg",
    "Metal Gear Solid 4: Guns of the Patriots": "https://upload.wikimedia.org/wikipedia/en/9/90/Metal_Gear_Solid_4_Guns_of_the_Patriots_box_art.jpg",
    "God of War III": "https://upload.wikimedia.org/wikipedia/en/6/69/God_of_War_III_cover.jpg",
    "Uncharted 2: Among Thieves": "https://upload.wikimedia.org/wikipedia/en/7/78/Uncharted_2_box_artwork.jpg",
    "Demon's Souls (PS3 Original)": "https://upload.wikimedia.org/wikipedia/en/2/25/Demon%27s_Souls_Cover_Art.jpg",
    "Grand Theft Auto V (PS3)": "https://upload.wikimedia.org/wikipedia/en/a/a5/Grand_Theft_Auto_V.png",
    "Red Dead Redemption": "https://upload.wikimedia.org/wikipedia/en/a/a7/Red_Dead_Redemption.jpg",
    "Dark Souls": "https://upload.wikimedia.org/wikipedia/en/8/8d/Dark_Souls_Cover_Art.jpg",
    "Batman: Arkham City": "https://upload.wikimedia.org/wikipedia/en/0/00/Batman_Arkham_City_Game_Cover.jpg",
    "BioShock Infinite": "https://upload.wikimedia.org/wikipedia/en/5/54/BioShock_Infinite_cover.jpg",

    # === XBOX SERIES X ===
    "Forza Horizon 5": "https://upload.wikimedia.org/wikipedia/en/8/86/Forza_Horizon_5_cover_art.jpg",
    "Starfield": "https://upload.wikimedia.org/wikipedia/en/6/6d/Bethesda_Starfield.jpg",
    "Senua's Saga: Hellblade II": "https://upload.wikimedia.org/wikipedia/en/7/79/Senua%27s_Saga_Hellblade_II_cover.jpg",
    "Elden Ring (Xbox Series)": "https://upload.wikimedia.org/wikipedia/en/b/b9/Elden_Ring_Box_art.jpg",
    "Halo Infinite": "https://upload.wikimedia.org/wikipedia/en/1/14/Halo_Infinite.png",
    "Cyberpunk 2077 (Xbox Series)": "https://upload.wikimedia.org/wikipedia/en/9/9f/Cyberpunk_2077_box_art.jpg",
    "Microsoft Flight Simulator": "https://upload.wikimedia.org/wikipedia/en/b/b3/Microsoft_Flight_Simulator_2020_cover_art.jpg",
    "Hi-Fi RUSH (Physical Edition)": "https://upload.wikimedia.org/wikipedia/en/5/52/Hi-Fi_Rush_cover_art.jpg",
    "Forza Motorsport": "https://upload.wikimedia.org/wikipedia/en/f/f4/Forza_Motorsport_%282023%29_cover_art.jpg",
    "Gears Tactics": "https://upload.wikimedia.org/wikipedia/en/9/90/Gears_Tactics_cover_art.jpg",

    # === XBOX ONE ===
    "Forza Horizon 4": "https://upload.wikimedia.org/wikipedia/en/8/87/Forza_Horizon_4_cover.jpg",
    "Halo 5: Guardians": "https://upload.wikimedia.org/wikipedia/en/7/78/Halo_5_Guardians_box_art.png",
    "Gears 5": "https://upload.wikimedia.org/wikipedia/en/c/cd/Gears_5_cover_art.png",
    "Sea of Thieves": "https://upload.wikimedia.org/wikipedia/en/7/7a/Sea_of_thieves_cover_art.jpg",
    "Quantum Break": "https://upload.wikimedia.org/wikipedia/en/9/93/Quantum_Break_cover_art.jpg",
    "Sunset Overdrive": "https://upload.wikimedia.org/wikipedia/en/8/8c/Sunset_Overdrive_cover.jpg",
    "Ori and the Will of the Wisps (Collector Edition)": "https://upload.wikimedia.org/wikipedia/en/9/94/Ori_and_the_Will_of_the_Wisps.jpg",
    "Cuphead (Physical Edition)": "https://upload.wikimedia.org/wikipedia/en/c/ce/Cuphead_%28artwork%29.png",
    "Ryse: Son of Rome": "https://upload.wikimedia.org/wikipedia/en/a/ad/Ryse_Son_of_Rome_box_art.jpg",
    "Dead Rising 3": "https://upload.wikimedia.org/wikipedia/en/c/cf/Dead_Rising_3_box_art.jpg",

    # === NINTENDO SWITCH ===
    "The Legend of Zelda: Tears of the Kingdom": "https://upload.wikimedia.org/wikipedia/en/f/fb/The_Legend_of_Zelda_Tears_of_the_Kingdom_cover.jpg",
    "The Legend of Zelda: Breath of the Wild": "https://upload.wikimedia.org/wikipedia/en/c/c6/The_Legend_of_Zelda_Breath_of_the_Wild.jpg",
    "Super Mario Odyssey": "https://upload.wikimedia.org/wikipedia/en/8/8d/Super_Mario_Odyssey.jpg",
    "Mario Kart 8 Deluxe": "https://upload.wikimedia.org/wikipedia/en/b/b5/MarioKart8Boxart.jpg",
    "Super Smash Bros. Ultimate": "https://upload.wikimedia.org/wikipedia/en/5/50/Super_Smash_Bros._Ultimate.jpg",
    "Metroid Dread": "https://upload.wikimedia.org/wikipedia/en/f/f7/Metroid_Dread_Box_Art.png",
    "Pokemon Scarlet": "https://upload.wikimedia.org/wikipedia/en/a/af/Pokemon_Scarlet_and_Violet_box_art.jpg",
    "Animal Crossing: New Horizons": "https://upload.wikimedia.org/wikipedia/en/1/1f/Animal_Crossing_New_Horizons.jpg",
    "Xenoblade Chronicles 3": "https://upload.wikimedia.org/wikipedia/en/a/a2/Xenoblade_Chronicles_3_box_art.jpg",
    "Fire Emblem: Three Houses": "https://upload.wikimedia.org/wikipedia/en/2/29/Fire_Emblem_Three_Houses.jpg",

    # === NINTENDO WII U ===
    "The Legend of Zelda: The Wind Waker HD": "https://upload.wikimedia.org/wikipedia/en/8/89/The_Legend_of_Zelda_The_Wind_Waker_HD_cover.jpg",
    "Super Mario 3D World (Wii U)": "https://upload.wikimedia.org/wikipedia/en/d/d9/Super_Mario_3D_World_Box_Art.png",
    "Mario Kart 8 (Wii U Original)": "https://upload.wikimedia.org/wikipedia/en/b/b5/MarioKart8Boxart.jpg",
    "Super Mario Maker": "https://upload.wikimedia.org/wikipedia/en/9/9b/Super_Mario_Maker_box_art.jpg",
    "Bayonetta 2 (Wii U Disc)": "https://upload.wikimedia.org/wikipedia/en/c/c5/Bayonetta_2_box_art.jpg",
    "Xenoblade Chronicles X": "https://upload.wikimedia.org/wikipedia/en/6/66/Xenoblade_Chronicles_X_box_art.jpg",
    "Splatoon": "https://upload.wikimedia.org/wikipedia/en/2/2e/Splatoon_box_art.png",
    "Super Smash Bros. for Wii U": "https://upload.wikimedia.org/wikipedia/en/5/50/Super_Smash_Bros._for_Nintendo_3DS_and_Wii_U_box_art.jpg",
    "Donkey Kong Country: Tropical Freeze": "https://upload.wikimedia.org/wikipedia/en/3/30/Donkey_Kong_Country_Tropical_Freeze_box_art.jpg",
    "Pikmin 3": "https://upload.wikimedia.org/wikipedia/en/7/7b/Pikmin_3_box_art.jpg",
}

print(f"Mengunduh 70 cover game ke {GAMES_DIR}...")
success_count = 0

for game in Game.objects.all():
    img_url = TITLE_TO_IMAGE_URL.get(game.title)
    if not img_url:
        print(f"Skip (no URL): {game.title}")
        continue

    ext = "png" if ".png" in img_url else "jpg"
    filename = f"{game.slug}.{ext}"
    local_path = os.path.join(GAMES_DIR, filename)
    public_url = f"/images/games/{filename}"

    if download_file(img_url, local_path):
        game.cover_image_url = public_url
        game.save()
        success_count += 1
        print(f"[{success_count}/70] Sukses: {game.title}")
    else:
        print(f"Gagal download: {game.title}")
    
    time.sleep(0.08)

print(f"\nTotal game cover berhasil diunduh dan diupdate di Supabase: {success_count}/70")
