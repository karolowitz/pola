import { useState } from "react";
import { C } from "@/design/tokens";
import { SEASON } from "@/data/season";
import { MONTHS_LONG, MONTHS_SHORT, capitalize } from "@/lib/format";
import { Icon } from "@/components/Icon";

type Props = { notify: string[]; onToggleNotify: (name: string) => void };

export function SeasonScreen({ notify, onToggleNotify }: Props) {
  const now = new Date().getMonth() + 1;
  const [month, setMonth] = useState(now);

  const inSeason = SEASON.filter((s) => s.months.includes(month));
  const nextMonth = month === 12 ? 1 : month + 1;
  const coming = SEASON.filter((s) => !s.months.includes(month) && s.months.includes(nextMonth));

  return (
    <div className="container" style={{ paddingTop: 24 }}>
      <header>
        <p style={{ fontSize: 11, color: C.faded, letterSpacing: 0.12, textTransform: "uppercase", marginBottom: 4, fontWeight: 600 }}>
          Kalendarz · {new Date().getFullYear()}
        </p>
        <h1 className="serif-display" style={{
          fontSize: "clamp(34px, 5vw, 48px)", fontWeight: 400,
          fontVariationSettings: "'opsz' 96, 'wght' 350", color: C.ink, lineHeight: 1.02,
        }}>
          Co teraz <em style={{ fontStyle: "italic", color: C.mustardT }}>w sezonie</em>
        </h1>
        <p style={{ fontSize: 14, color: C.inkSoft, lineHeight: 1.5, marginTop: 12, maxWidth: 420 }}>
          {month === now
            ? `${capitalize(MONTHS_LONG[month - 1])}. ${inSeason.length} rzeczy w pełni — reszta czeka.`
            : `Podgląd: ${MONTHS_LONG[month - 1]}. ${inSeason.length} rzeczy w sezonie.`}
        </p>
      </header>

      <div className="chip-row no-scrollbar" style={{ gap: 4, padding: "16px 0 0" }}>
        {MONTHS_SHORT.map((m, i) => {
          const active = i + 1 === month;
          const isNow = i + 1 === now;
          return (
            <button key={m} onClick={() => setMonth(i + 1)} aria-pressed={active} style={{
              padding: "10px 12px", borderRadius: 10, minHeight: 40, flexShrink: 0,
              background: active ? C.ink : "transparent",
              color: active ? C.cream : isNow ? C.mustardT : C.faded,
              fontSize: 11.5, fontWeight: active || isNow ? 700 : 500,
              textTransform: "uppercase", letterSpacing: 0.04,
              border: !active && isNow ? `1px solid ${C.mustard}80` : "1px solid transparent",
            }}>{m}</button>
          );
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
        {inSeason.length === 0 && (
          <p style={{ padding: "26px 18px", borderRadius: 14, border: `1.5px dashed ${C.line}`, textAlign: "center", fontSize: 13.5, color: C.inkSoft, lineHeight: 1.5 }}>
            W {MONTHS_LONG[month - 1]} pola odpoczywają.<br/>Zajrzyj do przetworów i nabiału.
          </p>
        )}
        {inSeason.map((s) => {
          const peak = s.peak === month;
          return (
            <div key={s.name} style={{
              padding: "14px 16px", borderRadius: 14,
              background: peak ? C.cream : "transparent",
              border: peak ? `1px solid ${C.mustard}90` : `1px solid ${C.lineSoft}`,
              display: "flex", alignItems: "center", gap: 14,
            }}>
              <span style={{ fontSize: 26 }} aria-hidden="true">{s.emoji}</span>
              <div style={{ flex: 1 }}>
                <div className="serif" style={{ fontSize: 17, fontWeight: 500, color: C.ink, fontVariationSettings: "'opsz' 20, 'wght' 500" }}>
                  {s.name}
                </div>
                <div style={{ fontSize: 11.5, marginTop: 2, color: peak ? C.mustardT : C.faded, fontWeight: peak ? 600 : 400 }}>
                  {peak ? "Szczyt sezonu — najlepszy moment" : `Dostępne ${s.months.length} mies. w roku`}
                </div>
              </div>
              <div style={{ display: "flex", gap: 2 }} aria-hidden="true">
                {MONTHS_SHORT.map((_, i) => (
                  <span key={i} style={{
                    width: 4, height: 14, borderRadius: 2,
                    background: s.peak === i + 1 ? C.mustard : s.months.includes(i + 1) ? C.mossLeaf : C.line,
                  }}/>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {coming.length > 0 && (
        <section style={{ marginTop: 28 }}>
          <h2 className="serif-display" style={{ fontSize: 22, fontWeight: 400, color: C.ink, fontVariationSettings: "'opsz' 32, 'wght' 400" }}>
            Wkrótce — <em style={{ fontStyle: "italic", color: C.faded }}>{MONTHS_LONG[nextMonth - 1]}</em>
          </h2>
          <div style={{ marginTop: 10 }}>
            {coming.map((s) => {
              const on = notify.includes(s.name);
              return (
                <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${C.lineSoft}` }}>
                  <span style={{ fontSize: 18 }} aria-hidden="true">{s.emoji}</span>
                  <span style={{ flex: 1, fontSize: 14, color: C.ink, fontWeight: 500 }}>{s.name}</span>
                  <button onClick={() => onToggleNotify(s.name)} aria-pressed={on} style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: 0.04,
                    padding: "10px 12px", borderRadius: 999, minHeight: 40,
                    background: on ? C.moss : "transparent",
                    color: on ? C.cream : C.mustardT,
                    border: on ? "none" : `1px solid ${C.line}`,
                    display: "flex", alignItems: "center", gap: 5,
                  }}>
                    {on ? <><Icon name="check" size={12} stroke={2.6}/> WŁĄCZONE</> : "POWIADOM MNIE"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}
      <div style={{ height: 24 }}/>
    </div>
  );
}
