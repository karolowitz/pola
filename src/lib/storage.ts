import type { CartLine, Farm } from "@/types";

const KEY = "pola-demo-v4";

export type PersistedState = {
  farms: Farm[];
  farmerFarmId: string | null;
  cart: CartLine[];
  favourites: string[];
  notify: string[];
};

/**
 * Demo trzyma stan w localStorage. Zdjęcia są kluczami (`PhotoKey`),
 * więc Farm serializuje się wprost — bez base64 i bez limitu quoty.
 * Docelowo zastąpi to API.
 */
export function loadState(): Partial<PersistedState> | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    if (!Array.isArray(parsed.farms)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveState(state: PersistedState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Quota albo tryb prywatny — demo działa dalej, tylko bez zapisu.
  }
}

export function clearState(): void {
  try { localStorage.removeItem(KEY); } catch { /* nic */ }
}
