import { GoogleMapView } from "./GoogleMapView";
import { StylizedMap } from "./StylizedMap";
import type { EngineProps } from "./types";

/**
 * Wybiera silnik mapy. Brak klucza albo błąd ładowania → mapa rysunkowa.
 * Reszta aplikacji nie wie, który silnik jest aktywny.
 */
export function MapView(props: EngineProps) {
  if (props.apiKey) return <GoogleMapView {...props} />;
  return <StylizedMap {...props} />;
}
