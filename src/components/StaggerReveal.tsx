"use client";

import { motion, useAnimation, useInView, Variants } from "framer-motion";
import { useRef, useEffect, ReactNode } from "react";

/**
 * Tüm alt elemanları sırayla (staggered) fade + slide animasyonuyla gösterir
 */
export default function StaggerReveal({
  children,
  delay = 0,
  stagger = 0.1,
  yOffset = 40,
}: {
  children: ReactNode;
  delay?: number;
  stagger?: number;
  yOffset?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  // ✅ Tipleri açıkça Variants olarak belirliyoruz
  const containerVariants: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delay,
        staggerChildren: stagger,
        ease: "easeInOut", // ✅ Bezier yerine geçerli string kullan
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: yOffset },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div key={i} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}
