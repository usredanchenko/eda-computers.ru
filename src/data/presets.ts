export type Preset = { id: string; title: string; image: string; price: number; tags: string[]; };
export const PRESETS: Preset[] = [
  { id: "gaming", title: "Игровой", image: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=1600&auto=format&fit=crop", price: 149990, tags: ["1440p","RTX","SSD NVMe"] },
  { id: "workstation", title: "Рабочая станция", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop", price: 209990, tags: ["Рендер","Многопоток","64 ГБ RAM"] },
  { id: "budget", title: "Бюджетный", image: "https://images.unsplash.com/photo-1545076478-2a58a0d27e2e?q=80&w=1600&auto=format&fit=crop", price: 69990, tags: ["1080п","Тихий","SSD"] },
];