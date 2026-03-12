'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import DashboardHeader from '@/components/DashboardHeader';
import Breadcrumb from '@/components/Breadcrumb';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  ShieldAlert, 
  Edit2, 
  Save, 
  X,
  Upload,
  CheckCircle2
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    campus: ''
  });
  const [ghanaCardFile, setGhanaCardFile] = useState<File | null>(null);
  const [ghanaCardPreview, setGhanaCardPreview] = useState<string>('');
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'rejected'>('pending');
  const [error, setError] = useState('');
  
  // Modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // 2FA state
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  
  // Delete account confirmation
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Mock user data - in real app this would come from API
  const mockUserData = {
    name: user?.name || 'Jane Doe',
    email: user?.email || 'jane@student.edu',
    phone: '+233 55 123 4567',
    campus: 'Main Campus',
    joinedDate: '2023-10-01T12:00:00.000Z',
    isVerified: false,
    verificationSubmitted: false
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Initialize form data
  useEffect(() => {
    if (user) {
      setFormData({
        name: mockUserData.name,
        email: mockUserData.email,
        phone: mockUserData.phone,
        campus: mockUserData.campus
      });
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setGhanaCardFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setGhanaCardPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitVerification = async () => {
    if (!ghanaCardFile) {
      setError('Please upload your Ghana Card');
      return;
    }

    setIsSubmitting(true);
    setError('');

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setVerificationStatus('pending');
    setIsSubmitting(false);
    setGhanaCardFile(null);
    setGhanaCardPreview('');
  };

  const handleSaveProfile = async () => {
    setIsSubmitting(true);
    setError('');

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsEditing(false);
    setIsSubmitting(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsSubmitting(true);
    setError('');

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setShowPasswordModal(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsSubmitting(false);
  };

  const handleToggle2FA = async () => {
    setIsSubmitting(true);

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIs2FAEnabled(!is2FAEnabled);
    setShow2FAModal(false);
    setIsSubmitting(false);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE MY ACCOUNT') {
      setError('Please type "DELETE MY ACCOUNT" to confirm');
      return;
    }

    setIsSubmitting(true);

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    logout();
    router.push('/');
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb 
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Profile' }
          ]} 
        />

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account and verification status</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info & Verification (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden">
              {/* Gradient accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600"></div>
              
              <div className="absolute top-4 right-4 w-16 h-16 opacity-5">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-pink-500">
                  <polygon points="0,0 100,0 100,100" />
                </svg>
              </div>

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-600" />
                  Profile Information
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-sm font-medium bg-white text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg border-2 border-transparent hover:border-purple-300 transition-all flex items-center gap-2 cursor-pointer relative before:absolute before:inset-0 before:rounded-lg before:p-[2px] before:bg-gradient-to-r before:from-purple-600 before:to-pink-600 before:-z-10 before:m-[-2px]"
                  >
                    <Edit2 className="w-4 h-4 text-purple-600" />
                    <span className="text-purple-600">Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-sm font-medium bg-white text-gray-600 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSubmitting}
                      className="px-4 py-2 text-sm font-medium bg-white text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg border-2 border-transparent hover:border-purple-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer relative before:absolute before:inset-0 before:rounded-lg before:p-[2px] before:bg-gradient-to-r before:from-purple-600 before:to-pink-600 before:-z-10 before:m-[-2px]"
                    >
                      <Save className="w-4 h-4 text-purple-600" />
                      <span className="text-purple-600">{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <User className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-900">{formData.name}</span>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-900">{formData.email}</span>
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-900">{formData.phone}</span>
                    </div>
                  )}
                </div>

                {/* Campus */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Campus
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.campus}
                      onChange={(e) => setFormData({...formData, campus: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
                    >
                      <option value="Main Campus">Main Campus</option>
                      <option value="North Campus">North Campus</option>
                      <option value="South Campus">South Campus</option>
                      <option value="East Campus">East Campus</option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-900">{formData.campus}</span>
                    </div>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Account Type
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900 capitalize">{user.role.toLowerCase()}</span>
                  </div>
                </div>

                {/* Member Since */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Member Since
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900">{formatDate(mockUserData.joinedDate)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ghana Card Verification */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-600 via-purple-500 to-pink-600"></div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-600" />
                Ghana Card Verification
              </h2>
              
              <div className="space-y-6">
                {/* Verification Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {verificationStatus === 'verified' ? (
                      <ShieldCheck className="w-6 h-6 text-green-500" />
                    ) : verificationStatus === 'rejected' ? (
                      <ShieldAlert className="w-6 h-6 text-red-500" />
                    ) : (
                      <ShieldAlert className="w-6 h-6 text-yellow-500" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {verificationStatus === 'verified' ? 'Verified Seller' : 
                         verificationStatus === 'rejected' ? 'Verification Rejected' : 
                         'Verification Pending'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {verificationStatus === 'verified' ? 'Your Ghana Card has been verified' : 
                         verificationStatus === 'rejected' ? 'Please upload a clearer image' : 
                         'Upload your Ghana Card for verification'}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    verificationStatus === 'verified' ? 'bg-green-100 text-green-700' :
                    verificationStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {verificationStatus === 'verified' ? 'Verified' : 
                     verificationStatus === 'rejected' ? 'Rejected' : 
                     'Pending'}
                  </span>
                </div>

                {/* Upload Form */}
                {verificationStatus !== 'verified' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Upload Ghana Card
                    </label>
                    
                    {error && (
                      <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                        {error}
                      </div>
                    )}

                    {ghanaCardPreview ? (
                      <div className="space-y-4">
                        <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={ghanaCardPreview}
                            alt="Ghana Card preview"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              setGhanaCardFile(null);
                              setGhanaCardPreview('');
                            }}
                            className="px-4 py-2 text-sm font-medium bg-white text-gray-600 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors cursor-pointer"
                          >
                            Remove
                          </button>
                          <button
                            onClick={handleSubmitVerification}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium bg-white text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg border-2 border-transparent hover:border-purple-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer relative before:absolute before:inset-0 before:rounded-lg before:p-[2px] before:bg-gradient-to-r before:from-purple-600 before:to-pink-600 before:-z-10 before:m-[-2px]"
                          >
                            <span className="text-purple-600">{isSubmitting ? 'Submitting...' : 'Submit for Verification'}</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors cursor-pointer">
                        <input
                          type="file"
                          id="ghana-card-upload"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <label htmlFor="ghana-card-upload" className="cursor-pointer">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center">
                              <Upload className="w-8 h-8 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 mb-1">Upload Ghana Card</p>
                              <p className="text-sm text-gray-500">JPG, PNG or PDF (Max 5MB)</p>
                            </div>
                            <button
                              type="button"
                              className="px-4 py-2 text-sm font-medium bg-white text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg border-2 border-transparent hover:border-purple-300 transition-all cursor-pointer relative before:absolute before:inset-0 before:rounded-lg before:p-[2px] before:bg-gradient-to-r before:from-purple-600 before:to-pink-600 before:-z-10 before:m-[-2px]"
                            >
                              <span className="text-purple-600">Choose File</span>
                            </button>
                          </div>
                        </label>
                      </div>
                    )}
                  </div>
                )}

                {/* Verification Benefits */}
                {verificationStatus !== 'verified' && (
                  <div className="bg-purple-50 rounded-xl p-4">
                    <h3 className="font-semibold text-purple-900 mb-2">Why Get Verified?</h3>
                    <ul className="space-y-2 text-sm text-purple-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Build trust with buyers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Higher visibility in search results</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Access to premium features</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Actions (1/3 width) */}
          <div className="space-y-6">
            {/* Account Stats */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-sm border border-purple-100 p-6">
              <h3 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                Account Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="text-sm text-gray-600 font-medium">Active Listings</span>
                  <span className="font-bold text-purple-600 text-lg">3</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="text-sm text-gray-600 font-medium">Total Sales</span>
                  <span className="font-bold text-purple-600 text-lg">GH₵ 1,250</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="text-sm text-gray-600 font-medium">Bids Received</span>
                  <span className="font-bold text-purple-600 text-lg">12</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="text-sm text-gray-600 font-medium">Response Rate</span>
                  <span className="font-bold text-purple-600 text-lg">95%</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600"></div>
              
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/create-listing')}
                  className="w-full px-4 py-3 text-left bg-white text-purple-600 rounded-lg border-2 border-transparent hover:border-purple-300 transition-all font-medium cursor-pointer relative before:absolute before:inset-0 before:rounded-lg before:p-[2px] before:bg-gradient-to-r before:from-purple-600 before:to-pink-600 before:-z-10 before:m-[-2px]"
                >
                  Create New Listing
                </button>
                <button
                  onClick={() => router.push('/dashboard/listings')}
                  className="w-full px-4 py-3 text-left bg-white text-gray-700 rounded-lg border-2 border-transparent hover:border-purple-300 transition-all font-medium cursor-pointer relative before:absolute before:inset-0 before:rounded-lg before:p-[2px] before:bg-gradient-to-r before:from-purple-600 before:to-pink-600 before:-z-10 before:m-[-2px]"
                >
                  View My Listings
                </button>
                <button
                  onClick={() => router.push('/browse')}
                  className="w-full px-4 py-3 text-left bg-white text-gray-700 rounded-lg border-2 border-transparent hover:border-purple-300 transition-all font-medium cursor-pointer relative before:absolute before:inset-0 before:rounded-lg before:p-[2px] before:bg-gradient-to-r before:from-purple-600 before:to-pink-600 before:-z-10 before:m-[-2px]"
                >
                  Browse Listings
                </button>
              </div>
            </div>

            {/* Account Security */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
              
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Account Security
              </h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full px-4 py-3 text-left bg-white text-gray-700 rounded-lg border-2 border-transparent hover:border-purple-300 transition-all font-medium cursor-pointer relative before:absolute before:inset-0 before:rounded-lg before:p-[2px] before:bg-gradient-to-r before:from-purple-600 before:to-pink-600 before:-z-10 before:m-[-2px]"
                >
                  Change Password
                </button>
                <button 
                  onClick={() => setShow2FAModal(true)}
                  className="w-full px-4 py-3 text-left bg-white text-gray-700 rounded-lg border-2 border-transparent hover:border-purple-300 transition-all font-medium cursor-pointer relative before:absolute before:inset-0 before:rounded-lg before:p-[2px] before:bg-gradient-to-r before:from-purple-600 before:to-pink-600 before:-z-10 before:m-[-2px]"
                >
                  Two-Factor Authentication
                </button>
                <button 
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full px-4 py-3 text-left bg-white text-red-600 rounded-lg border-2 border-transparent hover:border-red-300 transition-all font-medium cursor-pointer relative before:absolute before:inset-0 before:rounded-lg before:p-[2px] before:bg-gradient-to-r before:from-red-500 before:to-orange-500 before:-z-10 before:m-[-2px]"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Change Password</h3>
              
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setError('');
                  }}
                  className="flex-1 px-4 py-3 bg-white text-gray-700 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={isSubmitting || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                  className="flex-1 px-4 py-3 bg-white text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg border-2 border-transparent hover:border-purple-300 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer relative before:absolute before:inset-0 before:rounded-lg before:p-[2px] before:bg-gradient-to-r before:from-purple-600 before:to-pink-600 before:-z-10 before:m-[-2px]"
                >
                  <span className="text-purple-600">{isSubmitting ? 'Changing...' : 'Change Password'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Two-Factor Authentication Modal */}
        {show2FAModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Two-Factor Authentication</h3>
              
              <div className="mb-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
                  <div>
                    <p className="font-medium text-gray-900">Status</p>
                    <p className="text-sm text-gray-500">
                      {is2FAEnabled ? 'Currently enabled' : 'Currently disabled'}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    is2FAEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {is2FAEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  {is2FAEnabled 
                    ? 'Disabling 2FA will make your account less secure. You will only need your password to log in.'
                    : 'Enable two-factor authentication to add an extra layer of security to your account. You will need to enter a code from your phone when logging in.'
                  }
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShow2FAModal(false)}
                  className="flex-1 px-4 py-3 bg-white text-gray-700 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleToggle2FA}
                  disabled={isSubmitting}
                  className={`flex-1 px-4 py-3 bg-white rounded-lg border-2 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                    is2FAEnabled 
                      ? 'text-red-600 border-red-300 hover:border-red-400' 
                      : 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 border-transparent hover:border-purple-300 relative before:absolute before:inset-0 before:rounded-lg before:p-[2px] before:bg-gradient-to-r before:from-purple-600 before:to-pink-600 before:-z-10 before:m-[-2px]'
                  }`}
                >
                  <span className={is2FAEnabled ? '' : 'text-purple-600'}>
                    {isSubmitting ? 'Processing...' : is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Account</h3>
              
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="mb-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-red-800 font-medium mb-2">⚠️ Warning: This action cannot be undone</p>
                  <p className="text-sm text-red-700">
                    Deleting your account will permanently remove all your data, including:
                  </p>
                  <ul className="text-sm text-red-700 list-disc list-inside mt-2 space-y-1">
                    <li>All your listings</li>
                    <li>Transaction history</li>
                    <li>Messages and conversations</li>
                    <li>Profile information</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Type <span className="font-mono text-red-600">DELETE MY ACCOUNT</span> to confirm
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => {
                      setDeleteConfirmText(e.target.value);
                      setError('');
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 bg-white"
                    placeholder="DELETE MY ACCOUNT"
                  />
                </div>

                <p className="text-sm text-gray-600">
                  Are you sure you want to delete your account? This action is permanent and cannot be reversed.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmText('');
                    setError('');
                  }}
                  className="flex-1 px-4 py-3 bg-white text-gray-700 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isSubmitting || deleteConfirmText !== 'DELETE MY ACCOUNT'}
                  className="flex-1 px-4 py-3 bg-white text-red-600 rounded-lg border-2 border-red-300 hover:border-red-400 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}