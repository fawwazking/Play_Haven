export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  categoryType: "console" | "accessory" | "voucher";
  category: string;
  platform?: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  stock: number;
  image: string;
  description: string;
  description_en?: string;
  specs?: string[];
  features?: string[];
  region?: string;
  denomination?: string;
}

export const ALL_HARDWARE_PRODUCTS: ProductItem[] = [
  // CONSOLES
  {
    id: "ps5-disc",
    description_en: "Stunning visuals up to 4K 120Hz with near-instant load times. Fully compatible with every PS5 physical disc and thousands of PS4 disc titles. Includes an Ultra HD Blu-ray optical drive for the highest-resolution physical media.",
    name: "Sony PlayStation 5 Disc Edition",
    slug: "ps5-disc-edition",
    categoryType: "console",
    category: "PlayStation",
    platform: "PlayStation 5",
    price: 8499000,
    originalPrice: 9199000,
    stock: 20,
    image: "/images/consoles/ps5-console.png",
    specs: ["1TB Custom NVMe SSD", "Ultra HD Blu-ray Drive", "Tempest 3D AudioTech", "DualSense Controller Included"],
    description: "Nikmati visual grafis memukau hingga 4K 120Hz dan load time instan. Kompatibel penuh dengan seluruh kaset fisik PS5 & ribuan judul kaset PS4. Dilengkapi optical drive Ultra HD Blu-ray untuk membaca disc kaset fisik resolusi tertinggi."
  },
  {
    id: "ps4-pro",
    description_en: "A powerhouse machine that runs the entire best PS4 physical game library with steadier frame rates and 4K output options. Premium optical quality reads Blu-ray discs quietly and smoothly.",
    name: "Sony PlayStation 4 Pro 1TB Jet Black",
    slug: "ps4-pro-1tb",
    categoryType: "console",
    category: "PlayStation",
    platform: "PlayStation 4",
    price: 3899000,
    originalPrice: 4299000,
    stock: 20,
    image: "/images/consoles/ps4-pro-console.png",
    specs: ["1TB HDD Storage", "Dynamic 4K Gaming", "HDR Support", "DualShock 4 V2 Included"],
    description: "Mesin gaming tangguh untuk memutar seluruh library game fisik PS4 terbaik dengan framerate lebih stabil dan opsi resolusi 4K. Kualitas optik prima untuk membaca piringan Blu-ray Disc secara senyap dan lancar."
  },
  {
    id: "ps3-cecha",
    description_en: "A collector's treasure. This rare unit carries a genuine physical Emotion Engine chip, able to read and natively play PS1, PS2 and PS3 physical discs straight from the optical drive.",
    name: "Sony PlayStation 3 Classic CECHA 60GB (Back-compat)",
    slug: "ps3-classic-60gb",
    categoryType: "console",
    category: "PlayStation",
    platform: "PlayStation 3",
    price: 2199000,
    originalPrice: 2499000,
    stock: 20,
    image: "/images/consoles/ps3-console.png",
    specs: ["Emotion Engine Hardware", "4x USB Ports", "CF/SD/MS Card Slots", "DualShock 3 Sixaxis"],
    description: "Koleksi emas para gamer dan kolektor. Unit langka dengan chip Emotion Engine fisik asli yang mampu membaca dan memainkan kaset fisik PS1, PS2, dan PS3 secara native dari piringan optical drive."
  },
  {
    id: "ps-vita",
    description_en: "A legendary handheld with a brilliant 5-inch OLED screen. Runs every PS Vita physical game card plus retro PSP and PS1 collections.",
    name: "Sony PlayStation Vita OLED Crystal Black (PCH-1000)",
    slug: "ps-vita-oled-1000",
    categoryType: "console",
    category: "PlayStation",
    platform: "PlayStation Vita",
    price: 1899000,
    originalPrice: 2299000,
    stock: 15,
    image: "/images/consoles/ps-vita-console.jpg",
    specs: ["5-inch Vibrant OLED Screen", "Dual Analog Sticks", "Rear Multi-touch Pad", "Full PS Vita Physical Card Slot"],
    description: "Konsol genggam legendaris dengan layar OLED brilian 5 inci. Menjalankan seluruh kartu fisik game PS Vita dan koleksi retro PSP/PS1."
  },
  {
    id: "xbox-series-x",
    description_en: "The most powerful console of this generation. Smart Delivery guarantees you always play the best version of your physical disc at no extra cost.",
    name: "Microsoft Xbox Series X 1TB Carbon Black",
    slug: "xbox-series-x-1tb",
    categoryType: "console",
    category: "Xbox",
    platform: "Xbox Series X",
    price: 7999000,
    originalPrice: 8799000,
    stock: 20,
    image: "/images/consoles/xbox-series-x-console.png",
    specs: ["12 Teraflops GPU", "1TB Custom NVMe SSD", "4K UHD Blu-ray Drive", "Quick Resume Multiple Games"],
    description: "Konsol paling bertenaga di generasi ini. Dukungan Smart Delivery memastikan Anda selalu memainkan versi kaset fisik terbaik tanpa biaya tambahan."
  },
  {
    id: "xbox-series-s",
    description_en: "The most compact, power-efficient next-gen console. Enjoy instant load times, Quick Resume and hundreds of recent-generation games.",
    name: "Microsoft Xbox Series S 512GB Robot White Set",
    slug: "xbox-series-s-512gb",
    categoryType: "console",
    category: "Xbox",
    platform: "Xbox Series S",
    price: 4599000,
    originalPrice: 5199000,
    stock: 18,
    image: "/images/consoles/xbox-series-s-console.png",
    specs: ["Custom NVMe SSD Architecture", "1440p up to 120 FPS", "Xbox Velocity Architecture", "Xbox Wireless Controller Included"],
    description: "Konsol next-gen paling ringkas dan hemat daya. Menikmati kecepatan load instan, Quick Resume, dan ratusan game generasi terbaru."
  },
  {
    id: "xbox-one-s",
    description_en: "A sleek design with an internal power supply and a 4K Ultra HD Blu-ray drive for energy-efficient physical gaming and cinematic entertainment.",
    name: "Microsoft Xbox One S 1TB White Edition",
    slug: "xbox-one-s-1tb",
    categoryType: "console",
    category: "Xbox",
    platform: "Xbox One",
    price: 2699000,
    originalPrice: 2999000,
    stock: 20,
    image: "/images/consoles/xbox-one-s-console.png",
    specs: ["1TB Storage", "4K UHD Blu-ray Player", "HDR10 Video", "Xbox Wireless Controller Included"],
    description: "Desain ramping elegan dengan internal power supply dan drive 4K Ultra HD Blu-ray untuk gaming fisik hemat energi dan hiburan sinematik."
  },
  {
    id: "switch-oled",
    description_en: "A 7-inch OLED screen delivers deep blacks and razor-sharp contrast. Play thousands of Switch cartridge games anywhere, or dock it to your living-room TV.",
    name: "Nintendo Switch OLED Model with Dock & Joy-Con",
    slug: "nintendo-switch-oled-white",
    categoryType: "console",
    category: "Nintendo",
    platform: "Nintendo Switch",
    price: 4399000,
    originalPrice: 4799000,
    stock: 20,
    image: "/images/consoles/switch-oled-console.png",
    specs: ["7-inch Vibrant OLED Screen", "Enhanced Audio System", "TV Dock with LAN Port", "Joy-Con White Included"],
    description: "Layar OLED 7 inci menghadirkan warna pekat dan kontras tajam. Mainkan ribuan kaset cartridge Switch di mana saja atau sambungkan ke TV ruang keluarga."
  },
  {
    id: "switch-lite",
    description_en: "Purpose-built for lightweight, ultra-portable handheld play. Compatible with every Nintendo Switch game cartridge in handheld mode.",
    name: "Nintendo Switch Lite Compact Handheld Grey Edition",
    slug: "nintendo-switch-lite-grey",
    categoryType: "console",
    category: "Nintendo",
    platform: "Nintendo Switch",
    price: 2499000,
    originalPrice: 2899000,
    stock: 15,
    image: "/images/consoles/switch-lite-console.jpg",
    specs: ["5.5-inch Touchscreen", "Ultra-lightweight 275g", "Integrated D-Pad Controls", "Full Switch Cartridge Compatibility"],
    description: "Didesain khusus untuk handheld gaming portabel yang ringan dan praktis. Kompatibel dengan semua game cartridge Nintendo Switch dalam mode genggam."
  },
  {
    id: "wii-classic",
    description_en: "The revolutionary console that popularised motion gaming worldwide. Plays Nintendo Wii disc games and Nintendo GameCube disc games straight from the box.",
    name: "Nintendo Wii Sports Deluxe Console Set White",
    slug: "nintendo-wii-sports-deluxe",
    categoryType: "console",
    category: "Nintendo",
    platform: "Nintendo Wii",
    price: 1599000,
    originalPrice: 1999000,
    stock: 12,
    image: "/images/consoles/wii-classic-console.jpg",
    specs: ["Motion Sensing Wii Remote", "GameCube Hardware Back-compat", "4x GameCube Controller Ports", "Optical Disc Drive"],
    description: "Konsol revolusioner yang mempopulerkan motion gaming di seluruh dunia. Memutar langsung kaset disc Nintendo Wii dan game disc Nintendo GameCube."
  },
  {
    id: "wii-u-deluxe",
    description_en: "Nintendo's innovative dual-screen system supporting all 25GB proprietary Wii U discs, plus full backwards compatibility with Nintendo Wii disc games.",
    name: "Nintendo Wii U Basic Set 8GB White",
    slug: "wii-u-deluxe-32gb",
    categoryType: "console",
    category: "Nintendo",
    platform: "Nintendo Wii U",
    price: 2499000,
    originalPrice: 2899000,
    stock: 20,
    image: "/images/consoles/wii-u-console.png",
    specs: ["Touchscreen GamePad Controller", "8GB Internal Flash", "Proprietary Optical Disc Drive", "HDMI 1080p Output"],
    description: "Sistem dual-screen inovatif Nintendo yang mendukung seluruh disc proprietary Wii U berkapasitas 25GB serta kompatibilitas penuh dengan disc game Nintendo Wii generasi sebelumnya."
  },

  // ACCESSORIES / CONTROLLERS
  {
    id: "dualsense-ps5",
    description_en: "Feel every impact, bow draw and road surface through micro haptic feedback and pressure-sensitive adaptive triggers. A genuine physical link between your hands and the action on screen.",
    name: "PlayStation 5 DualSense Wireless Controller (Cobalt Blue)",
    slug: "dualsense-wireless-controller",
    categoryType: "accessory",
    category: "Controller",
    brand: "Sony PlayStation",
    price: 1149000,
    originalPrice: 1299000,
    stock: 20,
    image: "/images/consoles/dualsense-controller.png",
    features: ["Haptic Feedback Imersif", "Adaptive Triggers Dinamis", "Built-in Microphone & Headset Jack", "Motion Sensor 6-axis"],
    description: "Rasakan setiap benturan, tarikan busur, dan permukaan jalanan melalui getaran haptic feedback mikro dan adaptive trigger bertekanan dinamis. Menghadirkan koneksi fisik yang nyata antara tangan Anda dan aksi dalam game."
  },
  {
    id: "xbox-wireless-controller",
    description_en: "An ergonomic design built for hours of comfortable play. Compatible with Xbox Series X|S, Xbox One, Windows PC, Android and iOS, with a precision hybrid D-pad.",
    name: "Xbox Wireless Controller Robot White (Series X|S & PC)",
    slug: "xbox-wireless-controller-robot-white",
    categoryType: "accessory",
    category: "Controller",
    brand: "Microsoft Xbox",
    price: 949000,
    originalPrice: 1099000,
    stock: 20,
    image: "/images/consoles/xbox-controller.png",
    features: ["Hybrid D-pad Akurat", "Textured Grip Pelatuk", "Bluetooth Multi-device Pairing", "Tombol Share Khusus"],
    description: "Desain ergonomis terbaik untuk kenyamanan bermain puluhan jam. Kompatibel dengan Xbox Series X|S, Xbox One, Windows PC, Android, dan iOS dengan tombol hybrid D-pad presisi tinggi."
  },
  {
    id: "switch-pro-controller",
    description_en: "The go-to controller for action titles like Zelda and Super Smash Bros. Equipped with a gyro motion sensor, a battery lasting up to 40 hours, and a built-in Amiibo reader in the right stick.",
    name: "Nintendo Switch Pro Controller (Black)",
    slug: "nintendo-switch-pro-controller-black",
    categoryType: "accessory",
    category: "Controller",
    brand: "Nintendo",
    price: 899000,
    originalPrice: 1049000,
    stock: 20,
    image: "/images/consoles/switch-pro-controller.png",
    features: ["HD Rumble Presisi", "NFC Amiibo Scanner", "Baterai Tahan Hingga 40 Jam", "Stik Analog Premium"],
    description: "Controller andalan untuk game aksi seperti Zelda dan Super Smash Bros. Dilengkapi sensor gerak gyro, baterai ekstra awet hingga 40 jam penggunaan, dan reader Amiibo bawaan di tengah stik."
  },

  // VOUCHERS
  {
    id: "psn-100k",
    description_en: "An official instant redeem code to top up your Indonesian PlayStation Store balance. Buy digital games, DLC downloads or a PS Plus subscription safely without a credit card.",
    name: "PlayStation Network (PSN) Card Rp 100.000",
    slug: "psn-card-100k",
    categoryType: "voucher",
    category: "PlayStation",
    denomination: "Rp 100.000 Wallet",
    price: 105000,
    stock: 20,
    image: "/images/vouchers/psn-card.svg",
    region: "Indonesia (Reg 3)",
    description: "Kode redeem instan resmi untuk mengisi saldo PlayStation Store Indonesia. Beli game digital, download konten DLC, atau bayar langganan PS Plus dengan mudah dan aman tanpa kartu kredit."
  },
  {
    id: "psn-400k",
    description_en: "Official Indonesian PSN Store credit with no credit card required, ready for the latest AAA digital releases, battle passes and seasonal passes on PS5 and PS4.",
    name: "PlayStation Network (PSN) Card Rp 400.000",
    slug: "psn-card-400k",
    categoryType: "voucher",
    category: "PlayStation",
    denomination: "Rp 400.000 Wallet",
    price: 415000,
    stock: 20,
    image: "/images/vouchers/psn-card.svg",
    region: "Indonesia (Reg 3)",
    description: "Saldo resmi PSN Store Indonesia tanpa kartu kredit untuk membeli game AAA digital terbaru, battle pass, dan seasonal passes favorit Anda di PS5 dan PS4."
  },
  {
    id: "ps-plus-deluxe-3m",
    description_en: "Access hundreds of PS4 and PS5 catalogue titles, legendary PS1, PS2 and PSP classics, limited-time game trials, cloud saves and online multiplayer features.",
    name: "PlayStation Plus Deluxe Membership 3 Bulan",
    slug: "ps-plus-deluxe-3m",
    categoryType: "voucher",
    category: "PlayStation",
    denomination: "3 Bulan Subscription",
    price: 449000,
    stock: 20,
    image: "/images/vouchers/ps-plus.svg",
    region: "Indonesia (Reg 3)",
    description: "Akses ratusan game katalog PS4/PS5, game klasik legendaris PS1/PS2/PSP, uji coba game berbatas waktu (Game Trials), cloud saves, dan fitur multiplayer online."
  },
  {
    id: "xbox-game-pass-ultimate-3m",
    description_en: "Play hundreds of high-quality games across Xbox consoles, PC and cloud. Includes an EA Play subscription, member-exclusive discounts and day-one releases.",
    name: "Xbox Game Pass Ultimate 3 Bulan (Global/ID)",
    slug: "xbox-game-pass-ultimate-3m",
    categoryType: "voucher",
    category: "Xbox",
    denomination: "3 Bulan Ultimate Sub",
    price: 389000,
    stock: 20,
    image: "/images/vouchers/xbox-game-pass.svg",
    region: "Global Code",
    description: "Mainkan ratusan game berkualitas tinggi di konsol Xbox, PC, dan Cloud Gaming. Termasuk langganan EA Play, diskon eksklusif member, dan game day-one rilis."
  },
  {
    id: "xbox-game-pass-ultimate-1m",
    description_en: "One month of Xbox Game Pass Ultimate, including access to hundreds of games on PC and Xbox console, EA Play and Xbox Cloud Gaming with no friction.",
    name: "Xbox Game Pass Ultimate 1 Bulan (PC / Console)",
    slug: "xbox-game-pass-ultimate-1m",
    categoryType: "voucher",
    category: "Xbox",
    denomination: "1 Bulan Ultimate Sub",
    price: 159000,
    stock: 20,
    image: "/images/vouchers/xbox-game-pass.svg",
    region: "Global Code",
    description: "Langganan 1 bulan Xbox Game Pass Ultimate termasuk akses ratusan game PC dan konsol Xbox, EA Play, dan Xbox Cloud Gaming tanpa hambatan."
  },
  {
    id: "nintendo-eshop-20usd",
    description_en: "Top up the wallet of your US-region Nintendo eShop account to buy indie games, Super Smash Bros. DLC, Mario Kart Booster Course Pass and Nintendo Online classics.",
    name: "Nintendo eShop Card $20 USD (US Region)",
    slug: "nintendo-eshop-20usd",
    categoryType: "voucher",
    category: "Nintendo",
    denomination: "$20 USD Balance",
    price: 335000,
    stock: 20,
    image: "/images/vouchers/nintendo-eshop.svg",
    region: "United States (US)",
    description: "Isi saldo dompet Nintendo eShop akun region US Anda untuk membeli game indie, DLC Super Smash Bros, Mario Kart Booster Course Pass, dan game klasik Nintendo Online."
  },
  {
    id: "nintendo-eshop-50usd",
    description_en: "Safe, instant eShop credit for buying blockbuster Switch games directly from your console.",
    name: "Nintendo eShop Card $50 USD (US Region)",
    slug: "nintendo-eshop-50-usd",
    categoryType: "voucher",
    category: "Nintendo",
    denomination: "$50 USD Balance",
    price: 825000,
    stock: 20,
    image: "/images/vouchers/nintendo-eshop.svg",
    region: "United States (US)",
    description: "Isi saldo eShop aman dan mudah untuk membeli game blockbuster Switch secara langsung dari console Anda."
  },
  {
    id: "steam-wallet-120k",
    description_en: "An official Steam Wallet voucher in Rupiah, credited straight to your Steam account balance. Ideal for Steam Summer and Winter Sale events with no credit-card fees.",
    name: "Steam Wallet Code Rp 120.000 (IDR)",
    slug: "steam-wallet-120k",
    categoryType: "voucher",
    category: "Steam",
    denomination: "Rp 120.000 Balance",
    price: 125000,
    stock: 20,
    image: "/images/vouchers/steam-wallet.svg",
    region: "Indonesia (IDR)",
    description: "Voucher Steam Wallet resmi mata uang Rupiah langsung masuk ke saldo akun Steam Anda. Siap digunakan belanja saat event Steam Summer/Winter Sale tanpa potongan kartu kredit."
  }
];

