"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 inset-x-0 z-50 backdrop-blur bg-white/70 ${scrolled ? "shadow-md" : "shadow-none"}`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-extrabold tracking-wide text-xl">
          ANIL EMMİLER
        </Link>
        <nav className="flex items-center gap-6">
          <Link className="hover:text-emerald-600 transition" href="/works">WORKS</Link>
          <Link className="hover:text-emerald-600 transition" href="/about">ABOUT ME</Link>
        </nav>
      </div>
    </motion.header>
  );
}
