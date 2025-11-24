import type { Metadata } from "next";
import { Geist, Geist_Mono, Satisfy } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const satisfy = Satisfy({
  variable: "--font-satisfy",
  subsets: ["latin"],
  weight: ["400"],
  
});

export const metadata: Metadata = {
  title: "Giya Enjoy Living - Furniture Manufacturing & Interior Design",
  description: "Premium furniture manufacturing, interior design projects, and showroom. Creating beautiful living spaces with quality craftsmanship.",
  keywords: ["furniture manufacturing", "interior design", "custom furniture", "furniture showroom", "home furniture", "office furniture"],
  authors: [{ name: "Giya Enjoy Living" }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.giyaenjoyliving.com',
    title: 'Giya Enjoy Living - Furniture Manufacturing & Interior Design',
    description: 'Premium furniture manufacturing, interior design projects, and showroom. Creating beautiful living spaces with quality craftsmanship.',
    siteName: 'Giya Enjoy Living',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Giya Enjoy Living - Furniture Manufacturing & Interior Design',
    description: 'Premium furniture manufacturing, interior design projects, and showroom. Creating beautiful living spaces with quality craftsmanship.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your Google Search Console verification code here when you get it
    // google: 'your-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    "name": "Giya Enjoy Living",
    "description": "Premium furniture manufacturing, interior design projects, and showroom",
    "url": "https://www.giyaenjoyliving.com",
    "logo": "https://www.giyaenjoyliving.com/logo.png",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "sameAs": [
      // Add your social media URLs here when available
      // "https://www.facebook.com/giyaenjoyliving",
      // "https://www.instagram.com/giyaenjoyliving",
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${satisfy.variable} antialiased`} suppressHydrationWarning={true}>
        <div className="flex min-h-screen">
          <div className="relative z-50">
            <Navbar />
          </div>
          <main className="flex-1">
            {children}
            <Footer />
          </main>
        </div>
      </body>
    </html>
  );
}
