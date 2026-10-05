import uuid
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from catalog.models import Platform, ConsoleCategory, Game, GameVariant, Region, Condition

class Command(BaseCommand):
    help = 'Seeds initial console categories, platforms, and Top 10 BD games per console'

    def handle(self, *args, **options):
        self.stdout.write("Seeding platforms...")
        
        # 1. Platforms setup
        # PS: 3 generasi (PS3, PS4, PS5)
        # Xbox: 2 generasi terakhir (Xbox One, Xbox Series X)
        # Nintendo: 2 generasi terakhir (Wii U, Nintendo Switch)
        platforms_data = [
            # PlayStation (3 Generasi)
            {'name': 'PlayStation 5', 'slug': 'ps5', 'category': ConsoleCategory.PLAYSTATION, 'generation': 'Gen 9'},
            {'name': 'PlayStation 4', 'slug': 'ps4', 'category': ConsoleCategory.PLAYSTATION, 'generation': 'Gen 8'},
            {'name': 'PlayStation 3', 'slug': 'ps3', 'category': ConsoleCategory.PLAYSTATION, 'generation': 'Gen 7'},
            # Xbox (2 Generasi)
            {'name': 'Xbox Series X', 'slug': 'xbox-series-x', 'category': ConsoleCategory.XBOX, 'generation': 'Gen 9'},
            {'name': 'Xbox One', 'slug': 'xbox-one', 'category': ConsoleCategory.XBOX, 'generation': 'Gen 8'},
            # Nintendo (2 Generasi)
            {'name': 'Nintendo Switch', 'slug': 'switch', 'category': ConsoleCategory.NINTENDO, 'generation': 'Gen 8 / Hybrid'},
            {'name': 'Nintendo Wii U', 'slug': 'wii-u', 'category': ConsoleCategory.NINTENDO, 'generation': 'Gen 8 Early'},
        ]

        platform_objs = {}
        for p in platforms_data:
            obj, _ = Platform.objects.get_or_create(
                slug=p['slug'],
                defaults={'name': p['name'], 'category': p['category'], 'generation': p['generation']}
            )
            platform_objs[p['slug']] = obj

        self.stdout.write("Seeding top games & variants...")

        # Top 10 data games per platform
        catalog_dataset = [
            # ================= PLAYSTATION 5 =================
            {
                'platform': 'ps5',
                'title': "Marvel's Spider-Man 2",
                'publisher': 'Sony Interactive Entertainment', 'developer': 'Insomniac Games', 'year': 2023,
                'desc': 'Peter Parker dan Miles Morales menghadapi ancaman terbesar symbiote Venom di New York.',
                'image': 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 879000, 'price_used': 599000, 'weight': 140
            },
            {
                'platform': 'ps5',
                'title': 'God of War Ragnarok',
                'publisher': 'Sony Interactive Entertainment', 'developer': 'Santa Monica Studio', 'year': 2022,
                'desc': 'Petualangan Kratos dan Atreus melintasi Nine Realms menjelang terjadinya pertempuran Ragnarok.',
                'image': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 829000, 'price_used': 549000, 'weight': 140
            },
            {
                'platform': 'ps5',
                'title': "Demon's Souls",
                'publisher': 'Sony Interactive Entertainment', 'developer': 'Bluepoint Games', 'year': 2020,
                'desc': 'Remake mahakarya aksi Souls legendaris di kerajaan gelap Boletaria dengan visual next-gen.',
                'image': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 699000, 'price_used': 420000, 'weight': 130
            },
            {
                'platform': 'ps5',
                'title': 'Final Fantasy VII Rebirth',
                'publisher': 'Square Enix', 'developer': 'Square Enix', 'year': 2024,
                'desc': 'Kelanjutan perjalanan Cloud Strife dan kawan-kawan menjelajahi dunia luas di luar Midgar.',
                'image': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 949000, 'price_used': 699000, 'weight': 170
            },
            {
                'platform': 'ps5',
                'title': 'Returnal',
                'publisher': 'Sony Interactive Entertainment', 'developer': 'Housemarque', 'year': 2021,
                'desc': 'Aksi roguelike third-person shooter psikologis di planet asing Atropos yang selalu berubah.',
                'image': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 649000, 'price_used': 399000, 'weight': 130
            },
            {
                'platform': 'ps5',
                'title': 'Horizon Forbidden West',
                'publisher': 'Sony Interactive Entertainment', 'developer': 'Guerrilla Games', 'year': 2022,
                'desc': 'Aloy menjelajahi kawasan Barat Terlarang yang misterius dan sarat monster robot ganas.',
                'image': 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 749000, 'price_used': 490000, 'weight': 140
            },
            {
                'platform': 'ps5',
                'title': 'Ratchet & Clank: Rift Apart',
                'publisher': 'Sony Interactive Entertainment', 'developer': 'Insomniac Games', 'year': 2021,
                'desc': 'Petualangan melompati dimensi antar galaksi dengan kecepatan ultra SSD PS5.',
                'image': 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 629000, 'price_used': 399000, 'weight': 130
            },
            {
                'platform': 'ps5',
                'title': 'The Last of Us Part I',
                'publisher': 'Sony Interactive Entertainment', 'developer': 'Naughty Dog', 'year': 2022,
                'desc': 'Kisah emosional Joel dan Ellie yang dibangun ulang dari dasar memanfaatkan kekuatan PS5.',
                'image': 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 799000, 'price_used': 529000, 'weight': 135
            },
            {
                'platform': 'ps5',
                'title': 'Gran Turismo 7',
                'publisher': 'Sony Interactive Entertainment', 'developer': 'Polyphony Digital', 'year': 2022,
                'desc': 'Simulasi balap motorsport definitif dengan physics akurat dan ratusan mobil realistis.',
                'image': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 749000, 'price_used': 480000, 'weight': 140
            },
            {
                'platform': 'ps5',
                'title': 'Stellar Blade',
                'publisher': 'Sony Interactive Entertainment', 'developer': 'Shift Up', 'year': 2024,
                'desc': 'Aksi laga beroktan tinggi Eve membebaskan Bumi dari cengkeraman makhluk Naytiba.',
                'image': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 899000, 'price_used': 649000, 'weight': 140
            },

            # ================= PLAYSTATION 4 =================
            {
                'platform': 'ps4',
                'title': 'Bloodborne',
                'publisher': 'Sony Interactive Entertainment', 'developer': 'FromSoftware', 'year': 2015,
                'desc': 'Aksi RPG gotik karya Hidetaka Miyazaki bertempat di kota terkutuk Yharnam.',
                'image': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 349000, 'price_used': 199000, 'weight': 120
            },
            {
                'platform': 'ps4',
                'title': 'The Last of Us Part II',
                'publisher': 'Sony Interactive Entertainment', 'developer': 'Naughty Dog', 'year': 2020,
                'desc': 'Kisah balas dendam kelam Ellie melintasi sisa-sisa reruntuhan kota Seattle.',
                'image': 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 449000, 'price_used': 279000, 'weight': 150
            },
            {
                'platform': 'ps4',
                'title': 'Ghost of Tsushima',
                'publisher': 'Sony Interactive Entertainment', 'developer': 'Sucker Punch', 'year': 2020,
                'desc': 'Jin Sakai bertarung demi menyelamatkan tanah air Tsushima dari invasi tentara Mongol.',
                'image': 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 499000, 'price_used': 299000, 'weight': 125
            },
            {
                'platform': 'ps4',
                'title': 'God of War (2018)',
                'publisher': 'Sony Interactive Entertainment', 'developer': 'Santa Monica Studio', 'year': 2018,
                'desc': 'Awal babak baru Kratos di mitologi Nordik mendidik putranya Atreus bertahan hidup.',
                'image': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 329000, 'price_used': 189000, 'weight': 120
            },
            {
                'platform': 'ps4',
                'title': 'Uncharted 4: A Thief\'s End',
                'publisher': 'Sony Interactive Entertainment', 'developer': 'Naughty Dog', 'year': 2016,
                'desc': 'Petualangan pamungkas Nathan Drake memburu harta karun bajak laut Libertalia.',
                'image': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 299000, 'price_used': 169000, 'weight': 120
            },
            {
                'platform': 'ps4',
                'title': 'Red Dead Redemption 2',
                'publisher': 'Rockstar Games', 'developer': 'Rockstar Studios', 'year': 2018,
                'desc': 'Epos koboi Arthur Morgan dan geng Van der Linde di era pudarnya Wild West Amerika.',
                'image': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 449000, 'price_used': 289000, 'weight': 160
            },
            {
                'platform': 'ps4',
                'title': 'Persona 5 Royal',
                'publisher': 'SEGA', 'developer': 'Atlus', 'year': 2020,
                'desc': 'JRPG stylish mengisahkan Phantom Thieves mereformasi hati korup para penjahat di Tokyo.',
                'image': 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 489000, 'price_used': 319000, 'weight': 125
            },
            {
                'platform': 'ps4',
                'title': 'Horizon Zero Dawn: Complete Edition',
                'publisher': 'Sony Interactive Entertainment', 'developer': 'Guerrilla Games', 'year': 2017,
                'desc': 'Aloy membongkar masa lalu peradaban kuno di tengah alam liar pasca kehancuran.',
                'image': 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 279000, 'price_used': 159000, 'weight': 120
            },
            {
                'platform': 'ps4',
                'title': 'Monster Hunter: World',
                'publisher': 'Capcom', 'developer': 'Capcom', 'year': 2018,
                'desc': 'Berburu monster raksasa dan mengumpulkan material senjata di ekosistem New World.',
                'image': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 299000, 'price_used': 179000, 'weight': 120
            },
            {
                'platform': 'ps4',
                'title': 'Marvel\'s Spider-Man',
                'publisher': 'Sony Interactive Entertainment', 'developer': 'Insomniac Games', 'year': 2018,
                'desc': 'Aksi berayun lincah melintasi gedung Manhattan melawan Sinister Six.',
                'image': 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 349000, 'price_used': 210000, 'weight': 120
            },

            # ================= PLAYSTATION 3 =================
            {
                'platform': 'ps3',
                'title': 'The Last of Us (PS3)',
                'publisher': 'Sony Computer Entertainment', 'developer': 'Naughty Dog', 'year': 2013,
                'desc': 'Rilisan original karya pemenang ratusan Game of the Year di era konsol legendaris PS3.',
                'image': 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 299000, 'price_used': 139000, 'weight': 110
            },
            {
                'platform': 'ps3',
                'title': 'Grand Theft Auto V (PS3)',
                'publisher': 'Rockstar Games', 'developer': 'Rockstar North', 'year': 2013,
                'desc': 'Kisah trio kriminal Michael, Franklin, dan Trevor mengguncang Los Santos.',
                'image': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 289000, 'price_used': 149000, 'weight': 115
            },
            {
                'platform': 'ps3',
                'title': 'Metal Gear Solid 4: Guns of the Patriots',
                'publisher': 'Konami', 'developer': 'Kojima Productions', 'year': 2008,
                'desc': 'Misi infiltrasi epik Solid Snake mengakhiri konspirasi nanoteknologi The Patriots.',
                'image': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 399000, 'price_used': 189000, 'weight': 115
            },
            {
                'platform': 'ps3',
                'title': 'Uncharted 2: Among Thieves',
                'publisher': 'Sony Computer Entertainment', 'developer': 'Naughty Dog', 'year': 2009,
                'desc': 'Pencarian batu Cintamani legendaris di Shambhala dengan adegan set-piece sinematik.',
                'image': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 249000, 'price_used': 119000, 'weight': 110
            },
            {
                'platform': 'ps3',
                'title': 'God of War III',
                'publisher': 'Sony Computer Entertainment', 'developer': 'Santa Monica Studio', 'year': 2010,
                'desc': 'Puncak pembalasan dendam Kratos menghancurkan para dewa Gunung Olympus.',
                'image': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 279000, 'price_used': 130000, 'weight': 115
            },
            {
                'platform': 'ps3',
                'title': 'Red Dead Redemption',
                'publisher': 'Rockstar Games', 'developer': 'Rockstar San Diego', 'year': 2010,
                'desc': 'Perjalanan John Marston memburu mantan rekan gengnya demi menyelamatkan keluarganya.',
                'image': 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 319000, 'price_used': 159000, 'weight': 115
            },
            {
                'platform': 'ps3',
                'title': 'Dark Souls',
                'publisher': 'Bandai Namco', 'developer': 'FromSoftware', 'year': 2011,
                'desc': 'Pelopor genre Souls-like legendaris di Lordran yang menguji kesabaran dan keahlian bertarung.',
                'image': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 349000, 'price_used': 169000, 'weight': 115
            },
            {
                'platform': 'ps3',
                'title': 'Batman: Arkham City',
                'publisher': 'Warner Bros.', 'developer': 'Rocksteady Studios', 'year': 2011,
                'desc': 'Sang Ksatria Kegelapan berpatroli di penjara kota terbuka berkeamanan tinggi Arkham City.',
                'image': 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 239000, 'price_used': 110000, 'weight': 110
            },
            {
                'platform': 'ps3',
                'title': 'BioShock Infinite',
                'publisher': '2K Games', 'developer': 'Irrational Games', 'year': 2013,
                'desc': 'Booker DeWitt menyelamatkan Elizabeth di kota megah melayang Columbia.',
                'image': 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 229000, 'price_used': 105000, 'weight': 110
            },
            {
                'platform': 'ps3',
                'title': 'Demon\'s Souls (PS3 Original)',
                'publisher': 'Atlus / Sony', 'developer': 'FromSoftware', 'year': 2009,
                'desc': 'Edisi kaset Blu-ray perdana yang memulai era revolusi game aksi sulit kontemporer.',
                'image': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 450000, 'price_used': 220000, 'weight': 115
            },

            # ================= XBOX SERIES X =================
            {
                'platform': 'xbox-series-x',
                'title': 'Halo Infinite',
                'publisher': 'Xbox Game Studios', 'developer': '343 Industries', 'year': 2021,
                'desc': 'Master Chief kembali dalam petualangan eksplorasi open-world Zeta Halo.',
                'image': 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 699000, 'price_used': 419000, 'weight': 130
            },
            {
                'platform': 'xbox-series-x',
                'title': 'Forza Horizon 5',
                'publisher': 'Xbox Game Studios', 'developer': 'Playground Games', 'year': 2021,
                'desc': 'Festival balap mobil open-world spektakuler menjelajahi bentang alam Meksiko yang hidup.',
                'image': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 799000, 'price_used': 489000, 'weight': 130
            },
            {
                'platform': 'xbox-series-x',
                'title': 'Starfield',
                'publisher': 'Bethesda Softworks', 'developer': 'Bethesda Game Studios', 'year': 2023,
                'desc': 'Jelajahi lebih dari 1.000 planet dalam RPG luar angkasa pertama Bethesda dalam 25 tahun.',
                'image': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 749000, 'price_used': 459000, 'weight': 135
            },
            {
                'platform': 'xbox-series-x',
                'title': 'Gears Tactics',
                'publisher': 'Xbox Game Studios', 'developer': 'Splash Damage', 'year': 2020,
                'desc': 'Game strategi taktis berbasis giliran bertempo cepat di medan perang Gears of War.',
                'image': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 499000, 'price_used': 299000, 'weight': 130
            },
            {
                'platform': 'xbox-series-x',
                'title': 'Senua\'s Saga: Hellblade II',
                'publisher': 'Xbox Game Studios', 'developer': 'Ninja Theory', 'year': 2024,
                'desc': 'Pengalaman naratif sinematik imersif Senua melintasi mitos dan siksaan Islandia zaman Viking.',
                'image': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 799000, 'price_used': 529000, 'weight': 130
            },
            {
                'platform': 'xbox-series-x',
                'title': 'Microsoft Flight Simulator',
                'publisher': 'Xbox Game Studios', 'developer': 'Asobo Studio', 'year': 2021,
                'desc': 'Simulasi penerbangan realistis memetakan seluruh bumi dalam skala 1:1 di Xbox Series X.',
                'image': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 749000, 'price_used': 450000, 'weight': 130
            },
            {
                'platform': 'xbox-series-x',
                'title': 'Elden Ring (Xbox Series)',
                'publisher': 'Bandai Namco', 'developer': 'FromSoftware', 'year': 2022,
                'desc': 'Petualangan fantasi epik di The Lands Between untuk menjadi Elden Lord.',
                'image': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 799000, 'price_used': 499000, 'weight': 130
            },
            {
                'platform': 'xbox-series-x',
                'title': 'Cyberpunk 2077 (Xbox Series)',
                'publisher': 'CD Projekt', 'developer': 'CD Projekt RED', 'year': 2020,
                'desc': 'Jelajahi megacity Night City yang terobsesi dengan modifikasi tubuh, kekuasaan, dan glamor.',
                'image': 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 599000, 'price_used': 379000, 'weight': 130
            },
            {
                'platform': 'xbox-series-x',
                'title': 'Forza Motorsport',
                'publisher': 'Xbox Game Studios', 'developer': 'Turn 10 Studios', 'year': 2023,
                'desc': 'Balapan sirkuit kompetitif dengan ray tracing real-time di atas aspal dan sistem wear ban.',
                'image': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 789000, 'price_used': 499000, 'weight': 130
            },
            {
                'platform': 'xbox-series-x',
                'title': 'Hi-Fi RUSH (Physical Edition)',
                'publisher': 'Bethesda Softworks', 'developer': 'Tango Gameworks', 'year': 2023,
                'desc': 'Aksi brawler penuh irama di mana serangan karakter bergerak sinkron dengan ketukan musik rock.',
                'image': 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 629000, 'price_used': 389000, 'weight': 130
            },

            # ================= XBOX ONE =================
            {
                'platform': 'xbox-one',
                'title': 'Gears 5',
                'publisher': 'Xbox Game Studios', 'developer': 'The Coalition', 'year': 2019,
                'desc': 'Kait Diaz mengungkap hubungannya dengan musuh Swarm di tengah perang total Sera.',
                'image': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 349000, 'price_used': 189000, 'weight': 120
            },
            {
                'platform': 'xbox-one',
                'title': 'Forza Horizon 4',
                'publisher': 'Xbox Game Studios', 'developer': 'Playground Games', 'year': 2018,
                'desc': 'Sensasi balapan mobil dinamis 4 musim melintasi perbukitan dan kota bersejarah Inggris.',
                'image': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 379000, 'price_used': 210000, 'weight': 120
            },
            {
                'platform': 'xbox-one',
                'title': 'Halo 5: Guardians',
                'publisher': 'Microsoft Studios', 'developer': '343 Industries', 'year': 2015,
                'desc': 'Perburuan Spartan Locke melacak Master Chief yang menghilang melintasi koloni galaksi.',
                'image': 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 299000, 'price_used': 159000, 'weight': 120
            },
            {
                'platform': 'xbox-one',
                'title': 'Sea of Thieves',
                'publisher': 'Xbox Game Studios', 'developer': 'Rare', 'year': 2018,
                'desc': 'Jelajahi samudra lepas, cari peti emas, dan bertarung melawan kapal bajak laut lain.',
                'image': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 329000, 'price_used': 179000, 'weight': 120
            },
            {
                'platform': 'xbox-one',
                'title': 'Sunset Overdrive',
                'publisher': 'Microsoft Studios', 'developer': 'Insomniac Games', 'year': 2014,
                'desc': 'Aksi akrobatik lincah di kota penuh mutant akibat minuman energi beracun.',
                'image': 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 279000, 'price_used': 149000, 'weight': 120
            },
            {
                'platform': 'xbox-one',
                'title': 'Quantum Break',
                'publisher': 'Microsoft Studios', 'developer': 'Remedy Entertainment', 'year': 2016,
                'desc': 'Aksi manipulasi waktu berpadu dengan tayangan live-action series menegangkan.',
                'image': 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 269000, 'price_used': 139000, 'weight': 120
            },
            {
                'platform': 'xbox-one',
                'title': 'Ori and the Will of the Wisps (Collector Edition)',
                'publisher': 'Xbox Game Studios', 'developer': 'Moon Studios', 'year': 2020,
                'desc': 'Petualangan platformer penuh visual artistik memukau dan gameplay presisi.',
                'image': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 449000, 'price_used': 260000, 'weight': 130
            },
            {
                'platform': 'xbox-one',
                'title': 'Cuphead (Physical Edition)',
                'publisher': 'Studio MDHR', 'developer': 'Studio MDHR', 'year': 2017,
                'desc': 'Aksi run-and-gun menantang bergaya kartun klasik 1930-an yang digambar tangan.',
                'image': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 389000, 'price_used': 229000, 'weight': 120
            },
            {
                'platform': 'xbox-one',
                'title': 'Dead Rising 3',
                'publisher': 'Microsoft Studios', 'developer': 'Capcom Vancouver', 'year': 2013,
                'desc': 'Bertahan hidup dan merakit senjata gila menghadapi ribuan zombie di Los Perdidos.',
                'image': 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 249000, 'price_used': 129000, 'weight': 120
            },
            {
                'platform': 'xbox-one',
                'title': 'Ryse: Son of Rome',
                'publisher': 'Microsoft Studios', 'developer': 'Crytek', 'year': 2013,
                'desc': 'Laga gladiator brutal prajurit Romawi Marius Titus membalas dendam kematian keluarganya.',
                'image': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 239000, 'price_used': 120000, 'weight': 120
            },

            # ================= NINTENDO SWITCH =================
            {
                'platform': 'switch',
                'title': 'The Legend of Zelda: Tears of the Kingdom',
                'publisher': 'Nintendo', 'developer': 'Nintendo EPD', 'year': 2023,
                'desc': 'Jelajahi daratan, langit, dan kedalaman bawah tanah Hyrule dengan kekuatan kreasi Ultrahand.',
                'image': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 799000, 'price_used': 569000, 'weight': 60
            },
            {
                'platform': 'switch',
                'title': 'Super Smash Bros. Ultimate',
                'publisher': 'Nintendo', 'developer': 'Bandai Namco / Sora Ltd.', 'year': 2018,
                'desc': 'Pertarungan arena terbesar mengumpulkan setiap karakter ikonik sepanjang sejarah gaming.',
                'image': 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 699000, 'price_used': 489000, 'weight': 60
            },
            {
                'platform': 'switch',
                'title': 'Super Mario Odyssey',
                'publisher': 'Nintendo', 'developer': 'Nintendo EPD', 'year': 2017,
                'desc': 'Petualangan platforming 3D Mario menjelajahi beragam kerajaan dunia bersama topi Cappy.',
                'image': 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 649000, 'price_used': 449000, 'weight': 60
            },
            {
                'platform': 'switch',
                'title': 'Mario Kart 8 Deluxe',
                'publisher': 'Nintendo', 'developer': 'Nintendo EPD', 'year': 2017,
                'desc': 'Balapan gokart paling laris dengan puluhan lintasan seru dan kompetisi multiplayer.',
                'image': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 649000, 'price_used': 459000, 'weight': 60
            },
            {
                'platform': 'switch',
                'title': 'The Legend of Zelda: Breath of the Wild',
                'publisher': 'Nintendo', 'developer': 'Nintendo EPD', 'year': 2017,
                'desc': 'Petualangan open-world revolusioner menjelajahi Hyrule tanpa batasan.',
                'image': 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 689000, 'price_used': 479000, 'weight': 60
            },
            {
                'platform': 'switch',
                'title': 'Pokemon Scarlet',
                'publisher': 'Nintendo / The Pokemon Company', 'developer': 'Game Freak', 'year': 2022,
                'desc': 'Tangkap dan latih Pokemon dalam petualangan open-world di region Paldea.',
                'image': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 649000, 'price_used': 439000, 'weight': 60
            },
            {
                'platform': 'switch',
                'title': 'Animal Crossing: New Horizons',
                'publisher': 'Nintendo', 'developer': 'Nintendo EPD', 'year': 2020,
                'desc': 'Bangun dan kelola pulau tropis impian Anda bersama para penduduk hewan yang ramah.',
                'image': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 649000, 'price_used': 449000, 'weight': 60
            },
            {
                'platform': 'switch',
                'title': 'Metroid Dread',
                'publisher': 'Nintendo', 'developer': 'MercurySteam', 'year': 2021,
                'desc': 'Samus Aran menghadapi robot pembunuh E.M.M.I di labirin planet ZDR yang mencekam.',
                'image': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 629000, 'price_used': 419000, 'weight': 60
            },
            {
                'platform': 'switch',
                'title': 'Fire Emblem: Three Houses',
                'publisher': 'Nintendo', 'developer': 'Intelligent Systems', 'year': 2019,
                'desc': 'Pimpin murid akademi perwira Garreg Mach dalam perang taktis antar tiga faksi benua Fódlan.',
                'image': 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 649000, 'price_used': 439000, 'weight': 60
            },
            {
                'platform': 'switch',
                'title': 'Xenoblade Chronicles 3',
                'publisher': 'Nintendo', 'developer': 'Monolith Soft', 'year': 2022,
                'desc': 'JRPG epik mengisahkan perjuangan Noah dan Mio memutus siklus perang abadi dunia Aionios.',
                'image': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 679000, 'price_used': 469000, 'weight': 60
            },

            # ================= NINTENDO WII U =================
            {
                'platform': 'wii-u',
                'title': 'Super Mario 3D World (Wii U)',
                'publisher': 'Nintendo', 'developer': 'Nintendo EAD', 'year': 2013,
                'desc': 'Platformer 3D ceria multiplayer 4 pemain dengan transformasi Cat Mario.',
                'image': 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 329000, 'price_used': 159000, 'weight': 120
            },
            {
                'platform': 'wii-u',
                'title': 'Mario Kart 8 (Wii U Original)',
                'publisher': 'Nintendo', 'developer': 'Nintendo EAD', 'year': 2014,
                'desc': 'Rilisan original balapan gravitasi nol pertama di konsol Nintendo Wii U.',
                'image': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 299000, 'price_used': 149000, 'weight': 120
            },
            {
                'platform': 'wii-u',
                'title': 'Super Smash Bros. for Wii U',
                'publisher': 'Nintendo', 'developer': 'Bandai Namco / Sora Ltd.', 'year': 2014,
                'desc': 'Edisi pertarungan HD perdana Smash Bros. dengan dukungan kontroler GameCube.',
                'image': 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 319000, 'price_used': 159000, 'weight': 120
            },
            {
                'platform': 'wii-u',
                'title': 'Splatoon',
                'publisher': 'Nintendo', 'developer': 'Nintendo EAD', 'year': 2015,
                'desc': 'Tembak tinta dan kuasai area Turf War 4v4 dalam IP terobosan baru Nintendo.',
                'image': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 289000, 'price_used': 139000, 'weight': 120
            },
            {
                'platform': 'wii-u',
                'title': 'The Legend of Zelda: The Wind Waker HD',
                'publisher': 'Nintendo', 'developer': 'Nintendo EAD', 'year': 2013,
                'desc': 'Remaster HD memukau gaya cel-shading Link berlayar di samudra The Great Sea.',
                'image': 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 489000, 'price_used': 279000, 'weight': 120
            },
            {
                'platform': 'wii-u',
                'title': 'Bayonetta 2 (Wii U Disc)',
                'publisher': 'Nintendo', 'developer': 'PlatinumGames', 'year': 2014,
                'desc': 'Aksi hack-and-slash akrobatik penyihir Umbra Witch Bayonetta melawan malaikat dan iblis.',
                'image': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 399000, 'price_used': 199000, 'weight': 120
            },
            {
                'platform': 'wii-u',
                'title': 'Xenoblade Chronicles X',
                'publisher': 'Nintendo', 'developer': 'Monolith Soft', 'year': 2015,
                'desc': 'Bertahan hidup dan kendarai robot raksasa Skell di planet asing Mira yang luas.',
                'image': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 449000, 'price_used': 249000, 'weight': 120
            },
            {
                'platform': 'wii-u',
                'title': 'Super Mario Maker',
                'publisher': 'Nintendo', 'developer': 'Nintendo EAD', 'year': 2015,
                'desc': 'Ciptakan level Mario sesuka hati Anda menggunakan layar sentuh Wii U GamePad.',
                'image': 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 279000, 'price_used': 129000, 'weight': 125
            },
            {
                'platform': 'wii-u',
                'title': 'Donkey Kong Country: Tropical Freeze',
                'publisher': 'Nintendo', 'developer': 'Retro Studios', 'year': 2014,
                'desc': 'Petualangan platformer menantang keluarga Kong membebaskan pulau dari Snowmads.',
                'image': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 299000, 'price_used': 149000, 'weight': 120
            },
            {
                'platform': 'wii-u',
                'title': 'Pikmin 3',
                'publisher': 'Nintendo', 'developer': 'Nintendo EAD', 'year': 2013,
                'desc': 'Pimpin kawanan makhluk tanaman kecil Pikmin mengumpulkan buah di planet PNF-404.',
                'image': 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=600&auto=format&fit=crop&q=80',
                'price_sealed': 319000, 'price_used': 159000, 'weight': 120
            }
        ]

        games_created = 0
        variants_created = 0

        for item in catalog_dataset:
            platform_obj = platform_objs[item['platform']]
            slug = slugify(f"{item['title']}-{item['platform']}")
            
            game, _ = Game.objects.get_or_create(
                slug=slug,
                defaults={
                    'title': item['title'],
                    'publisher': item['publisher'],
                    'developer': item['developer'],
                    'release_year': item['year'],
                    'description': item['desc'],
                    'cover_image_url': item['image']
                }
            )
            games_created += 1

            # Varian 1: Sealed (Reg 3)
            sku_sealed = f"SKU-{item['platform'].upper()}-{item['year']}-{str(uuid.uuid4())[:6].upper()}-SEALED"
            GameVariant.objects.get_or_create(
                game=game,
                platform=platform_obj,
                region=Region.REG3,
                condition=Condition.SEALED,
                defaults={
                    'sku': sku_sealed,
                    'price': item['price_sealed'],
                    'stock': 12,
                    'weight_grams': item['weight'],
                    'is_active': True
                }
            )
            variants_created += 1

            # Varian 2: Pre-owned / Bekas (Reg 3)
            sku_used = f"SKU-{item['platform'].upper()}-{item['year']}-{str(uuid.uuid4())[:6].upper()}-USED"
            GameVariant.objects.get_or_create(
                game=game,
                platform=platform_obj,
                region=Region.REG3,
                condition=Condition.PREOWNED,
                defaults={
                    'sku': sku_used,
                    'price': item['price_used'],
                    'stock': 4,
                    'weight_grams': item['weight'],
                    'is_active': True
                }
            )
            variants_created += 1

        self.stdout.write(self.style.SUCCESS(
            f"Successfully seeded: {len(platforms_data)} Platforms, {games_created} Games, and {variants_created} Variants directly to Supabase!"
        ))
