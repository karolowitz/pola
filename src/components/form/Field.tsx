import type { ReactNode } from "react";
import { C } from "@/design/tokens";

type Props = {
  label: string;
  children: ReactNode;
  hint?: string;
  required?: boolean;
  error?: string | null;
};

export function Field({ label, children, hint, required, error }: Props) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: "block", marginBottom: 7, paddingLeft: 2,
        fontSize: 11, fontWeight: 600, letterSpacing: 0.1,
        textTransform: "uppercase",
        color: error ? C.rust : C.faded,
      }}>
        {label}
        {required && <span style={{ color: C.rust }} aria-label="pole wymagane"> *</span>}
      </label>
      {children}
      {(error || hint) && (
        <div style={{
          fontSize: 11.5, marginTop: 5, paddingLeft: 2, lineHeight: 1.4,
          color: error ? C.rust : C.faded,
        }}>{error || hint}</div>
      )}
    </div>
  );
}
