import type { Coords, FarmView } from "@/types";

/** Wspólny kontrakt obu silników mapy. */
export type MapViewProps = {
  farms: FarmView[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  /** Promień w km dla okręgu zasięgu; null = nie rysuj. */
  radiusKm?: number | null;
  hideRadius?: boolean;
  /** Gdy podane, mapa przechodzi w tryb wskazywania lokalizacji. */
  onPlace?: (coords: Coords) => void;
  placed?: Coords | null;
};

export type EngineProps = MapViewProps & {
  apiKey: string;
  onEngineError: (message: string) => void;
};
