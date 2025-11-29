"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Product {
  _id: string;
  name: string;
  category?: string | null;
  price?: string | null;
  image?: string | null;
  images?: string[] | null;
  video?: string | null;
  description?: string | null;
  features?: string[] | null;
  sizes?: string[] | null;
  colors?: string[] | null;
  availability?: string | null;
  specifications?: Record<string, string> | null;
}

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        
        setProduct(data);
        
        // Set default selections
        if (data.sizes && Array.isArray(data.sizes) && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
        if (data.colors && Array.isArray(data.colors) && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a45a52] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error || 'Product not found'}</p>
          <button
            onClick={() => router.push('/products')}
            className="px-6 py-3 bg-[#a45a52] text-white rounded-md hover:bg-[#8a4a44] transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const displayImages = (() => {
    const images: string[] = [];
    
    // Add main image first if it exists
    if (product.image) {
      images.push(`${API_URL}${product.image}`);
    }
    
    // Add gallery images if they exist
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      product.images.forEach(img => {
        const fullPath = `${API_URL}${img}`;
        // Avoid duplicates if main image is also in gallery
        if (!images.includes(fullPath)) {
          images.push(fullPath);
        }
      });
    }
    
    return images;
  })();
  
  const availabilityColors = {
    'in-stock': 'text-green-600',
    'out-of-stock': 'text-red-600',
    'pre-order': 'text-yellow-600',
  };

  const availabilityText = {
    'in-stock': 'In Stock',
    'out-of-stock': 'Out of Stock',
    'pre-order': 'Pre-Order',
  };

  // Generate Product Schema based on product data
  const generateProductSchema = () => {
    if (!product) return null;

    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": product.description || `${product.name} - Premium furniture by Giya Enjoy Living`,
      "brand": {
        "@type": "Brand",
        "name": "Giya Enjoy Living"
      },
      "image": displayImages.length > 0 ? displayImages : undefined,
      "offers": {
        "@type": "Offer",
        "url": `${typeof window !== 'undefined' ? window.location.href : ''}`,
        "priceCurrency": "USD",
        "price": product.price ? parseFloat(product.price.replace(/[^0-9.]/g, '')) : undefined,
        "availability": product.availability === 'in-stock' 
          ? "https://schema.org/InStock" 
          : product.availability === 'out-of-stock'
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/PreOrder",
        "seller": {
          "@type": "Organization",
          "name": "Giya Enjoy Living"
        }
      },
      "category": product.category || "Furniture",
      "sku": product._id
    };

    // Remove undefined fields
    return JSON.parse(JSON.stringify(schema));
  };

  // Generate Breadcrumb Schema
  const generateBreadcrumbSchema = () => {
    if (!product) return null;

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://giya-frontend.vercel.app';

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": baseUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Products",
          "item": `${baseUrl}/products`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": product.name,
          "item": `${baseUrl}/products/${product._id}`
        }
      ]
    };

    return breadcrumbSchema;
  };

  const productSchema = generateProductSchema();
  const breadcrumbSchema = generateBreadcrumbSchema();

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Product Schema Markup */}
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}

      {/* Breadcrumb Schema Markup */}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}

      {/* Back Button */}
      <div className="bg-white shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4">
          <button
            onClick={() => router.push('/products')}
            className="flex items-center text-gray-600 hover:text-[#a45a52] transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Products
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Images and Video */}
          <div>
            {/* Main Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden mb-4"
            >
              <div className="relative h-96 md:h-[500px]">
                {displayImages.length > 0 && (
                  <img
                    src={displayImages[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </motion.div>

            {/* Image Thumbnails */}
            {displayImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4 mb-6">
                {displayImages.map((img, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-24 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                      selectedImage === index ? 'border-[#a45a52]' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Video Player */}
            {product.video && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <video
                  controls
                  className="w-full h-64 md:h-80"
                  poster={product.image || undefined}
                >
                  <source src={product.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </motion.div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Product Name and Price  */}
              <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
              <div className="flex items-center justify-between mb-6">
                {product.price && <p className="text-4xl font-bold" style={{ color: '#a45a52' }}>{product.price}</p>}
                {product.availability && (
                  <span className={`text-lg font-semibold ${availabilityColors[product.availability as keyof typeof availabilityColors]}`}>
                    {availabilityText[product.availability as keyof typeof availabilityText]}
                  </span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div className="text-gray-600 text-lg mb-8 leading-relaxed">
                  <p className="mb-4">{product.description}</p>
                  <p className="text-sm text-gray-500">
                    Need help choosing the right piece? Explore our{" "}
                    <Link href="/services" className="text-[#a45a52] hover:underline font-medium">
                      interior design services
                    </Link>
                    {" "}or browse{" "}
                    <Link href="/products" className="text-[#a45a52] hover:underline font-medium">
                      our full collection
                    </Link>
                    . See how we&apos;ve styled similar pieces in our{" "}
                    <Link href="/projects" className="text-[#a45a52] hover:underline font-medium">
                      completed projects
                    </Link>.
                  </p>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Select Size:</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-6 py-3 rounded-md font-medium transition-all ${
                          selectedSize === size
                            ? 'text-white shadow-lg'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        style={selectedSize === size ? { backgroundColor: '#a45a52' } : {}}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors && Array.isArray(product.colors) && product.colors.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Select Color:</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-6 py-3 rounded-md font-medium transition-all ${
                          selectedColor === color
                            ? 'text-white shadow-lg'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        style={selectedColor === color ? { backgroundColor: '#a45a52' } : {}}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                <Link
                  href="/contact"
                  className="flex-1 text-center px-8 py-4 rounded-md font-semibold text-white transition-colors text-lg"
                  style={{ backgroundColor: '#a45a52' }}
                >
                  Request Quote
                </Link>
                <button
                  className="px-8 py-4 rounded-md font-semibold border-2 transition-all text-lg"
                  style={{ borderColor: '#a45a52', color: '#a45a52' }}
                >
                  Add to Wishlist
                </button>
              </div>

              {/* Features */}
              {product.features && Array.isArray(product.features) && product.features.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Features:</h3>
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <svg className="w-5 h-5 mr-3" style={{ color: '#a45a52' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Specifications */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Specifications:</h3>
                  <div className="space-y-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="font-medium text-gray-700">{key}:</span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="bg-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Free Delivery</h3>
              <p className="text-gray-300">Professional delivery and installation included</p>
            </div>
            <div>
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-2">Quality Guarantee</h3>
              <p className="text-gray-300">Extended warranty on all products</p>
            </div>
            <div>
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
              <p className="text-gray-300">
                Our team is here to help you.{" "}
                <Link href="/contact" className="text-yellow-300 hover:underline">
                  Contact us
                </Link>
                {" "}for personalized assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
