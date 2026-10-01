# Pola

Marketplace farm-to-table na rynek polski — prototyp strony responsywnej.
React + TypeScript + Vite.

## Start

```bash
npm install
npm run dev
```

Otworzy się na `http://localhost:5173`.

## Skrypty

| polecenie | co robi |
|---|---|
| `npm run dev` | serwer deweloperski z HMR |
| `npm run build` | typecheck + build produkcyjny do `dist/` |
| `npm run preview` | podgląd builda produkcyjnego |
| `npm run typecheck` | sam TypeScript, bez emitowania |

## Mapa Google (opcjonalnie)

Bez klucza działa zapasowa mapa rysunkowa SVG — aplikacja jest w pełni używalna.
Żeby włączyć Google Maps, wybierz jedno:

```bash
cp .env.example .env    # i wpisz VITE_GMAPS_KEY=AIza...
```

albo w działającej aplikacji: badge nad mapą → wklej klucz (zapisze się
w localStorage), albo `?gmaps=AIza...` w adresie.

Potrzebne: włączone **Maps JavaScript API** w Google Cloud, klucz ograniczony do
Twojej domeny i **ustawiony alert budżetowy**.

## Breakpointy

- `< 768px` — mobile: mapa nad listą, nawigacja na dole
- `768–1023px` — tablet: ten sam układ, szersza kolumna
- `≥ 1024px` — desktop: nawigacja boczna, mapa i lista obok siebie

## Struktura

Pełny opis architektury i zasad projektu jest w `CLAUDE.md`.

## Co dalej

Backend, konta rolników, płatności przez operatora marketplace, upload zdjęć,
historia zamówień. Panel rolnika docelowo zostaje w webie — patrz `CLAUDE.md`.
