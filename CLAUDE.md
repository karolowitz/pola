# Pola — kontekst projektu

Marketplace farm-to-table na rynek polski. Klient znajduje gospodarstwa w okolicy,
przegląda co dziś zebrano i zamawia online albo dzwoni. Rolnik zakłada profil,
wystawia produkty i płaci abonament.

Właściciel: Karol Gadzala (dyrektor kreatywny). **Rozmawiamy po polsku.**
Komentarze w kodzie, copy w UI, komunikaty błędów — też po polsku.

## Stan projektu

Prototyp, bez backendu. Dane siedzą w `src/data/`, stan w localStorage
(`src/lib/storage.ts`). Warstwa do wymiany na API to `src/state/useAppState.ts` —
reszta aplikacji nie wie, skąd biorą się dane.

Cel: **strona responsywna** (desktop / tablet / mobile). Nie robimy aplikacji
natywnej ani nie pakujemy tego w Capacitora. Decyzja świadoma — abonament rolnika
jako usługa cyfrowa oznaczałby prowizję sklepów, a panel rolnika i tak jest
wygodniejszy przy komputerze.

## Uruchomienie

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build
npm run typecheck  # sam tsc, bez emitowania
```

## Architektura

```
src/
  types.ts              typy domenowe — Farm, Product, Coords, Tier…
  design/tokens.ts      kolory, TAP, breakpointy
  design/global.css     reset, szkielet responsywny, animacje
  lib/                  geo (projekcja + haversine), format, photos, storage
  data/                 dane demo: farms, season, tiers, categories
  state/useAppState.ts  CAŁY stan aplikacji — tu podłączysz API
  components/           Icon, Nav, Toasts, karty, formularze
  components/map/       dwa silniki mapy + przełącznik
  screens/              po jednym pliku na ekran
```

## Zasady, które łatwo złamać

**Kolory tylko z `tokens.ts`.** Paleta jest przeaudytowana pod WCAG AA.
Dwie pułapki: `C.faded` to minimum dla małego tekstu (4.74:1) — `C.fadedDeco`
NIE jest dla tekstu, tylko dla elementów dekoracyjnych. Musztarda jako tekst na
jasnym tle to `C.mustardT`, nigdy `C.mustard` (2.29:1, nie przechodzi).

**Tokeny istnieją w dwóch miejscach.** `tokens.ts` dla JS, zmienne CSS w
`global.css` dla media queries i pseudoklas. Zmieniasz kolor — zmieniasz w obu.

**Layout w CSS, detale inline.** Wszystko, co zależy od breakpointa, idzie do
`global.css` jako klasa. Style inline są dla rzeczy niezależnych od szerokości.
Nie próbuj robić responsywności stylami inline.

**Minimalny cel dotykowy to `TAP` (44px).** Dotyczy każdego przycisku, też tych
małych w koszyku.

**Paski CTA przyklejone do dołu używają `position: sticky`,** klasy `.sticky-bar`
albo `.sticky-bar--bare`. Nigdy `absolute` — w kontenerze przewijania odjeżdża
razem z treścią. To był prawdziwy bug, nie teoria.

**Dystanse się liczy, nie zapisuje.** `Farm` ma współrzędne, `FarmView` ma
dodatkowo `distance` liczony haversine'em w `useAppState`. Nie dodawaj `distance`
do danych.

**Zdjęcia przez `photo()` / `photoSm()`.** Miniatury 480px na karty i kafelki,
pełny rozmiar tylko na hero. Nie wklejaj base64.

## Mapa

Dwa silniki za wspólnym kontraktem (`components/map/types.ts`):

- **Google Maps** — gdy jest klucz. Styl w `mapStyle.ts`, klasyczna tablica
  `styles`, więc bez cloud `mapId`, więc zwykłe `Marker`, nie `AdvancedMarkerElement`.
- **StylizedMap** — mapa rysunkowa SVG. Zapas, gdy klucza brak albo ładowanie padnie.

Klucz: `?gmaps=KLUCZ` w URL, localStorage, albo `VITE_GMAPS_KEY` w `.env`.
W UI: badge nad mapą albo Konto → Silnik mapy. Każdy błąd ładowania cofa aplikację
do mapy SVG z komunikatem — nigdy nie zostawiaj pustej dziury po mapie.

Oba silniki używają tej samej projekcji z `lib/geo.ts`, więc gospodarstwa są w tych
samych miejscach względem siebie niezależnie od silnika.

## Dostępność — nie do negocjacji

Widoczny focus (jest globalnie w CSS, nie usuwaj), `aria-pressed` na przełącznikach,
`aria-label` na przyciskach ikonowych, `aria-live` na komunikatach walidacji,
`prefers-reduced-motion`. Formularze: pola wymagane oznaczone, błędy inline przy
polu, a nie sam wyszarzony przycisk.

## Czego tu jeszcze nie ma

Backendu, kont, prawdziwych płatności, uploadu zdjęć, historii zamówień,
powiadomień push. Płatności w marketplace wymagają operatora z KYC rolników
(Stripe Connect albo Przelewy24 marketplace) — bez tego przyjmowanie pieniędzy
w cudzym imieniu to działalność regulowana.
