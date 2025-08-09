"use client";
import React from "react";
import SafeImage from "@/components/ui/SafeImage";
import type { AnyPart, BuildState, Category } from "@/types/parts";
import GlowButton from "../ui/GlowButton";
import { estimateAll } from "@/lib/fps";
export default function PartCard({ part, disabled, hint, onPick, build, category }:{ part: AnyPart; disabled?: boolean; hint?: string; onPick: () => void; build: BuildState; category: Category; }) {
  const hypothetical: BuildState = { ...build, [category]: part };
  const fps = estimateAll(hypothetical);
  return (
    <div className={`neon-panel rounded-2xl overflow-hidden border ${disabled ? "opacity-50" : "opacity-100"}`}>
      <div className="relative aspect-[16/10]">
        <SafeImage src={part.image} alt={part.name} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
      </div>
      <div className="p-3 md:p-4">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <div className="font-orbitron tracking-wider text-sm md:text-base nowrap-sm">{part.brand}</div>
            <div className="text-xs md:text-sm text-white/70">{part.name}</div>
          </div>
          <div className="font-orbitron text-neon-cyan">{part.price.toLocaleString("ru-RU")} ₽</div>
        </div>
        {hint && <div className="mt-2 text-xs text-neon-magenta/90">{hint}</div>}
        <div className="mt-2 grid grid-cols-3 gap-1">
          {fps.map(({ game, value }) => (
            <div key={game} className="text-center text-[10px] bg-white/5 border border-white/10 rounded-lg px-1 py-1">
              <div className="text-white/50">{game.slice(0,3)}</div>
              <div className="font-orbitron text-neon-cyan text-xs">{value ?? "—"}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 md:mt-4">
          <GlowButton variant={disabled ? "outline" : "cyan"} disabled={disabled} onClick={onPick}>
            {disabled ? "Недоступно" : "Выбрать"}
          </GlowButton>
        </div>
      </div>
    </div>
  );
}