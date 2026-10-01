import { C } from "@/design/tokens";

/**
 * Paleta Poli przełożona na styl podkładu Google.
 * Klasyczna tablica `styles` — działa bez cloud mapId, w zamian
 * nie można użyć AdvancedMarkerElement (stąd zwykłe `Marker`).
 */
export const GMAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: C.sand }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: C.inkSoft }] },
  { elementType: "labels.text.stroke", stylers: [{ color: C.paper }, { weight: 3 }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: C.line }] },
  { featureType: "administrative.land_parcel", stylers: [{ visibility: "off" }] },
  { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#E6DFCE" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#CFDAC2" }, { visibility: "on" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: C.paper }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: C.line }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#F7F0E2" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#DCCFB4" }] },
  { featureType: "road.local", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: C.river }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#6E8481" }] },
];
