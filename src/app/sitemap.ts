import { MetadataRoute } from 'next'
import { client } from '@/lib/sanity'

async function getWorks() {
  const query = `*[_type == "work"] {
    "slug": slug.current,
    _updatedAt
  }`
  return await client.fetch(query)
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const works = await getWorks()

  const workUrls = works.map((work: any) => ({
    url: `https://anilemmiler.com/work/${work.slug}`,
    lastModified: new Date(work._updatedAt || new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: 'https://anilemmiler.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://anilemmiler.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...workUrls,
  ]
}