"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { client, urlFor } from "@/lib/sanity";
import { FEATURED_WORKS } from "@/lib/queries";

type Work = {
  _id: string;
  title: string;
  slug: string;
  cover?: any;
  images?: any[];
  year?: string;
  role?: string;
};

export default function FeaturedRow() {
  const [items, setItems] = useState<Work[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await client.fetch(FEATURED_WORKS);
        setItems(data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <section className="px-6 md:px-10 lg:px-16 py-10 md:py-16">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-[-0.01em]">
          Selected Works
        </h2>
        <Link href="/works" className="opacity-70 hover:opacity-100 transition-opacity">
          View all
        </Link>
      </div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-10% 0px" }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
      >
        {items.map((w) => (
          <motion.div
            key={w._id}
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
          >
            <Link href={`/works/${w.slug}`} className="group block">
              <div className="relative overflow-hidden rounded-2xl bg-neutral-900 aspect-[4/3]">
                {w.cover ? (
                  <Image
                    src={urlFor(w.cover).width(1200).height(900).url()}
                    alt={w.title}
                    fill
                    className="object-cover transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center opacity-60">No image</div>
                )}
              </div>
              <div className="flex items-center justify-between mt-3">
                <h3 className="text-lg md:text-xl">{w.title}</h3>
                <span className="opacity-60 text-sm">{w.year ?? "Case"}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
