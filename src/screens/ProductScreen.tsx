import { useState } from "react";
import { C, TAP } from "@/design/tokens";
import { zl } from "@/lib/format";
import { photo, photoSm } from "@/lib/photos";
import { Icon } from "@/components/Icon";
import { InfoRow } from "@/components/InfoRow";
import type { FarmView, Product } from "@/types";
import type { PushToast } from "@/state/useToasts";

type Props = {
  product: (Product & { farm: FarmView }) | null;
  onBack: () => void;
  addToCart: (id: string, qty: number) => void;
  onGoCart: () => void;
  onOpenFarm: (id: string) => void;
  push: PushToast;
};

export function ProductScreen({ product, onBack, addToCart, onGoCart, onOpenFarm, push }: Props) {
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="container" style={{ paddingTop: 80 }}>
        <h1 className="serif-display" style={{ fontSize: 30 }}>Produkt nie istnieje</h1>
        <button onClick={onBack} style={{
          marginTop: 18, padding: "14px 20px", background: C.mustard,
          color: C.ink, borderRadius: 12, fontSize: 14, fontWeight: 700, minHeight: TAP,
        }}>Wróć</button>
      </div>
    );
  }

  const canOrder = product.farm.modes.includes("order");

  const handleAdd = () => {
    addToCart(product.id, qty);
    push(`${product.name} × ${qty} w koszyku.`, {
      action: { label: "Koszyk", onClick: onGoCart }, duration: 3800,
    });
    setQty(1);
  };

  return (
    <article>
      <div style={{ position: "relative", height: "clamp(280px, 42vw, 460px)", background: C.sand }}>
        <img src={photo(product.photo)} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(20,18,14,0.3) 0%, rgba(20,18,14,0) 26%)" }}/>
        <div className="container container--wide" style={{ position: "absolute", top: 20, left: 0, right: 0 }}>
          <button onClick={onBack} aria-label="Wróć do gospodarstwa" style={{
            width: TAP, height: TAP, borderRadius: 22,
            background: "rgba(250,246,238,0.94)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}><Icon name="back" size={18} color={C.ink}/></button>
        </div>
      </div>

      <div className="container container--wide" style={{
        position: "relative", marginTop: -28, background: C.paper,
        borderRadius: "24px 24px 0 0", paddingTop: 26, maxWidth: 760,
      }}>
        <p style={{ fontSize: 11, color: C.faded, letterSpacing: 0.12, textTransform: "uppercase", fontWeight: 600 }}>
          {product.category}
        </p>
        <h1 className="serif-display" style={{
          fontSize: "clamp(32px, 4.5vw, 46px)", fontWeight: 400,
          fontVariationSettings: "'opsz' 96, 'wght' 350",
          color: C.ink, marginTop: 6, lineHeight: 1.02,
        }}>
          {product.name}, <em style={{ fontStyle: "italic", color: C.faded }}>{product.unit}</em>
        </h1>
        <p style={{ marginTop: 14, fontSize: 24, fontWeight: 700, color: C.ink }}>
          {zl(product.price)}
          <span style={{ fontSize: 13, color: C.faded, fontWeight: 500, marginLeft: 6 }}>/ {product.unit}</span>
        </p>

        {product.desc && (
          <p style={{ fontSize: 15, color: C.inkSoft, lineHeight: 1.6, marginTop: 16, maxWidth: 580 }}>{product.desc}</p>
        )}

        <button onClick={() => onOpenFarm(product.farm.id)} style={{
          width: "100%", maxWidth: 520, marginTop: 24, padding: 14,
          background: C.cream, borderRadius: 14, border: `1px solid ${C.lineSoft}`,
          display: "flex", alignItems: "center", gap: 12, textAlign: "left",
        }}>
          <img src={photoSm(product.farm.photo)} alt="" loading="lazy" style={{ width: 48, height: 48, borderRadius: 12, objectFit: "cover", flexShrink: 0 }}/>
          <span style={{ flex: 1 }}>
            <span style={{ display: "block", fontSize: 11, color: C.faded, letterSpacing: 0.08, textTransform: "uppercase" }}>Pochodzenie</span>
            <span className="serif" style={{ display: "block", fontSize: 16, fontWeight: 500, color: C.ink, marginTop: 1 }}>{product.farm.full}</span>
            <span style={{ display: "block", fontSize: 11.5, color: C.faded }}>{product.farm.place} · {product.farm.distance} km</span>
          </span>
          <Icon name="forward" size={18} color={C.faded}/>
        </button>

        <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 12 }}>
          <InfoRow icon="clock" label="Najbliższy odbiór" value="Sobota, 4 października, 9:00–11:00"/>
          <InfoRow icon="pin" label="Punkt odbioru" value={product.farm.pickup}/>
        </div>

        <div className="sticky-bar" style={{ display: "flex", gap: 10, marginTop: 32, maxWidth: 520 }}>
          {canOrder ? (
            <>
              <div style={{
                display: "flex", alignItems: "center", padding: "0 4px",
                background: C.cream, borderRadius: 14, border: `1px solid ${C.line}`,
              }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} disabled={qty <= 1} aria-label="Zmniejsz ilość"
                  style={{ width: 40, height: TAP, color: qty <= 1 ? C.line : C.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="minus" size={16}/>
                </button>
                <span aria-live="polite" style={{ fontSize: 16, fontWeight: 700, minWidth: 26, textAlign: "center" }}>{qty}</span>
                <button onClick={() => setQty(qty + 1)} aria-label="Zwiększ ilość"
                  style={{ width: 40, height: TAP, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="plus" size={16}/>
                </button>
              </div>
              <button onClick={handleAdd} style={{
                flex: 1, padding: "16px 18px", minHeight: TAP,
                background: C.mustard, color: C.ink, borderRadius: 14,
                fontSize: 15, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                boxShadow: "0 8px 24px -4px rgba(201,151,74,0.45)",
              }}>
                <span>Do koszyka</span>
                <span>{zl(product.price * qty)}</span>
              </button>
            </>
          ) : (
            <a href={`tel:${product.farm.contact.phone.replace(/\s/g, "")}`} style={{
              flex: 1, padding: "16px 20px", minHeight: TAP,
              background: C.ink, color: C.cream, textDecoration: "none",
              borderRadius: 14, fontSize: 15, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              <Icon name="phone" size={17}/> Zadzwoń, żeby zamówić
            </a>
          )}
        </div>
        <div style={{ height: 24 }}/>
      </div>
    </article>
  );
}
