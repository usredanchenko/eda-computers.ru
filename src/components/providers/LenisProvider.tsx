"use client";

import { useEffect } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: any;
  }
}

export default function LenisProvider() {
  useEffect(() => {
    // включаем/выключаем hover-эффекты в зависимости от устройства
    document.documentElement.classList.toggle(
      "can-hover",
      matchMedia("(hover: hover)").matches
    );

    // Опции через any, чтобы не ловить TS-ошибки на разных версиях типов
    const lenis = new (Lenis as any)({
      autoRaf: true,          // Lenis сам крутит RAF
      smoothWheel: true,
      syncTouch: true,
      orientation: "vertical",
      gestureOrientation: "vertical",
    } as any);

    (window as any).__lenis = lenis;

    return () => {
      try { lenis.destroy(); } catch {}
      delete (window as any).__lenis;   // ← тут было обрезано
    };
  }, []);

  return null;
}
