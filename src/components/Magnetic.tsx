"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";

/**
 * Magnetic hover wrapper
 * @param children wrapped element (button, image, card, etc.)
 * @param strength movement intensity (default 30)
 */
export default function Magnetic({
  children,
  strength = 30,
}: {
  children: React.ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(springY, [-strength, strength], [10, -10]);
  const rotateY = useTransform(springX, [-strength, strength], [-10, 10]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      mouseX.set(x / 5);
      mouseY.set(y / 5);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    node.addEventListener("mousemove", handleMouseMove);
    node.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      node.removeEventListener("mousemove", handleMouseMove);
      node.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={ref}
      className="inline-block magnetic" // ✨ bu eklendi
      style={{
        x: springX,
        y: springY,
        rotateX,
        rotateY,
        perspective: 800,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </motion.div>
  );
}
