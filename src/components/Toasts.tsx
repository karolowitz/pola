import { C } from "@/design/tokens";
import { Icon } from "./Icon";
import type { Toast } from "@/types";

export function Toasts({ toasts }: { toasts: Toast[] }) {
  if (!toasts.length) return null;
  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="toast" style={{
          background: t.tone === "warn" ? C.rust : C.ink,
          color: C.cream,
          padding: "13px 16px", borderRadius: 14,
          fontSize: 13.5, fontWeight: 500, lineHeight: 1.35,
          boxShadow: "0 12px 30px -10px rgba(20,18,14,0.55)",
          display: "flex", alignItems: "center", gap: 10,
          pointerEvents: "auto",
        }}>
          <span style={{
            width: 20, height: 20, borderRadius: 10, flexShrink: 0,
            background: t.tone === "warn" ? "rgba(250,246,238,0.22)" : C.mustard,
            color: t.tone === "warn" ? C.cream : C.ink,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon name={t.tone === "warn" ? "warn" : "check"} size={12} stroke={2.6}/>
          </span>
          <span style={{ flex: 1 }}>{t.message}</span>
          {t.action && (
            <button onClick={t.action.onClick} style={{
              color: C.mustard, fontSize: 13, fontWeight: 700,
              padding: "6px 4px", whiteSpace: "nowrap",
            }}>{t.action.label}</button>
          )}
        </div>
      ))}
    </div>
  );
}
