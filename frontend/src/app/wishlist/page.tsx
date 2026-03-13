'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Toast from '@/components/Toast';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { MOCK_LISTINGS } from '@/lib/mockData';
import { Heart, Grid3X3, List, Search, Filter } from 'lucide-react';

export default function WishlistPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  
  // Mock wishlist data - in production, this would come from API
  const [wishlistIds, setWishlistIds] = useState<string[]>(['listing_101', 'listing_102']);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date_added');

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Show loading while checking auth
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

  // Get wishlist items
  const wishlistItems = MOCK_LISTINGS.filter(listing => wishlistIds.includes(listing.id));

  // Filter and sort
  const filteredItems = wishlistItems
    .filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return a.price - b.price;
        case 'price_high':
          return b.price - a.price;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'date_added':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const removeFromWishlist = (listingId: string) => {
    setWishlistIds(prev => prev.filter(id => id !== listingId));
    showToast('Removed from wishlist', 'info');
  };

  const clearWishlist = () => {
    setWishlistIds([]);
    showToast('Wishlist cleared', 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Wishlist</h1>
              <p className="text-gray-600">
                {wishlistItems.length} saved {wishlistItems.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>

          {/* Controls */}
          {wishlistItems.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search saved items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
                />
              </div>

              <div className="flex items-center gap-3">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white cursor-pointer"
                >
                  <option value="date_added">Date Added</option>
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
                    <Grid3X3 className="w-5 h-5" />
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

                {/* Clear All */}
                <button
                  onClick={clearWishlist}
                  className="px-4 py-2.5 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors font-medium cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        {filteredItems.length > 0 ? (
          <div className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'
            }
          `}>
            {filteredItems.map(listing => (
              <div key={listing.id} className="relative">
                <ProductCard 
                  listing={listing} 
                  viewMode={viewMode}
                  showWishlistButton={true}
                  isWishlisted={true}
                  onWishlistToggle={() => removeFromWishlist(listing.id)}
                />
              </div>
            ))}
          </div>
        ) : wishlistItems.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start browsing and save items you're interested in. They'll appear here for easy access later.
            </p>
            <button
              onClick={() => router.push('/browse')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-medium hover:from-purple-700 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl cursor-pointer"
            >
              Start Browsing
            </button>
          </div>
        ) : (
          /* No Search Results */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No items found</h2>
            <p className="text-gray-600 mb-8">
              Try adjusting your search or browse more items to add to your wishlist.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors cursor-pointer mr-4"
            >
              Clear Search
            </button>
            <button
              onClick={() => router.push('/browse')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-medium hover:from-purple-700 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl cursor-pointer"
            >
              Browse More
            </button>
          </div>
        )}
      </main>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}