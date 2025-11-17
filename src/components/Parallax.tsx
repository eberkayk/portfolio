"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ReactNode, useRef } from "react";

/**
 * Parallax effect wrapper
 */
export default function Parallax({
  children,
  offsetRange = ["start end", "end start"],
  yRange = [100, -100],
}: {
  children: ReactNode;
  offsetRange?: [string, string];
  yRange?: [number, number];
}) {
  const ref = useRef<HTMLDivElement>(null);

  // ✅ TypeScript'e açıkça 'any' olarak cast ediyoruz
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offsetRange as any, // 👈 burası ana düzeltme
  });

  const y: MotionValue<number> = useTransform(scrollYProgress, [0, 1], yRange);

  return (
    <div ref={ref} className="overflow-visible will-change-transform">
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}
