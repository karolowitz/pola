import { C, TAP } from "@/design/tokens";

export const inputStyle: React.CSSProperties = {
  width: "100%", padding: "13px 14px", minHeight: TAP,
  background: C.cream, border: `1px solid ${C.line}`,
  borderRadius: 12, fontSize: 14.5, color: C.ink,
  outline: "none", fontFamily: "'Inter', sans-serif",
};

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  type?: "text" | "tel" | "email";
  inputMode?: "text" | "tel" | "decimal" | "email";
  ariaLabel: string;
};

export function TInput({ value, onChange, placeholder, multiline, type, inputMode, ariaLabel }: Props) {
  if (multiline) {
    return (
      <textarea
        value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} aria-label={ariaLabel} rows={4}
        style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}/>
    );
  }
  return (
    <input
      type={type ?? "text"} inputMode={inputMode}
      value={value} onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder} aria-label={ariaLabel} style={inputStyle}/>
  );
}
