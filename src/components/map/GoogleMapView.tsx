import { useEffect, useRef, useState } from "react";
import { C } from "@/design/tokens";
import { USER_LOC } from "@/lib/geo";
import { loadGoogleMaps } from "./loader";
import { GMAP_STYLE } from "./mapStyle";
import type { EngineProps } from "./types";

function dot(maps: typeof google.maps, fill: string, scale: number): google.maps.Symbol {
  return {
    path: maps.SymbolPath.CIRCLE,
    scale,
    fillColor: fill,
    fillOpacity: 1,
    strokeColor: C.cream,
    strokeWeight: 2.5,
  };
}

export function GoogleMapView({
  apiKey, farms, selectedId, onSelect, radiusKm, onPlace, placed, onEngineError,
}: EngineProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const circleRef = useRef<google.maps.Circle | null>(null);
  const placedRef = useRef<google.maps.Marker | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps(apiKey)
      .then((maps) => {
        if (cancelled || !divRef.current) return;
        mapRef.current = new maps.Map(divRef.current, {
          center: { lat: USER_LOC.lat, lng: USER_LOC.lng },
          zoom: 10,
          styles: GMAP_STYLE,
          disableDefaultUI: true,
          gestureHandling: "greedy",
          clickableIcons: false,
          keyboardShortcuts: false,
        });
        new maps.Marker({
          map: mapRef.current,
          position: { lat: USER_LOC.lat, lng: USER_LOC.lng },
          icon: dot(maps, C.ink, 5),
          title: USER_LOC.label,
          zIndex: 1,
        });
        setReady(true);
      })
      .catch((err: Error) => { if (!cancelled) onEngineError(err.message); });
    return () => { cancelled = true; };
  }, [apiKey, onEngineError]);

  // tryb wskazywania lokalizacji
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !onPlace || !map) return;
    const maps = google.maps;
    const listener = map.addListener("click", (e: google.maps.MapMouseEvent) => {
      if (e.latLng) onPlace({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    });
    map.setOptions({ draggableCursor: "crosshair" });
    return () => maps.event.removeListener(listener);
  }, [ready, onPlace]);

  // pinezki gospodarstw
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    const maps = google.maps;
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = farms.map((f) => {
      const spich = f.tier === "spichlerz";
      const fill = spich ? C.mustard : f.tier === "sad" ? C.moss : C.inkSoft;
      const sel = selectedId === f.id;
      const marker = new maps.Marker({
        map,
        position: f.coords,
        icon: dot(maps, fill, sel ? 11 : spich ? 9 : 7.5),
        title: f.full,
        zIndex: sel ? 40 : spich ? 30 : 20,
        animation: sel ? maps.Animation.BOUNCE : null,
      });
      marker.addListener("click", () => onSelect?.(f.id));
      return marker;
    });
  }, [ready, farms, selectedId, onSelect]);

  // okrąg zasięgu
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map || !radiusKm) return;
    const maps = google.maps;
    circleRef.current?.setMap(null);
    circleRef.current = new maps.Circle({
      map,
      center: { lat: USER_LOC.lat, lng: USER_LOC.lng },
      radius: radiusKm * 1000,
      fillColor: C.mustard, fillOpacity: 0.08,
      strokeColor: C.mustardD, strokeOpacity: 0.5, strokeWeight: 1.5,
      clickable: false,
    });
    const bounds = circleRef.current.getBounds();
    if (bounds) map.fitBounds(bounds, 24);
  }, [ready, radiusKm]);

  // pinezka stawiana przez rolnika
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    const maps = google.maps;
    placedRef.current?.setMap(null);
    placedRef.current = null;
    if (placed) {
      placedRef.current = new maps.Marker({
        map,
        position: placed,
        icon: dot(maps, C.mustard, 10),
        zIndex: 60,
        animation: maps.Animation.DROP,
      });
    }
  }, [ready, placed]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={divRef} style={{ width: "100%", height: "100%" }}
        role="application" aria-label="Mapa gospodarstw"/>
      {!ready && (
        <div style={{
          position: "absolute", inset: 0, background: C.sand,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 10,
        }}>
          <div className="spinner" style={{
            width: 22, height: 22, borderRadius: 11,
            border: `2.5px solid ${C.line}`, borderTopColor: C.mustardD,
          }}/>
          <span style={{ fontSize: 12, color: C.faded }}>Ładuję mapę Google…</span>
        </div>
      )}
    </div>
  );
}
