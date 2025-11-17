"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { client, urlFor } from "@/lib/sanity";
import { FEATURED_WORKS, ALL_WORKS } from "@/lib/queries";
import Parallax from "@/components/Parallax";
import Reveal from "@/components/Reveal";
import StaggerReveal from "@/components/StaggerReveal";
import Magnetic from "@/components/Magnetic";

type Work = {
  _id: string;
  title: string;
  slug?: string;
  category: "illustration" | "design" | "music" | string;
  featured?: boolean;
  image: any;
  description?: string;
  images?: any[];
  createdAt?: string;
};

const CATEGORIES: { key: string; label: string }[] = [
  { key: "all",          label: "ALL WORKS" },
  { key: "illustration", label: "ILLUSTRATION" },
  { key: "design",       label: "DESIGN" },
  { key: "music",        label: "MUSIC" },
];

export default function HomePage() {
  const [featured, setFeatured] = useState<Work[]>([]);
  const [allWorks, setAllWorks] = useState<Work[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Work | null>(null);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const [f, a] = await Promise.all([
          client.fetch<Work[]>(FEATURED_WORKS),
          client.fetch<Work[]>(ALL_WORKS),
        ]);
        setFeatured(f || []);
        setAllWorks(a || []);
      } catch (e) {
        console.error("Sanity fetch error:", e);
      }
    })();
  }, []);

  // Modal açıkken body scroll'u kilitle
  useEffect(() => {
    if (selected || lightboxImages.length > 0) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selected, lightboxImages]);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxImages.length === 0) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : lightboxImages.length - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentImageIndex((prev) => (prev < lightboxImages.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Escape') {
        closeLightbox();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImages]);

  const filtered = useMemo(() => {
    if (filter === "all") return allWorks;
    return allWorks.filter((w) => w.category === filter);
  }, [allWorks, filter]);

  const openLightbox = (images: any[], index: number) => {
    const imageUrls = images.map(img => 
      urlFor(img).width(2400).quality(100).url()
    );
    setLightboxImages(imageUrls);
    setCurrentImageIndex(index);
  };

  const closeLightbox = () => {
    setLightboxImages([]);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev < lightboxImages.length - 1 ? prev + 1 : 0));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : lightboxImages.length - 1));
  };

  return (
    <div className="flex flex-col items-center bg-white text-black font-montserrat relative min-h-screen overflow-x-hidden">
      {/* Profil ikonu - sağ üst */}
      <Link 
        href="/about" 
        className="fixed top-4 right-4 sm:top-6 sm:right-6 md:top-10 md:right-10 w-12 h-12 sm:w-14 sm:h-14 md:w-[60px] md:h-[60px] rounded-full z-50 overflow-hidden shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer"
      >
        <Image
          src="/about-me-default.png"
          alt="About Me"
          width={120}
          height={120}
          className="w-full h-full object-cover"
          priority
        />
      </Link>

      {/* HERO */}
      <section className="flex flex-col items-center text-center mt-20 sm:mt-24 md:mt-28 mb-12 sm:mb-16 px-4 w-full max-w-7xl">
        <Reveal>
          <Parallax yRange={[100, -100]}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-none tracking-tight">
              ANIL EMMİLER
            </h1>
          </Parallax>
        </Reveal>

        <Reveal delay={0.1}>
          <Parallax yRange={[50, -50]}>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl lg:text-2xl font-bold px-4">
              ISTANBUL BASED DESIGNER & ILLUSTRATOR
            </p>
          </Parallax>
        </Reveal>

        <Reveal delay={0.2}>
          <Parallax yRange={[30, -30]}>
            <p className="mt-2 text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-[#00B050]">
              anilemmiler@gmail.com
            </p>
          </Parallax>
        </Reveal>
      </section>

      {/* FEATURED WORKS */}
      <section className="w-full max-w-7xl flex flex-col items-center mb-16 sm:mb-20 md:mb-24 px-4 sm:px-6">
        <Reveal>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-center mb-8 sm:mb-10 md:mb-12">
            FEATURED WORKS
          </h2>
        </Reveal>

        <StaggerReveal stagger={0.08}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full mb-6">
            {featured.map((work) => (
              <Magnetic key={work._id}>
                <div className="flex flex-col">
                  <div
                    className="rounded-3xl sm:rounded-[32px] overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer"
                    onClick={() => setSelected(work)}
                  >
                    {work.image ? (
                      <Image
                        src={urlFor(work.image).width(900).height(720).url()}
                        alt={work.title}
                        width={900}
                        height={720}
                        className="object-cover w-full h-auto"
                        priority
                      />
                    ) : (
                      <div className="w-full aspect-[4/3] bg-gray-200 grid place-items-center text-gray-500">No Image</div>
                    )}
                  </div>
                  <p className="mt-3 text-center text-xs sm:text-sm font-bold uppercase tracking-wider">
                    LABEL
                  </p>
                </div>
              </Magnetic>
            ))}
          </div>
        </StaggerReveal>
      </section>

      {/* FİLTRE BUTONLARI */}
      <section className="w-full max-w-7xl mb-8 sm:mb-10 px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => setFilter(c.key)}
                className={`px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-full text-xs sm:text-sm md:text-base font-semibold transition whitespace-nowrap
                  ${filter === c.key ? "bg-[#27AE60] text-white shadow-md" : "bg-[#E6F5EC] text-[#1D4E2D] hover:bg-[#d8f0e4]"}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </Reveal>
      </section>

      {/* TÜM İŞLER */}
      <section className="w-full max-w-7xl mb-16 sm:mb-20 md:mb-24 px-4 sm:px-6">
        <StaggerReveal stagger={0.06}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filtered.map((w) => (
              <Magnetic key={w._id}>
                <div
                  onClick={() => setSelected(w)}
                  className="relative rounded-2xl sm:rounded-[28px] overflow-hidden bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] cursor-pointer transition-transform duration-300 hover:scale-105"
                >
                  {w.image ? (
                    <Image
                      src={urlFor(w.image).width(800).height(800).url()}
                      alt={w.title}
                      width={800}
                      height={800}
                      className="object-cover w-full h-auto"
                    />
                  ) : (
                    <div className="w-full aspect-square bg-gray-200 grid place-items-center text-gray-500">No Image</div>
                  )}
                </div>
              </Magnetic>
            ))}
          </div>
        </StaggerReveal>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-[#00B050] text-center py-12 sm:py-14 md:py-16 text-white mt-10 px-4">
        <Reveal>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-8 sm:mb-10 md:mb-12 text-black">CONTACTS</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 text-base sm:text-lg md:text-xl lg:text-2xl font-black">
            <a href="#" className="hover:opacity-80 transition">INSTAGRAM</a>
            <a href="#" className="hover:opacity-80 transition">DRIBBBLE</a>
            <a href="#" className="hover:opacity-80 transition">BEHANCE</a>
            <a href="#" className="hover:opacity-80 transition">SPOTIFY</a>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-8 sm:mt-10 text-xs sm:text-sm font-semibold text-black">© ANIL EMMİLER 2025</p>
        </Reveal>
      </footer>

      {/* WORK DETAIL MODAL - MODERN SCROLLBAR */}
      {selected && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />
          
          {/* Modal - Custom Scrollbar */}
          <div className="relative bg-white rounded-2xl sm:rounded-3xl md:rounded-[36px] shadow-2xl w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[900px] max-h-[90vh] overflow-y-auto z-10 custom-scrollbar">
            {/* Close button */}
            <button
              onClick={() => setSelected(null)}
              className="sticky top-4 float-right mr-4 sm:mr-6 text-gray-500 hover:text-black text-2xl sm:text-3xl leading-none z-20 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              ×
            </button>

            {/* Content */}
            <div className="px-6 sm:px-8 md:px-10 py-8 sm:py-10 clear-both">
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black mb-2 text-center">
                {selected.title}
              </h3>
              <p className="text-xs sm:text-sm md:text-base font-medium text-gray-600 mb-2 text-center">
                Lorem ipsum dolor sit amet
              </p>
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 mb-6 text-center">
                Adobe Illustrator / April 2020
              </p>

              {/* Layout 1: Single image */}
              {selected.image && !selected.images && (
                <>
                  {selected.description && (
                    <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed text-center mb-6 max-w-3xl mx-auto">
                      {selected.description}
                    </p>
                  )}
                  <div 
                    className="rounded-2xl sm:rounded-[26px] overflow-hidden mx-auto max-w-full sm:max-w-[780px] mb-6 cursor-zoom-in group"
                    onClick={() => openLightbox([selected.image], 0)}
                  >
                    <Image
                      src={urlFor(selected.image).width(1400).height(1000).url()}
                      alt={selected.title}
                      width={1400}
                      height={1000}
                      className="object-contain w-full h-auto group-hover:opacity-90 transition"
                    />
                  </div>
                </>
              )}

              {/* Layout 2: Two images */}
              {selected.images && selected.images.length === 2 && (
                <>
                  {selected.description && (
                    <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed text-center mb-6 max-w-3xl mx-auto">
                      {selected.description}
                    </p>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
                    {selected.images.map((img: any, idx: number) => (
                      <div 
                        key={idx} 
                        className="rounded-2xl sm:rounded-[24px] overflow-hidden cursor-zoom-in group"
                        onClick={() => openLightbox(selected.images!, idx)}
                      >
                        <Image
                          src={urlFor(img).width(900).height(900).url()}
                          alt={`${selected.title} ${idx + 1}`}
                          width={900}
                          height={900}
                          className="object-cover w-full h-auto group-hover:opacity-90 transition"
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Layout 3: Multiple images */}
              {selected.images && selected.images.length > 2 && (
                <>
                  {selected.description && (
                    <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed text-center mb-6 sm:mb-8 max-w-3xl mx-auto">
                      {selected.description}
                    </p>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {selected.images.map((img: any, idx: number) => (
                      <div 
                        key={idx} 
                        className="rounded-2xl sm:rounded-[24px] overflow-hidden cursor-zoom-in group"
                        onClick={() => openLightbox(selected.images!, idx)}
                      >
                        <Image
                          src={urlFor(img).width(900).height(900).url()}
                          alt={`${selected.title} ${idx + 1}`}
                          width={900}
                          height={900}
                          className="object-cover w-full h-auto group-hover:opacity-90 transition"
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX - GÖRSELE TIKLAMA DÜZELTİLDİ */}
      {lightboxImages.length > 0 && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[70]"
        >
          {/* Backdrop - sadece boş alanlara tıklayınca kapansın */}
          <div 
            className="absolute inset-0" 
            onClick={closeLightbox}
          />

          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white hover:text-gray-300 text-3xl sm:text-4xl leading-none z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition"
          >
            ×
          </button>

          {/* Previous button */}
          {lightboxImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 text-4xl sm:text-5xl leading-none z-20 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition"
            >
              ‹
            </button>
          )}

          {/* Next button */}
          {lightboxImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 text-4xl sm:text-5xl leading-none z-20 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition"
            >
              ›
            </button>
          )}

          {/* Image counter */}
          {lightboxImages.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm z-20">
              {currentImageIndex + 1} / {lightboxImages.length}
            </div>
          )}
          
          {/* Image Container - Görsele tıklama engellenmiyor */}
          <div 
            className="relative w-full h-full flex items-center justify-center p-4 sm:p-8 z-10"
          >
            <Image
              src={lightboxImages[currentImageIndex]}
              alt={`Image ${currentImageIndex + 1}`}
              width={2400}
              height={2400}
              className="object-contain max-w-full max-h-full select-none"
              priority
              draggable={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}