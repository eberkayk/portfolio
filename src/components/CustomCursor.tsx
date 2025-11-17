"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);

  // mouse konumu
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // smooth hareket (yaylı)
  const springX = useSpring(mouseX, { stiffness: 300, damping: 40 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 40 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    // hover algılama
    const hoverTargets = document.querySelectorAll("button, a, img, .magnetic");
    hoverTargets.forEach((el) => {
      el.addEventListener("mouseenter", () => setIsHovering(true));
      el.addEventListener("mouseleave", () => setIsHovering(false));
    });

    window.addEventListener("mousemove", moveCursor);
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      hoverTargets.forEach((el) => {
        el.removeEventListener("mouseenter", () => setIsHovering(true));
        el.removeEventListener("mouseleave", () => setIsHovering(false));
      });
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={{
        x: springX,
        y: springY,
        translateX: "-50%", // 👈 fare merkezine hizalama
        translateY: "-50%", // 👈 fare merkezine hizalama
      }}
      className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference"
    >
      <motion.div
        animate={{
          width: isHovering ? 60 : 24,
          height: isHovering ? 60 : 24,
          opacity: 1,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="rounded-full bg-[#00B050]"
      />
    </motion.div>
  );
}
