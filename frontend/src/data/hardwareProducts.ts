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
  specs?: string[];
  features?: string[];
  region?: string;
  denomination?: string;
}

export const ALL_HARDWARE_PRODUCTS: ProductItem[] = [
  // CONSOLES
  {
    id: "ps5-disc",
    name: "Sony PlayStation 5 Disc Edition (Slim)",
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
    id: "xbox-series-x",
    name: "Microsoft Xbox Series X 1TB Black",
    slug: "xbox-series-x-1tb",
    categoryType: "console",
    category: "Xbox",
    platform: "Xbox Series X",
    price: 8199000,
    originalPrice: 8799000,
    stock: 20,
    image: "/images/consoles/xbox-series-x-console.png",
    specs: ["12 Teraflops RDNA 2", "1TB Custom NVMe SSD", "4K UHD Blu-ray Drive", "Quick Resume Feature"],
    description: "Konsol generasi terbaru paling bertenaga di dunia dengan 12 Teraflops GPU. Mendukung kaset fisik 4K UHD Blu-ray serta backwards compatibility 4 generasi kaset Xbox legendaris."
  },
  {
    id: "xbox-one-x",
    name: "Microsoft Xbox One X 1TB Monster Hunter Edition",
    slug: "xbox-one-x-1tb",
    categoryType: "console",
    category: "Xbox",
    platform: "Xbox One",
    price: 3499000,
    originalPrice: 3899000,
    stock: 20,
    image: "/images/consoles/xbox-one-x-console.png",
    specs: ["6 Teraflops GPU", "12GB GDDR5 RAM", "4K Blu-ray Optical Drive", "Dolby Atmos Audio"],
    description: "Konsol terkuat generasi ke-8 dengan kemampuan render grafis native 4K tajam dan drive Blu-ray berkecepatan tinggi untuk membaca seluruh disc kaset game Xbox One."
  },
  {
    id: "switch-oled",
    name: "Nintendo Switch OLED Model Neon Blue/Red",
    slug: "nintendo-switch-oled",
    categoryType: "console",
    category: "Nintendo",
    platform: "Nintendo Switch",
    price: 4399000,
    originalPrice: 4799000,
    stock: 20,
    image: "/images/consoles/switch-oled-console.png",
    specs: ["7-inch Vibrant OLED Screen", "64GB Internal Storage", "Adjustable Wide Stand", "Wired LAN Port Dock"],
    description: "Layar 7 inci OLED dengan warna kontras hidup dan hitam pekat. Dilengkapi slot cartridge presisi untuk memainkan seluruh kaset fisik game Nintendo Switch kapan saja dan di mana saja."
  },
  {
    id: "wii-u-deluxe",
    name: "Nintendo Wii U Deluxe Set 32GB Black",
    slug: "nintendo-wii-u-32gb",
    categoryType: "console",
    category: "Nintendo",
    platform: "Nintendo Wii U",
    price: 2499000,
    originalPrice: 2899000,
    stock: 20,
    image: "/images/consoles/wii-u-console.png",
    specs: ["Touchscreen GamePad Controller", "32GB Internal Flash", "Proprietary Optical Disc Drive", "HDMI 1080p Output"],
    description: "Sistem dual-screen inovatif Nintendo yang mendukung seluruh disc proprietary Wii U berkapasitas 25GB serta kompatibilitas penuh dengan disc game Nintendo Wii generasi sebelumnya."
  },

  // ACCESSORIES / CONTROLLERS
  {
    id: "dualsense-ps5",
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
    name: "Nintendo Switch Pro Controller Black Edition",
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
    name: "PlayStation Network (PSN) Card Rp 100.000",
    slug: "psn-card-100k",
    categoryType: "voucher",
    category: "PlayStation",
    denomination: "Rp 100.000 Wallet",
    price: 105000,
    stock: 20,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/PlayStation_logo.svg/800px-PlayStation_logo.svg.png",
    region: "Indonesia (Reg 3)",
    description: "Kode redeem instan resmi untuk mengisi saldo PlayStation Store Indonesia. Beli game digital, download konten DLC, atau bayar langganan PS Plus dengan mudah dan aman tanpa kartu kredit."
  },
  {
    id: "psn-400k",
    name: "PlayStation Network (PSN) Card Rp 400.000",
    slug: "psn-card-400k",
    categoryType: "voucher",
    category: "PlayStation",
    denomination: "Rp 400.000 Wallet",
    price: 415000,
    stock: 20,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/PlayStation_logo.svg/800px-PlayStation_logo.svg.png",
    region: "Indonesia (Reg 3)",
    description: "Saldo resmi PSN Store Indonesia tanpa kartu kredit untuk membeli game AAA digital terbaru, battle pass, dan seasonal passes favorit Anda di PS5 dan PS4."
  },
  {
    id: "ps-plus-deluxe-3m",
    name: "PlayStation Plus Deluxe Membership 3 Bulan",
    slug: "ps-plus-deluxe-3m",
    categoryType: "voucher",
    category: "PlayStation",
    denomination: "3 Bulan Subscription",
    price: 449000,
    stock: 20,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/PlayStation_logo.svg/800px-PlayStation_logo.svg.png",
    region: "Indonesia (Reg 3)",
    description: "Akses ratusan game katalog PS4/PS5, game klasik legendaris PS1/PS2/PSP, uji coba game berbatas waktu (Game Trials), cloud saves, dan fitur multiplayer online."
  },
  {
    id: "xbox-game-pass-ultimate-3m",
    name: "Xbox Game Pass Ultimate 3 Bulan (Global/ID)",
    slug: "xbox-game-pass-ultimate-3m",
    categoryType: "voucher",
    category: "Xbox",
    denomination: "3 Bulan Ultimate Sub",
    price: 389000,
    stock: 20,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Xbox_one_logo.svg/800px-Xbox_one_logo.svg.png",
    region: "Global Code",
    description: "Mainkan ratusan game berkualitas tinggi di konsol Xbox, PC, dan Cloud Gaming. Termasuk langganan EA Play, diskon eksklusif member, dan game day-one rilis."
  },
  {
    id: "nintendo-eshop-20usd",
    name: "Nintendo eShop Card $20 USD (US Region)",
    slug: "nintendo-eshop-20usd",
    categoryType: "voucher",
    category: "Nintendo",
    denomination: "$20 USD Balance",
    price: 335000,
    stock: 20,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Nintendo_Switch_logo.svg/800px-Nintendo_Switch_logo.svg.png",
    region: "United States (US)",
    description: "Isi saldo dompet Nintendo eShop akun region US Anda untuk membeli game indie, DLC Super Smash Bros, Mario Kart Booster Course Pass, dan game klasik Nintendo Online."
  },
  {
    id: "steam-wallet-120k",
    name: "Steam Wallet Code Rp 120.000 (IDR)",
    slug: "steam-wallet-120k",
    categoryType: "voucher",
    category: "Steam",
    denomination: "Rp 120.000 Balance",
    price: 125000,
    stock: 20,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/800px-Steam_icon_logo.svg.png",
    region: "Indonesia (IDR)",
    description: "Voucher Steam Wallet resmi mata uang Rupiah langsung masuk ke saldo akun Steam Anda. Siap digunakan belanja saat event Steam Summer/Winter Sale tanpa potongan kartu kredit."
  }
];

export function getHardwareProductBySlug(slug: string): ProductItem | undefined {
  return ALL_HARDWARE_PRODUCTS.find(p => p.slug === slug);
}
