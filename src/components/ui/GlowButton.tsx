"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import clsx from "clsx";

type Extra = {
  variant?: "cyan" | "magenta" | "outline";
  fullOnMobile?: boolean;
};

type Props = HTMLMotionProps<"button"> & Extra;

export default function GlowButton({
  className,
  variant = "cyan",
  fullOnMobile = false,
  ...rest
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const [hoverEnabled, setHover] = useState(false);

  useEffect(() => {
    setHover(matchMedia("(hover: hover)").matches);
  }, []);

  return (
    <motion.button
      ref={ref}
      whileHover={hoverEnabled ? { scale: 1.04 } : undefined}
      whileTap={{ scale: 0.98 }}
      className={clsx(
        "relative isolate px-4 md:px-5 py-3 rounded-xl font-orbitron tracking-wide md:tracking-widest transition border",
        variant === "cyan" && "border-neon-cyan/50",
        variant === "magenta" && "border-neon-magenta/50",
        variant === "outline" && "border-white/20",
        fullOnMobile && "w-full sm:w-auto",
        className
      )}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      style={{
        background:
          "radial-gradient(120px circle at var(--mx) var(--my), rgba(0,240,255,.15), rgba(255,0,230,.12) 40%, transparent 60%)",
      } as React.CSSProperties}
      {...rest}
    />
  );
}
