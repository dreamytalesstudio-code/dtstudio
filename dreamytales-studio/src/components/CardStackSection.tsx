import React, { useRef } from "react";
import { motion } from "motion/react";

interface CardStackSectionProps {
  children: React.ReactNode;
  id: string;
  zIndex?: number;
}

export default function CardStackSection({ children, id }: CardStackSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={containerRef}
      id={id}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full relative overflow-visible bg-luxury-ivory"
    >
      {children}
    </motion.div>
  );
}
