import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { client, urlFor } from "@/lib/sanity";

type Props = {
  params: Promise<{ slug: string }>;
};

type Work = {
  _id: string;
  title: string;
  slug?: { current: string };
  category: string;
  description?: string;
  image?: any;
  images?: any[];
  ogImage?: any;
};

async function getWork(slug: string): Promise<Work | null> {
  const query = `*[_type == "work" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    category,
    description,
    image,
    images,
    ogImage
  }`;

  return await client.fetch(query, { slug });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const work = await getWork(slug);

  if (!work) {
    return {
      title: "Work Not Found",
    };
  }

  // Determine OG image with fallback chain
  let ogImageUrl = "https://anilemmiler.com/og-image.jpg";

  if (work.ogImage) {
    ogImageUrl = urlFor(work.ogImage).width(1200).height(630).quality(90).url();
  } else if (work.images && work.images.length > 0) {
    ogImageUrl = urlFor(work.images[0])
      .width(1200)
      .height(630)
      .quality(90)
      .url();
  } else if (work.image) {
    ogImageUrl = urlFor(work.image).width(1200).height(630).quality(90).url();
  }

  return {
    title: `${work.title} - Anıl Emmiler`,
    description:
      work.description || `${work.title} - ${work.category} by Anıl Emmiler`,
    openGraph: {
      title: `${work.title} - Anıl Emmiler`,
      description: work.description || `${work.title} by Anıl Emmiler`,
      url: `https://anilemmiler.com/work/${slug}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${work.title} - ${work.category}`,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${work.title} - Anıl Emmiler`,
      description: work.description || `${work.title} by Anıl Emmiler`,
      images: [ogImageUrl],
    },
  };
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params;
  const work = await getWork(slug);

  if (!work) {
    notFound();
  }

  // Return a client component that handles redirect
  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content={`0; url=/#${slug}`} />
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.location.href = '/#${slug}';`,
          }}
        />
        <p>Redirecting...</p>
      </body>
    </html>
  );
}
