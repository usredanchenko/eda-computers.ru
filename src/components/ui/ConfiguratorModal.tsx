"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, ArrowRight, ShoppingCart } from "lucide-react";

import { useConfiguratorUI } from "@/store/ui";
import { useConfigurator } from "@/store/configurator";
import { useCart } from "@/store/cart";

import Stepper from "./Stepper";
import CategoryStep from "../configurator/CategoryStep";
import FpsPanel from "./FpsPanel";

import { Category, AnyPart } from "@/types/parts";
import { CPUS } from "@/data/cpus";
import { MBS } from "@/data/motherboards";
import { RAMS } from "@/data/rams";
import { GPUS } from "@/data/gpus";
import { STORAGES } from "@/data/storages";
import { PSUS } from "@/data/psus";
import { COOLERS } from "@/data/coolers";
import { CASES } from "@/data/cases";

import { priceWithCurrency } from "@/lib/pricing";
import { isPartCompatible, psuRequiredWattage } from "@/lib/compatibility";

const CATALOG: Record<Category, AnyPart[]> = {
  CPU: CPUS,
  MB: MBS,
  RAM: RAMS,
  GPU: GPUS,
  STORAGE: STORAGES,
  PSU: PSUS,
  COOLER: COOLERS,
  CASE: CASES,
};

const LABELS: Record<Category, string> = {
  CPU: "Процессор",
  MB: "Материнская плата",
  RAM: "Оперативная память",
  GPU: "Видеокарта",
  STORAGE: "Накопитель",
  PSU: "Блок питания",
  COOLER: "Кулер",
  CASE: "Корпус",
};

