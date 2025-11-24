'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Stats {
  products: number;
  projects: number;
  services: number;
  testimonials: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    products: 0,
    projects: 0,
    services: 0,
    testimonials: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, projectsRes, servicesRes, testimonialsRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/projects'),
          fetch('/api/services'),
          fetch('/api/testimonials'),
        ]);

        const products = await productsRes.json();
        const projects = await projectsRes.json();
        const services = await servicesRes.json();
        const testimonials = await testimonialsRes.json();

        setStats({
          products: Array.isArray(products) ? products.length : 0,
          projects: Array.isArray(projects) ? projects.length : 0,
          services: Array.isArray(services) ? services.length : 0,
          testimonials: Array.isArray(testimonials) ? testimonials.length : 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const menuItems = [
    {
      title: 'Products',
      description: 'Manage paint products and categories',
      href: '/admin/products',
      count: stats.products,
      color: 'bg-blue-500',
    },
    {
      title: 'Projects',
      description: 'Manage completed projects and case studies',
      href: '/admin/projects',
      count: stats.projects,
      color: 'bg-green-500',
    },
    {
      title: 'Services',
      description: 'Manage painting services offered',
      href: '/admin/services',
      count: stats.services,
      color: 'bg-purple-500',
    },
    {
      title: 'Testimonials',
      description: 'Manage customer testimonials and reviews',
      href: '/admin/testimonials',
      count: stats.testimonials,
      color: 'bg-yellow-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to the admin panel. Manage your content below.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {menuItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-md ${item.color}`}>
                <div className="w-6 h-6 text-white font-bold text-lg">
                  {item.count}
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link
              href="/admin/products/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add New Product
            </Link>
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add New Project
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
