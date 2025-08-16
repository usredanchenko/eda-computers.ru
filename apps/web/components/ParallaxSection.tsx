'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  background?: boolean;
  neonElements?: boolean;
}

export default function ParallaxSection({ 
  children, 
  className = "", 
  speed = 0.5,
  background = true,
  neonElements = true 
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100 * speed]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50 * speed]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -30 * speed]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, 40 * speed]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Неоновые фоновые элементы */}
      {background && neonElements && (
        <>
          {/* Плавающие частицы */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-neon-cyan rounded-full opacity-30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Неоновые линии */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent"
              style={{ y }}
              animate={{
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
            />
            <motion.div
              className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-pink to-transparent"
              style={{ y: y2 }}
              animate={{
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: 2,
              }}
            />
          </div>

          {/* Неоновые круги */}
          <motion.div
            className="absolute top-1/4 right-1/4 w-32 h-32 border border-neon-cyan rounded-full opacity-20"
            style={{ y: y3 }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
            }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/4 w-24 h-24 border border-neon-pink rounded-full opacity-20"
            style={{ y: y4 }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: 1,
            }}
          />
        </>
      )}

      {/* Основной контент */}
      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
}

// Специализированные параллакс-секции
export const HeroParallaxSection: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => (
  <ParallaxSection 
    className={`min-h-screen flex items-center justify-center ${className}`}
    speed={0.3}
    background={true}
    neonElements={true}
  >
    {children}
  </ParallaxSection>
);

export const ContentParallaxSection: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => (
  <ParallaxSection 
    className={`py-20 ${className}`}
    speed={0.2}
    background={false}
    neonElements={true}
  >
    {children}
  </ParallaxSection>
);

export const CardParallaxSection: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => (
  <ParallaxSection 
    className={`py-12 ${className}`}
    speed={0.1}
    background={false}
    neonElements={false}
  >
    {children}
  </ParallaxSection>
);
