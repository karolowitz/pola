import { useState } from "react";
import { C, TAP } from "@/design/tokens";
import { USER_LOC, kmDistance } from "@/lib/geo";
import { ChipSelect } from "@/components/form/ChipSelect";
import { Field } from "@/components/form/Field";
import { PhotoPicker } from "@/components/form/PhotoPicker";
import { TInput } from "@/components/form/TInput";
import { Icon } from "@/components/Icon";
import { MapView } from "@/components/map/MapView";
import { PageHeader } from "@/components/PageHeader";
import type { FarmProfileDraft } from "@/state/useAppState";
import type { PushToast } from "@/state/useToasts";
import type { Coords, FarmView, PhotoKey, SaleMode } from "@/types";

type Props = {
  farm: FarmView | null;
  onBack: () => void;
  onSave: (draft: FarmProfileDraft) => void;
  apiKey: string;
  onEngineError: (msg: string) => void;
  push: PushToast;
};

export function OnboardingScreen({ farm, onBack, onSave, apiKey, onEngineError, push }: Props) {
  const isEdit = Boolean(farm);
  const [full, setFull] = useState(farm?.full ?? "");
  const [family, setFamily] = useState(farm?.family ?? "");
  const [place, setPlace] = useState(farm?.place ?? "");
  const [blurb, setBlurb] = useState(farm?.blurb ?? "");
  const [long, setLong] = useState(farm?.long ?? "");
  const [hours, setHours] = useState(farm?.hours ?? "");
  const [pickup, setPickup] = useState(farm?.pickup ?? "");
  const [phone, setPhone] = useState(farm?.contact.phone ?? "");
  const [mode, setMode] = useState<SaleMode>(farm?.modes.includes("order") === false ? "contact" : "order");
  const [photoKey, setPhotoKey] = useState<PhotoKey>(farm?.photo ?? "harvest-box");
  const [coords, setCoords] = useState<Coords | null>(farm?.coords ?? null);
  const [showMore, setShowMore] = useState(isEdit);
  const [touched, setTouched] = useState(false);

  const missing: string[] = [];
  if (!full.trim()) missing.push("nazwa");
  if (!place.trim()) missing.push("miejscowość");
  if (!coords) missing.push("pinezka na mapie");
  const valid = missing.length === 0;

  const handleSave = () => {
    setTouched(true);
    if (!valid || !coords) {
      push(`Uzupełnij: ${missing.join(", ")}.`, { tone: "warn" });
      return;
    }
    onSave({
      full: full.trim(),
      name: full.trim().replace(/^(Gospodarstwo|Pasieka|Serowarnia|Pierogarnia|Sad|Ogrodnictwo)\s+/i, ""),
      family: family.trim(),
      place: place.trim(),
      blurb: blurb.trim(),
      long: long.trim(),
      hours: hours.trim(),
      pickup: pickup.trim() || "Do ustalenia telefonicznie",
      contact: { phone: phone.trim() },
      coords,
      photo: photoKey,
      modes: mode === "order" ? ["order", "contact"] : ["contact"],
    });
  };

  return (
    <div className="container container--narrow">
      <PageHeader onBack={onBack} meta={isEdit ? "Edycja profilu" : "Krok 2 z 3"}/>

      <header style={{ paddingTop: 14, paddingBottom: 8 }}>
        <h1 className="serif-display" style={{
          fontSize: "clamp(32px, 4.5vw, 42px)", fontWeight: 400,
          fontVariationSettings: "'opsz' 96, 'wght' 350", color: C.ink, lineHeight: 1.02,
        }}>
          {isEdit
            ? <>Twój <em style={{ fontStyle: "italic", color: C.mustardT }}>profil.</em></>
            : <>Opowiedz o swoim <em style={{ fontStyle: "italic", color: C.mustardT }}>gospodarstwie.</em></>}
        </h1>
        {!isEdit && (
          <p style={{ fontSize: 13.5, color: C.inkSoft, marginTop: 10, lineHeight: 1.5 }}>
            Trzy pola wystarczą, żeby ruszyć. Resztę dopiszesz, kiedy zechcesz.
          </p>
        )}
      </header>

      <div style={{ paddingTop: 10 }}>
        <Field label="Nazwa gospodarstwa" required error={touched && !full.trim() ? "Bez nazwy klienci Cię nie znajdą." : null}>
          <TInput value={full} onChange={setFull} placeholder="np. Gospodarstwo Pod Dębem" ariaLabel="Nazwa gospodarstwa"/>
        </Field>

        <Field label="Miejscowość" required error={touched && !place.trim() ? "Podaj miejscowość." : null}>
          <TInput value={place} onChange={setPlace} placeholder="np. Skawina" ariaLabel="Miejscowość"/>
        </Field>

        <Field label="Lokalizacja na mapie" required
          hint={coords ? "Kliknij ponownie, żeby poprawić." : "Kliknij na mapie, gdzie jest twoje gospodarstwo."}
          error={touched && !coords ? "Postaw pinezkę — bez niej nie ma Cię na mapie." : null}>
          <div style={{
            height: 240, borderRadius: 16, overflow: "hidden",
            border: coords ? `1px solid ${C.line}` : `2px solid ${touched ? C.rust : C.mustard}90`,
          }}>
            <MapView apiKey={apiKey} onEngineError={onEngineError}
              farms={[]} radiusKm={null} hideRadius onPlace={setCoords} placed={coords}/>
          </div>
          {coords && (
            <p style={{ fontSize: 11, color: C.moss, marginTop: 6, paddingLeft: 2, fontWeight: 600 }}>
              Pinezka ustawiona · {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)} ·{" "}
              {Math.round(kmDistance(USER_LOC, coords))} km od centrum Krakowa
            </p>
          )}
        </Field>

        <Field label="Tryb sprzedaży">
          <ChipSelect<SaleMode> label="Tryb sprzedaży" value={mode} onChange={setMode} options={[
            { id: "order", label: "Zamówienia online + kontakt" },
            { id: "contact", label: "Tylko kontakt" },
          ]}/>
        </Field>

        <Field label="Zdjęcie profilowe">
          <PhotoPicker label="Zdjęcie profilowe" value={photoKey} onChange={setPhotoKey}/>
        </Field>

        <button onClick={() => setShowMore((v) => !v)} aria-expanded={showMore} style={{
          width: "100%", marginTop: 6, marginBottom: 16, padding: "13px 16px", minHeight: TAP,
          borderRadius: 12, background: C.cream, border: `1px solid ${C.line}`,
          fontSize: 13.5, fontWeight: 600, color: C.ink,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span>Więcej o gospodarstwie {!showMore && <span style={{ color: C.faded, fontWeight: 500 }}>· opcjonalne</span>}</span>
          <span style={{ display: "flex", transform: showMore ? "rotate(90deg)" : "none", transition: "transform .15s" }}>
            <Icon name="forward" size={16} color={C.faded}/>
          </span>
        </button>

        {showMore && (
          <div className="form-grid form-grid--2">
            <Field label="Kto prowadzi">
              <TInput value={family} onChange={setFamily} placeholder="np. Rodzina Nowaków" ariaLabel="Kto prowadzi"/>
            </Field>
            <Field label="Telefon">
              <TInput value={phone} onChange={setPhone} type="tel" inputMode="tel" placeholder="+48 …" ariaLabel="Telefon"/>
            </Field>
            <Field label="Godziny otwarcia">
              <TInput value={hours} onChange={setHours} placeholder="np. Pon–Pt 8–18 · Sob 8–14" ariaLabel="Godziny otwarcia"/>
            </Field>
            <Field label="Odbiór zamówień">
              <TInput value={pickup} onChange={setPickup} placeholder="np. Odbiór w gospodarstwie, piątki 15–19" ariaLabel="Odbiór zamówień"/>
            </Field>
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Krótki opis" hint="1–2 zdania, pojawia się na liście przy mapie.">
                <TInput value={blurb} onChange={setBlurb} multiline placeholder="Czym się zajmujecie, co uprawiacie, od kiedy…" ariaLabel="Krótki opis"/>
              </Field>
              <Field label="Historia" hint="Dłuższa opowieść na profilu. Klienci to czytają — naprawdę.">
                <TInput value={long} onChange={setLong} multiline placeholder="Jak zaczęliście, co jest waszą specjalnością…" ariaLabel="Historia"/>
              </Field>
            </div>
          </div>
        )}
      </div>

      <div className="sticky-bar--bare" style={{
        paddingTop: 14, paddingBottom: 24,
        background: "linear-gradient(180deg, rgba(245,239,230,0) 0%, rgba(245,239,230,0.95) 26%, var(--paper) 52%)",
      }}>
        <button onClick={handleSave} style={{
          width: "100%", padding: "17px 22px", minHeight: TAP,
          background: valid ? C.mustard : C.sand,
          color: valid ? C.ink : C.faded,
          border: valid ? "none" : `1px solid ${C.line}`,
          borderRadius: 14, fontSize: 15, fontWeight: 700,
        }}>
          {isEdit ? "Zapisz zmiany" : "Dalej — dodaj produkty →"}
        </button>
        {!valid && (
          <p aria-live="polite" style={{ fontSize: 11.5, color: C.faded, marginTop: 8, textAlign: "center" }}>
            Zostało do uzupełnienia: {missing.join(", ")}.
          </p>
        )}
      </div>
    </div>
  );
}
