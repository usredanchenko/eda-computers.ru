"use client";
import { create } from "zustand";
import { BuildState } from "@/types/parts";
type CartItem = { id: string; build: BuildState; price: number; createdAt: number; };
type CartState = { items: CartItem[]; addBuild: (b: BuildState, price: number) => void; clear: () => void; };
export const useCart = create<CartState>((set) => ({
  items: [], addBuild: (build, price) => set((s) => ({ items: [...s.items, { id: `order-${Date.now()}`, build: JSON.parse(JSON.stringify(build)), price, createdAt: Date.now() }] })),
  clear: () => set({ items: [] }),
}));