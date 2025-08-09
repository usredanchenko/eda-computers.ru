"use client";
import { create } from "zustand";
import { BuildState, Category, AnyPart } from "@/types/parts";
import { sumPrice } from "@/lib/pricing";
const ORDER: Category[] = ["CPU","MB","RAM","GPU","STORAGE","COOLER","CASE","PSU"];
type ConfiguratorState = {
  build: BuildState; stepIndex: number;
  setPart: (p: AnyPart) => void; removePart: (category: Category) => void;
  next: () => void; back: () => void; reset: () => void;
  total: () => number; step: () => Category; isLast: () => boolean;
};
export const useConfigurator = create<ConfiguratorState>((set, get) => ({
  build: {}, stepIndex: 0,
  setPart: (p) => set((s) => ({ build: { ...s.build, [p.category]: p } })),
  removePart: (category) => set((s) => { const copy = { ...s.build } as any; delete copy[category]; return { build: copy }; }),
  next: () => set((s) => ({ stepIndex: Math.min(s.stepIndex + 1, ORDER.length - 1) })),
  back: () => set((s) => ({ stepIndex: Math.max(s.stepIndex - 1, 0) })),
  reset: () => set({ build: {}, stepIndex: 0 }),
  total: () => sumPrice(get().build),
  step: () => ORDER[get().stepIndex],
  isLast: () => get().stepIndex >= ORDER.length - 1,
}));