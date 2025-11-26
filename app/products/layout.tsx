import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Products - Premium Furniture Collection | Giya Enjoy Living',
  description: 'Browse our premium furniture collection including living room, bedroom, dining room, and office furniture. Quality craftsmanship and custom designs.',
  openGraph: {
    title: 'Products - Premium Furniture Collection | Giya Enjoy Living',
    description: 'Browse our premium furniture collection including living room, bedroom, dining room, and office furniture.',
    url: 'https://www.giyaenjoyliving.com/products',
  },
  alternates: {
    canonical: 'https://www.giyaenjoyliving.com/products',
  },
}

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
