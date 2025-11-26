import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects Portfolio - Interior Design Projects',
  description: 'View our completed interior design and furniture projects. Residential, commercial, and hospitality design solutions. Explore stunning transformations and expert craftsmanship.',
  keywords: ['interior design portfolio', 'furniture projects', 'residential design', 'commercial design', 'hospitality design', 'design case studies', 'furniture installation'],
  openGraph: {
    title: 'Projects Portfolio - Interior Design Projects | Giya Enjoy Living',
    description: 'View our completed interior design and furniture projects. Residential, commercial, and hospitality design solutions.',
    url: 'https://giya-frontend.vercel.app/projects',
    type: 'website',
  },
  alternates: {
    canonical: 'https://giya-frontend.vercel.app/projects',
  },
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
