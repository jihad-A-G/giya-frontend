import type { Metadata } from "next";
import { Geist, Geist_Mono, Satisfy } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";

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
  metadataBase: new URL('https://giya-frontend.vercel.app'),
  title: {
    default: "Giya Enjoy Living - Premium Furniture Manufacturing & Interior Design",
    template: "%s | Giya Enjoy Living"
  },
  description: "Premium furniture manufacturing, interior design projects, and showroom. Creating beautiful living spaces with quality craftsmanship since 1985. Custom furniture solutions for residential and commercial spaces.",
  keywords: [
    "furniture manufacturing", 
    "interior design", 
    "custom furniture", 
    "furniture showroom", 
    "home furniture", 
    "office furniture",
    "luxury furniture",
    "bespoke furniture",
    "residential design",
    "commercial furniture",
    "handcrafted furniture"
  ],
  authors: [{ name: "Giya Enjoy Living", url: "https://giya-frontend.vercel.app" }],
  creator: "Giya Enjoy Living",
  publisher: "Giya Enjoy Living",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://giya-frontend.vercel.app',
    title: 'Giya Enjoy Living - Premium Furniture Manufacturing & Interior Design',
    description: 'Premium furniture manufacturing, interior design projects, and showroom. Creating beautiful living spaces with quality craftsmanship since 1985.',
    siteName: 'Giya Enjoy Living',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Giya Enjoy Living Logo',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Giya Enjoy Living - Premium Furniture Manufacturing & Interior Design',
    description: 'Premium furniture manufacturing, interior design projects, and showroom. Creating beautiful living spaces with quality craftsmanship.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://giya-frontend.vercel.app',
  },
  verification: {
    // Add your Google Search Console verification code here when you get it
    // google: 'your-verification-code',
  },
  category: 'Furniture & Interior Design',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["FurnitureStore", "LocalBusiness", "Organization"],
    "name": "Giya Enjoy Living",
    "description": "Premium furniture manufacturing, interior design projects, and showroom. Creating beautiful living spaces with quality craftsmanship since 1985.",
    "url": "https://giya-frontend.vercel.app",
    "logo": {
      "@type": "ImageObject",
      "url": "https://giya-frontend.vercel.app/logo.png",
      "width": "200",
      "height": "200"
    },
    "image": "https://giya-frontend.vercel.app/logo.png",
    "telephone": "+1-555-123-4567",
    "email": "info@giyaenjoyliving.com",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US",
      "addressLocality": "California",
      "addressRegion": "CA"
    },
    "priceRange": "$$$",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "19:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "18:00"
      }
    ],
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "sameAs": [
      // Add your social media URLs here when available
      // "https://www.facebook.com/giyaenjoyliving",
      // "https://www.instagram.com/giyaenjoyliving",
      // "https://www.linkedin.com/company/giyaenjoyliving"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Furniture & Design Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Custom Furniture Manufacturing"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Interior Design Services"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Premium Furniture Collection"
          }
        }
      ]
    }
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
        <LoadingScreen />
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
