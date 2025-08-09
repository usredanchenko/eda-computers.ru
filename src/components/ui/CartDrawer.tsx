"use client";
import { useCart } from "@/store/cart";
import { useConfiguratorUI } from "@/store/ui";
import { priceWithCurrency } from "@/lib/pricing";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
export default function CartDrawer() {
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const ui = useConfiguratorUI();
  const total = items.reduce((s, i) => s + i.price, 0);
  const small = typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
  return (
    <AnimatePresence>
      {ui.isCartOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] bg-black/60" onClick={ui.closeCart}>
          <motion.div initial={small ? { y: "100%" } : { x: "100%" }} animate={small ? { y: 0 } : { x: 0 }} exit={small ? { y: "100%" } : { x: "100%" }} transition={{ type: "spring", stiffness: 200, damping: 24 }}
            className={`absolute ${small ? "left-0 right-0 bottom-0 h-[70vh] rounded-t-2xl" : "right-0 top-0 h-full w-[min(420px,92vw)]"} neon-panel p-4 overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle md:hidden" />
            <div className="flex items-center justify-between mb-2">
              <div className="font-orbitron tracking-wider">Корзина</div>
              <button className="p-2 rounded-xl hover:bg-white/5" onClick={ui.closeCart} aria-label="Закрыть"><X /></button>
            </div>
            {items.length === 0 ? (<div className="text-white/60">Пусто. Добавьте сборку из конструктора.</div>) : (
              <div className="space-y-3">
                {items.map((it) => (
                  <div key={it.id} className="rounded-xl border border-white/10 p-3 bg-white/5">
                    <div className="text-sm text-white/70">{new Date(it.createdAt).toLocaleString("ru-RU")}</div>
                    <div className="mt-1 font-orbitron text-neon-cyan">{priceWithCurrency(it.price)}</div>
                  </div>
                ))}
                <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                  <div className="text-white/70">Итого</div>
                  <div className="font-orbitron text-neon-cyan">{priceWithCurrency(total)}</div>
                </div>
                <button onClick={() => alert("Оформление заказа будет добавлено позже (MVP).")} className="w-full px-4 py-2 rounded-xl border border-neon-magenta/60">Оформить</button>
                <button onClick={clear} className="text-xs text-white/50 hover:text-white/80">Очистить</button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}