// src/components/WorkCard.tsx (içeriğinizin üstüne ekleme örneği)
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function WorkCard({ work }: { work: { slug: string; title: string; coverUrl: string; subtitle?: string; year?: string; } }) {
  return (
    <Link href={`/works/${work.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-neutral-900">
        <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.5, ease: [0.16,1,0.3,1] }}>
          <Image
            src={work.coverUrl}
            alt={work.title}
            width={1600}
            height={1066}
            className="w-full h-auto object-cover"
            priority={false}
          />
        </motion.div>
      </div>
      <div className="flex items-center justify-between mt-3">
        <h3 className="text-lg md:text-xl">{work.title}</h3>
        {work.year && <span className="opacity-60 text-sm">{work.year}</span>}
      </div>
      {work.subtitle && <p className="opacity-60 text-sm mt-1">{work.subtitle}</p>}
    </Link>
  );
}
