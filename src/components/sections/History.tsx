import Reveal from "@/components/anim/Reveal";
import NeonCard from "@/components/ui/NeonCard";
const TIMELINE = [
  { year: "2021", text: "Зарождение идеи — первые кастомные прототипы" },
  { year: "2022", text: "Переезд в собственную мастерскую и запуск пресетов" },
  { year: "2023", text: "Собственный конфигуратор и проверка совместимости" },
  { year: "2024", text: "Расширение ассортимента и поставщиков" },
  { year: "2025", text: "Запуск сайта EDA-Computers с киберпанк-эстетикой" },
];
export default function History() {
  return (
    <section id="about" className="py-20 md:py-24 container-px">
      <div className="max-w-5xl mx-auto">
        <Reveal><h2 className="font-orbitron text-2xl md:text-3xl tracking-widest mb-4 md:mb-6 nowrap-sm">История EDA-Computers</h2></Reveal>
        <NeonCard><div className="p-5 md:p-6 text-white/80 space-y-4">
          <p>EDA-Computers — студия кастомных ПК. Мы ценим производительность, тишину и эстетику. Стартовали с энтузиазма, выросли в сервис с продуманным UX.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {TIMELINE.map((t) => (<div key={t.year} className="rounded-xl border border-white/10 p-4 bg-white/5"><div className="font-orbitron text-neon-cyan nowrap-sm">{t.year}</div><div className="text-sm text-white/70 mt-1">{t.text}</div></div>))}
          </div>
        </div></NeonCard>
      </div>
    </section>
  );
}