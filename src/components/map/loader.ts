/**
 * Ładowanie Maps JavaScript API na żądanie.
 * Klucz pochodzi z (w kolejności): ?gmaps= w URL, localStorage, VITE_GMAPS_KEY.
 * Każda ścieżka błędu kończy się odrzuceniem obietnicy — wołający degraduje do mapy SVG.
 */
export const GMAPS_LS = "pola-gmaps-key";

export function readStoredKey(): string {
  try {
    const fromUrl = new URLSearchParams(location.search).get("gmaps");
    if (fromUrl) {
      localStorage.setItem(GMAPS_LS, fromUrl);
      return fromUrl;
    }
    return localStorage.getItem(GMAPS_LS) || import.meta.env.VITE_GMAPS_KEY || "";
  } catch {
    return import.meta.env.VITE_GMAPS_KEY || "";
  }
}

let pending: Promise<typeof google.maps> | null = null;

/** Zeruje cache obietnicy — po zmianie klucza trzeba załadować skrypt od nowa. */
export function resetLoader() {
  pending = null;
}

export function loadGoogleMaps(key: string): Promise<typeof google.maps> {
  if (pending) return pending;

  pending = new Promise((resolve, reject) => {
    if (typeof google !== "undefined" && google.maps) return resolve(google.maps);

    const CALLBACK = "__polaGmapsReady";
    const timer = window.setTimeout(
      () => reject(new Error("Mapa Google nie odpowiedziała w 12 sekund.")),
      12000,
    );

    (window as any)[CALLBACK] = () => {
      window.clearTimeout(timer);
      resolve(google.maps);
    };
    (window as any).gm_authFailure = () => {
      window.clearTimeout(timer);
      reject(new Error("Klucz Google Maps został odrzucony. Sprawdź ograniczenia domeny i czy Maps JavaScript API jest włączone."));
    };

    const s = document.createElement("script");
    s.src =
      `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}` +
      `&callback=${CALLBACK}&language=pl&region=PL&loading=async`;
    s.async = true;
    s.onerror = () => {
      window.clearTimeout(timer);
      reject(new Error("Nie udało się pobrać skryptu Google Maps (brak sieci albo blokada)."));
    };
    document.head.appendChild(s);
  });

  pending.catch(() => { pending = null; });
  return pending;
}
