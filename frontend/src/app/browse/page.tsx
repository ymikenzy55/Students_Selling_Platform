'use client';

import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import ProductCard from "@/components/ProductCard";
import ProductListItem from "@/components/ProductListItem";
import { MOCK_LISTINGS, CATEGORIES, CONDITIONS, CAMPUSES } from "@/lib/mockData";
import { SlidersHorizontal, X, Grid3x3, List } from "lucide-react";

export default function BrowsePage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get('search') || '';
  const categoryFromUrl = searchParams?.get('category') || '';
  
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCondition, setSelectedCondition] = useState<string>('');
  const [selectedCampus, setSelectedCampus] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Update selected category when URL parameter changes
  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedCondition, selectedCampus, priceRange, verifiedOnly, minRating, sortBy]);

  // Filter and sort listings
  const filteredListings = useMemo(() => {
    let filtered = MOCK_LISTINGS.filter(listing => {
      // Search filter
      if (searchQuery && !listing.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Category filter
      if (selectedCategory && listing.category !== selectedCategory) {
        return false;
      }
      
      // Condition filter
      if (selectedCondition && listing.condition !== selectedCondition) {
        return false;
      }
      
      // Campus filter
      if (selectedCampus && listing.campus !== selectedCampus) {
        return false;
      }
      
      // Price range filter
      if (listing.price < priceRange[0] || listing.price > priceRange[1]) {
        return false;
      }
      
      // Verified sellers only filter
      if (verifiedOnly && !listing.seller.isVerified) {
        return false;
      }
      
      // Minimum rating filter (mock - using verification as proxy for now)
      // In production, this would check actual seller rating from API
      if (minRating > 0) {
        const sellerRating = listing.seller.isVerified ? 4.5 : 3.5; // Mock rating
        if (sellerRating < minRating) {
          return false;
        }
      }
      
      return true;
    });

    // Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === 'title-az') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'title-za') {
      filtered.sort((a, b) => b.title.localeCompare(a.title));
    } else {
      // newest (default)
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedCondition, selectedCampus, priceRange, sortBy, verifiedOnly, minRating]);

  // Pagination
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedListings = filteredListings.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedCondition('');
    setSelectedCampus('');
    setPriceRange([0, 50000]);
    setVerifiedOnly(false);
    setMinRating(0);
  };

  const hasActiveFilters = selectedCategory || selectedCondition || selectedCampus || priceRange[0] > 0 || priceRange[1] < 50000 || verifiedOnly || minRating > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { label: 'Browse', href: '/browse' },
            ...(selectedCategory ? [{ label: selectedCategory }] : [])
          ]} 
        />

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            {searchQuery ? `Search results for "${searchQuery}"` : 'Browse Listings'}
          </h1>
          <p className="text-gray-600">
            {filteredListings.length} {filteredListings.length === 1 ? 'item' : 'items'} available
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Condition Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Condition</label>
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900"
                >
                  <option value="">All Conditions</option>
                  {CONDITIONS.map(cond => (
                    <option key={cond.value} value={cond.value}>{cond.label}</option>
                  ))}
                </select>
              </div>

              {/* Campus Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Campus</label>
                <select
                  value={selectedCampus}
                  onChange={(e) => setSelectedCampus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900"
                >
                  <option value="">All Campuses</option>
                  {CAMPUSES.map(campus => (
                    <option key={campus.value} value={campus.value}>{campus.label}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Price Range: GH₵{priceRange[0]} - GH₵{priceRange[1].toLocaleString()}
                </label>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>

              {/* Verified Sellers Only */}
              <div className="mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">Verified Sellers Only</span>
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </label>
              </div>

              {/* Minimum Rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Minimum Seller Rating
                </label>
                <div className="space-y-2">
                  {[
                    { value: 0, label: 'Any Rating' },
                    { value: 3, label: '3+ Stars' },
                    { value: 4, label: '4+ Stars' },
                    { value: 4.5, label: '4.5+ Stars' }
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                        minRating === option.value ? 'bg-purple-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="rating"
                        value={option.value}
                        checked={minRating === option.value}
                        onChange={(e) => setMinRating(parseFloat(e.target.value))}
                        className="w-4 h-4 text-purple-600 cursor-pointer"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900">{option.label}</span>
                        {option.value > 0 && (
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(option.value) ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort and Mobile Filter Toggle */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-6 gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filters</span>
                </button>

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
              </div>

              {/* Sort Bar - Mobile Optimized */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
                <span className="text-sm font-medium text-gray-700 hidden sm:block flex-shrink-0">Sort:</span>
                <button
                  onClick={() => setSortBy('newest')}
                  className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex-shrink-0 cursor-pointer ${
                    sortBy === 'newest'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Newest
                </button>
                <button
                  onClick={() => setSortBy('price-low')}
                  className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex-shrink-0 cursor-pointer ${
                    sortBy === 'price-low'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Price ↑
                </button>
                <button
                  onClick={() => setSortBy('price-high')}
                  className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex-shrink-0 cursor-pointer ${
                    sortBy === 'price-high'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Price ↓
                </button>
                <button
                  onClick={() => setSortBy('title-az')}
                  className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex-shrink-0 cursor-pointer ${
                    sortBy === 'title-az'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  A-Z
                </button>
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden mb-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900"
                    >
                      <option value="">All Categories</option>
                      {CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Condition</label>
                    <select
                      value={selectedCondition}
                      onChange={(e) => setSelectedCondition(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900"
                    >
                      <option value="">All Conditions</option>
                      {CONDITIONS.map(cond => (
                        <option key={cond.value} value={cond.value}>{cond.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Campus</label>
                    <select
                      value={selectedCampus}
                      onChange={(e) => setSelectedCampus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900"
                    >
                      <option value="">All Campuses</option>
                      {CAMPUSES.map(campus => (
                        <option key={campus.value} value={campus.value}>{campus.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={verifiedOnly}
                        onChange={(e) => setVerifiedOnly(e.target.checked)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-700">Verified Sellers Only</span>
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Minimum Seller Rating
                    </label>
                    <select
                      value={minRating}
                      onChange={(e) => setMinRating(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900"
                    >
                      <option value="0">Any Rating</option>
                      <option value="3">3+ Stars ⭐⭐⭐</option>
                      <option value="4">4+ Stars ⭐⭐⭐⭐</option>
                      <option value="4.5">4.5+ Stars ⭐⭐⭐⭐⭐</option>
                    </select>
                  </div>

                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Product Grid or List */}
            {paginatedListings.length > 0 ? (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {paginatedListings.map(listing => (
                      <ProductCard key={listing.id} listing={listing} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paginatedListings.map(listing => (
                      <ProductListItem key={listing.id} {...listing} />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Page Info */}
                    <div className="text-sm text-gray-600">
                      Showing {startIndex + 1}-{Math.min(endIndex, filteredListings.length)} of {filteredListings.length} items
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center gap-2">
                      {/* Previous Button */}
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        Previous
                      </button>

                      {/* Page Numbers */}
                      <div className="flex items-center gap-1">
                        {[...Array(totalPages)].map((_, index) => {
                          const page = index + 1;
                          
                          // Show first page, last page, current page, and pages around current
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <button
                                key={page}
                                onClick={() => goToPage(page)}
                                className={`w-10 h-10 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                                  currentPage === page
                                    ? 'bg-purple-600 text-white shadow-md'
                                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                {page}
                              </button>
                            );
                          } else if (
                            page === currentPage - 2 ||
                            page === currentPage + 2
                          ) {
                            return (
                              <span key={page} className="px-2 text-gray-400">
                                ...
                              </span>
                            );
                          }
                          return null;
                        })}
                      </div>

                      {/* Next Button */}
                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <svg className="w-24 h-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No listings found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search query</p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
