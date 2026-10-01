import { C } from "@/design/tokens";
import { PHOTO_KEYS, photoSm } from "@/lib/photos";
import { Icon } from "../Icon";
import type { PhotoKey } from "@/types";

type Props = { value: PhotoKey; onChange: (k: PhotoKey) => void; label: string };

/**
 * Wybór z puli zdjęć demonstracyjnych.
 * Docelowo: upload pliku + przycięcie + storage.
 */
export function PhotoPicker({ value, onChange, label }: Props) {
  return (
    <div role="radiogroup" aria-label={label}
      style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
      {PHOTO_KEYS.map((k, i) => {
        const on = value === k;
        return (
          <button key={k} onClick={() => onChange(k)} role="radio" aria-checked={on}
            aria-label={`Zdjęcie ${i + 1}`} style={{
              padding: 0, height: 78, borderRadius: 12, overflow: "hidden",
              border: on ? `3px solid ${C.mustard}` : `1px solid ${C.line}`,
              backgroundImage: `url(${photoSm(k)})`,
              backgroundSize: "cover", backgroundPosition: "center",
              opacity: on ? 1 : 0.72, position: "relative",
            }}>
            {on && (
              <span style={{
                position: "absolute", top: 5, right: 5, width: 18, height: 18, borderRadius: 9,
                background: C.mustard, color: C.ink,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}><Icon name="check" size={11} stroke={3}/></span>
            )}
          </button>
        );
      })}
    </div>
  );
}
