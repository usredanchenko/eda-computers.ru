import { PropsWithChildren } from "react";
import { motion } from "framer-motion";
export default function NeonCard({ children }: PropsWithChildren) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10% 0px -10% 0px" }} transition={{ duration: 0.6, ease: "easeOut" }} className="neon-panel rounded-3xl border border-white/10 p-4">
      {children}
    </motion.div>
  );
}