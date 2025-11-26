import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Products - Premium Furniture Collection',
  description: 'Browse our premium furniture collection including living room, bedroom, dining room, and office furniture. Quality craftsmanship and custom designs. Shop luxury furniture pieces handcrafted with excellence.',
  keywords: ['furniture catalog', 'buy furniture online', 'premium furniture', 'living room furniture', 'bedroom furniture', 'office furniture', 'dining furniture', 'custom furniture pieces'],
  openGraph: {
    title: 'Products - Premium Furniture Collection | Giya Enjoy Living',
    description: 'Browse our premium furniture collection including living room, bedroom, dining room, and office furniture.',
    url: 'https://giya-frontend.vercel.app/products',
    type: 'website',
  },
  alternates: {
    canonical: 'https://giya-frontend.vercel.app/products',
  },
}

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
