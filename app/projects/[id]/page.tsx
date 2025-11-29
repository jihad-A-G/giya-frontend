"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Project {
  _id: string;
  title: string;
  category: string;
  location: string;
  year: number;
  image: string;
  images: string[];
  video: string | null;
  description: string;
  services: string[];
  highlights: string[];
  stats: Record<string, string>;
  client: string | null;
  budget: string | null;
}

export default function ProjectDetail() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}`);
        if (!response.ok) {
          throw new Error('Project not found');
        }
        const data = await response.json();
        setProject(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a45a52] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error || 'Project not found'}</p>
          <Link href="/projects" className="px-4 py-2 bg-[#a45a52] text-white rounded-md hover:bg-[#8a4a44] transition-colors">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const galleryImages = project.images && project.images.length > 0 
    ? project.images.map(img => `${API_URL}${img}`)
    : [`${API_URL}${project.image}`];

  // Generate Breadcrumb Schema
  const generateBreadcrumbSchema = () => {
    if (!project) return null;

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://giya-frontend.vercel.app';

    return {
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
          "name": "Projects",
          "item": `${baseUrl}/projects`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": project.title,
          "item": `${baseUrl}/projects/${project._id}`
        }
      ]
    };
  };

  const breadcrumbSchema = generateBreadcrumbSchema();

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Breadcrumb Schema Markup */}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}

      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push('/projects')}
            className="flex items-center text-gray-600 hover:text-[#a45a52] transition-colors"
          >
            <span className="mr-2">←</span>
            <span className="font-medium">Back to Projects</span>
          </button>
        </div>
      </div>

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
              <div className="relative h-96">
                <Image
                  src={galleryImages[selectedImage]}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>

            {/* Thumbnail Gallery */}
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4 mb-6">
                {galleryImages.map((img, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative h-24 rounded-lg overflow-hidden cursor-pointer border-2 ${
                      selectedImage === index ? 'border-[#a45a52]' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={img}
                      alt={`${project.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Video Player */}
            {project.video && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <video
                  controls
                  className="w-full"
                  poster={`${API_URL}${project.image}`}
                >
                  <source src={project.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </motion.div>
            )}
          </div>

          {/* Right Column - Project Details */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Project Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: '#f3f1f0', color: '#a45a52' }}>
                    {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                  </span>
                  <span className="text-gray-500">{project.year}</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">{project.title}</h1>
                <p className="text-lg text-gray-600 flex items-center">
                  <span className="mr-2">📍</span>
                  {project.location}
                </p>
              </div>

              {/* Project Stats */}
              {project.stats && Object.keys(project.stats).length > 0 && (
                <div className="grid grid-cols-3 gap-4 mb-8 p-6 bg-white rounded-lg shadow-md">
                  {Object.entries(project.stats).slice(0, 3).map(([key, value], index) => (
                    <div 
                      key={key} 
                      className={`text-center ${index === 1 ? 'border-x border-gray-200' : ''}`}
                    >
                      <div className="text-2xl font-bold mb-1" style={{ color: '#a45a52' }}>{value as string}</div>
                      <div className="text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Client and Budget */}
              {(project.client || project.budget) && (
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {project.client && (
                    <div className="p-4 bg-white rounded-lg shadow-md">
                      <div className="text-sm text-gray-500 mb-1">Client</div>
                      <div className="font-semibold text-gray-800">{project.client}</div>
                    </div>
                  )}
                  {project.budget && (
                    <div className="p-4 bg-white rounded-lg shadow-md">
                      <div className="text-sm text-gray-500 mb-1">Budget</div>
                      <div className="font-semibold text-gray-800">{project.budget}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Project Overview</h2>
                <p className="text-gray-600 leading-relaxed mb-4">{project.description}</p>
                <p className="text-sm text-gray-500">
                  Interested in a similar project?{" "}
                  <Link href="/services" className="text-[#a45a52] hover:underline font-medium">
                    Explore our services
                  </Link>
                  {" "}or browse{" "}
                  <Link href="/products" className="text-[#a45a52] hover:underline font-medium">
                    furniture options
                  </Link>
                  {" "}to bring your vision to life.
                </p>
              </div>

              {/* Services Provided */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Services Provided</h2>
                <div className="flex flex-wrap gap-3">
                  {project.services.map((service, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-full text-sm font-medium"
                      style={{ backgroundColor: '#f3f1f0', color: '#a45a52' }}
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project Highlights */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Project Highlights</h2>
                <ul className="space-y-3">
                  {project.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-3 mt-1 text-xl" style={{ color: '#a45a52' }}>✓</span>
                      <span className="text-gray-600">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Link
                  href="/contact"
                  className="flex-1 text-center text-white px-6 py-3 rounded-md font-semibold transition-colors duration-200"
                  style={{ backgroundColor: '#a45a52' }}
                >
                  Start Your Project
                </Link>
                <Link
                  href="/projects"
                  className="flex-1 text-center border-2 px-6 py-3 rounded-md font-semibold transition-all duration-200"
                  style={{ borderColor: '#a45a52', color: '#a45a52' }}
                >
                  View More Projects
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 bg-white rounded-lg shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Why Choose Us for Your Project?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl mb-3">🏭</div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#a45a52' }}>In-House Manufacturing</h3>
              <p className="text-gray-600">Complete control over quality and timelines with our own manufacturing facility.</p>
            </div>
            <div>
              <div className="text-3xl mb-3">🎨</div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#a45a52' }}>Custom Design</h3>
              <p className="text-gray-600">Tailored solutions that perfectly match your vision and requirements.</p>
            </div>
            <div>
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#a45a52' }}>Timely Delivery</h3>
              <p className="text-gray-600">Professional project management ensuring on-time completion.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
