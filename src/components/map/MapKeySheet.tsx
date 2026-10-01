import { useEffect, useState } from "react";
import { C, TAP } from "@/design/tokens";
import { Icon } from "../Icon";

type Props = {
  open: boolean;
  apiKey: string;
  error: string | null;
  onClose: () => void;
  onSave: (key: string) => void;
  onClear: () => void;
};

export function MapKeySheet({ open, apiKey, error, onClose, onSave, onClear }: Props) {
  const [val, setVal] = useState(apiKey);
  useEffect(() => { if (open) setVal(apiKey); }, [open, apiKey]);
  if (!open) return null;

  return (
    <div
      role="dialog" aria-modal="true" aria-label="Ustawienia mapy"
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 300,
        background: "rgba(20,18,14,0.5)", backdropFilter: "blur(3px)",
        display: "flex", alignItems: "flex-end", justifyContent: "center",
      }}>
      <div className="sheet" onClick={(e) => e.stopPropagation()} style={{
        background: C.paper, width: "100%", maxWidth: 560,
        borderRadius: "24px 24px 0 0", padding: "22px 24px 40px",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <h2 className="serif-display" style={{ fontSize: 26, fontWeight: 400, color: C.ink }}>Mapa Google</h2>
          <button onClick={onClose} aria-label="Zamknij" style={{
            width: TAP, height: TAP, borderRadius: 22, color: C.inkSoft,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}><Icon name="close" size={18}/></button>
        </div>

        <p style={{ fontSize: 13.5, color: C.inkSoft, lineHeight: 1.5, marginBottom: 16 }}>
          Wklej klucz Maps JavaScript API. Zapisze się lokalnie w przeglądarce — nigdzie go nie wysyłamy.
          Bez klucza działa zapasowa mapa rysunkowa.
        </p>

        {error && (
          <div style={{
            padding: "11px 13px", borderRadius: 11, marginBottom: 14,
            background: `${C.rust}12`, border: `1px solid ${C.rust}35`,
            fontSize: 12.5, color: C.rust, lineHeight: 1.4, display: "flex", gap: 9,
          }}>
            <Icon name="warn" size={15} color={C.rust}/>
            <span>{error}</span>
          </div>
        )}

        <input
          value={val} onChange={(e) => setVal(e.target.value)}
          placeholder="AIza…" autoCapitalize="off" autoCorrect="off" spellCheck={false}
          aria-label="Klucz Google Maps API"
          style={{
            width: "100%", padding: "14px 15px", background: C.cream,
            border: `1px solid ${C.line}`, borderRadius: 12,
            fontSize: 14, color: C.ink, outline: "none",
            fontFamily: "ui-monospace, Menlo, monospace",
          }}/>

        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button onClick={() => onSave(val.trim())} disabled={!val.trim()} style={{
            flex: 2, padding: "15px 18px", borderRadius: 13, minHeight: TAP,
            background: val.trim() ? C.mustard : C.sand,
            color: val.trim() ? C.ink : C.faded,
            fontSize: 14.5, fontWeight: 700,
          }}>Włącz mapę Google</button>
          {apiKey && (
            <button onClick={onClear} style={{
              flex: 1, padding: "15px 14px", borderRadius: 13, minHeight: TAP,
              background: C.cream, border: `1px solid ${C.line}`,
              color: C.ink, fontSize: 13.5, fontWeight: 600,
            }}>Odłącz</button>
          )}
        </div>

        <p style={{ fontSize: 11.5, color: C.faded, marginTop: 12, lineHeight: 1.45 }}>
          Potrzebne: włączone „Maps JavaScript API" w Google Cloud i klucz ograniczony do domeny,
          na której hostujesz aplikację. Ustaw alert budżetowy.
        </p>
      </div>
    </div>
  );
}
