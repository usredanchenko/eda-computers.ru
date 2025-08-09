"use client";
import ParallaxSection from "@/components/anim/ParallaxSection";
import GlowButton from "@/components/ui/GlowButton";
import { useConfiguratorUI } from "@/store/ui";
import Reveal from "@/components/anim/Reveal";
export default function Hero(){
  const open = useConfiguratorUI((s) => s.open);
  return (
    <ParallaxSection id="home" bg="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop">
      <Reveal><h1 className="font-orbitron text-[clamp(24px,8vw,56px)] tracking-[0.14em] md:tracking-[0.18em] nowrap-sm">EDA <span className="text-neon-cyan">Computers</span></h1></Reveal>
      <Reveal delay={0.12}><p className="mt-3 md:mt-4 text-white/75 max-w-2xl mx-auto container-px">Кастомные ПК в стиле <span className="text-neon-magenta">киберпанка</span>. Конструктор с проверкой совместимости.</p></Reveal>
      <Reveal delay={0.24}><div className="mt-5 md:mt-7 stack-sm justify-center container-px"><a href="#builds"><GlowButton variant="cyan" fullOnMobile>Готовые сборки</GlowButton></a><GlowButton variant="magenta" onClick={open} fullOnMobile>Конструктор</GlowButton></div></Reveal>
    </ParallaxSection>
  );
}