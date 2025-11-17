"use client";

import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef, ReactNode } from "react";

/**
 * Fade + Slide-up animasyonu (scroll-based)
 */
export default function Reveal({
  children,
  delay = 0,
  yOffset = 40,
}: {
  children: ReactNode;
  delay?: number;
  yOffset?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0, y: yOffset },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.8,
            delay,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
      initial="hidden"
      animate={controls}
    >
      {children}
    </motion.div>
  );
}
