import PresetCard from "@/components/ui/PresetCard";
export default function Builds(){
  return (
    <section id="builds" className="py-14 md:py-20 container-px">
      <h2 className="font-orbitron text-xl md:text-3xl tracking-widest mb-5 md:mb-8 nowrap-sm">Готовые сборки</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
        <PresetCard id="gaming" title="Игровой" image="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=1600&auto=format&fit=crop" price={149990} tags={["1440p","RTX","NVMe"]}/>
        <PresetCard id="workstation" title="Рабочая станция" image="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop" price={209990} tags={["Рендер","64ГБ RAM"]}/>
        <PresetCard id="budget" title="Бюджетный" image="https://images.unsplash.com/photo-1545076478-2a58a0d27e2e?q=80&w=1600&auto=format&fit=crop" price={69990} tags={["1080p","Тихий"]}/>
      </div>
    </section>
  );
}