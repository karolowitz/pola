import { useState } from "react";
import { C, TAP } from "@/design/tokens";
import { CATEGORIES } from "@/data/categories";
import { parsePrice } from "@/lib/format";
import { ChipSelect } from "@/components/form/ChipSelect";
import { Field } from "@/components/form/Field";
import { PhotoPicker } from "@/components/form/PhotoPicker";
import { TInput } from "@/components/form/TInput";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";
import type { Category, FarmView, PhotoKey, Product } from "@/types";

type Props = {
  farm: FarmView;
  productId: string | null;
  onBack: () => void;
  onSave: (p: Product) => void;
  onDelete: (id: string) => void;
};

export function ProductEditScreen({ farm, productId, onBack, onSave, onDelete }: Props) {
  const existing = productId ? farm.products.find((p) => p.id === productId) ?? null : null;

  const [name, setName] = useState(existing?.name ?? "");
  const [unit, setUnit] = useState(existing?.unit ?? "");
  const [price, setPrice] = useState(existing ? existing.price.toFixed(2).replace(".", ",") : "");
  const [category, setCategory] = useState<Category>(existing?.category ?? "Warzywa");
  const [desc, setDesc] = useState(existing?.desc ?? "");
  const [photoKey, setPhotoKey] = useState<PhotoKey>(existing?.photo ?? "veggies-mix");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [touched, setTouched] = useState(false);

  const priceNum = parsePrice(price);
  const priceOk = !Number.isNaN(priceNum) && priceNum > 0 && priceNum < 10000;
  const valid = Boolean(name.trim()) && Boolean(unit.trim()) && priceOk;

  const handleSave = () => {
    setTouched(true);
    if (!valid) return;
    onSave({
      id: existing?.id ?? `p${Date.now()}`,
      name: name.trim(),
      unit: unit.trim(),
      price: Math.round(priceNum * 100) / 100,
      category,
      desc: desc.trim(),
      photo: photoKey,
    });
  };

  return (
    <div className="container container--narrow">
      <PageHeader onBack={onBack} backLabel="Wróć do panelu" meta={existing ? "Edycja produktu" : "Nowy produkt"}/>

      <header style={{ paddingTop: 14, paddingBottom: 8 }}>
        <h1 className="serif-display" style={{
          fontSize: "clamp(32px, 4.5vw, 42px)", fontWeight: 400,
          fontVariationSettings: "'opsz' 96, 'wght' 350", color: C.ink, lineHeight: 1.02,
        }}>
          {existing
            ? <>Edytuj <em style={{ fontStyle: "italic", color: C.mustardT }}>produkt.</em></>
            : <>Co dziś <em style={{ fontStyle: "italic", color: C.mustardT }}>zbierasz?</em></>}
        </h1>
      </header>

      <div style={{ paddingTop: 12 }}>
        <Field label="Nazwa produktu" required error={touched && !name.trim() ? "Podaj nazwę." : null}>
          <TInput value={name} onChange={setName} placeholder="np. Marchew z piasku" ariaLabel="Nazwa produktu"/>
        </Field>

        <div className="form-grid form-grid--2">
          <Field label="Jednostka" required error={touched && !unit.trim() ? "Np. 1 kg" : null}>
            <TInput value={unit} onChange={setUnit} placeholder="np. 1 kg / pęczek" ariaLabel="Jednostka"/>
          </Field>
          <Field label="Cena (zł)" required error={touched && !priceOk ? "Podaj kwotę." : null}>
            <TInput value={price} onChange={setPrice} inputMode="decimal" placeholder="np. 6,00" ariaLabel="Cena w złotych"/>
          </Field>
        </div>

        <Field label="Kategoria">
          <ChipSelect<Category> label="Kategoria" value={category} onChange={setCategory}
            options={CATEGORIES.map((c) => ({ id: c, label: c }))}/>
        </Field>

        <Field label="Opis" hint="Skąd, jaka odmiana, kiedy zebrane. Konkret sprzedaje.">
          <TInput value={desc} onChange={setDesc} multiline placeholder="np. Stara odmiana 'Karotela'. Wykopana dziś rano." ariaLabel="Opis produktu"/>
        </Field>

        <Field label="Zdjęcie">
          <PhotoPicker label="Zdjęcie produktu" value={photoKey} onChange={setPhotoKey}/>
        </Field>

        {existing && (
          <div style={{ marginTop: 8, marginBottom: 8 }}>
            {confirmDelete ? (
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => onDelete(existing.id)} style={{
                  flex: 1, padding: "13px 18px", borderRadius: 12, minHeight: TAP,
                  background: C.rust, color: C.cream, fontSize: 13.5, fontWeight: 700,
                }}>Tak, usuń</button>
                <button onClick={() => setConfirmDelete(false)} style={{
                  flex: 1, padding: "13px 18px", borderRadius: 12, minHeight: TAP,
                  background: C.cream, border: `1px solid ${C.line}`, color: C.ink, fontSize: 13.5, fontWeight: 600,
                }}>Anuluj</button>
              </div>
            ) : (
              <button onClick={() => setConfirmDelete(true)} style={{
                padding: "12px 4px", minHeight: TAP, fontSize: 13, fontWeight: 600, color: C.rust,
                display: "flex", alignItems: "center", gap: 6,
              }}><Icon name="trash" size={14}/> Usuń produkt</button>
            )}
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
          {existing ? "Zapisz zmiany" : "Dodaj do oferty"}
        </button>
      </div>
    </div>
  );
}
