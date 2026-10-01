import type { ReactNode } from "react";
import { C, TAP } from "@/design/tokens";
import { Icon } from "./Icon";

type Props = { onBack?: () => void; backLabel?: string; meta?: ReactNode };

export function PageHeader({ onBack, backLabel = "Wróć", meta }: Props) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      paddingTop: 24, paddingBottom: 4, gap: 12,
    }}>
      {onBack ? (
        <button onClick={onBack} aria-label={backLabel} style={{
          width: TAP, height: TAP, borderRadius: 21,
          background: C.cream, border: `1px solid ${C.lineSoft}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}><Icon name="back" size={16} color={C.ink}/></button>
      ) : <span/>}
      {meta && <span style={{ fontSize: 12, color: C.faded, fontWeight: 500 }}>{meta}</span>}
    </div>
  );
}
