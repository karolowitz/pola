import type { PhotoKey } from "@/types";

export const PHOTO_KEYS: PhotoKey[] = [
  "veggies-mix", "harvest-box", "market-stall",
  "veggies-close", "carrots", "tomatoes-cherry",
];

/** Pełny rozmiar — hero, tła okładek. */
export const photo = (key: PhotoKey): string => `/photos/${key}.jpg`;
/** Miniatura 480px — karty list, kafle produktów. */
export const photoSm = (key: PhotoKey): string => `/photos/${key}-sm.jpg`;
