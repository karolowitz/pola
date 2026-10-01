import type { Tier } from "@/types";

export const TIER_LIMITS: Record<Tier, number> = {
  zagroda: 1,
  sad: 8,
  spichlerz: Infinity,
};

export const TIER_NAMES: Record<Tier, string> = {
  zagroda: "Zagroda",
  sad: "Sad",
  spichlerz: "Spichlerz",
};

export type TierPlan = {
  id: Tier;
  name: string;
  tagline: string;
  price: number;
  period: string;
  best: boolean;
  features: string[];
  missing: string[];
  cta: string;
};

export const TIERS: TierPlan[] = [
  {
    id: "zagroda",
    name: "Zagroda",
    tagline: "Wystaw się na mapie",
    price: 0,
    period: "zawsze",
    best: false,
    features: [
      "Profil gospodarstwa na mapie",
      "1 produkt w ofercie",
      "Tryb «zadzwoń do mnie»",
      "Podstawowe statystyki",
    ],
    missing: ["Zamówienia online", "Wyróżniona pinezka"],
    cta: "Zacznij za darmo",
  },
  {
    id: "sad",
    name: "Sad",
    tagline: "Dla rolnika sprzedającego regularnie",
    price: 29,
    period: "miesięcznie",
    best: true,
    features: [
      "Wszystko z Zagrody",
      "Do 8 produktów",
      "Zamówienia online + płatność",
      "Kalendarz dostępności",
      "Powiadomienia sezonowe dla klientów",
    ],
    missing: ["Wyróżniona pinezka"],
    cta: "Wybierz Sad",
  },
  {
    id: "spichlerz",
    name: "Spichlerz",
    tagline: "Pełna obecność",
    price: 79,
    period: "miesięcznie",
    best: false,
    features: [
      "Wszystko z Sadu",
      "Bez limitu produktów",
      "Wyróżniona pinezka na mapie",
      "Priorytet w wyszukiwaniu",
      "Banery sezonowe",
      "Integracja z dostawą",
    ],
    missing: [],
    cta: "Wybierz Spichlerz",
  },
];

export const ADDONS = [
  { name: "Boost na 7 dni", desc: "Twoje gospodarstwo na górze listy w okolicy", price: "19 zł" },
  { name: "Targi sezonowe", desc: "Dodatkowa widoczność w peaku sezonu (czerwiec, październik, grudzień)", price: "29 zł" },
  { name: "Weryfikacja eko", desc: "Plakietka z certyfikatem na profilu", price: "od 49 zł" },
];

/** Opłata serwisowa doliczana do zamówienia (PLN). */
export const SERVICE_FEE = 2.0;
