"use client";
import { Category } from "@/types/parts";
import { motion } from "framer-motion";
const ORDER: Category[] = ["CPU","MB","RAM","GPU","STORAGE","COOLER","CASE","PSU"];
const LABELS: Record<Category, string> = { CPU:"Процессор", MB:"Матплата", RAM:"Память", GPU:"Видеокарта", STORAGE:"Накопитель", PSU:"Блок питания", COOLER:"Кулер", CASE:"Корпус" };
export default function Stepper({ index }: { index: number }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {ORDER.map((c, i) => {
        const active = i === index; const done = i < index;
        return (
          <motion.div key={c} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className={`px-2 md:px-3 py-1.5 rounded-xl text-[11px] md:text-xs font-orbitron tracking-widest border nowrap-sm ${active ? "border-neon-cyan/70 bg-white/5" : done ? "border-neon-magenta/50 bg-white/5" : "border-white/10"}`}>
            {LABELS[c]}
          </motion.div>
        );
      })}
    </div>
  );
}