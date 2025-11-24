"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function Contact() {
  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: ""
  });
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const contactInfo = [
    {
      icon: "📍",
      title: "Visit Our Showroom",
      details: ["123 Furniture Avenue", "Design District, CA 90210"],
      action: "Get Directions"
    },
    {
      icon: "📞",
      title: "Call Us",
      details: ["+1 (555) 123-4567", "Mon-Sat: 9AM-7PM"],
      action: "Call Now"
    },
    {
      icon: "✉️",
      title: "Email Us",
      details: ["info@giyaenjoyliving.com", "quotes@giyaenjoyliving.com"],
      action: "Send Email"
    },
    {
      icon: "🏭",
      title: "Factory Tours",
      details: ["Schedule a factory visit", "See our manufacturing process"],
      action: "Book Tour"
    }
  ];

  const services = [
    "Furniture Manufacturing",
    "Interior Design",
    "Custom Furniture",
    "Showroom Consultation",
    "Project Management",
    "Other"
  ];

  const faqs = [
    {
      question: "What is your typical project timeline?",
      answer: "Project timelines vary depending on scope and complexity. Custom furniture typically takes 4-8 weeks, while complete interior design projects can take 3-6 months. We'll provide a detailed timeline during consultation."
    },
    {
      question: "Do you offer design consultations?",
      answer: "Yes! We offer free initial consultations at our showroom or your location. Our design experts will discuss your vision, requirements, and provide preliminary recommendations."
    },
    {
      question: "Can I visit your factory?",
      answer: "Absolutely! We offer guided factory tours by appointment. You'll see our manufacturing process, quality control measures, and meet our skilled craftsmen."
    },
    {
      question: "Do you work with trade professionals?",
      answer: "Yes, we work closely with architects, interior designers, and contractors. We offer trade pricing and can coordinate with your existing project team."
    },
    {
      question: "What areas do you serve?",
      answer: "We primarily serve Southern California, but we can accommodate projects nationwide for larger commercial clients. Contact us to discuss your specific location."
    },
    {
      question: "Do you offer financing options?",
      answer: "Yes, we offer flexible financing options for qualified customers. Our team can discuss payment plans and financing during your consultation."
    }
  ];

  useEffect(() => {
    setVisibleCards(new Array(8).fill(false));
  }, []);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      service: "",
      message: ""
    });
    alert("Thank you for your message! We'll get back to you soon.");
  };

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
            <h1 className="text-5xl font-bold text-white mb-6">Contact Us</h1>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Ready to transform your space? Get in touch with our team for a free consultation, 
              showroom visit, or to discuss your custom furniture needs.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Information Cards */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                ref={(el) => {
                  if (el) cardRefs.current[index] = el;
                }}
                className={`bg-white p-6 rounded-lg shadow-lg text-center transition-all duration-300 transform ${
                  visibleCards[index] 
                    ? 'animate-pop-up opacity-100 scale-100' 
                    : 'opacity-0 scale-95'
                } hover:shadow-xl`}
                whileHover={{ y: -10 }}
              >
                <div className="text-5xl mb-4">{info.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{info.title}</h3>
                <div className="space-y-2 mb-6">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600">{detail}</p>
                  ))}
                </div>
                <button className="text-white px-6 py-2 rounded-md font-semibold transition-colors duration-200" style={{ backgroundColor: '#a45a52' }}>
                  {info.action}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form and Map Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Send Us a Message</h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and we'll get back to you within 24 hours. 
                For urgent inquiries, please call us directly.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <label htmlFor="service" className="block text-sm font-semibold text-gray-700 mb-2">
                      Service Interested In
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select a service</option>
                      {services.map((service, index) => (
                        <option key={index} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent transition-all duration-200 resize-vertical"
                    style={{ '--tw-ring-color': '#a45a52' } as React.CSSProperties}
                    placeholder="Tell us about your project, timeline, and any specific requirements..."
                  />
                </div>

                <motion.button
                  type="submit"
                  className="w-full text-white py-4 rounded-md font-semibold text-lg transition-colors duration-200"
                  style={{ backgroundColor: '#a45a52' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Send Message
                </motion.button>
              </form>
            </motion.div>

            {/* Map and Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Map Placeholder */}
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Find Our Showroom</h3>
                <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-400 rounded-lg flex items-center justify-center">
                  <div className="text-gray-600 text-center">
                    <div className="text-4xl mb-2">🗺️</div>
                    <p className="text-lg font-semibold">Interactive Map</p>
                    <p className="text-sm">123 Furniture Avenue, Design District</p>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Business Hours</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="font-semibold">9:00 AM - 7:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-semibold">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="font-semibold">Closed</span>
                  </div>
                </div>
              </div>

              {/* Quick Contact */}
              <div className="bg-amber-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Contact</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="mr-3" style={{ color: '#a45a52' }}>📞</span>
                    <span className="font-semibold">+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-3" style={{ color: '#a45a52' }}>✉️</span>
                    <span className="font-semibold">info@giyaenjoyliving.com</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-3" style={{ color: '#a45a52' }}>💬</span>
                    <span className="font-semibold">Live Chat Available</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about our services, processes, and policies.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                ref={(el) => {
                  if (el) cardRefs.current[index + 4] = el;
                }}
                className={`bg-white p-6 rounded-lg shadow-lg transition-all duration-300 transform ${
                  visibleCards[index + 4] 
                    ? 'animate-pop-up opacity-100 scale-100' 
                    : 'opacity-0 scale-95'
                }`}
                whileHover={{ y: -5 }}
              >
                <h3 className="text-lg font-bold text-gray-800 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
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
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
              Don't wait to transform your space. Schedule a free consultation today 
              and let's bring your vision to life.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="bg-white px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors duration-200" style={{ color: '#a45a52' }}>
                Schedule Consultation
              </button>
              <button className="border-2 border-white text-white hover:bg-white px-8 py-3 rounded-md font-semibold transition-all duration-200">
                Call Now
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
