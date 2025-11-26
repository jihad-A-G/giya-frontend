import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us - Get a Quote',
  description: 'Contact Giya Enjoy Living for furniture inquiries, interior design consultations, and custom project quotes. Visit our showroom or schedule a factory tour. Free design consultation available.',
  keywords: ['contact furniture store', 'furniture quote', 'design consultation', 'showroom visit', 'factory tour', 'furniture inquiry', 'get quote'],
  openGraph: {
    title: 'Contact Us - Get a Quote | Giya Enjoy Living',
    description: 'Contact Giya Enjoy Living for furniture inquiries, interior design consultations, and custom project quotes.',
    url: 'https://giya-frontend.vercel.app/contact',
    type: 'website',
  },
  alternates: {
    canonical: 'https://giya-frontend.vercel.app/contact',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
