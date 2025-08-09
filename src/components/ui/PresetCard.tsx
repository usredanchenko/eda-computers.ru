import SafeImage from "@/components/ui/SafeImage";
import GlowButton from "./GlowButton";
export default function PresetCard({ id, title, image, price, tags }:{ id:string; title:string; image:string; price:number; tags:string[]; }) {
  return (
    <div className="neon-panel rounded-3xl border border-white/10 p-3 md:p-4">
      <div className="img-card">
        <SafeImage src={image} alt={title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
      </div>
      <div className="p-2">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-orbitron text-base md:text-xl tracking-wide md:tracking-wider nowrap-sm">{title}</h3>
          <div className="text-neon-cyan font-orbitron tracking-wider">{price.toLocaleString("ru-RU")} ₽</div>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((t) => (<span key={t} className="text-[11px] md:text-xs px-2 py-1 rounded-lg bg-white/5 border border-white/10">{t}</span>))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <GlowButton variant="cyan" fullOnMobile>Оформить</GlowButton>
          <GlowButton variant="magenta" fullOnMobile>Подробнее</GlowButton>
        </div>
      </div>
    </div>
  );
}