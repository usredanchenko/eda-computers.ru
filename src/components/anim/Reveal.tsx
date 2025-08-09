"use client";
import { motion, useInView } from "framer-motion";
import { PropsWithChildren, useRef } from "react";
export default function Reveal({ children, delay = 0, y = 24 }: PropsWithChildren<{ delay?: number; y?: number; }>) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: "easeOut", delay }}>
      {children}
    </motion.div>
  );
}