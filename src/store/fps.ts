"use client";
import { create } from "zustand";
export type Resolution = "1080p" | "1440p" | "4K";
export type Quality = "Medium" | "High" | "Ultra";
export const useFpsSettings = create<{ res: Resolution; quality: Quality; setRes: (r: Resolution) => void; setQuality: (q: Quality) => void; }>((set) => ({
  res: "1080p", quality: "High", setRes: (res) => set({ res }), setQuality: (quality) => set({ quality }),
}));