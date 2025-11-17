"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type ImageModalProps = {
  isOpen: boolean;
  images: string[];
  current: number;
  onClose: () => void;
  onNavigate?: (dir: "prev" | "next") => void;
};

export default function ImageModal({
  isOpen,
  images,
  current,
  onClose,
  onNavigate,
}: ImageModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onNavigate) onNavigate("prev");
      if (e.key === "ArrowRight" && onNavigate) onNavigate("next");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0"
            onClick={onClose}
            role="button"
            aria-label="Close"
          />
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-w-5xl w-full mx-4"
          >
            <Image
              src={images[current]}
              alt={`Image ${current + 1}`}
              width={1600}
              height={1000}
              className="rounded-xl object-contain w-full h-auto"
            />
            {/* caption */}
            <p className="mt-4 text-center text-sm text-gray-300">
              {`Image ${current + 1} caption here`}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
