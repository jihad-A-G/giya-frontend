"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Project {
  _id: string;
  title: string;
  category: string;
  location: string;
  year: number;
  image: string;
  description: string;
  services: string[];
  highlights: string[];
  stats: {
    area: string;
    duration: string;
    furniture: string;
  };
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const filters = [
    { id: "all", name: "All Projects" },
    { id: "residential", name: "Residential" },
    { id: "commercial", name: "Commercial" },
    { id: "hospitality", name: "Hospitality" },
    { id: "custom", name: "Custom Furniture" }
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = activeFilter === "all"
    ? projects
    : projects.filter(project => project.category === activeFilter);

  useEffect(() => {
    setVisibleCards(new Array(filteredProjects.length).fill(false));
  }, [filteredProjects.length]);

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
          <p className="text-gray-600">Loading projects...</p>
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
            <h1 className="text-5xl font-bold text-white mb-6">Our Projects</h1>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Explore our portfolio of successful projects spanning residential, commercial,
              and hospitality spaces. Each project showcases our commitment to quality and design excellence.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Project Stats */}
      <div className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "500+", label: "Projects Completed" },
              { number: "50+", label: "Happy Clients" },
              { number: "15", label: "Years Experience" },
              { number: "10,000+", label: "Furniture Pieces" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-3xl font-bold mb-2" style={{ color: '#a45a52' }}>{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="bg-white py-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {filters.map((filter) => (
              <motion.button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeFilter === filter.id
                    ? "text-white shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                style={activeFilter === filter.id ? { backgroundColor: '#a45a52' } : {}}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {filter.name}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No projects found in this category.</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12"
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project._id}
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
                  onClick={() => window.location.href = `/projects/${project._id}`}
                >
                  {/* Project Image */}
                  <div className="h-64 relative overflow-hidden">
                    <Image
                      src={`${API_URL}${project.image}`}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 right-4 text-white px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: '#a45a52' }}>
                      {project.year}
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gray-800">{project.title}</h3>
                      <span className="text-sm text-gray-500">{project.location}</span>
                    </div>

                    <p className="text-gray-600 mb-6">{project.description}</p>

                    {/* Services */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Services Provided:</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.services.map((service, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 text-sm rounded-full"
                            style={{ backgroundColor: '#f3f1f0', color: '#a45a52' }}
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Project Stats */}
                    {project.stats && Object.keys(project.stats).length > 0 && (
                      <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                        {Object.entries(project.stats).slice(0, 3).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div className="text-lg font-bold" style={{ color: '#a45a52' }}>{value as string}</div>
                            <div className="text-xs text-gray-500 capitalize">{key}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Highlights */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Project Highlights:</h4>
                      <ul className="space-y-2">
                        {project.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-2 mt-1" style={{ color: '#a45a52' }}>•</span>
                            <span className="text-gray-600 text-sm">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Button */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/projects/${project._id}`;
                      }}
                      className="w-full text-white py-3 rounded-md font-semibold transition-colors duration-200" 
                      style={{ backgroundColor: '#a45a52' }}
                    >
                      View Project Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-6">Our Project Process</h2>
            <p className="text-xl max-w-3xl mx-auto">
              From initial consultation to final installation, we follow a proven process
              that ensures exceptional results for every project.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Consultation", description: "Understanding your vision, requirements, and budget" },
              { step: "2", title: "Design", description: "Creating detailed plans and 3D visualizations" },
              { step: "3", title: "Manufacturing", description: "Crafting furniture with precision in our factory" },
              { step: "4", title: "Installation", description: "Professional delivery and setup at your location" }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="w-16 h-16 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4" style={{ backgroundColor: '#a45a52' }}>
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
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
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Your Project?</h2>
            <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
              Let's discuss your vision and create something extraordinary together.
              Contact us for a free consultation and project quote.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/contact" className="bg-white px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors duration-200" style={{ color: '#a45a52' }}>
                Start Your Project
              </Link>
              <Link href="/services" className="border-2 border-white text-white hover:bg-white px-8 py-3 rounded-md font-semibold transition-all duration-200">
                Our Services
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
