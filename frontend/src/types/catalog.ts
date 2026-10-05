export interface Platform {
  id: string;
  name: string;
  slug: string;
  category: "PLAYSTATION" | "XBOX" | "NINTENDO";
  category_display: string;
  generation: string;
}

export interface GameVariant {
  id: string;
  sku: string;
  platform: string;
  platform_name: string;
  platform_slug: string;
  region: "REG1" | "REG2" | "REG3" | "ALL";
  region_display: string;
  condition: "SEALED" | "PREOWNED";
  condition_display: string;
  price: string;
  stock: number;
  weight_grams: number;
  is_active: boolean;
}

export interface Game {
  id: string | number;
  title: string;
  slug: string;
  publisher: string;
  developer: string;
  release_year: number;
  description: string;
  cover_image_url: string;
  min_price: number;
  total_stock?: number;
  variants: GameVariant[];
}
