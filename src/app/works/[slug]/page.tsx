"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { client, urlFor } from "@/lib/sanity";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import StaggerReveal from "@/components/StaggerReveal";

type Work = {
  title: string;
  description?: string;
  images?: any[];
};

export default function WorkDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [work, setWork] = useState<Work | null>(null);

  useEffect(() => {
    (async () => {
      const query = `*[_type == "work" && slug.current == $slug][0]{
        title,
        description,
        images
      }`;
      const data = await client.fetch(query, { slug });
      setWork(data);
    })();
  }, [slug]);

  if (!work) return <p className="p-6 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-24 space-y-12">
      <Reveal>
        <h1 className="text-4xl md:text-5xl font-semibold">{work.title}</h1>
      </Reveal>

      {work.description && (
        <Reveal delay={0.1}>
          <p className="opacity-70 text-lg">{work.description}</p>
        </Reveal>
      )}

      {/* Staggered reveal for multiple images */}
      <StaggerReveal stagger={0.12}>
        {work.images?.map((img: any, i: number) => (
          <motion.div
            key={i}
            className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-neutral-900"
          >
            <Image
              src={urlFor(img).width(1200).height(800).url()}
              alt={`${work.title} image ${i + 1}`}
              fill
              className="object-cover"
            />
          </motion.div>
        ))}
      </StaggerReveal>
    </div>
  );
}
