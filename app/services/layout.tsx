import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services - Furniture Manufacturing & Interior Design',
  description: 'Professional furniture manufacturing, interior design, and custom furniture services. Complete project management from concept to completion. Factory-direct pricing and quality assurance.',
  keywords: ['furniture manufacturing services', 'interior design services', 'custom furniture maker', 'bespoke furniture design', 'furniture factory', 'design consultation', 'project management'],
  openGraph: {
    title: 'Services - Furniture Manufacturing & Interior Design | Giya Enjoy Living',
    description: 'Professional furniture manufacturing, interior design, and custom furniture services.',
    url: 'https://giya-frontend.vercel.app/services',
    type: 'website',
  },
  alternates: {
    canonical: 'https://giya-frontend.vercel.app/services',
  },
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
