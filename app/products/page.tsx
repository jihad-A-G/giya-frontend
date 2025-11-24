"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Head from "next/head";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Product {
  _id: string;
  name: string;
  category: string;
  price: string;
  image: string;
  description: string;
  features: string[];
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const searchParams = useSearchParams();
  
  const categories = [
    { id: "all", name: "All Products" },
    { id: "sale", name: "Sale" },
    { id: "living", name: "Living Room" },
    { id: "bedroom", name: "Bedroom" },
    { id: "office", name: "Office" },
    { id: "dining", name: "Dining Room" },
    { id: "custom", name: "Custom Furniture" }
  ];

  useEffect(() => {
    // Check if there's a category parameter in the URL
    const categoryParam = searchParams.get('category');
    if (categoryParam && categories.some(cat => cat.id === categoryParam)) {
      setActiveCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = activeCategory === "all"
    ? products
    : products.filter(product => product.category === activeCategory);

  useEffect(() => {
    setVisibleCards(new Array(filteredProducts.length).fill(false));
  }, [filteredProducts.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = cardRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1 && !visibleCards[index]) {
              setVisibleCards(prev => {
                const newVisible = [...prev];
                newVisible[index] = true;
                return newVisible;
              });
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      cardRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [visibleCards]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a45a52] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#a45a52] text-white rounded-md hover:bg-[#8a4a44] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/products/productheader.jpg"
            alt="Professional Interior"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to right, rgba(164, 90, 82, 0.6), rgba(138, 74, 68, 0.6))` }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold text-white mb-6">Our Furniture Collection</h1>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Discover our extensive range of premium furniture, manufactured in our state-of-the-art factory
              with attention to detail and quality craftsmanship.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white py-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeCategory === category.id
                    ? "text-white shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                style={activeCategory === category.id ? { backgroundColor: '#a45a52' } : {}}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No products found in this category.</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  ref={(el) => {
                    if (el) cardRefs.current[index] = el;
                  }}
                  className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 transform ${
                    visibleCards[index]
                      ? 'animate-pop-up opacity-100 scale-100'
                      : 'opacity-0 scale-95'
                  } hover:shadow-xl cursor-pointer`}
                  whileHover={{ y: -10 }}
                  layout
                  onClick={() => window.location.href = `/products/${product._id}`}
                >
                  {/* Product Image */}
                  <div className="h-48 relative">
                    <Image
                      src={`${API_URL}${product.image}`}
                      alt={product.name}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-4 text-sm">{product.description}</p>

                    {/* Features */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Features:</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs rounded-full"
                            style={{ backgroundColor: '#f3f1f0', color: '#a45a52' }}
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold" style={{ color: '#a45a52' }}>{product.price}</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `/products/${product._id}`;
                          }}
                          className="text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200" 
                          style={{ backgroundColor: '#a45a52' }}
                        >
                          View Details
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = '/contact';
                          }}
                          className="border px-4 py-2 rounded-md text-sm font-medium transition-all duration-200" 
                          style={{ borderColor: '#a45a52', color: '#a45a52' }}
                        >
                          Quote
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Manufacturing Excellence Section */}
      <div className="bg-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">Manufacturing Excellence</h2>
              <p className="text-lg mb-6">
                Every piece of furniture is crafted in our modern factory using premium materials
                and traditional woodworking techniques combined with cutting-edge technology.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="mr-4 text-xl" style={{ color: '#a45a52' }}>✓</span>
                  <span>Premium hardwood and sustainable materials</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-4 text-xl" style={{ color: '#a45a52' }}>✓</span>
                  <span>Precision manufacturing with quality control</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-4 text-xl" style={{ color: '#a45a52' }}>✓</span>
                  <span>Custom sizing and finishes available</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-4 text-xl" style={{ color: '#a45a52' }}>✓</span>
                  <span>Professional delivery and installation</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-lg overflow-hidden">
                <div className="h-48 relative">
                  <Image
                    src="/factory.jpg"
                    alt="Our Factory"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8 text-center" style={{ background: `linear-gradient(to bottom right, #a45a52, #8a4a44)` }}>
                  <h3 className="text-2xl font-bold text-white mb-4">Our Factory</h3>
                  <p className="text-white mb-6">
                    50,000 sq ft manufacturing facility with modern equipment and skilled craftsmen.
                  </p>
                  <Link href="/contact" className="inline-block bg-gray-800 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-700 transition-colors duration-200">
                    Schedule Factory Tour
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16" style={{ backgroundColor: '#a45a52' }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Space?</h2>
            <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
              Visit our showroom to see our furniture collections in person, or contact us for custom solutions.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/contact" className="bg-white px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors duration-200" style={{ color: '#a45a52' }}>
                Visit Showroom
              </Link>
              <Link href="/services" className="border-2 border-white text-white hover:bg-white px-8 py-3 rounded-md font-semibold transition-all duration-200" style={{ '--hover-color': '#a45a52' } as React.CSSProperties}>
                Custom Design
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
