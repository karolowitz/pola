import { C, TAP } from "@/design/tokens";
import { photoSm } from "@/lib/photos";
import { Icon, type IconName } from "@/components/Icon";
import type { FarmView } from "@/types";
import type { PushToast } from "@/state/useToasts";

type Props = {
  myFarm: FarmView | null;
  favourites: string[];
  farms: FarmView[];
  apiKey: string;
  onPricing: () => void;
  onOpenFarm: (id: string) => void;
  onOpenKeySheet: () => void;
  push: PushToast;
};

export function AccountScreen({
  myFarm, favourites, farms, apiKey, onPricing, onOpenFarm, onOpenKeySheet, push,
}: Props) {
  const favFarms = farms.filter((f) => favourites.includes(f.id));

  const rows: { icon: IconName; label: string; sub: string; onClick: () => void }[] = [
    { icon: "cart", label: "Moje zamówienia", sub: "1 w drodze", onClick: () => push("Historia zamówień pojawi się w następnej iteracji.") },
    { icon: "pin", label: "Adresy odbioru", sub: "Stare Miasto", onClick: () => push("Edycja adresów — do zaprojektowania.") },
    { icon: "bell", label: "Powiadomienia sezonowe", sub: "Włączone", onClick: () => push("Ustawienia powiadomień — do zaprojektowania.") },
    { icon: "globe", label: "Silnik mapy", sub: apiKey ? "Google Maps" : "Mapa poglądowa (bez klucza)", onClick: onOpenKeySheet },
  ];

  return (
    <div className="container container--narrow" style={{ paddingTop: 24 }}>
      <header>
        <h1 className="serif-display" style={{ fontSize: "clamp(34px, 5vw, 44px)", fontWeight: 400, color: C.ink, fontVariationSettings: "'opsz' 96, 'wght' 380" }}>
          Cześć, <em style={{ fontStyle: "italic", color: C.mustardT }}>Karol.</em>
        </h1>
        <p style={{ fontSize: 13, color: C.faded, marginTop: 6 }}>karol@example.com · Kraków</p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 22 }}>
        {[
          { label: "Zamówień", val: "12" },
          { label: "Ulubionych", val: String(favFarms.length) },
          { label: "Kilometrów", val: "147" },
        ].map((s) => (
          <div key={s.label} style={{ background: C.cream, padding: 14, borderRadius: 14, border: `1px solid ${C.lineSoft}` }}>
            <div className="serif" style={{ fontSize: 24, fontWeight: 500, color: C.ink, fontVariationSettings: "'opsz' 36, 'wght' 500" }}>{s.val}</div>
            <div style={{ fontSize: 11, color: C.faded, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {favFarms.length > 0 && (
        <section style={{ marginTop: 26 }}>
          <h2 style={{ fontSize: 11, color: C.faded, letterSpacing: 0.12, textTransform: "uppercase", marginBottom: 10, fontWeight: 600 }}>
            Ulubione gospodarstwa
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {favFarms.map((f) => (
              <button key={f.id} onClick={() => onOpenFarm(f.id)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: 10, minHeight: TAP,
                background: C.cream, borderRadius: 13, border: `1px solid ${C.lineSoft}`, textAlign: "left",
              }}>
                <img src={photoSm(f.photo)} alt="" loading="lazy" style={{ width: 40, height: 40, borderRadius: 10, objectFit: "cover", flexShrink: 0 }}/>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span className="serif" style={{ display: "block", fontSize: 14.5, fontWeight: 500, color: C.ink }}>{f.full}</span>
                  <span style={{ display: "block", fontSize: 11.5, color: C.faded }}>{f.place} · {f.distance} km</span>
                </span>
                <Icon name="forward" size={16} color={C.faded}/>
              </button>
            ))}
          </div>
        </section>
      )}

      <div style={{ marginTop: 26, display: "flex", flexDirection: "column" }}>
        {rows.map((m) => (
          <button key={m.label} onClick={m.onClick} style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "14px 12px", minHeight: TAP, textAlign: "left",
            color: C.ink, borderBottom: `1px solid ${C.lineSoft}`,
          }}>
            <span style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: C.cream, border: `1px solid ${C.lineSoft}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}><Icon name={m.icon} size={16} color={C.inkSoft}/></span>
            <span style={{ flex: 1 }}>
              <span style={{ display: "block", fontSize: 14, fontWeight: 500 }}>{m.label}</span>
              <span style={{ display: "block", fontSize: 11.5, color: C.faded }}>{m.sub}</span>
            </span>
            <Icon name="forward" size={16} color={C.faded}/>
          </button>
        ))}
      </div>

      <button onClick={onPricing} style={{
        width: "100%", marginTop: 26, padding: 18, minHeight: TAP,
        background: C.ink, color: C.cream, borderRadius: 18,
        textAlign: "left", display: "flex", alignItems: "center", gap: 14,
      }}>
        <span style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: C.mustard,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}><Icon name={myFarm ? "edit" : "leaf"} size={20} color={C.ink}/></span>
        <span style={{ flex: 1 }}>
          <span className="serif" style={{ display: "block", fontSize: 16, fontWeight: 500, fontVariationSettings: "'opsz' 20, 'wght' 500" }}>
            {myFarm ? "Panel rolnika" : "Jesteś rolnikiem?"}
          </span>
          <span style={{ display: "block", fontSize: 12, opacity: 0.75, marginTop: 2, lineHeight: 1.35 }}>
            {myFarm ? `${myFarm.full} · zarządzaj profilem i produktami` : "Wystaw swoje gospodarstwo — pierwszy produkt za darmo"}
          </span>
        </span>
        <span aria-hidden="true" style={{ color: C.mustard, fontSize: 22 }}>→</span>
      </button>
      <div style={{ height: 24 }}/>
    </div>
  );
}
