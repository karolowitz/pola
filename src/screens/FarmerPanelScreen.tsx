import { useState } from "react";
import { C, TAP } from "@/design/tokens";
import { TIER_LIMITS, TIER_NAMES } from "@/data/tiers";
import { zl } from "@/lib/format";
import { photoSm } from "@/lib/photos";
import { Icon } from "@/components/Icon";
import type { FarmView } from "@/types";

type Props = {
  farm: FarmView;
  onEditProfile: () => void;
  onEditProduct: (id: string) => void;
  onAddProduct: () => void;
  onViewPublic: () => void;
  onChangePlan: () => void;
  onExit: () => void;
  onReset: () => void;
};

export function FarmerPanelScreen({
  farm, onEditProfile, onEditProduct, onAddProduct, onViewPublic, onChangePlan, onExit, onReset,
}: Props) {
  const [confirmReset, setConfirmReset] = useState(false);
  const limit = TIER_LIMITS[farm.tier];
  const used = farm.products.length;
  const atLimit = used >= limit;
  const nextTier = farm.tier === "zagroda" ? "Sad" : "Spichlerz";

  return (
    <div className="container container--wide" style={{ paddingTop: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <button onClick={onExit} style={{
          display: "flex", alignItems: "center", gap: 6, minHeight: 40,
          fontSize: 12.5, fontWeight: 600, color: C.inkSoft, padding: "0 2px",
        }}><Icon name="back" size={14}/> Widok klienta</button>
        <span style={{ fontSize: 11, color: C.faded, letterSpacing: 0.12, textTransform: "uppercase", fontWeight: 600 }}>
          Panel rolnika
        </span>
      </div>

      <header style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 className="serif-display" style={{
            fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 400,
            fontVariationSettings: "'opsz' 96, 'wght' 380", color: C.ink, lineHeight: 1.05,
          }}>{farm.full}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            <span style={{
              fontSize: 11, fontWeight: 700, padding: "5px 10px", borderRadius: 999,
              color: farm.tier === "spichlerz" ? C.ink : C.cream,
              background: farm.tier === "spichlerz" ? C.mustard : C.moss,
            }}>Plan: {TIER_NAMES[farm.tier]}</span>
            <button onClick={onChangePlan} style={{
              fontSize: 12, fontWeight: 600, color: C.inkSoft,
              textDecoration: "underline", minHeight: 36, padding: "0 2px",
            }}>Zmień plan</button>
          </div>
        </div>
        <img src={photoSm(farm.photo)} alt="" style={{
          width: 56, height: 56, borderRadius: 14, objectFit: "cover",
          flexShrink: 0, border: `1px solid ${C.line}`,
        }}/>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 18 }}>
        {[
          { label: "Wyświetlenia · 7 dni", val: "214" },
          { label: "Zamówienia", val: farm.modes.includes("order") ? "8" : "—" },
          { label: "Telefony", val: "12" },
        ].map((s) => (
          <div key={s.label} style={{ background: C.cream, padding: 12, borderRadius: 14, border: `1px solid ${C.lineSoft}` }}>
            <div className="serif" style={{ fontSize: 22, fontWeight: 500, color: C.ink, fontVariationSettings: "'opsz' 36, 'wght' 500" }}>{s.val}</div>
            <div style={{ fontSize: 10, color: C.faded, marginTop: 2, lineHeight: 1.25 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        <button onClick={onViewPublic} style={{
          flex: 1, padding: "13px 14px", borderRadius: 12, minHeight: TAP,
          background: C.cream, border: `1px solid ${C.line}`,
          fontSize: 13, fontWeight: 600, color: C.ink,
        }}>Zobacz profil publiczny</button>
        <button onClick={onEditProfile} style={{
          flex: 1, padding: "13px 14px", borderRadius: 12, minHeight: TAP,
          background: C.ink, color: C.cream, fontSize: 13, fontWeight: 600,
        }}>Edytuj profil</button>
      </div>

      <section style={{ marginTop: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 className="serif-display" style={{ fontSize: 24, fontWeight: 400, fontVariationSettings: "'opsz' 48, 'wght' 400", color: C.ink }}>
            Twoje <em style={{ fontStyle: "italic", color: C.faded }}>produkty</em>
          </h2>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: atLimit ? C.rust : C.faded }}>
            {used} / {limit === Infinity ? "∞" : limit}
          </span>
        </div>
        {limit !== Infinity && (
          <div style={{ marginTop: 10, height: 5, borderRadius: 3, background: C.line, overflow: "hidden" }}>
            <div style={{
              width: `${Math.min(100, (used / limit) * 100)}%`, height: "100%",
              background: atLimit ? C.rust : C.moss, borderRadius: 3, transition: "width .2s",
            }}/>
          </div>
        )}
      </section>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
        {used === 0 && (
          <p style={{ padding: "26px 18px", borderRadius: 14, border: `1.5px dashed ${C.line}`, textAlign: "center", fontSize: 13.5, color: C.inkSoft, lineHeight: 1.5 }}>
            Nie masz jeszcze produktów.<br/>Dodaj pierwszy — to dwie minuty.
          </p>
        )}
        {farm.products.map((p) => (
          <button key={p.id} onClick={() => onEditProduct(p.id)} style={{
            display: "flex", alignItems: "center", gap: 12, padding: 10, minHeight: TAP,
            background: C.cream, borderRadius: 14, border: `1px solid ${C.lineSoft}`,
            textAlign: "left", width: "100%",
          }}>
            <img src={photoSm(p.photo)} alt="" loading="lazy" style={{ width: 52, height: 52, borderRadius: 10, objectFit: "cover", flexShrink: 0 }}/>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span className="serif" style={{ display: "block", fontSize: 15, fontWeight: 500, color: C.ink, lineHeight: 1.2 }}>{p.name}</span>
              <span style={{ display: "block", fontSize: 11.5, color: C.faded, marginTop: 2 }}>{p.unit} · {p.category}</span>
            </span>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>{zl(p.price)}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, fontWeight: 700, color: C.mustardT, marginLeft: 4 }}>
              <Icon name="edit" size={13}/> Edytuj
            </span>
          </button>
        ))}

        {atLimit ? (
          <div style={{ padding: 16, borderRadius: 14, background: `${C.terra}12`, border: `1px solid ${C.terra}40` }}>
            <p style={{ fontSize: 13.5, fontWeight: 700, color: C.rust }}>
              Limit planu {TIER_NAMES[farm.tier]} osiągnięty
            </p>
            <p style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 4, lineHeight: 1.4 }}>
              Przejdź na plan {nextTier}, żeby dodać więcej produktów.
            </p>
            <button onClick={onChangePlan} style={{
              marginTop: 12, padding: "12px 16px", borderRadius: 11, minHeight: TAP,
              background: C.mustard, color: C.ink, fontSize: 13.5, fontWeight: 700,
            }}>Zobacz plany →</button>
          </div>
        ) : (
          <button onClick={onAddProduct} style={{
            padding: "15px 18px", borderRadius: 14, minHeight: TAP,
            background: C.mustard, color: C.ink, fontSize: 14.5, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <Icon name="plus" size={16} stroke={2.4}/> Dodaj produkt
          </button>
        )}
      </div>

      <div style={{ marginTop: 28, textAlign: "center", maxWidth: 420, marginLeft: "auto", marginRight: "auto" }}>
        {confirmReset ? (
          <div style={{ padding: 14, borderRadius: 13, background: `${C.rust}0E`, border: `1px solid ${C.rust}30` }}>
            <p style={{ fontSize: 13, color: C.rust, fontWeight: 600, marginBottom: 10, lineHeight: 1.4 }}>
              Usunie to Twoje gospodarstwo, produkty i koszyk. Na pewno?
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={onReset} style={{
                flex: 1, padding: "12px 14px", borderRadius: 11, minHeight: TAP,
                background: C.rust, color: C.cream, fontSize: 13, fontWeight: 700,
              }}>Tak, resetuj</button>
              <button onClick={() => setConfirmReset(false)} style={{
                flex: 1, padding: "12px 14px", borderRadius: 11, minHeight: TAP,
                background: C.cream, border: `1px solid ${C.line}`, color: C.ink, fontSize: 13, fontWeight: 600,
              }}>Anuluj</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setConfirmReset(true)} style={{ fontSize: 12, color: C.faded, textDecoration: "underline", minHeight: 40 }}>
            Resetuj demo
          </button>
        )}
      </div>
      <div style={{ height: 24 }}/>
    </div>
  );
}
