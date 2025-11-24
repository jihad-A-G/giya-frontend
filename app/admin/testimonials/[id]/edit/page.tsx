'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getAuthHeaders } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Testimonial {
  _id?: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

export default function EditTestimonial() {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    content: '',
    rating: 5,
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    if (id) {
      fetchTestimonial();
    }
  }, [id]);

  const fetchTestimonial = async () => {
    try {
      const response = await fetch(`/api/testimonials/${id}`);
      if (response.ok) {
        const data: Testimonial = await response.json();
        setFormData({
          name: data.name || '',
          role: data.role || '',
          content: data.content || '',
          rating: data.rating || 5,
        });
      } else {
        setError('Failed to fetch testimonial');
      }
    } catch (err) {
      setError('An error occurred while fetching the testimonial');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/testimonials');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update testimonial');
      }
    } catch (err) {
      setError('An error occurred while updating the testimonial');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <Link
        href="/admin/testimonials"
        className="inline-flex items-center text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Testimonials
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Testimonial</h1>
        <p className="mt-2 text-sm text-gray-600">Update the testimonial information below</p>
      </div>

      <div className="bg-white shadow-lg rounded-lg">
        <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
          {error && (
            <div className="p-6">
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Testimonial Information</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., John Doe"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-900 mb-2">
                  Role/Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="role"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g., CEO at ABC Company"
                />
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="rating" className="block text-sm font-medium text-gray-900 mb-2">
                Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  id="rating"
                  min="1"
                  max="5"
                  step="1"
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                />
                <div className="flex items-center gap-2 min-w-[120px]">
                  <span className="text-2xl text-yellow-400">
                    {'★'.repeat(formData.rating)}{'☆'.repeat(5 - formData.rating)}
                  </span>
                  <span className="text-sm font-medium text-gray-700">({formData.rating}/5)</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="content" className="block text-sm font-medium text-gray-900 mb-2">
                Testimonial Content <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                required
                rows={6}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write the customer's testimonial here..."
              />
              <p className="mt-1 text-sm text-gray-500">Share what the customer said about your service</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="p-6 bg-gray-50 flex justify-end gap-4">
            <Link
              href="/admin/testimonials"
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium transition-colors inline-flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                'Update Testimonial'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
