import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects Portfolio - Interior Design Projects | Giya Enjoy Living',
  description: 'View our completed interior design and furniture projects. Residential, commercial, and hospitality design solutions.',
  openGraph: {
    title: 'Projects Portfolio - Interior Design Projects | Giya Enjoy Living',
    description: 'View our completed interior design and furniture projects. Residential, commercial, and hospitality design solutions.',
    url: 'https://www.giyaenjoyliving.com/projects',
  },
  alternates: {
    canonical: 'https://www.giyaenjoyliving.com/projects',
  },
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
