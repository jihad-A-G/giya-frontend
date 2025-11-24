'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getAuthHeaders } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Service {
  _id?: string;
  title: string;
  icon: string;
  description: string;
  features: string[];
  process: string[];
}

export default function EditService() {
  const [formData, setFormData] = useState({
    title: '',
    icon: '',
    description: '',
    features: [''],
    process: [''],
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    if (id) {
      fetchService();
    }
  }, [id]);

  const fetchService = async () => {
    try {
      const response = await fetch(`/api/services/${id}`);
      if (response.ok) {
        const data: Service = await response.json();
        setFormData({
          title: data.title || '',
          icon: data.icon || '',
          description: data.description || '',
          features: data.features && data.features.length > 0 ? data.features : [''],
          process: data.process && data.process.length > 0 ? data.process : [''],
        });
      } else {
        setError('Failed to fetch service');
      }
    } catch (err) {
      setError('An error occurred while fetching the service');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Filter out empty strings from arrays
      const cleanedData = {
        ...formData,
        features: formData.features.filter(f => f.trim() !== ''),
        process: formData.process.filter(p => p.trim() !== ''),
      };

      const response = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(cleanedData),
      });

      if (response.ok) {
        router.push('/admin/services');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update service');
      }
    } catch (err) {
      setError('An error occurred while updating the service');
    } finally {
      setLoading(false);
    }
  };

  const handleArrayChange = (field: 'features' | 'process', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: 'features' | 'process') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (field: 'features' | 'process', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
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
        href="/admin/services"
        className="inline-flex items-center text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Services
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Service</h1>
        <p className="mt-2 text-sm text-gray-600">Update the service information below</p>
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-2">
                  Service Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Interior Design"
                />
              </div>

              <div>
                <label htmlFor="icon" className="block text-sm font-medium text-gray-900 mb-2">
                  Icon (Emoji) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="icon"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 text-2xl"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="🏠"
                  maxLength={2}
                />
                <p className="mt-1 text-sm text-gray-500">Enter an emoji to represent this service</p>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  required
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the service in detail..."
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Features</h2>
                <p className="text-sm text-gray-500 mt-1">Key features and benefits of this service</p>
              </div>
              <button
                type="button"
                onClick={() => addArrayItem('features')}
                className="inline-flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Feature
              </button>
            </div>
            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                    value={feature}
                    onChange={(e) => handleArrayChange('features', index, e.target.value)}
                    placeholder={`Feature ${index + 1}`}
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('features', index)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Process */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Process Steps</h2>
                <p className="text-sm text-gray-500 mt-1">Steps involved in delivering this service</p>
              </div>
              <button
                type="button"
                onClick={() => addArrayItem('process')}
                className="inline-flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Step
              </button>
            </div>
            <div className="space-y-3">
              {formData.process.map((step, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg font-semibold flex-shrink-0">
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                    value={step}
                    onChange={(e) => handleArrayChange('process', index, e.target.value)}
                    placeholder={`Step ${index + 1}`}
                  />
                  {formData.process.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('process', index)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="p-6 bg-gray-50 flex justify-end gap-4">
            <Link
              href="/admin/services"
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
                'Update Service'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