export function getHardwareProductBySlug(slug: string): ProductItem | undefined {
  if (!slug) return undefined;
  const norm = decodeURIComponent(slug).toLowerCase().trim();

  // 1. Direct match
  const exact = ALL_HARDWARE_PRODUCTS.find(p => p.slug.toLowerCase() === norm);
  if (exact) return exact;

  // 2. Normalized aliases
  const aliases: Record<string, string> = {
    "nintendo-eshop-20-usd": "nintendo-eshop-20usd",
    "nintendo-eshop-20usd": "nintendo-eshop-20usd",
    "nintendo-eshop-50usd": "nintendo-eshop-50-usd",
    "nintendo-eshop-50-usd": "nintendo-eshop-50-usd",
    "xbox-game-pass-ultimate-1m": "xbox-game-pass-ultimate-1m",
    "xbox-gamepass-ultimate-1m": "xbox-game-pass-ultimate-1m",
    "xbox-game-pass-ultimate-3m": "xbox-game-pass-ultimate-3m",
    "ps5-slim": "ps5-disc-edition",
    "ps5": "ps5-disc-edition",
    "ps4-pro": "ps4-pro-1tb",
    "xbox-series-x": "xbox-series-x-1tb",
    "xbox-series-s": "xbox-series-s-512gb",
    "switch-oled": "nintendo-switch-oled-white",
    "switch-lite": "nintendo-switch-lite-grey",
  };

  if (aliases[norm]) {
    const aliased = ALL_HARDWARE_PRODUCTS.find(p => p.slug === aliases[norm]);
    if (aliased) return aliased;
  }

  // 3. Hyphen-less match
  const cleanNorm = norm.replace(/[^a-z0-9]/g, "");
  return ALL_HARDWARE_PRODUCTS.find(p => p.slug.toLowerCase().replace(/[^a-z0-9]/g, "") === cleanNorm);
}