export default function ConfiguratorModal() {
  const ui = useConfiguratorUI();
  const {
    build,
    stepIndex,
    step,
    next,
    back,
    setPart,
    removePart,
    total,
    isLast,
    reset,
  } = useConfigurator();
  const addToCart = useCart((s) => s.addBuild);

  const category = step();
  const canContinue = Boolean((build as any)[category]);
  const totalPrice = total();
  const psuReq = psuRequiredWattage(build);

  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  // Закрытие по ESC
  useEffect(() => {
    if (!ui.isConfiguratorOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && ui.close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ui]);

  // Отключаем Lenis и лочим фон, когда модалка открыта
  useEffect(() => {
    if (!ui.isConfiguratorOpen) return;
    const lenis = (window as any).__lenis;
    lenis?.stop?.();

    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";

    return () => {
      lenis?.start?.();
      html.style.overflow = prevOverflow;
    };
  }, [ui.isConfiguratorOpen]);

  const pick = (p: AnyPart) => {
    const { ok } = isPartCompatible(p, build);
    if (!ok) return;
    setPart(p);
  };

  const finishAndAdd = () => {
    if (!build.CPU || !build.MB || !build.RAM || !build.GPU || !build.PSU || !build.CASE) return;
    addToCart(build, totalPrice);
    reset();
    ui.close();
    ui.openCart();
  };

  return (
    <AnimatePresence>
      {ui.isConfiguratorOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] grid place-items-center bg-black/70 backdrop-blur"
          onClick={ui.close}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 140, damping: 18 }}
            // КЛЮЧЕВОЕ: фиксированная высота по viewport + flex-колонка
            className="neon-panel rounded-3xl w-[min(1200px,94vw)] h-[92svh] md:h-[90svh] p-0 md:p-6 flex flex-col"
            role="dialog"
            aria-modal="true"
          >
            {/* Шапка */}
            <div className="shrink-0 sticky top-0 z-10 bg-surface/80 backdrop-blur px-4 py-3 md:px-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={ui.close}
                    className="p-2 rounded-xl hover:bg-white/5"
                    aria-label="Закрыть"
                  >
                    <X />
                  </button>
                  <h3 className="font-orbitron text-base md:text-lg tracking-widest nowrap-sm">
                    Конструктор ПК
                  </h3>
                </div>
                <div className="text-xs md:text-sm text-white/60">
                  Реком. мощность БП:{" "}
                  <span className="text-neon-cyan">{psuReq} Вт</span>
                </div>
              </div>
              <div className="mt-2 md:mt-3">
                <Stepper index={stepIndex} />
              </div>
            </div>

            {/* Прокручиваемая середина — ЕДИНСТВЕННЫЙ scroll-контейнер */}
            <div
              ref={scrollAreaRef}
              className="flex-1 min-h-0 overflow-y-auto px-4 md:px-6 pb-24 md:pb-3"
              data-lenis-prevent
            >
              <div className="grid grid-cols-12 gap-4 md:gap-5">
                {/* Левая колонка (сводка) — sticky внутри скролла */}
                <div className="col-span-12 lg:col-span-4 order-first lg:order-none">
                  <div className="neon-panel rounded-2xl p-4 lg:sticky lg:top-2">
                    <div className="font-orbitron tracking-wider mb-2 nowrap-sm">
                      Ваша сборка
                    </div>
                    <div className="space-y-2 text-sm">
                      {(Object.keys(CATALOG) as Category[]).map((c) => {
                        const item = (build as any)[c] as AnyPart | undefined;
                        return (
                          <div key={c} className="flex items-center justify-between gap-3">
                            <div className="text-white/70 nowrap-sm">{LABELS[c]}</div>
                            {item ? (
                              <div className="flex items-center gap-2">
                                <span className="text-white/80 max-w-[180px] truncate">{item.name}</span>
                                <button
                                  className="text-neon-magenta/80 hover:text-neon-magenta"
                                  onClick={() => removePart(c)}
                                  aria-label={`Убрать ${LABELS[c]}`}
                                >
                                  ×
                                </button>
                              </div>
                            ) : (
                              <span className="text-white/30">—</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-3">
                      <FpsPanel />
                    </div>

                    <div className="mt-4 border-t border-white/10 pt-3 flex items-center justify-between">
                      <div className="text-white/70">Итого</div>
                      <div className="font-orbitron text-neon-cyan">
                        {priceWithCurrency(totalPrice)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Правая колонка — список деталей */}
                <div className="col-span-12 lg:col-span-8 pr-0 md:pr-1">
                  <div className="mb-2 md:mb-3 font-orbitron tracking-wider nowrap-sm">
                    {LABELS[category]}
                  </div>
                  <CategoryStep
                    category={category}
                    catalog={CATALOG[category]}
                    build={build}
                    onPick={pick}
                  />
                </div>
              </div>
            </div>

            {/* Нижняя панель действий */}
            <div className="shrink-0 sticky bottom-0 bg-surface/80 backdrop-blur border-t border-white/10 px-4 py-3 md:px-6">
              <div className="flex gap-2">
                <button
                  onClick={back}
                  className="px-3 py-2 rounded-xl border border-white/15 hover:bg-white/5 flex items-center gap-2 disabled:opacity-40"
                  disabled={stepIndex === 0}
                >
                  <ArrowLeft size={16} /> Назад
                </button>

                {!isLast() ? (
                  <button
                    onClick={next}
                    disabled={!canContinue}
                    className="flex-1 px-3 py-2 rounded-xl border border-neon-cyan/50 hover:shadow-glow flex items-center gap-2 justify-center disabled:opacity-40"
                  >
                    Далее <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={finishAndAdd}
                    disabled={
                      !build.CPU ||
                      !build.MB ||
                      !build.RAM ||
                      !build.GPU ||
                      !build.PSU ||
                      !build.CASE
                    }
                    className="flex-1 px-3 py-2 rounded-xl border border-neon-magenta/60 hover:shadow-glow flex items-center gap-2 justify-center disabled:opacity-40"
                  >
                    <ShoppingCart size={16} /> В корзину
                  </button>
                )}
              </div>
              <div className="mt-1 text-[11px] text-white/50">
                FPS — приблизительный расчёт (1080p/1440p/4K; Medium/High/Ultra).
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
