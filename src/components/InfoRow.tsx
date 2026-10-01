import { C } from "@/design/tokens";
import { Icon, type IconName } from "./Icon";

type Props = { icon: IconName; label: string; value: string };

export function InfoRow({ icon, label, value }: Props) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
      <span style={{
        width: 32, height: 32, borderRadius: 10, flexShrink: 0,
        background: C.cream, border: `1px solid ${C.lineSoft}`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon name={icon} size={15} color={C.inkSoft}/>
      </span>
      <span>
        <span style={{ display: "block", fontSize: 11, color: C.faded, letterSpacing: 0.08, textTransform: "uppercase" }}>{label}</span>
        <span style={{ display: "block", fontSize: 13.5, color: C.ink, fontWeight: 500, marginTop: 1 }}>{value}</span>
      </span>
    </div>
  );
}
