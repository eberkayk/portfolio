"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { client, urlFor } from "@/lib/sanity";
import { FEATURED_WORKS, ALL_WORKS } from "@/lib/queries";
import logoAnimation from "../../public/data.json";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => null,
});

type Work = {
  _id: string;
  title: string;
  slug?: {
    current?: string;
    _type?: string;
  };
  category: "illustration" | "ui/ux" | "animation" | string;
  featured?: boolean;
  image?: any;
  video?: string;
  description?: string;
  images?: any[];
  videos?: string[];
  createdAt?: string;
  order?: number;
};

const CATEGORIES: { key: string; label: string }[] = [
  { key: "all", label: "ALL WORKS" },
  { key: "illustration", label: "ILLUSTRATION" },
  { key: "ui/ux", label: "UI/UX" },
  { key: "animation", label: "ANIMATION" },
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

  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());
  const workCardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const [velocity, setVelocity] = useState(0);
  const animationRef = useRef<number | undefined>(undefined);
  const [isLightboxDragging, setIsLightboxDragging] = useState(false);
  const [lightboxStartX, setLightboxStartX] = useState(0);
  const [lightboxScrollLeft, setLightboxScrollLeft] = useState(0);

  const openModal = (work: Work) => {
    setSelected(work);
    if (work.slug?.current) {
      window.location.hash = work.slug.current;
    }
  };

  const closeModal = () => {
    setSelected(null);
    window.location.hash = "";
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setIsDragging(true);
    setStartX(e.pageX - container.offsetLeft);
    setScrollLeft(container.scrollLeft);
    setVelocity(0);

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    container.style.cursor = "grabbing";
    container.style.scrollBehavior = "auto";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2.5;

    setVelocity(walk - (container.scrollLeft - scrollLeft));
    container.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    const container = scrollContainerRef.current;
    if (!container) return; // ← Early return

    container.style.cursor = "grab";
    container.style.scrollBehavior = "smooth";

    let currentVelocity = velocity;
    const friction = 0.95;

    const animate = () => {
      if (Math.abs(currentVelocity) > 0.5) {
        currentVelocity *= friction;
        container.scrollLeft -= currentVelocity;
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (Math.abs(currentVelocity) > 1) {
      animate();
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      const container = scrollContainerRef.current;
      if (container) {
        container.style.cursor = "grab";
        container.style.scrollBehavior = "smooth";

        // Apply momentum on leave
        let currentVelocity = velocity;
        const friction = 0.95;

        const animate = () => {
          if (Math.abs(currentVelocity) > 0.5) {
            currentVelocity *= friction;
            container.scrollLeft -= currentVelocity;
            animationRef.current = requestAnimationFrame(animate);
          }
        };

        if (Math.abs(currentVelocity) > 1) {
          animate();
        }
      }
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
        setFeatured(f || []);
        setAllWorks(a || []);
      } catch (e) {
        console.error("Sanity fetch error:", e);
      }
    })();
  }, []);

  useEffect(() => {
    if (selected || lightboxImages.length > 0) {
      const scrollY = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.position = "fixed";
      document.body.style.width = "100%";

      return () => {
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [selected, lightboxImages]);
  useEffect(() => {
    if (lightboxImages.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevImage();
      } else if (e.key === "ArrowRight") {
        nextImage();
      } else if (e.key === "Escape") {
        closeLightbox();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxImages]);

  const filtered = useMemo(() => {
    const result =
      filter === "all"
        ? allWorks
        : allWorks.filter((w) => w.category === filter);
    return result;
  }, [filter, allWorks]);

  // Scroll animation for work cards - triggers every time
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("data-work-id");
          if (!id) return;

          if (entry.isIntersecting) {
            setVisibleCards((prev) => new Set([...prev, id]));
          } else {
            setVisibleCards((prev) => {
              const newSet = new Set(prev);
              newSet.delete(id);
              return newSet;
            });
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "50px 0px -50px 0px",
      }
    );

    const timer = setTimeout(() => {
      workCardsRef.current.forEach((card) => {
        if (card) observer.observe(card);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      workCardsRef.current.forEach((card) => {
        if (card) observer.unobserve(card);
      });
    };
  }, [filtered]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Reset visible cards when filter changes
  useEffect(() => {
    setVisibleCards(new Set());
    workCardsRef.current = [];
  }, [filter]);

  // Handle hash changes (open modal from URL)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");

      if (hash) {
        // Find work by slug
        const work = allWorks.find((w) => w.slug?.current === hash);
        if (work) {
          setSelected(work);
        }
      } else {
        setSelected(null);
      }
    };

    // Check hash on mount
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [allWorks]);

  const openLightbox = (images: any[], index: number) => {
    const imageUrls = images.map((img) =>
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
    setCurrentImageIndex((prev) =>
      prev < lightboxImages.length - 1 ? prev + 1 : 0
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : lightboxImages.length - 1
    );
  };

  const isModalScrollable =
    selected && selected.images && selected.images.length > 2;

  const [isAboutHovered, setIsAboutHovered] = useState(false);
  const lottieRef = useRef<any>(null);

  return (
    <div className="flex flex-col items-center bg-white text-black font-montserrat relative min-h-screen overflow-x-hidden">
      <Link
        href="/about"
        className={`fixed top-4 right-4 sm:top-6 sm:right-6 md:top-10 md:right-10 rounded-full bg-[#00B050] z-50 transition-all duration-500 cursor-pointer flex items-center justify-center shadow-lg overflow-hidden group ${
          isAboutHovered
            ? "w-[180px] h-14 sm:w-[220px] sm:h-16 md:w-[250px] md:h-[70px] pr-4"
            : "w-14 h-14 sm:w-16 sm:h-16 md:w-[70px] md:h-[70px]"
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
        <div
          className={`flex-shrink-0 transition-all duration-500 ${
            isAboutHovered
              ? "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
              : "w-[75%] h-[75%]"
          }`}
        >
          <Lottie
            lottieRef={lottieRef}
            animationData={logoAnimation}
            loop={true}
            autoplay={false}
            className="w-full h-full"
          />
        </div>

        <span
          className={`font-black text-[#003300] font-weight:900 text-sm sm:text-base md:text-lg whitespace-nowrap transition-all duration-500 ${
            isAboutHovered
              ? "opacity-100 translate-x-0 ml-3"
              : "opacity-0 translate-x-[-20px] ml-0 w-0"
          }`}
        >
          ABOUT ME
        </span>
      </Link>

      <section className="flex flex-col items-center text-center mt-20 sm:mt-24 md:mt-28 mb-12 sm:mb-16 px-4 w-full max-w-7xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-none tracking-tight text-[#191919]">
          ANIL EMMİLER
        </h1>
        <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl lg:text-2xl font-bold px-4 text-[#191919]">
          ISTANBUL BASED DESIGNER & ILLUSTRATOR
        </p>
        <a
          href="mailto:anilemmiler@gmail.com"
          className="mt-2 text-base sm:text-lg md:text-xl lg:text-2xl font-black text-[#26a95a] hover:text-[#063F14] transition-colors duration-300"
        >
          anilemmiler@gmail.com
        </a>
      </section>

      {/* 100px spacing */}
      <div className="h-[100px]"></div>

      <section className="w-full mb-[200px]">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#191919] text-center mb-12 px-4">
          FEATURED WORKS
        </h2>

        <div
          ref={scrollContainerRef}
          className="overflow-x-auto overflow-y-hidden px-4 sm:px-6 md:px-8 pb-6 cursor-grab select-none transition-all duration-300"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          <div className="flex gap-[100px] w-max">
            {featured.map((work) => (
              <div
                key={work._id}
                className="flex flex-col items-center flex-shrink-0"
              >
                <div className="w-[500px] h-[500px] rounded-3xl overflow-hidden shadow-lg pointer-events-none select-none">
                  {work.video ? (
                    <video
                      src={work.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="object-cover w-full h-full"
                    />
                  ) : work.image ? (
                    <Image
                      src={urlFor(work.image).width(1200).height(1200).url()}
                      alt={work.title}
                      width={1200}
                      height={1200}
                      className="object-cover w-full h-full pointer-events-none"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 grid place-items-center text-gray-500">
                      No Image
                    </div>
                  )}
                </div>
                <button
                  onClick={() => openModal(work)}
                  className="mt-4 px-6 py-2 bg-[#F8F8F8] text-[#191919] shadow-sm rounded-full font-semibold hover:bg-[#F8F8F8] transition-transform duration-300 hover:scale-110"
                >
                  {work.title}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full max-w-7xl mb-8 sm:mb-10 px-4 sm:px-6">
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setFilter(c.key)}
              className={`px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm md:text-base lg:text-lg font-bold rounded-full transition-all duration-300 ${
                filter === c.key
                  ? "bg-[#26a95a] text-[#063F14]"
                  : "bg-[#8ad6a8] text-[#063F14] hover:bg-[#6FC491] hover:scale-105"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      <section className="w-full max-w-7xl mb-16 sm:mb-20 md:mb-24 px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-16 lg:gap-[100px] justify-items-center">
          {filtered.map((w, index) => (
            <div
              key={w._id}
              ref={(el) => {
                workCardsRef.current[index] = el;
              }}
              data-work-id={w._id}
              className={`w-[300px] h-[300px] rounded-2xl overflow-visible bg-transparent shadow-lg cursor-pointer relative group transition-all duration-1000 ease-out ${
                visibleCards.has(w._id)
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-75 translate-y-16"
              }`}
            >
              {/* Stack Effect - Show actual images if multiple */}
              {w.images && w.images.length >= 3 && (
                <>
                  {/* Third layer (3rd image) */}
                  <div
                    className="absolute top-0 left-0 w-[300px] h-[300px] rounded-2xl shadow-md overflow-hidden"
                    style={{
                      transform: "translate(16px, 16px)",
                      zIndex: 1,
                    }}
                  >
                    <Image
                      src={urlFor(w.images[2]).width(1200).height(1200).url()}
                      alt=""
                      width={1200}
                      height={1200}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Second layer (2nd image) */}
                  <div
                    className="absolute top-0 left-0 w-[300px] h-[300px] rounded-2xl shadow-lg overflow-hidden"
                    style={{
                      transform: "translate(8px, 8px)",
                      zIndex: 2,
                    }}
                  >
                    <Image
                      src={urlFor(w.images[1]).width(1200).height(1200).url()}
                      alt=""
                      width={1200}
                      height={1200}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </>
              )}

              {w.images && w.images.length === 2 && (
                <>
                  {/* Second layer (2nd image) */}
                  <div
                    className="absolute top-0 left-0 w-[300px] h-[300px] rounded-2xl shadow-lg overflow-hidden"
                    style={{
                      transform: "translate(8px, 8px)",
                      zIndex: 2,
                    }}
                  >
                    <Image
                      src={urlFor(w.images[1]).width(1200).height(1200).url()}
                      alt=""
                      width={1200}
                      height={1200}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </>
              )}

              {/* Main image container (1st image or cover) */}
              <div
                onClick={() => openModal(w)}
                className="absolute inset-0 z-10"
              />
              <div
                className="relative w-full h-full rounded-2xl overflow-hidden bg-white"
                style={{ zIndex: 3 }}
              >
                {w.video ? (
                  <>
                    <video
                      src={w.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/[0.35] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <h3 className="text-white text-lg sm:text-xl font-bold px-4 text-center">
                        {w.title}
                      </h3>
                    </div>
                  </>
                ) : w.image ? (
                  <>
                    <Image
                      src={urlFor(w.image).width(1200).height(1200).url()}
                      alt={w.title}
                      width={1200}
                      height={1200}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/[0.35] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <h3 className="text-white text-lg sm:text-xl font-bold px-4 text-center">
                        {w.title}
                      </h3>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="w-full bg-[#00B050] text-center py-12 sm:py-14 md:py-16 text-white mt-10 px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-8 sm:mb-10 md:mb-12 text-[#191919]">
          CONTACTS
        </h2>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 text-base sm:text-lg md:text-xl lg:text-2xl font-black">
          <a
            href="https://www.instagram.com/anilemmiler?igsh=MWpkdDN3Z2V6cmh6OA%3D%3D&utm_source=qr"
            className="hover:text-[#063F14] hover:scale-110 transition-all duration-300"
          >
            INSTAGRAM
          </a>
          <a
            href="https://dribbble.com/anilemmiler"
            className="hover:text-[#063F14] hover:scale-110 transition-all duration-300"
          >
            DRIBBBLE
          </a>
          <a
            href="https://www.behance.net/anilemmiler"
            className="hover:text-[#063F14] hover:scale-110 transition-all duration-300"
          >
            BEHANCE
          </a>
          <a
            href="https://open.spotify.com/artist/02btoKVtot82NXrfZwnTUt?si=WjxjhlBcSF6e-ar25_Q6FQ"
            className="hover:text-[#063F14] hover:scale-110 transition-all duration-300"
          >
            SPOTIFY
          </a>
        </div>
        <p className="mt-8 sm:mt-10 text-xs sm:text-sm font-semibold text-[#191919]">
          © ANIL EMMİLER 2026
        </p>
      </footer>

      {/* WORK DETAIL MODAL */}
      {selected && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-[30px]">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />

          <div
            className="relative bg-white rounded-[24px] sm:rounded-[40px] shadow-2xl w-full max-w-[95vw] h-[90vh] z-10 overflow-hidden"
            onWheel={(e) => {
              e.stopPropagation();
            }}
          >
            <style jsx global>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
              .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
              .custom-scrollbar::-webkit-scrollbar {
                width: 8px;
                height: 8px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 10px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #00b050;
                border-radius: 10px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #00693a;
              }
              .custom-scrollbar {
                scrollbar-width: thin;
                scrollbar-color: #00b050 #f1f1f1;
              }
            `}</style>

            <button
              onClick={closeModal}
              className="absolute top-4 right-4 sm:top-[30px] sm:right-[30px] w-12 h-12 sm:w-[60px] sm:h-[60px] flex items-center justify-center font-extralight hover:font-extralight text-black hover:text-black text-5xl sm:text-7xl leading-none z-20 bg-gray-100 hover:bg-gray-200 rounded-full transition-all hover:scale-110"
            >
              ×
            </button>

            <div className="h-full overflow-y-auto px-4 sm:px-8 md:px-12 lg:px-20 py-4 sm:py-6 scrollbar-hide">
              {/* Title & Description */}
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

              {/* Videos Section - ALWAYS FIRST IF EXISTS */}
              {selected.videos && selected.videos.length > 0 && (
                <div className="w-full space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                  {selected.videos.map((videoUrl: string, idx: number) => (
                    <div
                      key={`video-${idx}`}
                      className="w-full max-w-4xl mx-auto rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-lg"
                    >
                      <video
                        src={videoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-auto"
                        style={{ maxHeight: "70vh" }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Single image */}
              {((selected.image &&
                (!selected.images || selected.images.length === 0)) ||
                (selected.images && selected.images.length === 1)) && (
                <div className="w-full flex justify-center items-center mb-6 sm:mb-8">
                  <div
                    className="rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-lg cursor-pointer w-full max-w-[90vw] sm:max-w-[min(65vh,650px)] aspect-square"
                    onClick={() => {
                      const imageToShow =
                        selected.images && selected.images.length === 1
                          ? selected.images[0]
                          : selected.image;
                      if (imageToShow) {
                        openLightbox([imageToShow], 0);
                      }
                    }}
                  >
                    {(() => {
                      const imageToShow =
                        selected.images && selected.images.length === 1
                          ? selected.images[0]
                          : selected.image;
                      return imageToShow ? (
                        <Image
                          src={urlFor(imageToShow)
                            .width(1200)
                            .height(1200)
                            .quality(90)
                            .url()}
                          alt={selected.title || "Work image"}
                          width={1200}
                          height={1200}
                          className="object-cover w-full h-full"
                          priority
                        />
                      ) : null;
                    })()}
                  </div>
                </div>
              )}

              {/* Two images */}
              {selected.images && selected.images.length === 2 && (
                <div className="mb-6 sm:mb-8">
                  {/* Mobile: Horizontal scroll with peek */}
                  <div className="sm:hidden w-full overflow-x-auto scrollbar-hide">
                    <div className="flex gap-4 w-max pl-4 pr-4">
                      {selected.images.map((img: any, idx: number) => (
                        <div
                          key={idx}
                          className="rounded-[24px] overflow-hidden shadow-lg cursor-pointer aspect-square flex-shrink-0"
                          style={{ width: "calc(90vw - 40px)" }}
                          onClick={() => openLightbox(selected.images!, idx)}
                        >
                          <Image
                            src={urlFor(img)
                              .width(1200)
                              .height(1200)
                              .quality(100)
                              .url()}
                            alt={`${selected.title} ${idx + 1}`}
                            width={1200}
                            height={1200}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Desktop: Side by side square, fit screen */}
                  <div className="hidden sm:flex w-full justify-center items-center gap-6">
                    {selected.images.map((img: any, idx: number) => (
                      <div
                        key={idx}
                        className="rounded-[32px] overflow-hidden shadow-lg cursor-pointer aspect-square"
                        style={{ width: "min(calc(55vh), 500px)" }}
                        onClick={() => openLightbox(selected.images!, idx)}
                      >
                        <Image
                          src={urlFor(img)
                            .width(1200)
                            .height(1200)
                            .quality(100)
                            .url()}
                          alt={`${selected.title} ${idx + 1}`}
                          width={1200}
                          height={1200}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Multiple images (3+) */}
              {selected.images && selected.images.length > 2 && (
                <>
                  {/* Mobile: Alternating grid (2-1-2-1 pattern) */}
                  <div className="sm:hidden w-full space-y-4 px-4">
                    {selected.images.map((img: any, idx: number) => {
                      const position = idx % 3;

                      if (position === 0 || position === 1) {
                        if (idx === 0 || idx % 3 === 0) {
                          return (
                            <div
                              key={`row-${idx}`}
                              className="grid grid-cols-2 gap-4"
                            >
                              {selected.images
                                ?.slice(idx, idx + 2)
                                .map((img: any, subIdx: number) => (
                                  <div
                                    key={idx + subIdx}
                                    className="rounded-[20px] overflow-hidden shadow-lg cursor-pointer aspect-square"
                                    onClick={() =>
                                      openLightbox(
                                        selected.images!,
                                        idx + subIdx
                                      )
                                    }
                                  >
                                    <Image
                                      src={urlFor(img)
                                        .width(1200)
                                        .height(1200)
                                        .quality(100)
                                        .url()}
                                      alt={`${selected.title} ${idx + subIdx + 1}`}
                                      width={1200}
                                      height={1200}
                                      className="object-cover w-full h-full"
                                    />
                                  </div>
                                ))}
                            </div>
                          );
                        }
                        return null;
                      } else {
                        return (
                          <div
                            key={idx}
                            className="rounded-[20px] overflow-hidden shadow-lg cursor-pointer aspect-[16/9] w-full"
                            onClick={() => openLightbox(selected.images!, idx)}
                          >
                            <Image
                              src={urlFor(img)
                                .width(1200)
                                .height(1200)
                                .quality(100)
                                .url()}
                              alt={`${selected.title} ${idx + 1}`}
                              width={1200}
                              height={1200}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        );
                      }
                    })}
                  </div>

                  {/* Desktop: Alternating grid (2-1-2-1 pattern) */}
                  <div className="hidden sm:block w-full space-y-6 max-w-5xl mx-auto">
                    {selected.images?.map((img: any, idx: number) => {
                      const position = idx % 3;

                      if (position === 0 || position === 1) {
                        if (idx === 0 || idx % 3 === 0) {
                          return (
                            <div
                              key={`row-${idx}`}
                              className="grid grid-cols-2 gap-6"
                            >
                              {selected.images
                                ?.slice(idx, idx + 2)
                                .map((img: any, subIdx: number) => (
                                  <div
                                    key={idx + subIdx}
                                    className="rounded-[32px] overflow-hidden shadow-lg cursor-pointer aspect-square"
                                    onClick={() =>
                                      openLightbox(
                                        selected.images!,
                                        idx + subIdx
                                      )
                                    }
                                  >
                                    <Image
                                      src={urlFor(img)
                                        .width(1200)
                                        .height(1200)
                                        .quality(100)
                                        .url()}
                                      alt={`${selected.title} ${idx + subIdx + 1}`}
                                      width={1200}
                                      height={1200}
                                      className="object-cover w-full h-full"
                                    />
                                  </div>
                                ))}
                            </div>
                          );
                        }
                        return null;
                      } else {
                        return (
                          <div
                            key={idx}
                            className="rounded-[32px] overflow-hidden shadow-lg cursor-pointer aspect-[16/9] w-full"
                            onClick={() => openLightbox(selected.images!, idx)}
                          >
                            <Image
                              src={urlFor(img)
                                .width(1400)
                                .height(788)
                                .quality(90)
                                .url()}
                              alt={`${selected.title} ${idx + 1}`}
                              width={1400}
                              height={788}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        );
                      }
                    })}
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
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 sm:top-[30px] sm:right-[30px] w-12 h-12 sm:w-[60px] sm:h-[60px] flex items-center justify-center font-extralight hover:font-extralight text-black hover:text-black text-5xl sm:text-7xl leading-none z-20 bg-gray-100 hover:bg-gray-200 rounded-full transition-all hover:scale-110"
            >
              ×
            </button>

            {/* Scrollable Images Container */}
            <div className="relative w-full h-full overflow-hidden">
              <div
                ref={lightboxScrollRef}
                className={`w-full h-full overflow-x-auto overflow-y-hidden px-6 sm:px-8 py-6 sm:py-8 ${
                  lightboxImages.length === 1
                    ? "flex items-center justify-center"
                    : "cursor-grab active:cursor-grabbing"
                }`}
                style={{
                  scrollBehavior: isLightboxDragging ? "auto" : "smooth",
                }}
                onMouseDown={
                  lightboxImages.length > 1
                    ? handleLightboxMouseDown
                    : undefined
                }
                onMouseMove={
                  lightboxImages.length > 1
                    ? handleLightboxMouseMove
                    : undefined
                }
                onMouseUp={
                  lightboxImages.length > 1 ? handleLightboxMouseUp : undefined
                }
                onMouseLeave={
                  lightboxImages.length > 1
                    ? handleLightboxMouseLeave
                    : undefined
                }
              >
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>

                {lightboxImages.length === 1 ? (
                  // Single image - centered
                  <div className="flex items-center justify-center h-full">
                    <div className="rounded-[16px] sm:rounded-[24px] overflow-hidden shadow-lg bg-gray-50">
                      <Image
                        src={lightboxImages[0]}
                        alt="Image"
                        width={1200}
                        height={1200}
                        className="object-contain w-auto select-none"
                        style={{
                          maxHeight: "calc(90vh - 8rem)",
                          maxWidth: "calc(95vw - 4rem)",
                        }}
                        priority
                        draggable={false}
                      />
                    </div>
                  </div>
                ) : (
                  // Multiple images - scrollable
                  <div className="flex gap-4 sm:gap-6 h-full w-max items-center">
                    {lightboxImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="flex-shrink-0 flex items-center justify-center"
                        style={{ height: "calc(90vh - 3rem)" }}
                      >
                        <div className="rounded-[16px] sm:rounded-[24px] overflow-hidden shadow-lg bg-gray-50">
                          <Image
                            src={img}
                            alt={`Image ${idx + 1}`}
                            width={1200}
                            height={1200}
                            className="object-contain w-auto select-none"
                            style={{ height: "calc(90vh - 4rem)" }}
                            priority
                            draggable={false}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
