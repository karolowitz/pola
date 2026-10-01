import { C } from "@/design/tokens";

type Option<T extends string> = { id: T; label: string };

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
  label: string;
};

export function ChipSelect<T extends string>({ options, value, onChange, label }: Props<T>) {
  return (
    <div role="group" aria-label={label} style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {options.map((o) => {
        const on = value === o.id;
        return (
          <button key={o.id} onClick={() => onChange(o.id)} aria-pressed={on} style={{
            padding: "10px 14px", borderRadius: 999, minHeight: 42,
            background: on ? C.ink : C.cream,
            color: on ? C.cream : C.inkSoft,
            border: on ? "none" : `1px solid ${C.line}`,
            fontSize: 12.5, fontWeight: 600,
          }}>{o.label}</button>
        );
      })}
    </div>
  );
}
