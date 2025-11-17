"use client";

import { motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => setProgress(v));
  }, [scrollYProgress]);

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] bg-neutral-800 z-[9999]">
      <motion.div
        className="h-full bg-white"
        style={{ scaleX: progress, transformOrigin: "0 0" }}
      />
    </div>
  );
}
