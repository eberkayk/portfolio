"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { client, urlFor } from "@/lib/sanity";
import { ALL_WORKS } from "@/lib/queries";

type Work = {
  _id: string;
  title: string;
  slug: string;
  cover?: any;
  images?: any[];
  tags?: string[];
  description?: string;
};

export default function GalleryGrid() {
  const [works, setWorks] = useState<Work[]>([]);
  const [active, setActive] = useState("All");

  useEffect(() => {
    (async () => {
      try {
        const data = await client.fetch(ALL_WORKS);
        setWorks(data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const tags = useMemo(() => {
    const all = new Set<string>();
    works.forEach((w) => w.tags?.forEach((t) => all.add(t)));
    return ["All", ...Array.from(all)];
  }, [works]);

  const filtered = active === "All" ? works : works.filter((w) => w.tags?.includes(active));

  return (
    <div className="space-y-8">
      {/* tags */}
      <div className="flex flex-wrap gap-3 justify-center">
        {tags.map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={`px-4 py-2 rounded-full border transition ${
              active === t
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-transparent text-gray-300 border-gray-600 hover:border-gray-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* grid */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-10% 0px" }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {filtered.map((work) => (
          <motion.div
            key={work._id}
            variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
            className="group relative overflow-hidden rounded-2xl bg-neutral-900 aspect-[4/3]"
          >
            {work.cover ? (
              <Image
                src={urlFor(work.cover).width(800).height(600).url()}
                alt={work.title}
                fill
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.05]"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center opacity-60">No Image</div>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-center px-4">
              <h3 className="text-lg md:text-xl font-semibold text-white">{work.title}</h3>
              <Link
                href={`/works/${work.slug}`}
                className="mt-4 px-4 py-2 rounded-md bg-white text-black text-sm font-medium hover:bg-gray-200 transition"
              >
                View Details
              </Link>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
