import { useMemo, useState } from "react";
import { C, TAP } from "@/design/tokens";
import { SERVICE_FEE } from "@/data/tiers";
import { zl } from "@/lib/format";
import { photoSm } from "@/lib/photos";
import { Icon } from "@/components/Icon";
import type { CartLine, FarmView, Product } from "@/types";

/** Terminy odbioru są wybierane OSOBNO dla każdego gospodarstwa — jedno
 *  zamówienie z trzech wsi oddalonych o 40 km nie ma wspólnego terminu. */
const SLOTS = [
  { id: "sat", label: "Sobota, 4 października", sub: "9:00 – 11:00" },
  { id: "wed", label: "Środa, 8 października", sub: "16:00 – 19:00" },
];

type Group = { farm: FarmView; items: { product: Product; qty: number }[] };

type Props = {
  farms: FarmView[];
  cart: CartLine[];
  updateQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  onBrowse: () => void;
  onPlaceOrder: (total: number) => void;
  onOpenFarm: (id: string) => void;
};

export function CartScreen({ farms, cart, updateQty, removeFromCart, onBrowse, onPlaceOrder, onOpenFarm }: Props) {
  const [pickup, setPickup] = useState<Record<string, string>>({});
  const [payMethod, setPayMethod] = useState("blik");
  const [confirming, setConfirming] = useState(false);

  const groups = useMemo<Group[]>(() => {
    const map: Record<string, Group> = {};
    cart.forEach((line) => {
      for (const f of farms) {
        const p = f.products.find((x) => x.id === line.productId);
        if (p) {
          (map[f.id] ??= { farm: f, items: [] }).items.push({ product: p, qty: line.qty });
          break;
        }
      }
    });
    return Object.values(map);
  }, [cart, farms]);

  const subtotal = groups.reduce((s, g) => s + g.items.reduce((ss, it) => ss + it.product.price * it.qty, 0), 0);
  const total = subtotal + (groups.length ? SERVICE_FEE : 0);
  const missingPickup = groups.filter((g) => !pickup[g.farm.id]);

  if (groups.length === 0) {
    return (
      <div className="container container--narrow" style={{ paddingTop: 64 }}>
        <h1 className="serif-display" style={{ fontSize: 36, fontWeight: 400, color: C.ink, fontVariationSettings: "'opsz' 96, 'wght' 380" }}>
          Koszyk <em style={{ fontStyle: "italic", color: C.faded }}>pusty.</em>
        </h1>
        <p style={{ fontSize: 14.5, color: C.inkSoft, marginTop: 12, lineHeight: 1.5 }}>
          Wróć na mapę i zobacz, co dziś wykopali rolnicy w okolicy.
        </p>
        <button onClick={onBrowse} style={{
          marginTop: 22, padding: "16px 22px", minHeight: TAP,
          background: C.mustard, color: C.ink, borderRadius: 14,
          fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", gap: 8,
        }}>
          <Icon name="map" size={17}/> Przeglądaj gospodarstwa
        </button>
      </div>
    );
  }

  return (
    <div className="container container--narrow" style={{ paddingTop: 24 }}>
      <header style={{ marginBottom: 18 }}>
        <h1 className="serif-display" style={{ fontSize: 36, fontWeight: 400, fontVariationSettings: "'opsz' 96, 'wght' 380", color: C.ink }}>
          Koszyk, <em style={{ fontStyle: "italic", color: C.faded }}>{cart.reduce((s, x) => s + x.qty, 0)} szt.</em>
        </h1>
        <p style={{ fontSize: 13, color: C.inkSoft, marginTop: 4 }}>
          Z {groups.length} {groups.length === 1 ? "gospodarstwa" : "gospodarstw"} — każde odbierasz osobno.
        </p>
      </header>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {groups.map(({ farm, items }) => {
          const farmTotal = items.reduce((s, it) => s + it.product.price * it.qty, 0);
          return (
            <section key={farm.id} style={{ background: C.cream, borderRadius: 18, border: `1px solid ${C.lineSoft}`, overflow: "hidden" }}>
              <button onClick={() => onOpenFarm(farm.id)} style={{
                width: "100%", padding: "12px 16px", minHeight: TAP, textAlign: "left",
                borderBottom: `1px solid ${C.lineSoft}`, display: "flex", alignItems: "center", gap: 10,
              }}>
                <img src={photoSm(farm.photo)} alt="" loading="lazy" style={{ width: 34, height: 34, borderRadius: 9, objectFit: "cover" }}/>
                <span style={{ flex: 1 }}>
                  <span className="serif" style={{ display: "block", fontSize: 14.5, fontWeight: 500, color: C.ink }}>{farm.full}</span>
                  <span style={{ display: "block", fontSize: 11, color: C.faded }}>{farm.place} · {farm.distance} km</span>
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{zl(farmTotal)}</span>
              </button>

              {items.map((it) => (
                <div key={it.product.id} style={{
                  padding: "12px 16px", display: "flex", gap: 12, alignItems: "center",
                  borderTop: `1px solid ${C.lineSoft}`,
                }}>
                  <img src={photoSm(it.product.photo)} alt="" loading="lazy" style={{ width: 54, height: 54, borderRadius: 10, objectFit: "cover", flexShrink: 0 }}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="serif" style={{ fontSize: 15, fontWeight: 500, color: C.ink, lineHeight: 1.2 }}>{it.product.name}</div>
                    <div style={{ fontSize: 11.5, color: C.faded, marginTop: 1 }}>{it.product.unit}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.rust, marginTop: 4 }}>{zl(it.product.price * it.qty)}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 2, background: C.paper, borderRadius: 999, padding: 3 }}>
                      <button onClick={() => updateQty(it.product.id, it.qty - 1)} aria-label={`Mniej: ${it.product.name}`}
                        style={{ width: 34, height: 34, borderRadius: 17, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon name="minus" size={14}/>
                      </button>
                      <span style={{ fontSize: 13.5, fontWeight: 700, minWidth: 20, textAlign: "center" }}>{it.qty}</span>
                      <button onClick={() => updateQty(it.product.id, it.qty + 1)} aria-label={`Więcej: ${it.product.name}`}
                        style={{ width: 34, height: 34, borderRadius: 17, background: C.ink, color: C.cream, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon name="plus" size={14}/>
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(it.product.id)} aria-label={`Usuń ${it.product.name} z koszyka`}
                      style={{ fontSize: 11, color: C.faded, display: "flex", alignItems: "center", gap: 3, padding: "4px 2px" }}>
                      <Icon name="trash" size={12}/> Usuń
                    </button>
                  </div>
                </div>
              ))}

              <div style={{ padding: "12px 16px 14px", borderTop: `1px solid ${C.lineSoft}`, background: C.paper }}>
                <div style={{ fontSize: 10.5, color: C.faded, letterSpacing: 0.1, textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>
                  Odbiór — {farm.pickup}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {SLOTS.map((s) => {
                    const on = pickup[farm.id] === s.id;
                    return (
                      <button key={s.id} onClick={() => setPickup((p) => ({ ...p, [farm.id]: s.id }))} aria-pressed={on}
                        style={{
                          flex: 1, padding: "10px", borderRadius: 11, minHeight: TAP, textAlign: "left",
                          background: on ? C.ink : C.cream,
                          color: on ? C.cream : C.ink,
                          border: on ? "none" : `1px solid ${C.line}`,
                        }}>
                        <span style={{ display: "block", fontSize: 12, fontWeight: 600, lineHeight: 1.2 }}>{s.label}</span>
                        <span style={{ display: "block", fontSize: 10.5, color: on ? C.line : C.faded, marginTop: 2 }}>{s.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <section style={{ marginTop: 20 }}>
        <h2 style={{ fontSize: 11, color: C.faded, letterSpacing: 0.12, textTransform: "uppercase", marginBottom: 10, fontWeight: 600 }}>Płatność</h2>
        <div style={{ display: "flex", gap: 8 }}>
          {[{ id: "blik", label: "BLIK" }, { id: "card", label: "Karta" }, { id: "cash", label: "Gotówka" }].map((m) => (
            <button key={m.id} onClick={() => setPayMethod(m.id)} aria-pressed={payMethod === m.id} style={{
              flex: 1, padding: "13px 8px", borderRadius: 12, minHeight: TAP,
              background: payMethod === m.id ? C.ink : C.cream,
              color: payMethod === m.id ? C.cream : C.ink,
              border: payMethod === m.id ? "none" : `1px solid ${C.lineSoft}`,
              fontSize: 12.5, fontWeight: 600,
            }}>{m.label}</button>
          ))}
        </div>
      </section>

      <div style={{ marginTop: 20, fontSize: 13.5 }}>
        <div style={{ display: "flex", justifyContent: "space-between", color: C.inkSoft, marginBottom: 6 }}>
          <span>Suma produktów</span><strong>{zl(subtotal)}</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", color: C.inkSoft, marginBottom: 6 }}>
          <span>Opłata serwisowa</span><strong>{zl(SERVICE_FEE)}</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", color: C.moss }}>
          <span>Dostawa</span><strong>0 zł · odbiór własny</strong>
        </div>
      </div>

      <div className="sticky-bar" style={{
        marginTop: 20, background: C.ink, borderRadius: 16, padding: "14px 18px",
        boxShadow: "0 12px 32px -8px rgba(20,18,14,0.5)",
      }}>
        {missingPickup.length > 0 && (
          <p style={{ fontSize: 11.5, color: C.mustard, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="warn" size={13} color={C.mustard}/>
            Wybierz termin odbioru dla: {missingPickup.map((g) => g.farm.name).join(", ")}
          </p>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: C.line, letterSpacing: 0.08, textTransform: "uppercase" }}>Do zapłaty</div>
            <div className="serif" style={{ fontSize: 22, fontWeight: 600, color: C.cream, fontVariationSettings: "'opsz' 24, 'wght' 600" }}>
              {zl(total)}
            </div>
          </div>
          {confirming ? (
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => onPlaceOrder(total)} style={{
                background: C.mustard, color: C.ink, padding: "12px 16px",
                borderRadius: 12, fontSize: 13.5, fontWeight: 700, minHeight: TAP,
              }}>Tak, zamawiam</button>
              <button onClick={() => setConfirming(false)} style={{
                color: C.line, padding: "12px", fontSize: 13, fontWeight: 600, minHeight: TAP,
              }}>Anuluj</button>
            </div>
          ) : (
            <button onClick={() => setConfirming(true)} disabled={missingPickup.length > 0} style={{
              background: missingPickup.length > 0 ? "rgba(250,246,238,0.15)" : C.mustard,
              color: missingPickup.length > 0 ? C.line : C.ink,
              padding: "13px 22px", borderRadius: 12, minHeight: TAP,
              fontSize: 14, fontWeight: 700,
              cursor: missingPickup.length > 0 ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              Zamawiam <span aria-hidden="true">→</span>
            </button>
          )}
        </div>
      </div>
      <div style={{ height: 24 }}/>
    </div>
  );
}
