// src/app/work/[slug]/page.tsx
import Image from "next/image";

interface WorkDetailProps {
  params: {
    slug: string;
  };
}

export default function WorkDetail({ params }: WorkDetailProps) {
  // Normalde bu bilgileri Sanity'den çekeceğiz.
  // Şimdilik mock data:
  const work = {
    title: "PARK",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc et malesuada erat. In non turpis ultrices, semper orci a, dapibus nunc. Praesent sagittis consequat ipsum vitae dictum.",
    date: "April 2020",
    tool: "Adobe Illustrator",
    images: ["/works/work1.png", "/works/work2.png", "/works/work3.png"],
  };

  return (
    <main className="min-h-screen px-6 md:px-20 py-12">
      {/* Başlık */}
      <section className="text-center max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-extrabold">{work.title}</h1>
        <p className="mt-3 text-gray-600">{work.description}</p>
        <p className="mt-2 text-sm text-gray-500">
          {work.tool} / {work.date}
        </p>
      </section>

      {/* Görseller */}
      <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {work.images.map((src, index) => (
          <div
            key={index}
            className="rounded-xl overflow-hidden shadow-lg bg-white"
          >
            <Image
              src={src}
              alt={`Work image ${index + 1}`}
              width={1000}
              height={800}
              className="w-full h-auto object-cover"
            />
          </div>
        ))}
      </section>
    </main>
  );
}
// Not: Gerçek projede, `params.slug` kullanarak Sanity'den ilgili işi çekersiniz.