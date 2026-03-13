'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import DashboardHeader from '@/components/DashboardHeader';
import Breadcrumb from '@/components/Breadcrumb';
import { MOCK_LISTINGS } from '@/lib/mockData';
import { Package, Edit, Trash2, CheckCircle, Grid3x3, List } from 'lucide-react';
import Image from 'next/image';

export default function MyListingsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [listings, setListings] = useState(MOCK_LISTINGS);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<string | null>(null);

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

  const handleMarkAsSold = (id: string) => {
    // Mock action - replace with real API call
    setListings(listings.map(listing => 
      listing.id === id ? { ...listing, isSoldOut: true } : listing
    ));
  };

  const handleDeleteClick = (id: string) => {
    setListingToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (listingToDelete) {
      // Mock action - replace with real API call
      setListings(listings.filter(listing => listing.id !== listingToDelete));
      setShowDeleteModal(false);
      setListingToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setListingToDelete(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCondition = (cond: string) => {
    return cond.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        <Breadcrumb 
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'My Listings' }
          ]} 
        />
        
        {/* Page Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1 sm:mb-2">My Listings</h1>
            <p className="text-sm sm:text-base text-gray-600">
              {listings.length} {listings.length === 1 ? 'listing' : 'listings'} total
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Grid view"
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => router.push('/create-listing')}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg border-2 border-transparent hover:border-purple-300 transition-all font-medium shadow-md hover:shadow-lg cursor-pointer relative before:absolute before:inset-0 before:rounded-lg before:p-[2px] before:bg-gradient-to-r before:from-purple-600 before:to-pink-600 before:-z-10 before:m-[-2px] text-sm sm:text-base"
            >
              <span className="text-purple-600">Create New</span>
            </button>
          </div>
        </div>

        {/* Listings */}
        {listings.length > 0 ? (
          viewMode === 'list' ? (
            <div className="space-y-4">
              {listings.map(listing => (
                <div
                  key={listing.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                    {/* Image */}
                    <div className="relative w-full sm:w-32 h-48 sm:h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={listing.imageUrl}
                        alt={listing.title}
                        fill
                        className="object-cover"
                      />
                      {listing.isSoldOut && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                            SOLD
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-4 mb-2">
                        <div className="flex-1 w-full">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                            {listing.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {listing.description}
                          </p>
                        </div>
                        <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1 w-full sm:w-auto justify-between sm:justify-start flex-shrink-0">
                          <span className="text-xl sm:text-2xl font-extrabold text-purple-600">
                            GH₵{listing.price.toFixed(2)}
                          </span>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            listing.isSoldOut 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {listing.isSoldOut ? 'Sold Out' : 'Active'}
                          </span>
                        </div>
                      </div>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-4">
                        <span className="font-medium">{formatCondition(listing.condition)}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{listing.category}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline">{listing.campus}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>Posted {formatDate(listing.createdAt)}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => router.push(`/listing/${listing.id}`)}
                          className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium bg-white text-purple-600 rounded-lg border-2 border-purple-300 hover:border-purple-400 transition-colors cursor-pointer"
                        >
                          View
                        </button>
                        {!listing.isSoldOut && (
                          <>
                            <button
                              onClick={() => handleMarkAsSold(listing.id)}
                              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium bg-white text-green-600 rounded-lg border-2 border-green-300 hover:border-green-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              <span className="hidden sm:inline">Mark as Sold</span>
                              <span className="sm:hidden">Sold</span>
                            </button>
                            <button
                              onClick={() => router.push(`/listing/${listing.id}/edit`)}
                              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium bg-white text-gray-600 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              <span className="hidden sm:inline">Edit</span>
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteClick(listing.id)}
                          className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium bg-white text-red-600 rounded-lg border-2 border-red-300 hover:border-red-400 transition-colors flex items-center gap-1.5 sm:ml-auto cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {listings.map(listing => (
                <div
                  key={listing.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gray-100">
                    <Image
                      src={listing.imageUrl}
                      alt={listing.title}
                      fill
                      className="object-cover"
                    />
                    {listing.isSoldOut && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          SOLD
                        </span>
                      </div>
                    )}
                    <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
                      listing.isSoldOut 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {listing.isSoldOut ? 'Sold Out' : 'Active'}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
                      {listing.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {listing.description}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-extrabold text-purple-600">
                        GH₵{listing.price.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(listing.createdAt)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => router.push(`/listing/${listing.id}`)}
                        className="w-full px-3 py-2 text-sm font-medium bg-white text-purple-600 rounded-lg border-2 border-purple-300 hover:border-purple-400 transition-colors cursor-pointer"
                      >
                        View Details
                      </button>
                      <div className="flex gap-2">
                        {!listing.isSoldOut && (
                          <button
                            onClick={() => handleMarkAsSold(listing.id)}
                            className="flex-1 px-3 py-2 text-xs font-medium bg-white text-green-600 rounded-lg border-2 border-green-300 hover:border-green-400 transition-colors cursor-pointer"
                          >
                            Mark Sold
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteClick(listing.id)}
                          className="flex-1 px-3 py-2 text-xs font-medium bg-white text-red-600 rounded-lg border-2 border-red-300 hover:border-red-400 transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No listings yet</h3>
            <p className="text-gray-600 mb-6">Start selling by creating your first listing</p>
            <button
              onClick={() => router.push('/create-listing')}
              className="px-6 py-3 bg-white text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg border-2 border-transparent hover:border-purple-300 transition-all font-medium cursor-pointer relative before:absolute before:inset-0 before:rounded-lg before:p-[2px] before:bg-gradient-to-r before:from-purple-600 before:to-pink-600 before:-z-10 before:m-[-2px]"
            >
              <span className="text-purple-600">Create Your First Listing</span>
            </button>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Listing</h3>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this listing? This action cannot be undone.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ Deleting this listing will permanently remove it from the marketplace. Any pending bids will be cancelled.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDeleteCancel}
                className="flex-1 px-4 py-3 bg-white text-gray-700 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-3 bg-white text-red-600 rounded-lg border-2 border-red-300 hover:border-red-400 transition-colors font-medium cursor-pointer"
              >
                Delete Listing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
