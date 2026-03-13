'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { 
  Search, 
  Menu, 
  X, 
  User, 
  Package, 
  Gavel, 
  CreditCard, 
  LogOut, 
  ChevronDown,
  Laptop,
  BookOpen,
  Armchair,
  Shirt,
  Grid3x3,
  LayoutDashboard,
  MessageCircle,
  Heart,
  Plus,
  List
} from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { user, logout, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);

  // Mock search suggestions - in production, this would come from API
  const MOCK_POPULAR_SEARCHES = [
    'MacBook Pro',
    'iPhone 13',
    'Biology Textbook',
    'Gaming Mouse',
    'Desk Lamp',
    'Backpack',
    'Calculator',
    'Headphones',
    'Study Table',
    'Winter Jacket'
  ];

  const MOCK_RECENT_SEARCHES = [
    'MacBook',
    'Textbooks',
    'Furniture'
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchSuggestions(false);
      window.location.href = `/browse?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
    
    if (value.trim().length > 0) {
      // Filter suggestions based on input
      const filtered = MOCK_POPULAR_SEARCHES.filter(item =>
        item.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setSearchSuggestions(filtered);
      setShowSearchSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSearchSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSearchSuggestions(false);
    window.location.href = `/browse?search=${encodeURIComponent(suggestion)}`;
  };

  return (
    <>
      {/* Main Navigation - Sticky */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 cursor-pointer">
              <video
                src="/logo.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="h-10 w-auto rounded-lg pointer-events-none"
              />
            </Link>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-2 relative">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  onFocus={() => {
                    if (searchQuery.trim().length > 0) {
                      setShowSearchSuggestions(true);
                    }
                  }}
                  onBlur={() => {
                    // Delay to allow click on suggestions
                    setTimeout(() => setShowSearchSuggestions(false), 200);
                  }}
                  placeholder="Search for items..."
                  className="w-full px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
                />
                
                {/* Search Suggestions Dropdown */}
                {showSearchSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-80 overflow-y-auto">
                    {searchQuery.trim().length === 0 ? (
                      <>
                        {/* Recent Searches */}
                        {MOCK_RECENT_SEARCHES.length > 0 && (
                          <div className="px-4 py-2">
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Recent Searches</p>
                            {MOCK_RECENT_SEARCHES.map((item, index) => (
                              <button
                                key={index}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  handleSuggestionClick(item);
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                              >
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {item}
                              </button>
                            ))}
                          </div>
                        )}
                        
                        {/* Popular Searches */}
                        <div className="px-4 py-2 border-t border-gray-100">
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Popular Searches</p>
                          {MOCK_POPULAR_SEARCHES.slice(0, 5).map((item, index) => (
                            <button
                              key={index}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleSuggestionClick(item);
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                            >
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                              </svg>
                              {item}
                            </button>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Filtered Suggestions */}
                        {searchSuggestions.length > 0 ? (
                          <div className="px-4 py-2">
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Suggestions</p>
                            {searchSuggestions.map((item, index) => (
                              <button
                                key={index}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  handleSuggestionClick(item);
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                              >
                                <Search className="w-4 h-4 text-gray-400" />
                                <span dangerouslySetInnerHTML={{
                                  __html: item.replace(
                                    new RegExp(searchQuery, 'gi'),
                                    (match) => `<strong class="text-purple-600">${match}</strong>`
                                  )
                                }} />
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-500 text-center">
                            No suggestions found
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </form>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {isLoading ? (
                <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
              ) : user ? (
                <>
                  {/* User Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 font-medium transition-colors"
                    >
                      <User className="w-5 h-5" />
                      <span>{user.name || 'Account'}</span>
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                        <Link
                          href="/dashboard"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Dashboard</span>
                        </Link>
                        <Link
                          href="/dashboard/profile"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          <span>My Profile</span>
                        </Link>
                        <Link
                          href="/messages"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Messages</span>
                        </Link>
                        <Link
                          href="/wishlist"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Heart className="w-4 h-4" />
                          <span>Wishlist</span>
                        </Link>
                        {user.role === 'SELLER' && (
                          <>
                            <hr className="my-2 border-gray-100" />
                            <Link
                              href="/create-listing"
                              className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <Plus className="w-4 h-4" />
                              <span>Create Listing</span>
                            </Link>
                            <Link
                              href="/dashboard/listings"
                              className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <List className="w-4 h-4" />
                              <span>My Listings</span>
                            </Link>
                          </>
                        )}
                        {user.role === 'BUYER' && (
                          <>
                            <hr className="my-2 border-gray-100" />
                            <Link
                              href="/dashboard/bids"
                              className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <Gavel className="w-4 h-4" />
                              <span>My Bids</span>
                            </Link>
                          </>
                        )}
                        <hr className="my-2 border-gray-100" />
                        <Link
                          href="/dashboard/transactions"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Transactions</span>
                        </Link>
                        <hr className="my-2 border-gray-100" />
                        <button
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                          }}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Link
                    href="/login"
                    className="text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    Log in
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link
                    href="/register"
                    className="text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-purple-600"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Search Bar */}
          <form onSubmit={handleSearch} className="md:hidden pb-4 relative">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                onFocus={() => {
                  if (searchQuery.trim().length > 0) {
                    setShowSearchSuggestions(true);
                  }
                }}
                onBlur={() => {
                  setTimeout(() => setShowSearchSuggestions(false), 200);
                }}
                placeholder="Search for items..."
                className="w-full px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              
              {/* Mobile Search Suggestions */}
              {showSearchSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-60 overflow-y-auto">
                  {searchQuery.trim().length === 0 ? (
                    <>
                      {MOCK_RECENT_SEARCHES.length > 0 && (
                        <div className="px-3 py-2">
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Recent</p>
                          {MOCK_RECENT_SEARCHES.map((item, index) => (
                            <button
                              key={index}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleSuggestionClick(item);
                              }}
                              className="w-full text-left px-2 py-1.5 text-sm text-gray-700 hover:bg-purple-50 rounded transition-colors cursor-pointer"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      )}
                      <div className="px-3 py-2 border-t border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Popular</p>
                        {MOCK_POPULAR_SEARCHES.slice(0, 3).map((item, index) => (
                          <button
                            key={index}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleSuggestionClick(item);
                            }}
                            className="w-full text-left px-2 py-1.5 text-sm text-gray-700 hover:bg-purple-50 rounded transition-colors cursor-pointer"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    searchSuggestions.length > 0 && (
                      <div className="px-3 py-2">
                        {searchSuggestions.map((item, index) => (
                          <button
                            key={index}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleSuggestionClick(item);
                            }}
                            className="w-full text-left px-2 py-1.5 text-sm text-gray-700 hover:bg-purple-50 rounded transition-colors cursor-pointer"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <nav className="px-4 py-4 space-y-3">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block text-gray-700 hover:text-purple-600 font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    className="block text-gray-700 hover:text-purple-600 font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/messages"
                    className="block text-gray-700 hover:text-purple-600 font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Messages
                  </Link>
                  <Link
                    href="/wishlist"
                    className="block text-gray-700 hover:text-purple-600 font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Wishlist
                  </Link>
                  {user.role === 'SELLER' && (
                    <>
                      <hr className="border-gray-100" />
                      <Link
                        href="/create-listing"
                        className="block text-gray-700 hover:text-purple-600 font-medium py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Create Listing
                      </Link>
                      <Link
                        href="/dashboard/listings"
                        className="block text-gray-700 hover:text-purple-600 font-medium py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        My Listings
                      </Link>
                    </>
                  )}
                  {user.role === 'BUYER' && (
                    <>
                      <hr className="border-gray-100" />
                      <Link
                        href="/dashboard/bids"
                        className="block text-gray-700 hover:text-purple-600 font-medium py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        My Bids
                      </Link>
                    </>
                  )}
                  <hr className="border-gray-100" />
                  <Link
                    href="/dashboard/transactions"
                    className="block text-gray-700 hover:text-purple-600 font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Transactions
                  </Link>
                  <hr className="border-gray-100" />
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="block text-red-600 hover:text-red-700 font-medium py-2 w-full text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block text-purple-600 hover:text-purple-700 font-medium py-2 text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="block text-purple-600 hover:text-purple-700 font-medium py-2 text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Secondary Navigation - Categories (Not Sticky, Scrolls Away) */}
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="hidden md:flex items-center space-x-8 h-10 text-sm">
            {/* sBay Markets with All Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="flex items-center gap-2 text-gray-700 hover:text-purple-600 font-medium transition-colors"
              >
                <span className="font-semibold">sBay Markets</span>
                <span className="text-gray-400">All</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {categoriesOpen && (
                <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                  <Link
                    href="/browse"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                    onClick={() => setCategoriesOpen(false)}
                  >
                    <Grid3x3 className="w-4 h-4 text-gray-500" />
                    <span>All Items</span>
                  </Link>
                  <Link
                    href="/browse?category=ELECTRONICS"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                    onClick={() => setCategoriesOpen(false)}
                  >
                    <Laptop className="w-4 h-4 text-gray-500" />
                    <span>Electronics</span>
                  </Link>
                  <Link
                    href="/browse?category=BOOKS"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                    onClick={() => setCategoriesOpen(false)}
                  >
                    <BookOpen className="w-4 h-4 text-gray-500" />
                    <span>Books</span>
                  </Link>
                  <Link
                    href="/browse?category=FURNITURE"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                    onClick={() => setCategoriesOpen(false)}
                  >
                    <Armchair className="w-4 h-4 text-gray-500" />
                    <span>Furniture</span>
                  </Link>
                  <Link
                    href="/browse?category=CLOTHING"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                    onClick={() => setCategoriesOpen(false)}
                  >
                    <Shirt className="w-4 h-4 text-gray-500" />
                    <span>Clothing</span>
                  </Link>
                  <Link
                    href="/browse?category=OTHER"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                    onClick={() => setCategoriesOpen(false)}
                  >
                    <Package className="w-4 h-4 text-gray-500" />
                    <span>Other</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Separator */}
            <span className="text-gray-300">|</span>

            {/* Separator */}
            <span className="ml-auto text-gray-300">|</span>
            
            {/* Right Side Links */}
            <div className="flex items-center gap-6">
              <Link href="/how-it-works" className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg font-medium transition-all duration-200 uppercase text-xs tracking-wide relative group">
                <span className="relative">
                  How It Works
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-700 transition-all duration-200 group-hover:w-full"></span>
                </span>
              </Link>
              {user?.role === 'SELLER' ? (
                <Link href="/create-listing" className="flex items-center gap-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-3 py-2 rounded-lg font-semibold transition-all duration-200 relative group">
                  <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">$</span>
                  <span className="text-xs tracking-wide relative">
                    Sell on sBay
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-700 transition-all duration-200 group-hover:w-full"></span>
                  </span>
                </Link>
              ) : (
                <Link href="/register" className="flex items-center gap-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-3 py-2 rounded-lg font-semibold transition-all duration-200 relative group">
                  <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">$</span>
                  <span className="text-xs tracking-wide relative">
                    Sell on sBay
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-700 transition-all duration-200 group-hover:w-full"></span>
                  </span>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
