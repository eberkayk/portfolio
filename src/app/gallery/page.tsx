"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { client, urlFor } from "@/lib/sanity";
import { ALL_GALLERIES } from "@/lib/queries";
import Reveal from "@/components/Reveal";
import StaggerReveal from "@/components/StaggerReveal";

type GalleryItem = {
  _id: string;
  title: string;
  description?: string;
  images: {
    _key: string;
    caption?: string;
    asset: any;
  }[];
};

export default function GalleryPage() {
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    caption?: string;
  } | null>(null);

  useEffect(() => {
    (async () => {
      const data = await client.fetch(ALL_GALLERIES);
      setGalleries(data);
    })();
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <Reveal>
        <h1 className="text-5xl font-black text-center mb-16">IMAGE GALLERY</h1>
      </Reveal>

      {galleries.length === 0 && (
        <p className="text-center text-gray-500">No gallery items found.</p>
      )}

      {galleries.map((gallery, i) => (
        <Reveal key={gallery._id} delay={i * 0.1}>
          <div className="mb-24">
            <Reveal delay={0.1}>
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-2">{gallery.title}</h2>
                {gallery.description && (
                  <p className="text-gray-600">{gallery.description}</p>
                )}
              </div>
            </Reveal>

            {/* Staggered grid */}
            <StaggerReveal stagger={0.08}>
              {gallery.images?.map((img) => (
                <motion.div
                  key={img._key}
                  onClick={() =>
                    setSelectedImage({
                      src: urlFor(img.asset).width(1200).url(),
                      caption: img.caption,
                    })
                  }
                  className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-100 cursor-pointer group"
                >
                  <Image
                    src={urlFor(img.asset).width(800).height(600).url()}
                    alt={img.caption || gallery.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.05]"
                  />
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white text-sm p-2 opacity-0 group-hover:opacity-100 transition">
                      {img.caption}
                    </div>
                  )}
                </motion.div>
              ))}
            </StaggerReveal>
          </div>
        </Reveal>
      ))}

      {/* Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[40px] shadow-xl p-8 relative max-w-[800px] w-[90%] text-center"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 text-gray-600 hover:text-black text-3xl leading-none"
            >
              ×
            </button>
            <div className="overflow-hidden rounded-[26px] mb-6">
              <Image
                src={selectedImage.src}
                alt="selected"
                width={1200}
                height={900}
                className="object-cover w-full h-auto"
              />
            </div>
            {selectedImage.caption && (
              <p className="text-sm text-gray-600">{selectedImage.caption}</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
