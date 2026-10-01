/** Cena w złotówkach, polski format: 6,00 zł */
export const zl = (n: number): string => `${n.toFixed(2).replace(".", ",")} zł`;

/** "6,00" albo "6.00" → 6 */
export const parsePrice = (raw: string): number =>
  parseFloat(String(raw).replace(",", "."));

export const MONTHS_SHORT = ["sty","lut","mar","kwi","maj","cze","lip","sie","wrz","paź","lis","gru"];
export const MONTHS_LONG = ["styczeń","luty","marzec","kwiecień","maj","czerwiec","lipiec","sierpień","wrzesień","październik","listopad","grudzień"];

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
