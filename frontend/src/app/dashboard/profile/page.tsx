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
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSubmitting}
                      className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Ghana Card Verification</h2>
              
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
                            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            Remove
                          </button>
                          <button
                            onClick={handleSubmitVerification}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
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
                              className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                            >
                              Choose File
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

          {/* Right Column - Stats & Actions */}
          <div className="space-y-6">
            {/* Account Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Account Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Listings</span>
                  <span className="font-bold text-gray-900">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Sales</span>
                  <span className="font-bold text-gray-900">GH₵ 1,250</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Bids Received</span>
                  <span className="font-bold text-gray-900">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Response Rate</span>
                  <span className="font-bold text-gray-900">95%</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/create-listing')}
                  className="w-full px-4 py-3 text-left text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors font-medium"
                >
                  Create New Listing
                </button>
                <button
                  onClick={() => router.push('/dashboard/listings')}
                  className="w-full px-4 py-3 text-left text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  View My Listings
                </button>
                <button
                  onClick={() => router.push('/browse')}
                  className="w-full px-4 py-3 text-left text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  Browse Listings
                </button>
              </div>
            </div>

            {/* Account Security */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Account Security</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full px-4 py-3 text-left text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors font-medium cursor-pointer"
                >
                  Change Password
                </button>
                <button 
                  onClick={() => setShow2FAModal(true)}
                  className="w-full px-4 py-3 text-left text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors font-medium cursor-pointer"
                >
                  Two-Factor Authentication
                </button>
                <button 
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full px-4 py-3 text-left text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors font-medium cursor-pointer"
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
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={isSubmitting || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                  className="flex-1 px-4 py-3 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? 'Changing...' : 'Change Password'}
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
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleToggle2FA}
                  disabled={isSubmitting}
                  className={`flex-1 px-4 py-3 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                    is2FAEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  {isSubmitting ? 'Processing...' : is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
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
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isSubmitting || deleteConfirmText !== 'DELETE MY ACCOUNT'}
                  className="flex-1 px-4 py-3 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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