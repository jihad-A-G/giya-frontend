"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ProductCardSkeleton, ProjectCardSkeleton } from "@/components/LoadingSkeleton";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const Typewriter = () => {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const words = ["Premium Furniture", "Interior Design", "Custom Solutions", "Beautiful Living Spaces"];

  useEffect(() => {
    const handleType = () => {
      const current = loopNum % words.length;
      const fullText = words[current];

      setText(
        isDeleting
          ? fullText.substring(0, text.length - 1)
          : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 50 : 150);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed, words]);

  return (
    <span className="font-mono text-4xl" style={{ color: '#fbbf24' }}>
      {text}
      <span className="animate-pulse">|</span>
    </span>
  );
};

interface Product {
  _id: string;
  name: string;
  category: string;
  image: string;
  description: string;
}

interface Project {
  _id: string;
  title: string;
  image: string;
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageReady, setPageReady] = useState(false);
  const [visibleCards, setVisibleCards] = useState([true, true, true]);
  const [visibleSection, setVisibleSection] = useState(true);
  const [visibleProjectCards, setVisibleProjectCards] = useState([true, true, true]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const projectCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Mark page as ready immediately for critical content
  useEffect(() => {
    setPageReady(true);
  }, []);

  useEffect(() => {
    const fetchFeaturedData = async () => {
      try {
        console.log('Fetching featured data...');
        
        // Fetch in parallel for better performance
        const [productsResponse, projectsResponse] = await Promise.all([
          fetch('/api/products', { cache: 'no-store' }),
          fetch('/api/projects', { cache: 'no-store' })
        ]);
        
        console.log('Products response status:', productsResponse.status);
        console.log('Projects response status:', projectsResponse.status);
        
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          console.log('Products data length:', productsData.length);
          
          if (productsData && productsData.length > 0) {
            const parsedProducts = productsData.slice(0, 3).map((product: Product) => {
              try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const productAny = product as any;
                return {
                  ...product,
                  features: typeof productAny.features === 'string' ? JSON.parse(productAny.features) : productAny.features || []
                };
              } catch (error) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                console.error('Error parsing features for product:', (product as any)._id, error);
                return {
                  ...product,
                  features: []
                };
              }
            });
            console.log('Parsed products count:', parsedProducts.length);
            setFeaturedProducts(parsedProducts);
          } else {
            console.log('No products data received');
            setFeaturedProducts([]);
          }
        }

        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          console.log('Projects data length:', projectsData.length);
          
          if (projectsData && projectsData.length > 0) {
            const featuredProjectsData = projectsData.slice(0, 3);
            console.log('Featured projects count:', featuredProjectsData.length);
            setFeaturedProjects(featuredProjectsData);
          } else {
            console.log('No projects data received');
            setFeaturedProjects([]);
          }
        }
      } catch (error) {
        console.error('Error fetching featured data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Defer API calls to not block initial render
    const timer = setTimeout(() => {
      fetchFeaturedData();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Debug useEffect
  useEffect(() => {
    console.log('Featured products state updated:', featuredProducts);
  }, [featuredProducts]);

  useEffect(() => {
    console.log('Featured projects state updated:', featuredProjects);
  }, [featuredProjects]);

  useEffect(() => {
    const cardObserver = new IntersectionObserver(
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

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSection(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    const projectCardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = projectCardRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1 && !visibleProjectCards[index]) {
              setVisibleProjectCards(prev => {
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
      if (ref) cardObserver.observe(ref);
    });

    if (sectionRef.current) {
      sectionObserver.observe(sectionRef.current);
    }

    projectCardRefs.current.forEach((ref) => {
      if (ref) projectCardObserver.observe(ref);
    });

    return () => {
      cardRefs.current.forEach((ref) => {
        if (ref) cardObserver.unobserve(ref);
      });
      if (sectionRef.current) {
        sectionObserver.unobserve(sectionRef.current);
      }
      projectCardRefs.current.forEach((ref) => {
        if (ref) projectCardObserver.unobserve(ref);
      });
    };
  }, []);

  return (
    <div className="relative">
      {/* Hero Section with Video Background */}
      <div className="relative min-h-screen overflow-hidden">
        {/* Fallback background while video loads */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black z-0" />
        
        {/* Background Video */}
        {pageReady && (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover z-[1]"
          >
            <source src="/video1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}

        {/* Dark Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40 z-10"></div>

        {/* Hero Content */}
        <div className="relative z-20 pt-20 min-h-screen flex items-center justify-center text-white text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <p className="text-xl mb-8">
              <Typewriter />
            </p>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              From our state-of-the-art factory to your dream home. We manufacture premium furniture,
              design stunning interiors, and showcase our craftsmanship in our exclusive showroom.
            </p>
            <div className="flex gap-4 justify-center">
              <motion.button
                className="px-8 py-3 rounded-md font-medium transition-all duration-300 transform hover:scale-105"
                style={{ backgroundColor: '#a45a52' }}
                onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#8a4a44'}
                onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#a45a52'}
                onClick={() => {
                  const productsSection = document.getElementById('products-section');
                  if (productsSection) {
                    productsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Products
              </motion.button>
              <motion.button
                className="border-2 border-white hover:bg-white hover:text-black px-8 py-3 rounded-md font-medium transition-all duration-300"
                onClick={() => {
                  const contactSection = document.getElementById('contact-section');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Visit Showroom
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* White Division */}
      <div className="bg-white h-2"></div>

      {/* Sale Promotional Banner */}
      <Link href="/products?category=sale" className="block relative w-full h-64 md:h-80 overflow-hidden cursor-pointer group">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/products/Living.jpeg"
            alt="Sale Promotion"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-50 transition-opacity duration-300"></div>
        </div>

        {/* Sale Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.h2
              className="text-7xl md:text-9xl font-bold mb-4"
              style={{ color: '#fbbf24' }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              SALE
            </motion.h2>
            <motion.p
              className="text-3xl md:text-4xl font-semibold mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true }}
            >
              Up to 50% Off
            </motion.p>
            <motion.div
              className="inline-block px-8 py-3 rounded-md font-semibold text-lg transition-all duration-300 group-hover:scale-110"
              style={{ backgroundColor: '#a45a52' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              viewport={{ once: true }}
            >
              Shop Now →
            </motion.div>
          </motion.div>
        </div>
      </Link>

      {/* Products Preview Section */}
      <div id="products-section" className="relative z-20 bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">Our Premium Furniture Collection</h2>
            <p className="text-lg text-center mb-12 text-gray-600 max-w-3xl mx-auto">
              Manufactured in our modern factory with precision and care. Each piece combines traditional craftsmanship with contemporary design.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.length === 0 ? (
                <div className="col-span-3 text-center py-8">
                  <p className="text-gray-600">No products found. Featured products length: {featuredProducts.length}</p>
                </div>
              ) : (
                featuredProducts.map((product, index) => (
                  <motion.div
                    key={(product as { _id: string })._id}
                    ref={(el) => {
                      if (el) cardRefs.current[index] = el;
                    }}
                    className={`bg-white p-6 rounded-lg shadow-lg transition-all duration-500 text-center transform ${
                      visibleCards[index]
                        ? 'animate-pop-up opacity-100 scale-100'
                        : 'opacity-0 scale-95'
                    }`}
                    whileHover={{ y: -10, scale: 1.05 }}
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      willChange: 'transform',
                    }}
                    onMouseEnter={(e) => {
                      const target = e.currentTarget as HTMLElement;
                      const before = document.createElement('div');
                      before.className = 'holographic-shine';
                      before.style.cssText = `
                        content: '';
                        position: absolute;
                        top: -50%;
                        left: -50%;
                        width: 200%;
                        height: 200%;
                        background: linear-gradient(0deg, transparent, transparent 30%, rgba(164, 90, 82, 0.3));
                        transform: rotate(-45deg);
                        transition: all 0.6s ease;
                        pointer-events: none;
                        z-index: 5;
                        opacity: 0;
                      `;
                      target.appendChild(before);
                      
                      requestAnimationFrame(() => {
                        before.style.opacity = '1';
                        before.style.transform = 'rotate(-45deg) translateY(100%)';
                      });
                      
                      target.style.boxShadow = '0 0 20px rgba(164, 90, 82, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      const target = e.currentTarget as HTMLElement;
                      const shine = target.querySelector('.holographic-shine');
                      if (shine) {
                        shine.remove();
                      }
                      target.style.boxShadow = '';
                    }}
                  >
                    <div className="w-full h-48 rounded-lg mb-4 overflow-hidden relative">
                      <img
                        src={`${API_URL}${product.image}`}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                        style={{
                          transition: 'transform 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)';
                        }}
                      />
                    </div>
                    <h3 className="text-2xl font-semibold mb-3 text-gray-800">{product.name}</h3>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <Link href="/products" className="text-white px-6 py-2 rounded-md transition-colors duration-200 inline-block" style={{ backgroundColor: '#a45a52' }}>
                      View Collection
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Services Section */}
      <div ref={sectionRef} className="relative z-20 py-16" style={{ background: `linear-gradient(to right, #a45a52, #8a4a44)` }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Text Content - Left Side */}
            <motion.div
              className={`space-y-6 transition-all duration-700 ${
                visibleSection
                  ? 'animate-slide-in-left opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-20'
              }`}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white">Our Services</h2>
              <p className="text-lg text-white">
                Beyond manufacturing, we offer comprehensive interior design services to transform your space
                into a reflection of your style and personality.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="text-yellow-300 mr-4 text-2xl">🏭</span>
                  <div>
                    <h4 className="text-white font-semibold">Furniture Manufacturing</h4>
                    <p className="text-gray-100">State-of-the-art factory producing premium quality furniture</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-yellow-300 mr-4 text-2xl">🎨</span>
                  <div>
                    <h4 className="text-white font-semibold">Interior Design</h4>
                    <p className="text-gray-100">Complete interior design solutions for homes and offices</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-yellow-300 mr-4 text-2xl">🏪</span>
                  <div>
                    <h4 className="text-white font-semibold">Showroom Experience</h4>
                    <p className="text-gray-100">Visit our showroom to see and feel our products firsthand</p>
                  </div>
                </div>
              </div>
              <Link href="/services" className="inline-block bg-white px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors duration-200" style={{ color: '#a45a52' }}>
                Learn More About Our Services
              </Link>
            </motion.div>

            {/* Video - Right Side */}
            <motion.div
              className={`relative transition-all duration-700 ${
                visibleSection
                  ? 'animate-slide-in-right opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-20'
              }`}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full h-64 md:h-80 rounded-lg shadow-lg object-cover"
              >
                <source src="/video2.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Projects Showcase Section */}
      <div className="relative z-20 bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">Featured Projects</h2>
            <p className="text-lg text-center mb-12 text-gray-600 max-w-3xl mx-auto">
              Discover how we&apos;ve transformed spaces with our furniture and interior design expertise.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProjects.length === 0 ? (
                <div className="col-span-3 text-center py-8">
                  <p className="text-gray-600">No projects found. Featured projects length: {featuredProjects.length}</p>
                </div>
              ) : (
                featuredProjects.map((project, index) => (
                  <motion.div
                    key={(project as { _id: string })._id}
                    ref={(el) => {
                      if (el) projectCardRefs.current[index] = el;
                    }}
                    className={`bg-white rounded-lg shadow-lg transition-all duration-500 text-center transform overflow-hidden ${
                      visibleProjectCards[index]
                        ? 'animate-pop-up opacity-100 scale-100'
                        : 'opacity-0 scale-95'
                    }`}
                    whileHover={{ y: -10, scale: 1.05 }}
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      willChange: 'transform',
                    }}
                    onMouseEnter={(e) => {
                      const target = e.currentTarget as HTMLElement;
                      const before = document.createElement('div');
                      before.className = 'holographic-shine';
                      before.style.cssText = `
                        content: '';
                        position: absolute;
                        top: -50%;
                        left: -50%;
                        width: 200%;
                        height: 200%;
                        background: linear-gradient(0deg, transparent, transparent 30%, rgba(164, 90, 82, 0.3));
                        transform: rotate(-45deg);
                        transition: all 0.6s ease;
                        pointer-events: none;
                        z-index: 5;
                        opacity: 0;
                      `;
                      target.appendChild(before);
                      
                      requestAnimationFrame(() => {
                        before.style.opacity = '1';
                        before.style.transform = 'rotate(-45deg) translateY(100%)';
                      });
                      
                      target.style.boxShadow = '0 0 20px rgba(164, 90, 82, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      const target = e.currentTarget as HTMLElement;
                      const shine = target.querySelector('.holographic-shine');
                      if (shine) {
                        shine.remove();
                      }
                      target.style.boxShadow = '';
                    }}
                  >
                    <Link href="/projects" className="relative group cursor-pointer block">
                      <div className="w-full h-64 relative">
                        <img
                          src={`${API_URL}${project.image}`}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          style={{
                            transition: 'transform 0.3s ease',
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.1)';
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)';
                          }}
                        />
                      </div>
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-70 transition-all duration-300 flex items-center justify-center">
                        <div className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300 p-4">
                          <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                          <p className="text-sm">Click to view project details</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/projects" className="text-white px-8 py-3 rounded-md font-semibold transition-colors duration-200 inline-block" style={{ backgroundColor: '#a45a52' }}>
              View All Projects
            </Link>
          </div>
        </div>
      </div>

      {/* Contact & Showroom Section */}
      <div id="contact-section" className="relative z-20 bg-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">Visit Our Showroom</h2>
              <p className="text-lg mb-6">
                Experience our furniture collections firsthand in our state-of-the-art showroom.
                See the quality, feel the craftsmanship, and get inspired for your next project.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="mr-4" style={{ color: '#a45a52' }}>📍</span>
                  <span>123 Furniture Avenue, Design District</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-4" style={{ color: '#a45a52' }}>📞</span>
                  <span>+123 456 7890</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-4" style={{ color: '#a45a52' }}>✉️</span>
                  <span>info@giyaenjoyliving.com</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-4" style={{ color: '#a45a52' }}>🕒</span>
                  <span>Mon-Sat: 9AM-7PM</span>
                </div>
              </div>
              <div className="mt-8">
                <Link href="/contact" className="px-8 py-3 rounded-md font-semibold transition-colors duration-200 inline-block mr-4" style={{ backgroundColor: '#a45a52' }}>
                  Get In Touch
                </Link>
                <button className="border-2 px-8 py-3 rounded-md font-semibold transition-all duration-200" style={{ borderColor: '#a45a52', color: '#a45a52' }}>
                  Schedule Visit
                </button>
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
                    src="/giya-store.jpg"
                    alt="Our Showroom"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-8 text-center" style={{ background: `linear-gradient(to bottom right, #a45a52, #8a4a44)` }}>
                  <h3 className="text-2xl font-bold text-white mb-4">Our Showroom</h3>
                  <p className="text-white">
                    A 10,000 sq ft space showcasing our complete furniture collections and interior design capabilities.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
