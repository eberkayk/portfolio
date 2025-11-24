"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { client, urlFor } from "@/lib/sanity";
import { FEATURED_WORKS, ALL_WORKS } from "@/lib/queries";
import logoAnimation from "../../public/logo.json";

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

type Work = {
  _id: string;
  title: string;
  slug?: string;
  category: "illustration" | "ui/ux" | "music" | string;
  featured?: boolean;
  image: any;
  description?: string;
  images?: any[];
  createdAt?: string;
};

const CATEGORIES: { key: string; label: string }[] = [
  { key: "all",          label: "ALL WORKS" },
  { key: "illustration", label: "ILLUSTRATION" },
  { key: "ui/ux",       label: "UI/UX" },
  { key: "music",        label: "MUSIC" },
];
//111
export default function HomePage() {
  const [featured, setFeatured] = useState<Work[]>([]);
  const [allWorks, setAllWorks] = useState<Work[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Work | null>(null);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lightboxScrollRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const [isLightboxDragging, setIsLightboxDragging] = useState(false);
  const [lightboxStartX, setLightboxStartX] = useState(0);
  const [lightboxScrollLeft, setLightboxScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setIsDragging(true);
    setStartX(e.pageX - container.offsetLeft);
    setScrollLeft(container.scrollLeft);
    container.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    container.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    const container = scrollContainerRef.current;
    if (container) container.style.cursor = 'grab';
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      const container = scrollContainerRef.current;
      if (container) container.style.cursor = 'grab';
    }
  };

  const handleLightboxMouseDown = (e: React.MouseEvent) => {
    const container = lightboxScrollRef.current;
    if (!container) return;
    setIsLightboxDragging(true);
    setLightboxStartX(e.pageX - container.offsetLeft);
    setLightboxScrollLeft(container.scrollLeft);
  };

  const handleLightboxMouseMove = (e: React.MouseEvent) => {
    if (!isLightboxDragging) return;
    const container = lightboxScrollRef.current;
    if (!container) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - lightboxStartX) * 2;
    container.scrollLeft = lightboxScrollLeft - walk;
  };

  const handleLightboxMouseUp = () => {
    setIsLightboxDragging(false);
  };

  const handleLightboxMouseLeave = () => {
    if (isLightboxDragging) {
      setIsLightboxDragging(false);
    }
  };

  useEffect(() => {
  (async () => {
    try {
      const [f, a] = await Promise.all([
        client.fetch<Work[]>(FEATURED_WORKS),
        client.fetch<Work[]>(ALL_WORKS),
      ]);
      console.log("Fetched works:", a); // ← EKLEME
      console.log("Sample work:", a[0]); // ← EKLEME
      setFeatured(f || []);
      setAllWorks(a || []);
    } catch (e) {
      console.error("Sanity fetch error:", e);
    }
  })();
}, []);

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

  useEffect(() => {
    if (lightboxImages.length === 0) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
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

  const isModalScrollable = selected && selected.images && selected.images.length > 2;
  
  const [isAboutHovered, setIsAboutHovered] = useState(false);
  const lottieRef = useRef<any>(null);

  return (
    <div className="flex flex-col items-center bg-white text-black font-montserrat relative min-h-screen overflow-x-hidden">
      <Link 
        href="/about" 
        className={`fixed top-4 right-4 sm:top-6 sm:right-6 md:top-10 md:right-10 rounded-full bg-[#00B050] z-50 transition-all duration-500 cursor-pointer flex items-center justify-center shadow-lg overflow-hidden group ${
          isAboutHovered 
            ? 'w-[180px] h-14 sm:w-[220px] sm:h-16 md:w-[250px] md:h-[70px] pr-4' 
            : 'w-14 h-14 sm:w-16 sm:h-16 md:w-[70px] md:h-[70px]'
        }`}
        onMouseEnter={() => {
          setIsAboutHovered(true);
          if (lottieRef.current) {
            lottieRef.current.play();
          }
        }}
        onMouseLeave={() => {
          setIsAboutHovered(false);
          if (lottieRef.current) {
            lottieRef.current.stop();
          }
        }}
      >
        <div className={`flex-shrink-0 transition-all duration-500 ${
          isAboutHovered ? 'w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16' : 'w-[75%] h-[75%]'
        }`}>
          <Lottie 
            lottieRef={lottieRef}
            animationData={logoAnimation}
            loop={true}
            autoplay={false}
            className="w-full h-full"
          />
        </div>
        
        <span className={`font-black text-[#003300] font-weight:900 text-sm sm:text-base md:text-lg whitespace-nowrap transition-all duration-500 ${
          isAboutHovered 
            ? 'opacity-100 translate-x-0 ml-3' 
            : 'opacity-0 translate-x-[-20px] ml-0 w-0'
        }`}>
          ABOUT ME
        </span>
      </Link>



      <section className="flex flex-col items-center text-center mt-20 sm:mt-24 md:mt-28 mb-12 sm:mb-16 px-4 w-full max-w-7xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-none tracking-tight">
          ANIL EMMİLER
        </h1>
        <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl lg:text-2xl font-bold px-4">
          ISTANBUL BASED DESIGNER & ILLUSTRATOR
        </p>
        <p className="mt-2 text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-[#00B050]">
          anilemmiler@gmail.com
        </p>
      </section>

      <section className="w-full mb-16 sm:mb-20 md:mb-24">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-center mb-8 sm:mb-10 md:mb-12 px-4">
          FEATURED WORKS
        </h2>

        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto overflow-y-hidden px-4 sm:px-6 md:px-8 pb-6 cursor-grab select-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>
          
          <div className="flex gap-[100px] w-max">
            {featured.map((work) => (
              <div key={work._id} className="flex flex-col items-center flex-shrink-0">
                <div className="w-[500px] h-[500px] rounded-3xl overflow-hidden shadow-lg pointer-events-none select-none">
                  {work.image ? (
                    <Image
                      src={urlFor(work.image).width(500).height(500).url()}
                      alt={work.title}
                      width={500}
                      height={500}
                      className="object-cover w-full h-full"
                      priority
                      draggable={false}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 grid place-items-center text-gray-500">No Image</div>
                  )}
                </div>
                <button
                  onClick={() => setSelected(work)}
                  className="mt-4 px-6 py-2 bg-[#00B050] text-white rounded-full font-semibold hover:bg-[#00a046] transition pointer-events-auto"
                >
                  {work.title}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full max-w-7xl mb-8 sm:mb-10 px-4 sm:px-6">
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
      </section>

      <section className="w-full max-w-7xl mb-16 sm:mb-20 md:mb-24 px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-16 lg:gap-[100px] justify-items-center">
          {filtered.map((w) => (
            <div 
  key={w._id}
  onClick={() => {
    console.log("Selected work:", w); // ← EKLEME
    console.log("Has image:", w.image); // ← EKLEME
    console.log("Has images array:", w.images); // ← EKLEME
    setSelected(w);
  }}
  className="w-[300px] h-[300px] rounded-2xl overflow-hidden bg-white shadow-lg cursor-pointer relative group transition-transform duration-300 hover:scale-105"
>
              {w.image ? (
                <>
                  <Image
                    src={urlFor(w.image).width(300).height(300).url()}
                    alt={w.title}
                    width={300}
                    height={300}
                    className="object-cover w-full h-full transition-all duration-300 group-hover:brightness-[0.35] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold text-center px-4">
                      {w.title}
                    </h3>
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-gray-200 grid place-items-center text-gray-500">No Image</div>
              )}
            </div>
          ))}
        </div>
      </section>

      <footer className="w-full bg-[#00B050] text-center py-12 sm:py-14 md:py-16 text-white mt-10 px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-8 sm:mb-10 md:mb-12 text-black">CONTACTS</h2>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 text-base sm:text-lg md:text-xl lg:text-2xl font-black">
          <a href="#" className="hover:text-[#003300] hover:scale-110 transition-all duration-300">INSTAGRAM</a>
          <a href="#" className="hover:text-[#003300] hover:scale-110 transition-all duration-300">DRIBBBLE</a>
          <a href="#" className="hover:text-[#003300] hover:scale-110 transition-all duration-300">BEHANCE</a>
          <a href="#" className="hover:text-[#003300] hover:scale-110 transition-all duration-300">SPOTIFY</a>
        </div>
        <p className="mt-8 sm:mt-10 text-xs sm:text-sm font-semibold text-black">© ANIL EMMİLER 2025</p>
      </footer>

      {/* WORK DETAIL MODAL */}
      {selected && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-[30px] invisible-scrollbar">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />
          
          <div className={`relative bg-white rounded-[24px] sm:rounded-[40px] shadow-2xl w-full h-full z-10 overflow-y-auto`}>
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 sm:top-[30px] sm:right-[30px] w-12 h-12 sm:w-[60px] sm:h-[60px] flex items-center justify-center text-gray-500 hover:text-black text-3xl sm:text-4xl leading-none z-20 bg-gray-100 hover:bg-gray-200 rounded-full transition-all"
            >
              ×
            </button>

            <div className="px-4 sm:px-8 md:px-12 lg:px-20 py-4 sm:py-6">
              {/* Title & Description - Smaller, centered, higher */}
              <div className="w-full flex flex-col items-center mb-6 sm:mb-8 pt-3 sm:pt-4">
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-center px-4">
                  {selected.title}
                </h3>
                
                {selected.description && (
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-2 sm:mt-3 text-center leading-relaxed max-w-3xl px-4">
                    {selected.description}
                  </p>
                )}

              </div>

              {/* Single image - when no images array OR only one image */}
              {((selected.image && (!selected.images || selected.images.length === 0)) || 
                (selected.images && selected.images.length === 1)) && (
                <div className="w-full flex justify-center mb-12 sm:mb-20">
                  <div 
                    className="rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-lg cursor-pointer group w-full max-w-[280px] sm:max-w-[380px]"
                    onClick={() => {
                      const imageToShow = selected.images && selected.images.length === 1 
                        ? selected.images[0] 
                        : selected.image;
                      if (imageToShow) {
                        openLightbox([imageToShow], 0);
                      }
                    }}
                  >
                    {(() => {
                      const imageToShow = selected.images && selected.images.length === 1 
                        ? selected.images[0] 
                        : selected.image;
                      return imageToShow ? (
                        <Image
                          src={urlFor(imageToShow).width(1200).height(1200).url()}
                          alt={selected.title || 'Work image'}
                          width={1200}
                          height={1200}
                          className="object-contain w-full h-auto group-hover:scale-105 transition-transform duration-300"
                          priority
                        />
                      ) : null;
                    })()}
                  </div>
                </div>
              )}



              {/* Two images - Horizontal scrollable on mobile, side by side on desktop */}
              {selected.images && selected.images.length === 2 && (
                <>
                  {/* Mobile: Horizontal scroll - SAME SIZE */}
                  <div className="sm:hidden w-full mb-12 overflow-x-auto pb-4">
                    <div className="flex gap-4 w-max px-2">
                      {selected.images.map((img: any, idx: number) => (
                        <div 
                          key={idx} 
                          className="rounded-[24px] overflow-hidden shadow-lg cursor-pointer group w-[280px] flex-shrink-0"
                          onClick={() => openLightbox(selected.images!, idx)}
                        >
                          <Image
                            src={urlFor(img).width(900).height(900).url()}
                            alt={`${selected.title} ${idx + 1}`}
                            width={900}
                            height={900}
                            className="object-contain w-full h-auto group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Desktop: Side by side - HALF SIZE */}
                  <div className="hidden sm:flex w-full justify-center items-center gap-6 mb-20">
                    {selected.images.map((img: any, idx: number) => (
                      <div 
                        key={idx} 
                        className="rounded-[32px] overflow-hidden shadow-lg cursor-pointer group w-full max-w-[300px]"
                        onClick={() => openLightbox(selected.images!, idx)}
                      >
                        <Image
                          src={urlFor(img).width(450).height(450).url()}
                          alt={`${selected.title} ${idx + 1}`}
                          width={450}
                          height={450}
                          className="object-contain w-full h-auto group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Multiple images (3+) - Horizontal scroll on mobile, grid on desktop */}
              {selected.images && selected.images.length > 2 && (
                <>
                  {/* Mobile: Horizontal scroll */}
                  <div className="sm:hidden w-full mb-12 overflow-x-auto pb-4">
                    <div className="flex gap-4 w-max px-2">
                      {selected.images.map((img: any, idx: number) => (
                        <div 
                          key={idx} 
                          className="rounded-[24px] overflow-hidden shadow-lg cursor-pointer group w-[280px] flex-shrink-0"
                          onClick={() => openLightbox(selected.images!, idx)}
                        >
                          <Image
                            src={urlFor(img).width(900).height(900).url()}
                            alt={`${selected.title} ${idx + 1}`}
                            width={900}
                            height={900}
                            className="object-contain w-full h-auto group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Desktop: Grid layout */}
                  <div className="hidden sm:grid grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto mb-20">
                    {selected.images.map((img: any, idx: number) => (
                      <div 
                        key={idx} 
                        className="rounded-[32px] overflow-hidden shadow-lg cursor-pointer group w-full max-w-[300px]"
                        onClick={() => openLightbox(selected.images!, idx)}
                      >
                        <Image
                          src={urlFor(img).width(450).height(450).url()}
                          alt={`${selected.title} ${idx + 1}`}
                          width={450}
                          height={450}
                          className="object-contain w-full h-auto group-hover:scale-105 transition-transform duration-300"
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

      {/* LIGHTBOX MODAL */}
      {lightboxImages.length > 0 && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeLightbox}
          />

          {/* Modal Container */}
          <div className="relative bg-white rounded-[24px] sm:rounded-[40px] shadow-2xl w-full max-w-[95vw] h-[90vh] z-10 overflow-hidden">
            {/* Close Button - Over images */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-gray-500 hover:text-black text-3xl sm:text-4xl leading-none z-30 bg-white/90 hover:bg-white rounded-full transition-all shadow-lg"
            >
              ×
            </button>

            
            {/* Scrollable Images Container */}
            <div className="relative w-full h-full overflow-hidden">
              <div
                ref={lightboxScrollRef}
                className="w-full h-full overflow-x-auto overflow-y-hidden cursor-grab active:cursor-grabbing px-6 sm:px-8 py-6 sm:py-8"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                onMouseDown={handleLightboxMouseDown}
                onMouseMove={handleLightboxMouseMove}
                onMouseUp={handleLightboxMouseUp}
                onMouseLeave={handleLightboxMouseLeave}
              >
                <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>
                <div className="flex gap-4 sm:gap-6 h-full w-max items-center">
                  {lightboxImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="flex-shrink-0 flex items-center justify-center"
                      style={{ height: 'calc(90vh - 3rem)' }}
                    >
                      <div className="rounded-[16px] sm:rounded-[24px] overflow-hidden shadow-lg bg-gray-50">
                        <Image
                          src={img}
                          alt={`Image ${idx + 1}`}
                          width={1200}
                          height={1200}
                          className="object-contain w-auto select-none"
                          style={{ height: 'calc(90vh - 4rem)' }}
                          priority
                          draggable={false}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
