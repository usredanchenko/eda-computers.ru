"use client";
import { create } from "zustand";
type UIState = { isConfiguratorOpen: boolean; isCartOpen: boolean; open: () => void; close: () => void; toggle: () => void; openCart: () => void; closeCart: () => void; };
export const useConfiguratorUI = create<UIState>((set) => ({
  isConfiguratorOpen: false, isCartOpen: false,
  open: () => set({ isConfiguratorOpen: true }), close: () => set({ isConfiguratorOpen: false }), toggle: () => set((s) => ({ isConfiguratorOpen: !s.isConfiguratorOpen })),
  openCart: () => set({ isCartOpen: true }), closeCart: () => set({ isCartOpen: false }),
}));