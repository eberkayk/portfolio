import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { client } from '@/lib/sanity'

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
    ogImage
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
    ? `https://cdn.sanity.io/images/f4lzq01e/production/${work.ogImage.asset._ref.replace('image-', '').replace('-png', '.png').replace('-jpg', '.jpg')}?w=1200&h=630`
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
  
  // Redirect to homepage with hash (modal will open)
  redirect(`/#${slug}`)
}