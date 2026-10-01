import { useMemo, useState } from "react";
import { C, TAP } from "@/design/tokens";
import { CATEGORIES } from "@/data/categories";
import { USER_LOC } from "@/lib/geo";
import { FarmListCard } from "@/components/FarmListCard";
import { Icon } from "@/components/Icon";
import { MapView } from "@/components/map/MapView";
import type { FarmView } from "@/types";
import type { PushToast } from "@/state/useToasts";

const SORTS = [
  { id: "distance", label: "Najbliżej" },
  { id: "rating", label: "Najlepiej oceniane" },
  { id: "products", label: "Najwięcej produktów" },
  { id: "name", label: "Alfabetycznie" },
] as const;
type SortId = (typeof SORTS)[number]["id"];

const RADII = [10, 25, 50, 100];

type Props = {
  farms: FarmView[];
  onOpenFarm: (id: string) => void;
  favourites: string[];
  onToggleFavourite: (id: string) => void;
  apiKey: string;
  mapError: string | null;
  onEngineError: (msg: string) => void;
  onOpenKeySheet: () => void;
  push: PushToast;
};

export function DiscoverScreen({
  farms, onOpenFarm, favourites, onToggleFavourite,
  apiKey, mapError, onEngineError, onOpenKeySheet, push,
}: Props) {
  const [radius, setRadius] = useState(25);
  const [filter, setFilter] = useState<string>("Wszystko");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortId>("distance");
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedPin, setSelectedPin] = useState<string | null>(null);

  const matched = useMemo(() => {
    const q = query.trim().toLowerCase();
    return farms
      .filter((f) => f.distance <= radius)
      .filter((f) => {
        if (filter === "Eko") return f.eko;
        if (filter !== "Wszystko") return f.products.some((p) => p.category === filter);
        return true;
      })
      .filter((f) => {
        if (!q) return true;
        const hay = [f.full, f.name, f.place, f.family, f.blurb,
          ...f.products.map((p) => `${p.name} ${p.category}`)].join(" ").toLowerCase();
        return hay.includes(q);
      });
  }, [farms, radius, filter, query]);

  const visible = useMemo(() => {
    const arr = [...matched];
    arr.sort((a, b) => {
      if (!!a.featured !== !!b.featured) return a.featured ? -1 : 1;
      switch (sort) {
        case "rating": return (b.rating ?? 0) - (a.rating ?? 0);
        case "products": return b.products.length - a.products.length;
        case "name": return a.full.localeCompare(b.full, "pl");
        default: return a.distance - b.distance;
      }
    });
    return arr;
  }, [matched, sort]);

  const selectPin = (id: string) => {
    setSelectedPin(id);
    document.getElementById(`farm-card-${id}`)?.scrollIntoView({ block: "center", behavior: "smooth" });
  };

  const hasFilters = filter !== "Wszystko" || query.trim().length > 0;

  return (
    <div className="container container--wide" style={{ paddingTop: 24 }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, gap: 16 }}>
        <div>
          <div style={{ fontSize: 11, color: C.faded, letterSpacing: 0.08, textTransform: "uppercase", marginBottom: 2 }}>
            Twoja lokalizacja
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: C.ink, display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="pin" size={15} color={C.mustardT}/> {USER_LOC.label}
          </div>
        </div>
        <button onClick={() => push("Powiadomienia sezonowe są włączone — damy znać, gdy ruszą truskawki.")}
          aria-label="Powiadomienia" style={{
            width: TAP, height: TAP, borderRadius: 22, position: "relative",
            background: C.cream, border: `1px solid ${C.line}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
          <Icon name="bell" size={18} color={C.ink}/>
          <span style={{
            position: "absolute", top: 11, right: 13, width: 7, height: 7,
            borderRadius: 4, background: C.terra, border: `2px solid ${C.cream}`,
          }}/>
        </button>
      </header>

      <div style={{ position: "relative", marginBottom: 14 }}>
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", display: "flex" }}>
          <Icon name="search" size={16} color={C.faded}/>
        </span>
        <input
          type="search" value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Szukaj produktu albo gospodarstwa…"
          aria-label="Szukaj produktu albo gospodarstwa"
          style={{
            width: "100%", padding: "13px 42px", minHeight: TAP,
            background: C.cream, border: `1px solid ${C.line}`, borderRadius: 14,
            fontSize: 14, color: C.ink, outline: "none",
          }}/>
        {query && (
          <button onClick={() => setQuery("")} aria-label="Wyczyść wyszukiwanie" style={{
            position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)",
            width: 38, height: 38, borderRadius: 19, color: C.faded,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}><Icon name="close" size={15}/></button>
        )}
      </div>

      <div className="discover-split">
        <div>
          <div className="discover-map">
            <MapView
              apiKey={apiKey} onEngineError={onEngineError}
              farms={visible} selectedId={selectedPin} onSelect={selectPin} radiusKm={radius}/>

            <div style={{ position: "absolute", top: 12, left: 12 }}>
              <button onClick={onOpenKeySheet} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 12px", borderRadius: 999, minHeight: 36,
                background: C.cream, border: `1px solid ${C.line}`,
                fontSize: 11.5, fontWeight: 600, color: C.inkSoft,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}>
                <Icon name="globe" size={13} color={apiKey ? C.moss : C.faded}/>
                {apiKey ? "Google Maps" : "Mapa poglądowa"}
              </button>
            </div>

            <div style={{ position: "absolute", bottom: 12, left: 12, right: 12, display: "flex", gap: 6, justifyContent: "center" }}>
              {RADII.map((r) => (
                <button key={r} onClick={() => setRadius(r)} aria-pressed={radius === r} style={{
                  padding: "9px 14px", borderRadius: 999, minHeight: 40,
                  background: radius === r ? C.ink : C.cream,
                  color: radius === r ? C.cream : C.ink,
                  fontSize: 12.5, fontWeight: 600,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}>{r} km</button>
              ))}
            </div>
          </div>

          {mapError && !apiKey && (
            <div style={{
              marginTop: 12, padding: "11px 13px", borderRadius: 12,
              background: `${C.rust}0E`, border: `1px solid ${C.rust}30`,
              fontSize: 12, color: C.rust, lineHeight: 1.4,
              display: "flex", gap: 9, alignItems: "flex-start",
            }}>
              <Icon name="warn" size={14} color={C.rust}/>
              <span style={{ flex: 1 }}>{mapError}</span>
              <button onClick={onOpenKeySheet} style={{ fontWeight: 700, color: C.rust, textDecoration: "underline", fontSize: 12 }}>
                Popraw
              </button>
            </div>
          )}
        </div>

        <div className="discover-list">
          <div className="chip-row no-scrollbar" style={{ padding: "16px 0 4px" }}>
            {["Wszystko", ...CATEGORIES, "Eko"].map((c) => (
              <button key={c} onClick={() => setFilter(c)} aria-pressed={filter === c} style={{
                padding: "9px 14px", borderRadius: 999, minHeight: 40, flexShrink: 0, whiteSpace: "nowrap",
                background: filter === c ? C.ink : "transparent",
                color: filter === c ? C.cream : C.inkSoft,
                border: filter === c ? "none" : `1px solid ${C.line}`,
                fontSize: 13, fontWeight: filter === c ? 600 : 500,
              }}>{c}</button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, margin: "14px 0" }}>
            <h2 className="serif-display" style={{ fontSize: 28, fontWeight: 400, fontVariationSettings: "'opsz' 96, 'wght' 380", color: C.ink }}>
              W okolicy <em style={{ fontStyle: "italic", color: C.faded }}>{visible.length}</em>
            </h2>
            <button onClick={() => setSortOpen((v) => !v)} aria-expanded={sortOpen} style={{
              fontSize: 12.5, color: C.inkSoft, fontWeight: 600, minHeight: 40,
              display: "flex", alignItems: "center", gap: 5, padding: "0 4px",
            }}>
              <Icon name="sort" size={14}/> {SORTS.find((s) => s.id === sort)!.label}
            </button>
          </div>

          {sortOpen && (
            <div className="sheet" style={{
              marginBottom: 14, padding: 6, borderRadius: 14,
              background: C.cream, border: `1px solid ${C.line}`,
              boxShadow: "0 10px 26px -12px rgba(20,18,14,0.35)",
            }}>
              {SORTS.map((s) => (
                <button key={s.id} onClick={() => { setSort(s.id); setSortOpen(false); }} style={{
                  width: "100%", textAlign: "left", padding: "12px", minHeight: TAP,
                  borderRadius: 10, fontSize: 13.5,
                  fontWeight: sort === s.id ? 700 : 500,
                  color: sort === s.id ? C.ink : C.inkSoft,
                  background: sort === s.id ? C.sand : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  {s.label}
                  {sort === s.id && <Icon name="check" size={15} color={C.mustardT} stroke={2.4}/>}
                </button>
              ))}
            </div>
          )}

          {visible.length === 0 ? (
            <div style={{ padding: "30px 20px", borderRadius: 16, border: `1.5px dashed ${C.line}`, textAlign: "center" }}>
              <p className="serif" style={{ fontSize: 17, color: C.ink, fontWeight: 500 }}>Nic tu nie rośnie.</p>
              <p style={{ fontSize: 13, color: C.inkSoft, marginTop: 6, lineHeight: 1.5 }}>
                {hasFilters ? "Spróbuj innego hasła albo zdejmij filtr." : `W promieniu ${radius} km nie ma jeszcze gospodarstw.`}
              </p>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 14, flexWrap: "wrap" }}>
                {hasFilters && (
                  <button onClick={() => { setQuery(""); setFilter("Wszystko"); }} style={{
                    padding: "11px 16px", borderRadius: 11, minHeight: TAP,
                    background: C.ink, color: C.cream, fontSize: 13, fontWeight: 600,
                  }}>Wyczyść filtry</button>
                )}
                {radius < 100 && (
                  <button onClick={() => setRadius(100)} style={{
                    padding: "11px 16px", borderRadius: 11, minHeight: TAP,
                    background: C.cream, border: `1px solid ${C.line}`,
                    color: C.ink, fontSize: 13, fontWeight: 600,
                  }}>Poszerz do 100 km</button>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {visible.map((f) => (
                <FarmListCard key={f.id} farm={f} highlighted={selectedPin === f.id}
                  isFavourite={favourites.includes(f.id)}
                  onToggleFavourite={() => onToggleFavourite(f.id)}
                  onClick={() => onOpenFarm(f.id)}/>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
