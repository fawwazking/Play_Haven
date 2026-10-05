import os

BANNERS_DIR = r"C:\Sem5\E Commerce\PlayHaven\frontend\public\images\banners"
os.makedirs(BANNERS_DIR, exist_ok=True)

banners = [
    {
        "filename": "banner-hero-1.svg",
        "tag": "EXCLUSIVES & PRE-ORDERS",
        "title": "PLAYSTATION 5 NEXT-GEN ARRIVAL",
        "subtitle": "Rasakan kedalaman grafis 4K Ray Tracing dan DualSense Haptic Feedback pada kaset fisik original.",
        "bg_start": "#030712",
        "bg_end": "#0b192c",
        "accent": "#0070d1",
        "badge": "PS5 DISC EDITION"
    },
    {
        "filename": "banner-hero-2.svg",
        "tag": "UNRIVALED POWER",
        "title": "XBOX SERIES X|S PHYSICAL DISCS",
        "subtitle": "Koleksi Blu-ray Disc 12 Teraflops terlengkap dengan Smart Delivery dan Quick Resume.",
        "bg_start": "#022c22",
        "bg_end": "#051914",
        "accent": "#107c10",
        "badge": "XBOX SERIES X"
    },
    {
        "filename": "banner-hero-3.svg",
        "tag": "PORTABLE ADVENTURE",
        "title": "NINTENDO SWITCH CARTRIDGE VAULT",
        "subtitle": "Petualangan tanpa batas Hyrule dan Mushroom Kingdom dalam cartridge fisik bergaransi resmi.",
        "bg_start": "#450a0a",
        "bg_end": "#180505",
        "accent": "#e60012",
        "badge": "OLED & HYBRID"
    },
    {
        "filename": "banner-hero-4.svg",
        "tag": "RETRO & LEGACY GEMS",
        "title": "CLASSIC CONSOLE HERITAGE (PS3 & WII U)",
        "subtitle": "Koleksi langka kaset Blu-ray PS3 segel & Disc Wii U legendaris untuk kolektor sejati.",
        "bg_start": "#1e1b4b",
        "bg_end": "#0f172a",
        "accent": "#8b5cf6",
        "badge": "COLLECTOR SPECIAL"
    }
]

template = """<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="600" viewBox="0 0 1920 600">
  <defs>
    <linearGradient id="banner_grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{bg_start}" />
      <stop offset="100%" stop-color="{bg_end}" />
    </linearGradient>
    <radialGradient id="glow" cx="75%" cy="50%" r="50%">
      <stop offset="0%" stop-color="{accent}" stop-opacity="0.35" />
      <stop offset="100%" stop-color="{bg_end}" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="1920" height="600" fill="url(#banner_grad)" />
  <circle cx="1400" cy="300" r="450" fill="url(#glow)" />

  <!-- Grid Tech Lines Pattern -->
  <g opacity="0.08" stroke="#ffffff" stroke-width="1">
    <line x1="0" y1="100" x2="1920" y2="100" />
    <line x1="0" y1="200" x2="1920" y2="200" />
    <line x1="0" y1="300" x2="1920" y2="300" />
    <line x1="0" y1="400" x2="1920" y2="400" />
    <line x1="0" y1="500" x2="1920" y2="500" />
    <line x1="200" y1="0" x2="200" y2="600" />
    <line x1="500" y1="0" x2="500" y2="600" />
    <line x1="800" y1="0" x2="800" y2="600" />
    <line x1="1100" y1="0" x2="1100" y2="600" />
    <line x1="1400" y1="0" x2="1400" y2="600" />
    <line x1="1700" y1="0" x2="1700" y2="600" />
  </g>

  <!-- Tag / Pill Badge -->
  <g transform="translate(120, 140)">
    <rect width="240" height="34" rx="17" fill="{accent}" fill-opacity="0.2" stroke="{accent}" stroke-width="1.5" />
    <text x="120" y="22" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="12" font-weight="800" fill="#38bdf8" text-anchor="middle" letter-spacing="2">{tag}</text>
  </g>

  <!-- Title -->
  <text x="120" y="245" font-family="'Rajdhani', sans-serif" font-size="56" font-weight="800" fill="#ffffff" letter-spacing="1.5">
    {title}
  </text>

  <!-- Subtitle -->
  <text x="120" y="305" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="20" fill="#94a3b8" font-weight="400">
    {subtitle}
  </text>

  <!-- Button Decorative -->
  <g transform="translate(120, 360)">
    <rect width="220" height="52" rx="10" fill="{accent}" />
    <text x="110" y="32" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="16" font-weight="700" fill="#ffffff" text-anchor="middle">JELAJAHI KATALOG</text>
  </g>

  <!-- Hardware Badge Card on Right -->
  <g transform="translate(1320, 160)">
    <rect width="440" height="280" rx="24" fill="#0f172a" fill-opacity="0.6" stroke="#334155" stroke-width="2" />
    <rect x="24" y="24" width="392" height="232" rx="16" fill="{accent}" fill-opacity="0.08" />
    <text x="220" y="145" font-family="'Rajdhani', sans-serif" font-size="34" font-weight="800" fill="#f8fafc" text-anchor="middle" letter-spacing="2">{badge}</text>
    <text x="220" y="185" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="14" font-weight="600" fill="#38bdf8" text-anchor="middle" letter-spacing="3">AUTHENTIC PHYSICAL MEDIA</text>
  </g>
</svg>"""

for b in banners:
    outpath = os.path.join(BANNERS_DIR, b["filename"])
    svg_data = template.format(
        bg_start=b["bg_start"],
        bg_end=b["bg_end"],
        accent=b["accent"],
        tag=b["tag"],
        title=b["title"],
        subtitle=b["subtitle"],
        badge=b["badge"]
    )
    with open(outpath, "w", encoding="utf-8") as f:
        f.write(svg_data)
    print(f"Generated hero banner: {b['filename']}")
