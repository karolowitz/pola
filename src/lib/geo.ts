import type { Coords } from "@/types";

/** Punkt odniesienia użytkownika. Docelowo z Geolocation API. */
export const USER_LOC = { lat: 50.0614, lng: 19.9366, label: "Kraków, Stare Miasto" };

const KM_PER_DEG_LAT = 110.57;
const kmPerDegLng = (lat: number) => 111.32 * Math.cos((lat * Math.PI) / 180);

/** Jednostki SVG na kilometr — viewBox 100×100 pokrywa ~133 × 133 km. */
export const SVG_SCALE = 0.75;
export const SVG_ORIGIN = { x: 45, y: 50 };

/** Rzutowanie równoodległościowe lat/lng → współrzędne mapy SVG. */
export function project(coords: Coords): { x: number; y: number } {
  const dxKm = (coords.lng - USER_LOC.lng) * kmPerDegLng(USER_LOC.lat);
  const dyKm = (USER_LOC.lat - coords.lat) * KM_PER_DEG_LAT;
  return { x: SVG_ORIGIN.x + dxKm * SVG_SCALE, y: SVG_ORIGIN.y + dyKm * SVG_SCALE };
}

/** Odwrotność `project` — klik na mapie SVG → lat/lng. */
export function unproject(pt: { x: number; y: number }): Coords {
  const dxKm = (pt.x - SVG_ORIGIN.x) / SVG_SCALE;
  const dyKm = (pt.y - SVG_ORIGIN.y) / SVG_SCALE;
  return {
    lat: USER_LOC.lat - dyKm / KM_PER_DEG_LAT,
    lng: USER_LOC.lng + dxKm / kmPerDegLng(USER_LOC.lat),
  };
}

/** Haversine — dystans w linii prostej, w kilometrach. */
export function kmDistance(a: Coords, b: Coords): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export const TOWNS = [
  { name: "Kraków", lat: 50.0614, lng: 19.9366, big: true },
  { name: "Wieliczka", lat: 49.987, lng: 20.0645 },
  { name: "Niepołomice", lat: 50.0397, lng: 20.2206 },
  { name: "Skawina", lat: 49.9757, lng: 19.829 },
  { name: "Myślenice", lat: 49.8344, lng: 19.9384 },
  { name: "Rabka-Zdrój", lat: 49.6086, lng: 19.9639 },
];
