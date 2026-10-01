import { C, TAP } from "@/design/tokens";
import { photo } from "@/lib/photos";

type Props = { onStart: () => void; onFarmer: () => void };

export function SplashScreen({ onStart, onFarmer }: Props) {
  return (
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <img src={photo("harvest-box")} alt="" style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        objectFit: "cover",
      }}/>
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(20,18,14,0.5) 0%, rgba(20,18,14,0.25) 38%, rgba(20,18,14,0.9) 88%)",
      }}/>

      <header className="container container--wide" style={{
        position: "relative", display: "flex", alignItems: "center",
        justifyContent: "space-between", paddingTop: 28, paddingBottom: 28, color: C.cream,
      }}>
        <span className="serif-display" style={{ fontSize: 28, fontVariationSettings: "'opsz' 96, 'wght' 350" }}>pola.</span>
        <button onClick={onFarmer} style={{
          color: C.cream, fontSize: 13, fontWeight: 500, padding: "11px 18px",
          borderRadius: 999, minHeight: TAP,
          border: `1px solid ${C.cream}55`, background: "rgba(245,239,230,0.12)",
          backdropFilter: "blur(8px)",
        }}>Jesteś rolnikiem? →</button>
      </header>

      <div className="container container--wide" style={{
        position: "relative", flex: 1, display: "flex",
        flexDirection: "column", justifyContent: "flex-end",
        paddingBottom: 72, color: C.cream,
      }}>
        <div style={{ maxWidth: 620 }}>
          <p style={{ fontSize: 12.5, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.88, marginBottom: 18 }}>
            Sezon 2026 · Małopolska
          </p>
          <h1 className="serif-display" style={{
            fontSize: "clamp(52px, 9vw, 104px)", fontWeight: 400,
            fontVariationSettings: "'opsz' 144, 'wght' 320",
            lineHeight: 0.94, letterSpacing: "-0.035em", marginBottom: 20,
          }}>
            Prosto<br/>
            <em style={{ fontStyle: "italic", color: C.mustard, fontVariationSettings: "'opsz' 144, 'wght' 320, 'WONK' 1" }}>
              z pola.
            </em>
          </h1>
          <p style={{ fontSize: "clamp(15px, 1.6vw, 19px)", lineHeight: 1.5, opacity: 0.93, marginBottom: 32, maxWidth: 440 }}>
            Znajdź rolników w okolicy, sprawdź co dziś wykopali, kup online albo umów się na miejscu.
          </p>
          <button onClick={onStart} style={{
            padding: "18px 28px", minHeight: TAP, minWidth: 280,
            background: C.mustard, color: C.ink, borderRadius: 16,
            fontSize: 16, fontWeight: 600,
            display: "inline-flex", alignItems: "center", justifyContent: "space-between", gap: 24,
          }}>
            <span>Zobacz mapę gospodarstw</span>
            <span aria-hidden="true" style={{ fontSize: 20 }}>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
