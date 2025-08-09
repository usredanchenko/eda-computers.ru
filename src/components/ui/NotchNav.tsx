"use client";
import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Wrench, Gamepad2, Info, Phone, Home } from "lucide-react";
import { useConfiguratorUI } from "@/store/ui";
import { useCart } from "@/store/cart";
export default function NotchNav() {
  const [active, setActive] = useState<string>("#home");
  const ui = useConfiguratorUI();
  const items = useCart((s) => s.items);
  return (<>
    <div className="hidden md:block fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="neon-panel rounded-2xl px-4 py-2 flex items-center gap-3 overflow-hidden">
        <nav className="flex items-center gap-2">
          {[
            { href: "#home", label: "Главная", icon: <Home size={16} /> },
            { href: "#builds", label: "Сборки", icon: <Gamepad2 size={16} /> },
            { href: "#about", label: "О нас", icon: <Info size={16} /> },
            { href: "#contact", label: "Контакты", icon: <Phone size={16} /> },
          ].map((x) => (
            <Link key={x.href} href={x.href} onClick={() => setActive(x.href)} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition min-w-0 ${active === x.href ? "bg-surface/60 ring-1 ring-neon-cyan/40 shadow-glow" : "hover:bg-surface/40"}`}>
              {x.icon}<span className="font-orbitron text-sm tracking-wide md:tracking-widest nowrap-sm">{x.label}</span>
            </Link>
          ))}
        </nav>
        <div className="w-px h-6 bg-white/10" />
        <button onClick={ui.open} className="relative px-4 py-1.5 rounded-xl font-orbitron tracking-wide md:tracking-widest border border-neon-cyan/50" title="Открыть конструктор">
          Конструктор
        </button>
        <button onClick={ui.openCart} className="relative px-3 py-1.5 rounded-xl border border-white/20 hover:bg-white/5" title="Корзина">
          <ShoppingCart size={16} />
          {items.length > 0 && (<span className="absolute -top-2 -right-2 text-[10px] px-1.5 py-0.5 rounded bg-neon-magenta text-black font-bold">{items.length}</span>)}
        </button>
      </div>
    </div>
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 safe-bottom container-px">
      <div className="neon-panel rounded-t-2xl px-2 py-2 flex items-center justify-between overflow-hidden">
        <Link href="#home" className="p-2 rounded-xl min-w-0" onClick={() => setActive("#home")} aria-label="Главная"><Home /></Link>
        <Link href="#builds" className="p-2 rounded-xl min-w-0" onClick={() => setActive("#builds")} aria-label="Сборки"><Gamepad2 /></Link>
        <button onClick={ui.open} className="px-4 py-2 rounded-xl font-orbitron text-sm border border-neon-cyan/50 min-w-0" aria-label="Конструктор"><Wrench /></button>
        <button onClick={ui.openCart} className="relative p-2 rounded-xl min-w-0" aria-label="Корзина">
          <ShoppingCart />{items.length > 0 && (<span className="absolute -top-1 -right-1 text-[10px] px-1.5 py-0.5 rounded bg-neon-magenta text-black font-bold">{items.length}</span>)}
        </button>
      </div>
    </div>
  </>);
}