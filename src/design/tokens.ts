/**
 * Tokeny designu Poli.
 * Kontrast zweryfikowany względem WCAG 2.1 AA — wartości w komentarzach
 * to współczynnik kontrastu na tle `paper` (#F5EFE6).
 * Nie dodawaj tu koloru bez sprawdzenia kontrastu, jeśli ma nieść tekst.
 */
export const C = {
  paper: "#F5EFE6",
  sand: "#EDE5D6",
  cream: "#FAF6EE",

  ink: "#2C2620",       // 13.07:1 — AAA
  inkSoft: "#5A4F42",   // 6.98:1  — AAA dla tekstu ciągłego
  faded: "#756857",     // 4.74:1  — AA, minimum dla podpisów 11–12px
  fadedDeco: "#8B7E6E", // 3.46:1  — WYŁĄCZNIE dekoracja, nigdy tekst

  line: "#E0D7C5",
  lineSoft: "#EBE2D0",

  moss: "#3F5C3A",      // 6.55:1
  mossDeep: "#2A3D26",
  mossLeaf: "#6B8259",

  mustard: "#C9974A",   // tylko wypełnienia; ink na mustard = 5.70:1
  mustardD: "#A87A35",
  mustardT: "#8A6329",  // 4.71:1 — musztarda JAKO TEKST na jasnym tle

  terra: "#B5613A",
  rust: "#8B3D1F",      // 6.60:1 — ceny, akcje destrukcyjne
  berry: "#6E2230",
  river: "#A8B8B5",
} as const;

/** Minimalny cel dotykowy: Apple HIG 44pt / Material 48dp. */
export const TAP = 44;

export const BREAKPOINT = { tablet: 768, desktop: 1024, wide: 1280 } as const;

export const RADIUS = { sm: 10, md: 14, lg: 18, xl: 22, pill: 999 } as const;
