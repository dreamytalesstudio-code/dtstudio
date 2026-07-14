import { motion } from "motion/react";
import React from "react";

interface SlowRevealParagraphProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function SlowRevealParagraph({
  children,
  className = "",
  delay = 0.2,
}: SlowRevealParagraphProps) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{
        duration: 1.6,
        ease: [0.16, 1, 0.3, 1], // Custom elegant ease-out
        delay,
      }}
      className={className}
    >
      {children}
    </motion.p>
  );
}
