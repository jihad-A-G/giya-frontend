'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getAuthHeaders } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Product {
  _id?: string;
  id?: number;
  name: string;
  category: string;
  price: string;
  image: string;
  description: string;
  features: string[];
  images?: string[];
  video?: string;
  sizes?: string[];
  colors?: string[];
  availability?: string;
  specifications?: Record<string, any>;
}

export default function EditProduct() {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    image: '',
    images: [] as string[],
    video: '',
    description: '',
    features: [''],
    sizes: [''],
    colors: [''],
    availability: 'in-stock',
    specifications: {} as Record<string, string>,
  });
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [multiUploadLoading, setMultiUploadLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${id}`);
      if (response.ok) {
        const product: Product = await response.json();
        console.log('Fetched product:', product);
        setFormData({
          name: product.name || '',
          category: product.category || '',
          price: product.price || '',
          image: product.image || '',
          images: Array.isArray(product.images) ? product.images : [],
          video: product.video || '',
          description: product.description || '',
          features: Array.isArray(product.features) && product.features.length > 0 ? product.features : [''],
          sizes: Array.isArray(product.sizes) && product.sizes.length > 0 ? product.sizes : [''],
          colors: Array.isArray(product.colors) && product.colors.length > 0 ? product.colors : [''],
          availability: product.availability || 'in-stock',
          specifications: product.specifications || {},
        });
      } else {
        const errorData = await response.json();
        console.error('Fetch error:', errorData);
        setError(errorData.error || 'Failed to fetch product');
      }
    } catch (err) {
      console.error('Exception while fetching:', err);
      setError('An error occurred while fetching product');
    } finally {
      setFetchLoading(false);
    }
  };

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
      setError('Please upload a main product image');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          ...formData,
          features: formData.features.filter(f => f.trim() !== ''),
          sizes: formData.sizes.filter(s => s.trim() !== ''),
          colors: formData.colors.filter(c => c.trim() !== ''),
        }),
      });

      if (response.ok) {
        router.push('/admin/products');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update product');
      }
    } catch (err) {
      setError('An error occurred while updating product');
    } finally {
      setLoading(false);
    }
  };

  const handleArrayChange = (field: 'features' | 'sizes' | 'colors', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: 'features' | 'sizes' | 'colors') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (field: 'features' | 'sizes' | 'colors', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const addSpecification = () => {
    if (specKey.trim() && specValue.trim()) {
      setFormData({
        ...formData,
        specifications: {
          ...formData.specifications,
          [specKey]: specValue
        }
      });
      setSpecKey('');
      setSpecValue('');
    }
  };

  const removeSpecification = (key: string) => {
    const newSpecs = { ...formData.specifications };
    delete newSpecs[key];
    setFormData({ ...formData, specifications: newSpecs });
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
        href="/admin/products"
        className="inline-flex items-center text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Products
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="mt-2 text-sm text-gray-600">Update the product information below</p>
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
                <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="Enter product name"
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
                  <option value="Living Room">Living Room</option>
                  <option value="Bedroom">Bedroom</option>
                  <option value="Dining">Dining</option>
                  <option value="Office">Office</option>
                  <option value="Decor">Decor</option>
                  <option value="Outdoor">Outdoor</option>
                </select>
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-900 mb-2">
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="price"
                  required
                  placeholder="e.g., $1,299"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label htmlFor="availability" className="block text-sm font-medium text-gray-900 mb-2">
                  Availability
                </label>
                <select
                  id="availability"
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                  <option value="in-stock">In Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                  <option value="pre-order">Pre-Order</option>
                </select>
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
                placeholder="Enter product description"
              />
            </div>
          </div>

          {/* Images & Media */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Images & Media</h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-900 mb-2">
                  Main Product Image <span className="text-red-500">*</span>
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

          {/* Product Details */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h2>
            
            {/* Features */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Features
              </label>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleArrayChange('features', index, e.target.value)}
                      placeholder="Enter feature"
                      className="flex-1 px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('features', index)}
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
                onClick={() => addArrayItem('features')}
                className="mt-3 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
              >
                + Add Feature
              </button>
            </div>

            {/* Sizes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Available Sizes
              </label>
              <div className="space-y-2">
                {formData.sizes.map((size, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={size}
                      onChange={(e) => handleArrayChange('sizes', index, e.target.value)}
                      placeholder="e.g., Small, Medium, Large, 120x80cm"
                      className="flex-1 px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                    {formData.sizes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('sizes', index)}
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
                onClick={() => addArrayItem('sizes')}
                className="mt-3 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
              >
                + Add Size
              </button>
            </div>

            {/* Colors */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Available Colors
              </label>
              <div className="space-y-2">
                {formData.colors.map((color, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => handleArrayChange('colors', index, e.target.value)}
                      placeholder="e.g., Black, White, Brown, Natural Oak"
                      className="flex-1 px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                    {formData.colors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('colors', index)}
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
                onClick={() => addArrayItem('colors')}
                className="mt-3 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
              >
                + Add Color
              </button>
            </div>
          </div>

          {/* Specifications */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h2>
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  value={specKey}
                  onChange={(e) => setSpecKey(e.target.value)}
                  placeholder="Specification name (e.g., Material)"
                  className="px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
                <input
                  type="text"
                  value={specValue}
                  onChange={(e) => setSpecValue(e.target.value)}
                  placeholder="Value (e.g., Solid Wood)"
                  className="px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
              <button
                type="button"
                onClick={addSpecification}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                + Add Specification
              </button>
            </div>

            {Object.keys(formData.specifications).length > 0 && (
              <div className="mt-4 space-y-2">
                {Object.entries(formData.specifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-sm">
                      <span className="font-semibold text-gray-900">{key}:</span>
                      <span className="text-gray-700 ml-2">{value}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSpecification(key)}
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
                {loading ? 'Updating Product...' : 'Update Product'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
