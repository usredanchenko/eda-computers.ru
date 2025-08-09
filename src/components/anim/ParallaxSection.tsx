"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import SafeImage from "@/components/ui/SafeImage";
import { PropsWithChildren, useRef } from "react";
export default function ParallaxSection({ id, bg, height = "min(88vh, 900px)", children }: PropsWithChildren<{ id?: string; bg: string; height?: string; }>) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const small = typeof window !== "undefined" && window.matchMedia('(max-width: 767px)').matches;
  const y = useTransform(scrollYProgress, [0, 1], small ? ["-4%", "4%"] : ["-10%", "10%"]);
  const scale = useTransform(scrollYProgress, [0, 1], small ? [1.02, 1] : [1.05, 1]);
  return (
    <section id={id} ref={ref} className="relative overflow-hidden" style={{ height }}>
      <motion.div style={{ y, scale }} className="img-bg">
        <SafeImage src={bg} alt="" fill priority sizes="100vw" className="object-cover pointer-events-none" />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-grid" />
      <div className="h-full grid place-items-center container-px">
        <div className="max-w-4xl text-center">{children}</div>
      </div>
    </section>
  );
}