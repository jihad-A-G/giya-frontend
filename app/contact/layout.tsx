import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us - Get a Quote | Giya Enjoy Living',
  description: 'Contact Giya Enjoy Living for furniture inquiries, interior design consultations, and custom project quotes. Visit our showroom or schedule a factory tour.',
  openGraph: {
    title: 'Contact Us - Get a Quote | Giya Enjoy Living',
    description: 'Contact Giya Enjoy Living for furniture inquiries, interior design consultations, and custom project quotes.',
    url: 'https://www.giyaenjoyliving.com/contact',
  },
  alternates: {
    canonical: 'https://www.giyaenjoyliving.com/contact',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
