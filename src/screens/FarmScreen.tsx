import { useRef } from "react";
import { C, TAP } from "@/design/tokens";
import { zl } from "@/lib/format";
import { photo, photoSm } from "@/lib/photos";
import { Icon } from "@/components/Icon";
import { InfoRow } from "@/components/InfoRow";
import type { CartLine, FarmView } from "@/types";
import type { PushToast } from "@/state/useToasts";

type Props = {
  farm: FarmView | null;
  onBack: () => void;
  onOpenProduct: (id: string) => void;
  isFavourite: boolean;
  onToggleFavourite: (id: string) => void;
  cart: CartLine[];
  onGoCart: () => void;
  push: PushToast;
};

export function FarmScreen({
  farm, onBack, onOpenProduct, isFavourite, onToggleFavourite, cart, onGoCart, push,
}: Props) {
  const productsRef = useRef<HTMLElement>(null);
  if (!farm) {
    return (
      <div className="container" style={{ paddingTop: 80 }}>
        <h1 className="serif-display" style={{ fontSize: 30 }}>Nie znaleziono gospodarstwa</h1>
        <button onClick={onBack} style={{
          marginTop: 18, padding: "14px 20px", background: C.mustard,
          color: C.ink, borderRadius: 12, fontSize: 14, fontWeight: 700, minHeight: TAP,
        }}>Wróć</button>
      </div>
    );
  }

  const canOrder = farm.modes.includes("order");
  const inCart = cart
    .filter((x) => farm.products.some((p) => p.id === x.productId))
    .reduce((s, x) => s + x.qty, 0);
  const phone = farm.contact.phone;

  return (
    <article>
      <div style={{ position: "relative", height: "clamp(240px, 38vw, 420px)" }}>
        <img src={photo(farm.photo)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(20,18,14,0.38) 0%, rgba(20,18,14,0) 34%, rgba(20,18,14,0.4) 100%)",
        }}/>
        <div className="container container--wide" style={{
          position: "absolute", top: 20, left: 0, right: 0,
          display: "flex", justifyContent: "space-between",
        }}>
          <button onClick={onBack} aria-label="Wróć do listy" style={{
            width: TAP, height: TAP, borderRadius: 22,
            background: "rgba(250,246,238,0.94)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}><Icon name="back" size={18} color={C.ink}/></button>
          <button onClick={() => onToggleFavourite(farm.id)} aria-pressed={isFavourite}
            aria-label={isFavourite ? "Usuń z ulubionych" : "Dodaj do ulubionych"} style={{
              width: TAP, height: TAP, borderRadius: 22,
              background: "rgba(250,246,238,0.94)", backdropFilter: "blur(8px)",
              color: isFavourite ? C.rust : C.ink,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}><Icon name={isFavourite ? "heartOn" : "heart"} size={19}/></button>
        </div>
        {farm.tier === "spichlerz" && (
          <div className="container container--wide" style={{ position: "absolute", bottom: 18, left: 0, right: 0 }}>
            <span style={{
              background: C.mustard, color: C.ink, padding: "6px 12px", borderRadius: 999,
              fontSize: 11, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 5,
            }}><Icon name="sparkle" size={12}/> Wyróżnione w okolicy</span>
          </div>
        )}
      </div>

      <div className="container container--wide" style={{
        position: "relative", marginTop: -28, background: C.paper,
        borderRadius: "24px 24px 0 0", paddingTop: 26,
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 className="serif-display" style={{
              fontSize: "clamp(32px, 4.5vw, 46px)", fontWeight: 400,
              fontVariationSettings: "'opsz' 96, 'wght' 380", color: C.ink, lineHeight: 1.02,
            }}>{farm.full}</h1>
            <p style={{ fontSize: 13, color: C.faded, marginTop: 6 }}>
              {farm.family ? `${farm.family} · ` : ""}{farm.place} · od {farm.since}
            </p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            {farm.rating !== null ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
                  <Icon name="star" size={14} color={C.mustardD}/>
                  <span style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>{farm.rating}</span>
                </div>
                <div style={{ fontSize: 11, color: C.faded }}>{farm.reviews} opinii</div>
              </>
            ) : (
              <span style={{ fontSize: 10, fontWeight: 700, color: C.moss, background: `${C.moss}18`, padding: "5px 10px", borderRadius: 999 }}>NOWE</span>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 6, marginTop: 14, flexWrap: "wrap" }}>
          {farm.eko && (
            <span style={{ fontSize: 11, fontWeight: 600, color: C.moss, padding: "6px 10px", borderRadius: 999, background: `${C.moss}18`, display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Icon name="leaf" size={11} color={C.moss}/> ekologiczne
            </span>
          )}
          <span style={{ fontSize: 11, fontWeight: 600, color: C.inkSoft, padding: "6px 10px", borderRadius: 999, background: C.sand }}>
            {farm.distance} km w linii prostej
          </span>
          {farm.hours && (
            <span style={{ fontSize: 11, fontWeight: 600, color: C.inkSoft, padding: "6px 10px", borderRadius: 999, background: C.sand, display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Icon name="clock" size={11} color={C.inkSoft}/> {farm.hours}
            </span>
          )}
        </div>

        {farm.long && (
          <section style={{ marginTop: 24, maxWidth: 680 }}>
            <h2 style={{ fontSize: 11, color: C.faded, letterSpacing: 0.12, textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>
              Historia
            </h2>
            <p style={{ fontSize: 15, color: C.inkSoft, lineHeight: 1.6 }}>{farm.long}</p>
          </section>
        )}

        {farm.pickup && (
          <div style={{ marginTop: 20 }}>
            <InfoRow icon="pin" label="Odbiór" value={farm.pickup}/>
          </div>
        )}

        <section ref={productsRef} style={{ marginTop: 32, scrollMarginTop: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <h2 className="serif-display" style={{ fontSize: 24, fontWeight: 400, fontVariationSettings: "'opsz' 48, 'wght' 400", color: C.ink }}>
              Dziś <em style={{ fontStyle: "italic", color: C.faded }}>w gospodarstwie</em>
            </h2>
            <span style={{ fontSize: 12, color: C.faded }}>{farm.products.length} poz.</span>
          </div>

          {farm.products.length === 0 ? (
            <p style={{ padding: "22px 18px", borderRadius: 14, border: `1.5px dashed ${C.line}`, fontSize: 13.5, color: C.inkSoft, lineHeight: 1.5, textAlign: "center" }}>
              Rolnik nie dodał jeszcze produktów — zajrzyj wkrótce.
            </p>
          ) : (
            <div className="grid-products">
              {farm.products.map((p) => (
                <button key={p.id} onClick={() => onOpenProduct(p.id)} style={{
                  textAlign: "left", padding: 0, borderRadius: 14, overflow: "hidden",
                  background: C.cream, border: `1px solid ${C.lineSoft}`,
                }}>
                  <img src={photoSm(p.photo)} alt="" loading="lazy" style={{ width: "100%", height: 120, objectFit: "cover" }}/>
                  <span style={{ display: "block", padding: "10px 12px 12px" }}>
                    <span className="serif" style={{ display: "block", fontSize: 14.5, fontWeight: 500, color: C.ink, fontVariationSettings: "'opsz' 18, 'wght' 500", lineHeight: 1.2 }}>
                      {p.name}
                    </span>
                    <span style={{ display: "block", fontSize: 11, color: C.faded, marginTop: 2 }}>{p.unit}</span>
                    <span style={{ display: "block", fontSize: 15, fontWeight: 700, color: C.ink, marginTop: 6 }}>{zl(p.price)}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        <div className="sticky-bar" style={{ display: "flex", gap: 8, marginTop: 28 }}>
          {canOrder && (
            inCart > 0 ? (
              <button onClick={onGoCart} style={{
                flex: 2, padding: "16px 20px", minHeight: TAP,
                background: C.mustard, color: C.ink, borderRadius: 14,
                fontSize: 15, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: "0 8px 24px -4px rgba(201,151,74,0.45)",
              }}>
                <Icon name="cart" size={18}/> W koszyku ({inCart}) — przejdź
              </button>
            ) : (
              <button onClick={() => {
                if (farm.products.length === 0) { push("To gospodarstwo nie ma jeszcze produktów."); return; }
                productsRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
              }} style={{
                flex: 2, padding: "16px 20px", minHeight: TAP,
                background: C.mustard, color: C.ink, borderRadius: 14,
                fontSize: 15, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: "0 8px 24px -4px rgba(201,151,74,0.45)",
              }}>
                <Icon name="cart" size={18}/> Zamów online
              </button>
            )
          )}
          <a href={`tel:${phone.replace(/\s/g, "")}`} style={{
            flex: canOrder ? 1 : 2, padding: "16px 20px", minHeight: TAP,
            background: canOrder ? C.cream : C.ink,
            color: canOrder ? C.ink : C.cream,
            border: canOrder ? `1px solid ${C.line}` : "none",
            borderRadius: 14, fontSize: 15, fontWeight: 600, textDecoration: "none",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <Icon name="phone" size={16}/> {canOrder ? "Zadzwoń" : "Skontaktuj się"}
          </a>
        </div>
        <div style={{ height: 24 }}/>
      </div>
    </article>
  );
}
