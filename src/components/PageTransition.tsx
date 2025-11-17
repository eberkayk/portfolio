"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function PageTransition({
  children,
  routeKey,
}: {
  children: ReactNode;
  routeKey: string;
}) {
  return (
    <motion.div
      key={routeKey}
      initial={{ opacity: 0, y: 12 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
      }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.35 } }}
    >
      {children}
    </motion.div>
  );
}
