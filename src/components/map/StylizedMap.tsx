import type { MouseEvent } from "react";
import { C } from "@/design/tokens";
import { SVG_ORIGIN, SVG_SCALE, TOWNS, project, unproject } from "@/lib/geo";
import type { MapViewProps } from "./types";

/**
 * Zapasowa mapa rysunkowa. Nie jest kartografią — jest czytelnym schematem
 * okolicy. Używa tej samej projekcji co silnik Google, więc oba pokazują
 * gospodarstwa w tych samych miejscach względem siebie.
 */
export function StylizedMap({
  farms, selectedId, onSelect, radiusKm, onPlace, placed, hideRadius,
}: MapViewProps) {
  const r = (radiusKm ?? 25) * SVG_SCALE;
  const c = SVG_ORIGIN;

  const handleClick = (e: MouseEvent<SVGSVGElement>) => {
    if (!onPlace) return;
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const loc = pt.matrixTransform(ctm.inverse());
    onPlace(unproject({ x: loc.x, y: loc.y }));
  };

  const placedPt = placed ? project(placed) : null;

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"
      onClick={handleClick}
      role={onPlace ? "application" : "img"}
      aria-label={onPlace
        ? "Mapa — kliknij, aby wskazać lokalizację gospodarstwa"
        : "Mapa gospodarstw w okolicy"}
      style={{ width: "100%", height: "100%", display: "block", cursor: onPlace ? "crosshair" : "default" }}>
      <defs>
        <pattern id="pola-paper" patternUnits="userSpaceOnUse" width="2" height="2">
          <rect width="2" height="2" fill={C.sand}/>
          <circle cx="1" cy="1" r="0.06" fill={C.fadedDeco} opacity="0.3"/>
        </pattern>
        <radialGradient id="pola-vignette" cx="50%" cy="50%" r="70%">
          <stop offset="60%" stopColor={C.sand} stopOpacity="0"/>
          <stop offset="100%" stopColor={C.ink} stopOpacity="0.08"/>
        </radialGradient>
      </defs>

      <rect width="100" height="100" fill="url(#pola-paper)"/>

      <g fill={C.mossLeaf} opacity="0.22">
        <ellipse cx="72" cy="30" rx="20" ry="13"/>
        <ellipse cx="18" cy="76" rx="18" ry="12"/>
        <ellipse cx="84" cy="74" rx="14" ry="9"/>
      </g>
      <g fill={C.moss} opacity="0.13">
        <ellipse cx="72" cy="30" rx="13" ry="8"/>
        <ellipse cx="18" cy="76" rx="11" ry="7"/>
      </g>

      <g stroke={C.river} fill="none" opacity="0.7">
        <path d="M-2 42 Q 20 40, 35 47 T 75 52 T 110 50" strokeWidth="1.6"/>
        <path d="M-2 42 Q 20 40, 35 47 T 75 52 T 110 50" strokeWidth="0.4" stroke={C.cream}/>
        <path d="M58 -2 Q 56 20, 52 36 T 45 50" strokeWidth="1.2"/>
      </g>

      <g stroke={C.fadedDeco} fill="none" opacity="0.25" strokeDasharray="0.6 0.8">
        <path d="M-2 60 Q 30 58, 50 55 T 102 50" strokeWidth="0.4"/>
        <path d="M45 -2 Q 47 30, 48 56 T 50 102" strokeWidth="0.4"/>
        <path d="M0 90 Q 30 70, 60 65 T 102 30" strokeWidth="0.3"/>
      </g>

      {TOWNS.map((t) => {
        const p = project(t);
        return (
          <g key={t.name}>
            <circle cx={p.x} cy={p.y} r={t.big ? 0.8 : 0.5} fill={C.inkSoft} opacity="0.4"/>
            <text x={p.x + 1.4} y={p.y + 0.7} fill={C.ink} fontFamily="Inter" fontSize="2"
              fontWeight={t.big ? 600 : 500} opacity="0.55">{t.name}</text>
          </g>
        );
      })}

      <rect width="100" height="100" fill="url(#pola-vignette)" pointerEvents="none"/>

      {!hideRadius && (
        <circle cx={c.x} cy={c.y} r={r} fill={C.mustard} fillOpacity="0.08"
          stroke={C.mustardD} strokeOpacity="0.4" strokeWidth="0.35" strokeDasharray="0.9 0.7"/>
      )}
      <circle cx={c.x} cy={c.y} r="1.5" fill={C.ink}/>
      <circle cx={c.x} cy={c.y} r="0.6" fill={C.cream}/>

      {farms.map((f) => {
        const p = project(f.coords);
        const sel = selectedId === f.id;
        const spich = f.tier === "spichlerz";
        const color = spich ? C.mustard : f.tier === "sad" ? C.moss : C.inkSoft;
        const rad = spich ? 2.6 : 2.1;
        return (
          <g key={f.id}
            onClick={(e) => { if (!onPlace) { e.stopPropagation(); onSelect?.(f.id); } }}
            style={{ cursor: onPlace ? "crosshair" : "pointer" }}>
            {sel && (
              <circle cx={p.x} cy={p.y} r={rad + 2.5} fill={color} fillOpacity="0.18">
                <animate attributeName="r" from={rad + 1.5} to={rad + 4} dur="1.4s" repeatCount="indefinite"/>
                <animate attributeName="fill-opacity" from="0.3" to="0" dur="1.4s" repeatCount="indefinite"/>
              </circle>
            )}
            <circle cx={p.x} cy={p.y + 0.4} r={rad} fill={C.ink} opacity="0.18"/>
            <circle cx={p.x} cy={p.y} r={rad} fill={color} stroke={C.cream} strokeWidth="0.5"/>
            {spich && <circle cx={p.x} cy={p.y} r="0.7" fill={C.cream}/>}
          </g>
        );
      })}

      {placedPt && (
        <g pointerEvents="none">
          <circle cx={placedPt.x} cy={placedPt.y} r="4" fill={C.mustard} fillOpacity="0.25">
            <animate attributeName="r" from="3" to="6.5" dur="1.4s" repeatCount="indefinite"/>
            <animate attributeName="fill-opacity" from="0.4" to="0" dur="1.4s" repeatCount="indefinite"/>
          </circle>
          <circle cx={placedPt.x} cy={placedPt.y} r="2.5" fill={C.mustard} stroke={C.cream} strokeWidth="0.6"/>
        </g>
      )}
    </svg>
  );
}
