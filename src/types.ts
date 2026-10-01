export type Coords = { lat: number; lng: number };

export type Tier = "zagroda" | "sad" | "spichlerz";

export type Category =
  | "Warzywa" | "Owoce" | "Mięso" | "Nabiał" | "Miód" | "Pieczywo" | "Gotowe";

export type SaleMode = "order" | "contact";

export type PhotoKey =
  | "veggies-mix" | "harvest-box" | "market-stall"
  | "veggies-close" | "carrots" | "tomatoes-cherry";

export type Product = {
  id: string;
  name: string;
  unit: string;
  /** PLN, brutto */
  price: number;
  category: Category;
  desc: string;
  photo: PhotoKey;
};

export type Farm = {
  id: string;
  /** Krótka nazwa, bez prefiksu typu "Gospodarstwo" */
  name: string;
  /** Pełna nazwa wyświetlana w nagłówkach */
  full: string;
  family: string;
  place: string;
  since: number;
  tier: Tier;
  /** null = gospodarstwo bez ocen, pokazujemy badge NOWE */
  rating: number | null;
  reviews: number;
  eko: boolean;
  featured?: boolean;
  photo: PhotoKey;
  blurb: string;
  long: string;
  hours: string;
  pickup: string;
  contact: { phone: string; email?: string };
  coords: Coords;
  modes: SaleMode[];
  products: Product[];
};

/** Farm wzbogacone o policzony dystans — nigdy nie trafia do storage. */
export type FarmView = Farm & { distance: number };

export type CartLine = { productId: string; qty: number };

export type SeasonItem = {
  name: string;
  /** numery miesięcy 1–12 */
  months: number[];
  peak: number;
  emoji: string;
};

export type ToastTone = "default" | "warn";
export type Toast = {
  id: number;
  message: string;
  tone: ToastTone;
  action?: { label: string; onClick: () => void };
};

export type ScreenId =
  | "splash" | "discover" | "farm" | "product" | "cart"
  | "season" | "account" | "pricing" | "onboarding"
  | "farmerPanel" | "productEdit";

export type TabId = "discover" | "season" | "cart" | "account";
