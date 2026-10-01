import { C } from "@/design/tokens";
import { photoSm } from "@/lib/photos";
import { Icon } from "./Icon";
import { TierBadge } from "./TierBadge";
import type { FarmView } from "@/types";

type Props = {
  farm: FarmView;
  onClick: () => void;
  highlighted?: boolean;
  isFavourite: boolean;
  onToggleFavourite: () => void;
};

export function FarmListCard({ farm, onClick, highlighted, isFavourite, onToggleFavourite }: Props) {
  return (
    <div id={`farm-card-${farm.id}`} style={{
      display: "flex", gap: 14, padding: 12, position: "relative",
      background: C.cream, borderRadius: 18,
      border: highlighted ? `2px solid ${C.mustard}` : `1px solid ${C.lineSoft}`,
    }}>
      <button onClick={onClick} style={{ display: "flex", gap: 14, textAlign: "left", flex: 1, minWidth: 0, padding: 0 }}>
        <img src={photoSm(farm.photo)} alt="" loading="lazy" width={88} height={88} style={{
          width: 88, height: 88, borderRadius: 14, objectFit: "cover", flexShrink: 0,
        }}/>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span className="serif" style={{
            display: "block", paddingRight: 34, fontSize: 19, fontWeight: 500,
            color: C.ink, fontVariationSettings: "'opsz' 24, 'wght' 500", lineHeight: 1.15,
          }}>{farm.full}</span>

          <span style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", fontSize: 12, color: C.faded, marginTop: 3 }}>
            <span>{farm.place} · {farm.distance} km</span>
            {farm.eko && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 2, color: C.moss, fontWeight: 600 }}>
                <Icon name="leaf" size={11} color={C.moss}/> eko
              </span>
            )}
          </span>

          <span className="clamp-2" style={{ display: "-webkit-box", fontSize: 12.5, color: C.inkSoft, marginTop: 6, lineHeight: 1.35 }}>
            {farm.blurb}
          </span>

          <span style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            {farm.rating !== null ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <Icon name="star" size={11} color={C.mustardD}/>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: C.ink }}>{farm.rating}</span>
                <span style={{ fontSize: 11.5, color: C.faded }}>({farm.reviews})</span>
              </span>
            ) : (
              <span style={{ fontSize: 10, fontWeight: 700, color: C.moss, background: `${C.moss}18`, padding: "3px 8px", borderRadius: 999 }}>NOWE</span>
            )}
            <TierBadge tier={farm.tier}/>
            <span style={{ fontSize: 11.5, color: C.faded }}>{farm.products.length} prod.</span>
          </span>
        </span>
      </button>

      <button onClick={onToggleFavourite} aria-pressed={isFavourite}
        aria-label={isFavourite ? `Usuń ${farm.full} z ulubionych` : `Dodaj ${farm.full} do ulubionych`}
        style={{
          position: "absolute", top: 8, right: 8,
          width: 40, height: 40, borderRadius: 20,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: isFavourite ? C.rust : C.faded,
        }}>
        <Icon name={isFavourite ? "heartOn" : "heart"} size={19}/>
      </button>
    </div>
  );
}
