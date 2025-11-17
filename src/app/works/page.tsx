"use client";
import GalleryGrid from "@/components/GalleryGrid";
import PageTransition from "@/components/PageTransition";

export default function WorksPage() {
  return (
    <PageTransition routeKey="works">
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-16">
        My Works
        </h1>

        <p className="text-center opacity-70 mb-12">
          A selection of projects showcasing design, development, and
          interactive experiments.
        </p>
        <GalleryGrid />
      </section>
    </PageTransition>
  );
}
