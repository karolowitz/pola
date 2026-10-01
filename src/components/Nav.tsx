import { C } from "@/design/tokens";
import { Icon, type IconName } from "./Icon";
import type { TabId } from "@/types";

const ITEMS: { id: TabId; label: string; icon: IconName }[] = [
  { id: "discover", label: "Odkrywaj", icon: "map" },
  { id: "season", label: "Sezon", icon: "leaf" },
  { id: "cart", label: "Koszyk", icon: "cart" },
  { id: "account", label: "Ja", icon: "user" },
];

type Props = { tab: TabId; setTab: (t: TabId) => void; cartCount: number };

/** Dolna nawigacja na mobile, boczna na desktopie — przełącza CSS. */
export function Nav({ tab, setTab, cartCount }: Props) {
  return (
    <nav className="nav" aria-label="Nawigacja główna">
      <div className="nav-brand">pola.</div>
      <div className="nav-items">
        {ITEMS.map((it) => {
          const active = tab === it.id;
          return (
            <button key={it.id} className="nav-item" onClick={() => setTab(it.id)}
              aria-current={active ? "page" : undefined}>
              <span style={{ position: "relative", display: "flex" }}>
                <Icon name={it.icon} size={22} stroke={active ? 2 : 1.6}/>
                {it.id === "cart" && cartCount > 0 && (
                  <span aria-label={`${cartCount} w koszyku`} style={{
                    position: "absolute", top: -5, right: -9,
                    minWidth: 17, height: 17, padding: "0 4px", borderRadius: 9,
                    background: C.mustard, color: C.ink,
                    fontSize: 10, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{cartCount}</span>
                )}
              </span>
              <span>{it.label}</span>
              {active && <span className="nav-dot" style={{
                position: "absolute", bottom: 0, width: 4, height: 4,
                borderRadius: 2, background: C.mustard,
              }}/>}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
