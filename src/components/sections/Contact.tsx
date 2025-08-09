import Reveal from "@/components/anim/Reveal";
import NeonCard from "@/components/ui/NeonCard";
import GlowButton from "@/components/ui/GlowButton";
export default function Contact() {
  return (
    <section id="contact" className="py-20 md:py-24 container-px">
      <div className="max-w-4xl mx-auto">
        <Reveal><h2 className="font-orbitron text-2xl md:text-3xl tracking-widest mb-4 md:mb-6 nowrap-sm">Контакты</h2></Reveal>
        <NeonCard><form className="p-5 md:p-6 grid gap-3 md:gap-4">
          <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-3" placeholder="Имя" />
          <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-3" placeholder="Email" />
          <textarea className="bg-white/5 border border-white/10 rounded-xl px-4 py-3" rows={4} placeholder="Сообщение" />
          <div className="flex justify-end"><GlowButton variant="cyan" type="submit">Отправить</GlowButton></div>
        </form></NeonCard>
      </div>
    </section>
  );
}