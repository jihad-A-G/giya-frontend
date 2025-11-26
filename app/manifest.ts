import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Giya Enjoy Living - Premium Furniture & Interior Design',
    short_name: 'Giya Living',
    description: 'Premium furniture manufacturing, interior design projects, and showroom. Creating beautiful living spaces with quality craftsmanship.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#a45a52',
    icons: [
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
