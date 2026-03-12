'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import ProductCard from '@/components/ProductCard';
import ProductListItem from '@/components/ProductListItem';
import ReportSellerModal from '@/components/ReportSellerModal';
import { MOCK_LISTINGS } from '@/lib/mockData';
import { 
  ShieldCheck, 
  Star, 
  MapPin, 
  Calendar, 
  Package, 
  Grid3x3, 
  List,
  MessageCircle,
  Flag
} from 'lucide-react';

export default function SellerProfilePage() {
  const params = useParams();
  const sellerId = params?.id as string;
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showReportModal, setShowReportModal] = useState(false);

  // Mock seller data - in production this would come from API
  const mockSellers: Record<string, any> = {
    'seller_user_id': {
      id: 'seller_user_id',
      name: 'John Smith',
      email: 'john@student.edu',
      isVerified: true,
      joinedDate: '2023-08-15T12:00:00.000Z',
      campus: 'North Campus',
      rating: 4.8,
      totalSales: 23,
      responseRate: 95,
      bio: 'Computer Science student selling tech items and textbooks. All items are well-maintained and accurately described. Fast shipping and great communication!'
    },
    'seller_user_id2': {
      id: 'seller_user_id2',
      name: 'Sarah Connor',
      email: 'sarah@student.edu',
      isVerified: false,
      joinedDate: '2023-09-10T12:00:00.000Z',
      campus: 'South Campus',
      rating: 4.5,
      totalSales: 12,
      responseRate: 88,
      bio: 'Biology major selling textbooks and lab equipment. All items are in good condition and priced fairly.'
    },
    'seller_user_id8': {
      id: 'seller_user_id8',
      name: 'David Martinez',
      email: 'david@student.edu',
      isVerified: true,
      joinedDate: '2023-07-20T12:00:00.000Z',
      campus: 'Main Campus',
      rating: 4.9,
      totalSales: 45,
      responseRate: 98,
      bio: 'Engineering student with a passion for technology. Selling high-quality electronics and gadgets. All items tested and guaranteed to work perfectly!'
    }
  };

  const mockSeller = mockSellers[sellerId] || {
    id: sellerId,
    name: 'Unknown Seller',
    email: 'unknown@student.edu',
    isVerified: false,
    joinedDate: '2023-01-01T12:00:00.000Z',
    campus: 'Main Campus',
    rating: 4.0,
    totalSales: 0,
    responseRate: 0,
    bio: 'No information available for this seller.'
  };

  // Get seller's listings
  const sellerListings = useMemo(() => {
    let listings = MOCK_LISTINGS.filter(listing => 
      listing.seller.id === sellerId
    );

    // Sort listings
    switch (sortBy) {
      case 'price_low':
        return listings.sort((a, b) => a.price - b.price);
      case 'price_high':
        return listings.sort((a, b) => b.price - a.price);
      case 'title':
        return listings.sort((a, b) => a.title.localeCompare(b.title));
      case 'newest':
      default:
        return listings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [sortBy, sellerId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[
          { label: 'Browse', href: '/browse' },
          { label: mockSeller.name }
        ]} />

        {/* Seller Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left Sidebar - Seller Card */}
            <div className="lg:col-span-3 bg-gray-50 p-6 border-r border-gray-200">
              <div className="flex flex-col items-center text-center mb-6">
                {/* Avatar */}
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg mb-4">
                  <span className="text-white font-bold text-5xl">
                    {mockSeller.name.charAt(0)}
                  </span>
                </div>

                {/* Name and Verification */}
                <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
                  {mockSeller.name}
                </h1>
                
                {mockSeller.isVerified && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verified ID</span>
                  </div>
                )}

                {/* Join Date */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                  <Calendar className="w-4 h-4" />
                  <span>Member since {formatDate(mockSeller.joinedDate)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mb-6">
                <button 
                  onClick={() => setShowReportModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <Flag className="w-5 h-5" />
                  <span>Report Seller</span>
                </button>
              </div>

              {/* About Seller */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-bold text-gray-900 mb-3 uppercase text-sm">About Seller</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {mockSeller.bio}
                </p>
              </div>
            </div>

            {/* Right Content - Stats and Info */}
            <div className="lg:col-span-9 p-6">
              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Package className="w-5 h-5 text-purple-600" />
                    <span className="text-2xl font-bold text-gray-900">{sellerListings.length}</span>
                  </div>
                  <p className="text-sm text-gray-600">Active Ads</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="text-2xl font-bold text-gray-900">{mockSeller.rating}</span>
                  </div>
                  <p className="text-sm text-gray-600">Rating</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                    <span className="text-2xl font-bold text-gray-900">{mockSeller.totalSales}</span>
                  </div>
                  <p className="text-sm text-gray-600">Total Sales</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                    <span className="text-2xl font-bold text-gray-900">{mockSeller.responseRate}%</span>
                  </div>
                  <p className="text-sm text-gray-600">Response Rate</p>
                </div>
              </div>

              {/* Location Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Location</p>
                    <p className="text-sm text-gray-700">{mockSeller.campus}</p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Member Since</p>
                  <p className="font-semibold text-gray-900">{formatDate(mockSeller.joinedDate)}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Last Active</p>
                  <p className="font-semibold text-gray-900">3 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Listings Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Listings ({sellerListings.length})
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="title">Title A-Z</option>
              </select>

              {/* View Mode */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors cursor-pointer ${
                    viewMode === 'grid' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors cursor-pointer ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Listings Grid/List */}
          {sellerListings.length > 0 ? (
            <div className={`
              ${viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                : 'space-y-4'
              }
            `}>
              {sellerListings.map(listing => (
                viewMode === 'grid' ? (
                  <ProductCard 
                    key={listing.id} 
                    listing={listing}
                    showWishlistButton={true}
                  />
                ) : (
                  <ProductListItem 
                    key={listing.id} 
                    {...listing}
                  />
                )
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Listings</h3>
              <p className="text-gray-600">
                This seller doesn't have any active listings at the moment.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Report Seller Modal */}
      <ReportSellerModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        sellerName={mockSeller.name}
        sellerId={sellerId}
      />
    </div>
  );
}