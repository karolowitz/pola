import { C } from "@/design/tokens";
import type { Tier } from "@/types";

const MAP: Record<Tier, { label: string; bg: string; fg: string }> = {
  spichlerz: { label: "Wyróżnione", bg: C.mustard, fg: C.ink },
  sad: { label: "Online", bg: C.moss, fg: C.cream },
  zagroda: { label: "Kontakt", bg: C.sand, fg: C.inkSoft },
};

export function TierBadge({ tier }: { tier: Tier }) {
  const b = MAP[tier];
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: "4px 9px", borderRadius: 999,
      background: b.bg, color: b.fg, whiteSpace: "nowrap",
    }}>{b.label}</span>
  );
}
