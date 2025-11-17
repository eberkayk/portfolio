"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

/**
 * Global smooth scroll provider (Lenis)
 * Wraps the entire app for soft scrolling experience.
 */
export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2, // scroll hızı
      easing: (t: number) => 1 - Math.pow(1 - t, 3), // cubic ease-out
      smoothWheel: true, // fare tekerleği
      lerp: 0.1, // ivme yumuşatma
    });

    // 🌍 global erişim için:
    (window as any).lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return <>{children}</>;
}
