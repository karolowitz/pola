import { C, TAP } from "@/design/tokens";
import { ADDONS, TIERS } from "@/data/tiers";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";
import type { FarmView, Tier } from "@/types";

type Props = { onBack: () => void; onContinue: (tier: Tier) => void; myFarm: FarmView | null };

export function PricingScreen({ onBack, onContinue, myFarm }: Props) {
  return (
    <div className="container container--wide">
      <PageHeader onBack={onBack} meta={myFarm ? "Zmiana planu" : "Krok 1 z 3"}/>

      <header style={{ paddingTop: 16, maxWidth: 560 }}>
        <p style={{ fontSize: 11, color: C.faded, letterSpacing: 0.12, textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>
          Dla rolnika
        </p>
        <h1 className="serif-display" style={{
          fontSize: "clamp(38px, 5.5vw, 56px)", fontWeight: 400,
          fontVariationSettings: "'opsz' 144, 'wght' 320", color: C.ink, lineHeight: 1.0,
        }}>
          Pokaż się<br/><em style={{ fontStyle: "italic", color: C.mustardT }}>klientom w okolicy.</em>
        </h1>
        <p style={{ fontSize: 14.5, color: C.inkSoft, lineHeight: 1.5, marginTop: 14 }}>
          Bez prowizji od sprzedaży. Płacisz raz w miesiącu albo zostajesz na darmowym planie.
        </p>
      </header>

      <div style={{
        marginTop: 28, display: "grid", gap: 14,
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        alignItems: "start",
      }}>
        {TIERS.map((t) => {
          const current = myFarm?.tier === t.id;
          return (
            <article key={t.id} style={{
              borderRadius: 20, overflow: "hidden", position: "relative",
              background: t.best ? C.ink : C.cream,
              color: t.best ? C.cream : C.ink,
              border: current ? `2px solid ${C.mustard}` : t.best ? "none" : `1px solid ${C.lineSoft}`,
            }}>
              {t.best && !current && (
                <span style={{
                  position: "absolute", top: 14, right: 14,
                  background: C.mustard, color: C.ink,
                  padding: "4px 10px", borderRadius: 999,
                  fontSize: 10, fontWeight: 700, letterSpacing: 0.06,
                }}>NAJCZĘŚCIEJ WYBIERANE</span>
              )}

              <div style={{ padding: "20px 22px" }}>
                <h2 className="serif-display" style={{ fontSize: 32, fontWeight: 400, fontVariationSettings: "'opsz' 64, 'wght' 380", lineHeight: 1 }}>
                  {t.name}
                </h2>
                <p style={{ fontSize: 12.5, color: t.best ? C.line : C.faded, marginTop: 4 }}>{t.tagline}</p>

                <p style={{ marginTop: 16, display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span className="serif" style={{ fontSize: 36, fontWeight: 600, fontVariationSettings: "'opsz' 64, 'wght' 600" }}>
                    {t.price === 0 ? "0" : t.price}
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 500, opacity: 0.85 }}>zł</span>
                  <span style={{ fontSize: 12, color: t.best ? C.line : C.faded, marginLeft: 6 }}>/ {t.period}</span>
                </p>

                <ul style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 7, listStyle: "none" }}>
                  {t.features.map((f) => (
                    <li key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13 }}>
                      <span style={{
                        width: 18, height: 18, borderRadius: 9, marginTop: 1, flexShrink: 0,
                        background: t.best ? C.mustard : C.moss,
                        color: t.best ? C.ink : C.cream,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}><Icon name="check" size={11} stroke={2.6}/></span>
                      <span style={{ lineHeight: 1.35 }}>{f}</span>
                    </li>
                  ))}
                  {t.missing.map((f) => (
                    <li key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13, opacity: 0.5 }}>
                      <span style={{
                        width: 18, height: 18, borderRadius: 9, marginTop: 1, flexShrink: 0,
                        border: `1px solid ${t.best ? C.faded : C.line}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}><Icon name="close" size={10}/></span>
                      <span style={{ lineHeight: 1.35, textDecoration: "line-through" }}>{f}</span>
                    </li>
                  ))}
                </ul>

                <button onClick={() => !current && onContinue(t.id)} disabled={current} style={{
                  width: "100%", marginTop: 18, padding: "14px 18px", borderRadius: 12, minHeight: TAP,
                  background: current ? "transparent" : t.best ? C.mustard : C.ink,
                  color: current ? (t.best ? C.line : C.faded) : t.best ? C.ink : C.cream,
                  border: current ? `1px dashed ${t.best ? C.faded : C.line}` : "none",
                  fontSize: 14, fontWeight: 700,
                  cursor: current ? "default" : "pointer",
                }}>
                  {current ? "Twój obecny plan" : myFarm ? `Przełącz na ${t.name}` : t.cta}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <section style={{ marginTop: 32, maxWidth: 720 }}>
        <h2 style={{ fontSize: 11, color: C.faded, letterSpacing: 0.12, textTransform: "uppercase", marginBottom: 10, fontWeight: 600 }}>Dodatki</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {ADDONS.map((e) => (
            <div key={e.name} style={{
              padding: "14px 16px", borderRadius: 14,
              background: C.cream, border: `1px solid ${C.lineSoft}`,
              display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
            }}>
              <div>
                <div className="serif" style={{ fontSize: 14, fontWeight: 500, color: C.ink, fontVariationSettings: "'opsz' 18, 'wght' 500" }}>{e.name}</div>
                <div style={{ fontSize: 11.5, color: C.inkSoft, marginTop: 2, lineHeight: 1.35 }}>{e.desc}</div>
              </div>
              <strong style={{ fontSize: 14, color: C.rust, whiteSpace: "nowrap" }}>{e.price}</strong>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 22, padding: 18, borderRadius: 16,
          background: `${C.moss}12`, border: `1px solid ${C.moss}35`, color: C.mossDeep,
        }}>
          <p style={{ fontSize: 11, color: C.moss, fontWeight: 700, letterSpacing: 0.1, textTransform: "uppercase", marginBottom: 6 }}>
            Alternatywa
          </p>
          <p className="serif" style={{ fontSize: 16, fontWeight: 500, fontVariationSettings: "'opsz' 20, 'wght' 500", lineHeight: 1.3 }}>
            Wolisz płacić od wyniku? Wybierz 0 zł abonamentu i 5% od transakcji.
          </p>
        </div>
      </section>
      <div style={{ height: 32 }}/>
    </div>
  );
}
