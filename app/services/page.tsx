"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Service {
  _id: string;
  id?: number;
  title: string;
  icon: string;
  description: string;
  features: string[];
  process: string[];
}

interface Testimonial {
  _id: string;
  id?: number;
  name: string;
  role: string;
  content: string;
  rating: number;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);
  const [activeTab, setActiveTab] = useState("manufacturing");
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesResponse, testimonialsResponse] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/testimonials')
        ]);

        if (!servicesResponse.ok || !testimonialsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const servicesData = await servicesResponse.json();
        const testimonialsData = await testimonialsResponse.json();

        // MongoDB returns arrays directly, no need to parse
        setServices(servicesData);
        setTestimonials(testimonialsData);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Calculate total cards: services + 4 "Why Choose Us" cards
    const totalCards = services.length + 4;
    setVisibleCards(new Array(totalCards).fill(false));
  }, [services.length]);

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

  const activeService = services.find(service => service._id === activeTab) || services[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a45a52] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
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
      <div className="py-16" style={{ background: `linear-gradient(to right, #a45a52, #8a4a44)` }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold text-white mb-6">Our Services</h1>
            <p className="text-xl text-white max-w-3xl mx-auto">
              From manufacturing premium furniture to designing stunning interiors,
              we offer comprehensive solutions for all your living space needs.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Services Overview */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                ref={(el) => {
                  if (el) cardRefs.current[index] = el;
                }}
                className={`bg-white p-8 rounded-lg shadow-lg text-center transition-all duration-300 transform ${
                  visibleCards[index]
                    ? 'animate-pop-up opacity-100 scale-100'
                    : 'opacity-0 scale-95'
                } hover:shadow-xl cursor-pointer`}
                onClick={() => setActiveTab(service._id)}
                whileHover={{ y: -10 }}
              >
                <div className="text-6xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <button className={`px-6 py-3 rounded-md font-semibold transition-all duration-300 ${
                  activeTab === service._id
                    ? "text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
                style={activeTab === service._id ? { backgroundColor: '#a45a52' } : {}}>
                  Learn More
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Service Information */}
      {activeService && (
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              key={activeService._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-12">
                <div className="text-8xl mb-4">{activeService.icon}</div>
                <h2 className="text-4xl font-bold text-gray-800 mb-4">{activeService.title}</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">{activeService.description}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Features */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">What We Offer</h3>
                  <div className="space-y-4">
                    {activeService.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <span className="mr-4 text-xl" style={{ color: '#a45a52' }}>✓</span>
                        <span className="text-gray-700">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Process */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Our Process</h3>
                  <div className="space-y-6">
                    {activeService.process.map((step, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <div className="flex-shrink-0 w-8 h-8 text-white rounded-full flex items-center justify-center font-bold mr-4 mt-1" style={{ backgroundColor: '#a45a52' }}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-gray-700">{step}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Why Choose Us */}
      <div className="bg-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-6">Why Choose Giya Enjoy Living?</h2>
            <p className="text-xl max-w-3xl mx-auto">
              With decades of experience and a commitment to excellence, we deliver exceptional results that exceed expectations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: "🏆", title: "Award Winning", description: "Recognized for design excellence and quality craftsmanship" },
              { icon: "⚡", title: "Fast Delivery", description: "Efficient manufacturing and delivery processes" },
              { icon: "🛡️", title: "Quality Guarantee", description: "Comprehensive warranty on all our products and services" },
              { icon: "👥", title: "Expert Team", description: "Skilled craftsmen and experienced designers" }
            ].map((item, index) => (
              <motion.div
                key={index}
                ref={(el) => {
                  if (el) cardRefs.current[services.length + index] = el;
                }}
                className={`text-center transition-all duration-300 transform ${
                  visibleCards[services.length + index]
                    ? 'animate-pop-up opacity-100 scale-100'
                    : 'opacity-0 scale-95'
                }`}
                whileHover={{ y: -10 }}
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-6">What Our Clients Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what our satisfied clients have to say about our services.
            </p>
          </motion.div>

          {testimonials.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No testimonials available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial._id}
                  className="bg-white p-6 rounded-lg shadow-lg"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-xl" style={{ color: '#a45a52' }}>★</span>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-800">{testimonial.name}</p>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
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
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
              Contact us today to discuss your project requirements and discover how we can bring your vision to life.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/contact" className="bg-white px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors duration-200" style={{ color: '#a45a52' }}>
                Get Free Consultation
              </Link>
              <Link href="/products" className="border-2 border-white text-white hover:bg-white px-8 py-3 rounded-md font-semibold transition-all duration-200">
                View Our Products
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
