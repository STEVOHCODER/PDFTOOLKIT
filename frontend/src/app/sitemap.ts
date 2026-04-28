import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mediatoolkit.tech'

  const routes = [
    '',
    '/about',
    '/contact',
    '/how-to',
    '/privacy',
    '/terms',
    '/tools/merge',
    '/tools/split',
    '/tools/extract',
    '/tools/convert',
    '/tools/compress',
    '/tools/compress-image',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))
}
