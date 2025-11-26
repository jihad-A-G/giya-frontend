import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services - Furniture Manufacturing & Interior Design | Giya Enjoy Living',
  description: 'Professional furniture manufacturing, interior design, and custom furniture services. Complete project management from concept to completion.',
  openGraph: {
    title: 'Services - Furniture Manufacturing & Interior Design | Giya Enjoy Living',
    description: 'Professional furniture manufacturing, interior design, and custom furniture services.',
    url: 'https://www.giyaenjoyliving.com/services',
  },
  alternates: {
    canonical: 'https://www.giyaenjoyliving.com/services',
  },
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
