'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import DashboardHeader from '@/components/DashboardHeader';
import Breadcrumb from '@/components/Breadcrumb';
import { CATEGORIES, CONDITIONS, CAMPUSES } from '@/lib/mockData';
import { Upload, X, Plus, ImageIcon } from 'lucide-react';

export default function CreateListingPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('');
  const [category, setCategory] = useState('');
  const [campus, setCampus] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Autocomplete states
  const [categoryInput, setCategoryInput] = useState('');
  const [campusInput, setCampusInput] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showCampusDropdown, setShowCampusDropdown] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState(CATEGORIES);
  const [filteredCampuses, setFilteredCampuses] = useState(CAMPUSES);

  // Redirect if not authorized
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/');
      } else if (user.role !== 'SELLER') {
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, router]);

  // Show loading while checking auth
  if (isLoading || !user || user.role !== 'SELLER') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = 6 - images.length;
    const filesToAdd = files.slice(0, remainingSlots);
    
    if (files.length > remainingSlots) {
      setError(`You can only upload ${remainingSlots} more image${remainingSlots !== 1 ? 's' : ''}`);
      setTimeout(() => setError(''), 3000);
    }
    
    const newImages = [...images, ...filesToAdd];
    setImages(newImages);
    
    // Create previews
    const newPreviews = [...imagePreviews];
    filesToAdd.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        setImagePreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleCategoryInput = (value: string) => {
    setCategoryInput(value);
    setCategory(value);
    const filtered = CATEGORIES.filter(cat => 
      cat.label.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCategories(filtered);
    setShowCategoryDropdown(value.length > 0);
  };

  const handleCampusInput = (value: string) => {
    setCampusInput(value);
    setCampus(value);
    const filtered = CAMPUSES.filter(camp => 
      camp.label.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCampuses(filtered);
    setShowCampusDropdown(value.length > 0);
  };

  const selectCategory = (categoryValue: string, categoryLabel: string) => {
    setCategory(categoryValue);
    setCategoryInput(categoryLabel);
    setShowCategoryDropdown(false);
  };

  const selectCampus = (campusValue: string, campusLabel: string) => {
    setCampus(campusValue);
    setCampusInput(campusLabel);
    setShowCampusDropdown(false);
  };

  const handleCategoryKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filteredCategories.length > 0) {
      e.preventDefault();
      selectCategory(filteredCategories[0].value, filteredCategories[0].label);
    } else if (e.key === 'Escape') {
      setShowCategoryDropdown(false);
    }
  };

  const handleCampusKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filteredCampuses.length > 0) {
      e.preventDefault();
      selectCampus(filteredCampuses[0].value, filteredCampuses[0].label);
    } else if (e.key === 'Escape') {
      setShowCampusDropdown(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Validation
    if (images.length === 0) {
      setError('Please upload at least one image');
      setIsSubmitting(false);
      return;
    }

    try {
      // Mock submission - replace with real API call when backend is ready
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Replace with real API call that handles image upload
      // const formData = new FormData();
      // formData.append('title', title);
      // formData.append('description', description);
      // formData.append('price', price);
      // formData.append('condition', condition);
      // formData.append('category', category);
      // formData.append('campus', campus);
      // images.forEach((image, index) => {
      //   formData.append(`images`, image);
      // });
      
      // const response = await fetch('/api/listings', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: formData
      // });

      // Success - redirect to browse or my listings
      router.push('/dashboard/listings');
    } catch (err: any) {
      setError(err.message || 'Failed to create listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background Decorative Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Left Purple Polygon */}
        <div className="absolute -top-20 -left-20 w-40 h-40 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-purple-600">
            <polygon points="50,0 100,25 100,75 50,100 0,75 0,25" />
          </svg>
        </div>
        
        {/* Top Right Pink Slash */}
        <div className="absolute top-10 right-10 w-32 h-32 opacity-15 rotate-45">
          <div className="w-full h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          <div className="w-full h-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mt-4"></div>
          <div className="w-full h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-4"></div>
        </div>

        {/* Middle Left Triangle */}
        <div className="absolute top-1/3 -left-10 w-24 h-24 opacity-8">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-pink-500">
            <polygon points="50,10 90,90 10,90" />
          </svg>
        </div>

        {/* Middle Right Hexagon */}
        <div className="absolute top-1/2 -right-16 w-36 h-36 opacity-12">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-purple-400">
            <polygon points="50,5 85,25 85,75 50,95 15,75 15,25" />
          </svg>
        </div>

        {/* Bottom Left Diamond */}
        <div className="absolute bottom-20 left-20 w-20 h-20 opacity-10 rotate-45">
          <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg"></div>
        </div>

        {/* Bottom Right Slash Pattern */}
        <div className="absolute bottom-10 right-20 w-28 h-28 opacity-8">
          <div className="absolute inset-0 rotate-12">
            <div className="w-full h-1 bg-purple-500 rounded-full mb-2"></div>
            <div className="w-full h-1 bg-pink-500 rounded-full mb-2"></div>
            <div className="w-full h-1 bg-purple-500 rounded-full mb-2"></div>
            <div className="w-full h-1 bg-pink-500 rounded-full mb-2"></div>
            <div className="w-full h-1 bg-purple-500 rounded-full"></div>
          </div>
        </div>

        {/* Floating Circles */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-purple-400 rounded-full opacity-20"></div>
        <div className="absolute top-3/4 left-3/4 w-2 h-2 bg-pink-400 rounded-full opacity-25"></div>
        <div className="absolute top-1/2 left-1/6 w-4 h-4 bg-purple-300 rounded-full opacity-15"></div>
        <div className="absolute top-1/6 right-1/3 w-2 h-2 bg-pink-300 rounded-full opacity-20"></div>
      </div>

      <DashboardHeader />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Breadcrumb items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Create Listing' }
        ]} />
        
        <div className="mb-8 relative">
          {/* Decorative accent behind title */}
          <div className="absolute -top-4 -left-4 w-16 h-16 opacity-5">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-purple-600">
              <polygon points="50,0 100,50 50,100 0,50" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 relative">Create Listing</h1>
          <p className="text-gray-600">Fill in the details to list your item for sale</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 relative overflow-hidden">
          {/* Form decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-pink-500">
              <polygon points="0,0 100,0 100,100" />
            </svg>
          </div>
          
          <div className="absolute bottom-0 left-0 w-16 h-16 opacity-5">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-purple-500">
              <polygon points="0,100 100,100 0,0" />
            </svg>
          </div>
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., MacBook Pro M2 - Excellent Condition"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your item in detail..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white resize-none"
            />
            <p className="mt-1 text-sm text-gray-500">{description.length} characters</p>
          </div>

          {/* Price */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Price (GH₵) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
            />
          </div>

          {/* Condition */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Condition <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
            >
              <option value="">Select condition</option>
              {CONDITIONS.map(cond => (
                <option key={cond.value} value={cond.value}>{cond.label}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="mb-6 relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={categoryInput}
              onChange={(e) => handleCategoryInput(e.target.value)}
              onKeyDown={handleCategoryKeyDown}
              onFocus={() => setShowCategoryDropdown(categoryInput.length > 0)}
              onBlur={() => setTimeout(() => setShowCategoryDropdown(false), 150)}
              placeholder="Type to search categories..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
            />
            
            {/* Category Dropdown */}
            {showCategoryDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map(cat => (
                    <button
                      key={cat.value}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        selectCategory(cat.value, cat.label);
                      }}
                      className="w-full px-4 py-3 text-left text-gray-900 hover:bg-purple-50 hover:text-purple-700 focus:bg-purple-50 focus:text-purple-700 focus:outline-none cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <span className="font-medium">{cat.label}</span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-600 bg-gray-50 border-b border-gray-100">
                    <span className="font-medium">No categories found.</span>
                    <br />
                    <span className="text-sm">Press Enter to add "{categoryInput}" as a new category.</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Campus */}
          <div className="mb-6 relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Campus <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={campusInput}
              onChange={(e) => handleCampusInput(e.target.value)}
              onKeyDown={handleCampusKeyDown}
              onFocus={() => setShowCampusDropdown(campusInput.length > 0)}
              onBlur={() => setTimeout(() => setShowCampusDropdown(false), 150)}
              placeholder="Type to search campuses..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
            />
            
            {/* Campus Dropdown */}
            {showCampusDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                {filteredCampuses.length > 0 ? (
                  filteredCampuses.map(camp => (
                    <button
                      key={camp.value}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        selectCampus(camp.value, camp.label);
                      }}
                      className="w-full px-4 py-3 text-left text-gray-900 hover:bg-purple-50 hover:text-purple-700 focus:bg-purple-50 focus:text-purple-700 focus:outline-none cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <span className="font-medium">{camp.label}</span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-600 bg-gray-50 border-b border-gray-100">
                    <span className="font-medium">No campuses found.</span>
                    <br />
                    <span className="text-sm">Press Enter to add "{campusInput}" as a new campus.</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Images Upload */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Images <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-500 mb-4">Upload up to 6 images of your item</p>
            
            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors relative overflow-hidden">
              {/* Decorative background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-2 left-2 w-4 h-4 border-2 border-purple-400 rotate-45"></div>
                <div className="absolute top-2 right-2 w-3 h-3 bg-pink-400 rounded-full"></div>
                <div className="absolute bottom-2 left-2 w-3 h-3 bg-purple-400 rounded-full"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-2 border-pink-400 rotate-45"></div>
              </div>
              
              <input
                type="file"
                id="images-upload"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                disabled={images.length >= 6}
              />
              <label 
                htmlFor="images-upload" 
                className={`cursor-pointer relative z-10 ${images.length >= 6 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">
                      {images.length >= 6 ? 'Maximum images reached' : 'Upload Images'}
                    </p>
                    <p className="text-sm text-gray-500">
                      JPG, PNG or WebP (Max 5MB each) • {images.length}/6 uploaded
                    </p>
                  </div>
                  {images.length < 6 && (
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      Choose Files
                    </button>
                  )}
                </div>
              </label>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="mt-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                  
                  {/* Add More Button */}
                  {images.length < 6 && (
                    <label 
                      htmlFor="images-upload"
                      className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-purple-400 transition-colors"
                    >
                      <div className="text-center">
                        <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Add More</p>
                      </div>
                    </label>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Listing'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
