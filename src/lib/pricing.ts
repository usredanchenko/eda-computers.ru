import { BuildState } from "@/types/parts";
export function sumPrice(build: BuildState) { return Object.values(build).reduce((s, p) => s + (p?.price ?? 0), 0); }
export function priceWithCurrency(n: number) { return n.toLocaleString("ru-RU") + " ₽"; }