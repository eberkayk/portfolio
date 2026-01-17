import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { client, urlFor } from '@/lib/sanity'

type Props = {
  params: Promise<{ slug: string }>
}

async function getWork(slug: string) {
  const query = `*[_type == "work" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    category,
    description,
    image,
    ogImage,
    images
  }`
  
  return await client.fetch(query, { slug })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const work = await getWork(slug)

  if (!work) {
    return {
      title: 'Work Not Found',
    }
  }

  const ogImageUrl = work.ogImage 
    ? urlFor(work.ogImage).width(1200).height(630).quality(90).url()
    : work.image
    ? urlFor(work.image).width(1200).height(630).quality(90).url()
    : 'https://anilemmiler.com/og-image.jpg'

  return {
    title: `${work.title} - Anıl Emmiler`,
    description: work.description || `${work.title} - ${work.category} by Anıl Emmiler`,
    openGraph: {
      title: `${work.title} - Anıl Emmiler`,
      description: work.description || `${work.title} by Anıl Emmiler`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${work.title} - ${work.category}`,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${work.title} - Anıl Emmiler`,
      description: work.description || `${work.title} by Anıl Emmiler`,
      images: [ogImageUrl],
    },
  }
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params
  const work = await getWork(slug)

  if (!work) {
    notFound()
  }

  // Redirect to homepage with hash
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.location.href = '/#${slug}'`,
      }}
    />
  )
}