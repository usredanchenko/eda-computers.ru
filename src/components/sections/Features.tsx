import { Cpu, Layers, ShieldCheck, Zap } from "lucide-react";
import NeonCard from "@/components/ui/NeonCard";
import Reveal from "@/components/anim/Reveal";
const FEATURES = [
  { icon: Cpu, title: "Совместимость", desc: "Фильтры исключают неподходящие комплектующие." },
  { icon: Layers, title: "Пошаговый выбор", desc: "Прозрачные шаги и подсказки." },
  { icon: ShieldCheck, title: "Запас по питанию", desc: "Авто-проверка TDP и БП." },
  { icon: Zap, title: "Анимации", desc: "Неон-глоу, параллакс, микро-эффекты." },
];
export default function Features() {
  return (
    <section className="py-16 md:py-20 container-px">
      <div className="max-w-7xl mx-auto">
        <Reveal><h2 className="font-orbitron text-2xl md:text-3xl tracking-widest mb-6 md:mb-8 nowrap-sm">Почему у нас</h2></Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <NeonCard key={title}><div className="p-4 md:p-5"><Icon className="mb-2 md:mb-3" /><div className="font-orbitron tracking-wider text-sm md:text-base nowrap-sm">{title}</div><p className="mt-1 text-xs md:text-sm text-white/70">{desc}</p></div></NeonCard>
          ))}
        </div>
      </div>
    </section>
  );
}