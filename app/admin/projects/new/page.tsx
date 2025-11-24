'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAuthHeaders } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function NewProject() {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    location: '',
    year: new Date().getFullYear(),
    image: '',
    images: [] as string[],
    video: '',
    description: '',
    services: [''],
    highlights: [''],
    stats: {} as Record<string, string>,
    client: '',
    budget: '',
  });
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [multiUploadLoading, setMultiUploadLoading] = useState(false);
  const [error, setError] = useState('');
  const [statKey, setStatKey] = useState('');
  const [statValue, setStatValue] = useState('');
  const router = useRouter();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, image: data.url }));
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to upload image');
      }
    } catch (err) {
      setError('An error occurred while uploading image');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleMultipleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setMultiUploadLoading(true);
    setError('');

    try {
      const uploadedUrls: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);

        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            ...getAuthHeaders(),
          },
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          uploadedUrls.push(data.url);
        }
      }

      setFormData(prev => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
    } catch (err) {
      setError('An error occurred while uploading images');
    } finally {
      setMultiUploadLoading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.image) {
      setError('Please upload a main project image');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          ...formData,
          services: formData.services.filter(s => s.trim() !== ''),
          highlights: formData.highlights.filter(h => h.trim() !== ''),
        }),
      });

      if (response.ok) {
        router.push('/admin/projects');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create project');
      }
    } catch (err) {
      setError('An error occurred while creating project');
    } finally {
      setLoading(false);
    }
  };

  const handleArrayChange = (field: 'services' | 'highlights', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: 'services' | 'highlights') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (field: 'services' | 'highlights', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const addStat = () => {
    if (statKey.trim() && statValue.trim()) {
      setFormData({
        ...formData,
        stats: {
          ...formData.stats,
          [statKey]: statValue
        }
      });
      setStatKey('');
      setStatValue('');
    }
  };

  const removeStat = (key: string) => {
    const newStats = { ...formData.stats };
    delete newStats[key];
    setFormData({ ...formData, stats: newStats });
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <Link
        href="/admin/projects"
        className="inline-flex items-center text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Projects
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add New Project</h1>
        <p className="mt-2 text-sm text-gray-600">Fill in the information below to create a new project</p>
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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-2">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="Enter project title"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-900 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                  <option value="">Select category</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Office">Office</option>
                  <option value="Hospitality">Hospitality</option>
                  <option value="Retail">Retail</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-900 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="e.g., New York, NY"
                />
              </div>

              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-900 mb-2">
                  Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="year"
                  required
                  min="1900"
                  max="2100"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label htmlFor="client" className="block text-sm font-medium text-gray-900 mb-2">
                  Client (Optional)
                </label>
                <input
                  type="text"
                  id="client"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="Client name"
                />
              </div>

              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-900 mb-2">
                  Budget (Optional)
                </label>
                <input
                  type="text"
                  id="budget"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="e.g., $100,000"
                />
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter project description"
              />
            </div>
          </div>

          {/* Images & Media */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Images & Media</h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-900 mb-2">
                  Main Project Image <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full text-sm text-gray-900 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer border border-gray-300 rounded-lg"
                />
                {uploadLoading && (
                  <p className="mt-2 text-sm text-indigo-600">Uploading image...</p>
                )}
                {formData.image && (
                  <div className="mt-3">
                    <img
                      src={`${API_URL}${formData.image}`}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-lg border-2 border-gray-300 shadow-sm"
                    />
                    <p className="text-sm text-green-600 mt-2">✓ Image uploaded successfully</p>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="images" className="block text-sm font-medium text-gray-900 mb-2">
                  Gallery Images (Multiple)
                </label>
                <input
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                  onChange={handleMultipleImageUpload}
                  className="w-full text-sm text-gray-900 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer border border-gray-300 rounded-lg"
                />
                {multiUploadLoading && (
                  <p className="mt-2 text-sm text-green-600">Uploading images...</p>
                )}
                {formData.images.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-3">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={`${API_URL}${img}`}
                          alt={`Gallery ${index + 1}`}
                          className="h-24 w-24 object-cover rounded-lg border-2 border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="video" className="block text-sm font-medium text-gray-900 mb-2">
                  Video URL (Optional)
                </label>
                <input
                  type="url"
                  id="video"
                  value={formData.video}
                  onChange={(e) => setFormData({ ...formData, video: e.target.value })}
                  className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h2>
            
            {/* Services */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Services Provided <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {formData.services.map((service, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={service}
                      onChange={(e) => handleArrayChange('services', index, e.target.value)}
                      placeholder="e.g., Interior Design, Space Planning"
                      className="flex-1 px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                    {formData.services.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('services', index)}
                        className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => addArrayItem('services')}
                className="mt-3 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
              >
                + Add Service
              </button>
            </div>

            {/* Highlights */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Project Highlights <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {formData.highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) => handleArrayChange('highlights', index, e.target.value)}
                      placeholder="e.g., Sustainable materials, Open floor plan"
                      className="flex-1 px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                    {formData.highlights.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('highlights', index)}
                        className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => addArrayItem('highlights')}
                className="mt-3 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
              >
                + Add Highlight
              </button>
            </div>
          </div>

          {/* Project Stats */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Statistics <span className="text-red-500">*</span></h2>
            <p className="text-sm text-gray-600 mb-4">Add key project metrics (e.g., Area, Duration, Rooms)</p>
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  value={statKey}
                  onChange={(e) => setStatKey(e.target.value)}
                  placeholder="Stat name (e.g., Area)"
                  className="px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
                <input
                  type="text"
                  value={statValue}
                  onChange={(e) => setStatValue(e.target.value)}
                  placeholder="Value (e.g., 2,500 sq ft)"
                  className="px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
              <button
                type="button"
                onClick={addStat}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                + Add Statistic
              </button>
            </div>

            {Object.keys(formData.stats).length > 0 && (
              <div className="mt-4 space-y-2">
                {Object.entries(formData.stats).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-sm">
                      <span className="font-semibold text-gray-900">{key}:</span>
                      <span className="text-gray-700 ml-2">{value}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeStat(key)}
                      className="text-red-600 hover:text-red-700 font-medium text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="p-6 bg-gray-50">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
              >
                {loading ? 'Creating Project...' : 'Create Project'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
