'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import DashboardHeader from '@/components/DashboardHeader';
import Breadcrumb from '@/components/Breadcrumb';
import VerificationPromptModal from '@/components/VerificationPromptModal';
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
  const [meetupLocation, setMeetupLocation] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);
  
  // Autocomplete states
  const [categoryInput, setCategoryInput] = useState('');
  const [campusInput, setCampusInput] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showCampusDropdown, setShowCampusDropdown] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState(CATEGORIES);
  const [filteredCampuses, setFilteredCampuses] = useState(CAMPUSES);

  // Check if seller is verified and show prompt on first listing
  useEffect(() => {
    if (user && user.role === 'SELLER') {
      // Check if user is verified (mock - replace with real API call)
      const isVerified = user.isVerified || false;
      const hasSeenPrompt = localStorage.getItem('verification_prompt_seen');
      
      if (!isVerified && !hasSeenPrompt) {
        setShowVerificationPrompt(true);
      }
    }
  }, [user]);

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
      
      // Success - redirect to browse or my listings
      router.push('/dashboard/listings');
    } catch (err: any) {
      setError(err.message || 'Failed to create listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationUpload = async (file: File) => {
    try {
      // Mock API call - replace with real verification upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mark prompt as seen
      localStorage.setItem('verification_prompt_seen', 'true');
      setShowVerificationPrompt(false);
      
      // Show success message
      setError('');
      alert('Ghana Card uploaded successfully! Your verification is pending review.');
    } catch (err) {
      alert('Failed to upload Ghana Card. Please try again.');
    }
  };

  const handleSkipVerification = () => {
    localStorage.setItem('verification_prompt_seen', 'true');
    setShowVerificationPrompt(false);
  };

  const handleCloseVerificationModal = () => {
    setShowVerificationPrompt(false);
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
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

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Basic Info & Images */}
          <div className="space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden backdrop-blur-sm">
              {/* Gradient accent bar at top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600"></div>
              
              <div className="absolute top-4 right-4 w-16 h-16 opacity-5">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-pink-500">
                  <polygon points="0,0 100,0 100,100" />
                </svg>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Basic Information
              </h2>

              {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">{error}</span>
                  </div>
                </div>
              )}

              {/* Title */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., MacBook Pro M2 - Excellent Condition"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-gray-900 bg-white transition-all"
                />
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your item in detail..."
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-gray-900 bg-white resize-none transition-all"
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-gray-500">{description.length} characters</p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-2 h-2 rounded-full ${description.length > i * 50 ? 'bg-purple-500' : 'bg-gray-200'}`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="mb-0">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Price (GH₵) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">GH₵</span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-14 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-gray-900 bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Images Upload Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-600 via-purple-500 to-pink-600"></div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-purple-600" />
                Product Images
              </h2>
              <p className="text-sm text-gray-500 mb-4">Upload up to 6 images (first image will be the cover)</p>
              
              {/* Upload Area */}
              <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center hover:border-purple-500 hover:bg-purple-50/30 transition-all relative overflow-hidden group mb-4">
                {/* Animated gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Decorative background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-4 left-4 w-6 h-6 border-2 border-purple-400 rotate-45"></div>
                  <div className="absolute top-4 right-4 w-4 h-4 bg-pink-400 rounded-full"></div>
                  <div className="absolute bottom-4 left-4 w-4 h-4 bg-purple-400 rounded-full"></div>
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-2 border-pink-400 rotate-45"></div>
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
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Upload className="w-10 h-10 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 mb-1 text-lg">
                        {images.length >= 6 ? 'Maximum images reached' : 'Upload Images'}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        JPG, PNG or WebP (Max 5MB each)
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <div className="flex gap-1">
                          {[...Array(6)].map((_, i) => (
                            <div 
                              key={i} 
                              className={`w-2 h-2 rounded-full ${i < images.length ? 'bg-purple-500' : 'bg-gray-300'}`}
                            ></div>
                          ))}
                        </div>
                        <span className="text-gray-500 font-medium">{images.length}/6 uploaded</span>
                      </div>
                    </div>
                    {images.length < 6 && (
                      <button
                        type="button"
                        className="px-6 py-2.5 text-sm font-medium bg-white text-purple-600 rounded-lg border-2 border-purple-300 hover:border-purple-400 transition-colors shadow-sm cursor-pointer"
                      >
                        Choose Files
                      </button>
                    )}
                  </div>
                </label>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-black/50 text-white text-xs rounded">
                        {index === 0 ? 'Cover' : index + 1}
                      </div>
                    </div>
                  ))}
                  
                  {/* Add More Button */}
                  {images.length < 6 && (
                    <label 
                      htmlFor="images-upload"
                      className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-purple-400 transition-colors"
                    >
                      <div className="text-center">
                        <Plus className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-500">Add More</p>
                      </div>
                    </label>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Details & Submit */}
          <div className="space-y-6">
            {/* Details Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600"></div>
              
              <div className="absolute bottom-4 left-4 w-16 h-16 opacity-5">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-purple-500">
                  <polygon points="0,100 100,100 0,0" />
                </svg>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Item Details
              </h2>

              {/* Condition */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Condition <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-gray-900 bg-white transition-all cursor-pointer"
                >
                  <option value="">Select condition</option>
                  {CONDITIONS.map(cond => (
                    <option key={cond.value} value={cond.value}>{cond.label}</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div className="mb-6 relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-gray-900 bg-white transition-all"
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
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-gray-900 bg-white transition-all"
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

              {/* Meetup Location */}
              <div className="mb-0">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Meetup Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={meetupLocation}
                  onChange={(e) => setMeetupLocation(e.target.value)}
                  placeholder="e.g., Library Entrance, Cafeteria, Main Gate"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-gray-900 bg-white transition-all"
                />
                <p className="text-xs text-gray-500 mt-2">Specify where buyers can meet you to collect the item</p>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-sm border border-purple-100 p-6">
              <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Tips for a Great Listing
              </h3>
              <ul className="space-y-2 text-sm text-purple-800">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Use clear, well-lit photos from multiple angles</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Be honest about the item's condition</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Include all relevant details in the description</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Price competitively based on condition</span>
                </li>
              </ul>
            </div>

            {/* Submit Buttons */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-3 bg-white text-gray-700 rounded-lg font-medium border-2 border-gray-300 hover:border-gray-400 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-white text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium border-2 border-transparent hover:border-purple-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg hover:shadow-xl relative before:absolute before:inset-0 before:rounded-lg before:p-[2px] before:bg-gradient-to-r before:from-purple-600 before:to-pink-600 before:-z-10 before:m-[-2px]"
                >
                  <span className="text-purple-600 font-bold">{isSubmitting ? 'Creating...' : 'Create Listing'}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* Verification Prompt Modal */}
      {showVerificationPrompt && (
        <VerificationPromptModal
          onClose={handleCloseVerificationModal}
          onSkip={handleSkipVerification}
          onVerify={handleVerificationUpload}
        />
      )}
    </div>
  );
}
