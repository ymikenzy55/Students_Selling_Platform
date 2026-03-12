'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import { 
  Package, 
  Gavel, 
  CreditCard, 
  User, 
  MessageCircle,
  Heart,
  Plus,
  TrendingUp,
  Eye,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  LogOut
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();

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

  // Mock stats data with proper typing
  const sellerStats = {
    activeListings: 5,
    totalSales: 12,
    totalEarnings: 2450.00,
    pendingBids: 8,
    unreadMessages: 3,
    recentViews: 127
  };

  const buyerStats = {
    activeBids: 3,
    savedItems: 7,
    totalPurchases: 4,
    totalSpent: 890.00,
    unreadMessages: 2,
    watchingItems: 12
  };

  const isSeller = user.role === 'SELLER';
  // Mock user verification status since it's not in the User type yet
  const isVerified = true; // This will come from the API later

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimal Top Bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
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
            <button
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user.name}! {isSeller 
              ? "Here's what's happening with your listings and sales"
              : "Here's your buying activity and saved items"
            }
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isSeller ? (
            <>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-2xl font-extrabold text-gray-900">{sellerStats.activeListings}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Active Listings</h3>
                <p className="text-sm text-gray-600">Items currently for sale</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-2xl font-extrabold text-gray-900">GH₵{sellerStats.totalEarnings}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Total Earnings</h3>
                <p className="text-sm text-gray-600">From {sellerStats.totalSales} completed sales</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Gavel className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-2xl font-extrabold text-gray-900">{sellerStats.pendingBids}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Pending Bids</h3>
                <p className="text-sm text-gray-600">Awaiting your response</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-2xl font-extrabold text-gray-900">{sellerStats.unreadMessages}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">New Messages</h3>
                <p className="text-sm text-gray-600">From potential buyers</p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Gavel className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-2xl font-extrabold text-gray-900">{buyerStats.activeBids}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Active Bids</h3>
                <p className="text-sm text-gray-600">Waiting for responses</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-red-600" />
                  </div>
                  <span className="text-2xl font-extrabold text-gray-900">{buyerStats.savedItems}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Saved Items</h3>
                <p className="text-sm text-gray-600">In your wishlist</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-2xl font-extrabold text-gray-900">{buyerStats.totalPurchases}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Purchases</h3>
                <p className="text-sm text-gray-600">GH₵{buyerStats.totalSpent} total spent</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-2xl font-extrabold text-gray-900">{buyerStats.unreadMessages}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">New Messages</h3>
                <p className="text-sm text-gray-600">From sellers</p>
              </div>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column - Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-4">
              {isSeller ? (
                <>
                  <button
                    onClick={() => router.push('/create-listing')}
                    className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl hover:from-purple-700 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    <Plus className="w-6 h-6" />
                    <div className="text-left">
                      <h3 className="font-semibold">Create New Listing</h3>
                      <p className="text-sm text-purple-100">Sell something new</p>
                    </div>
                    <ArrowRight className="w-5 h-5 ml-auto" />
                  </button>

                  <button
                    onClick={() => router.push('/dashboard/listings')}
                    className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                  >
                    <Package className="w-6 h-6 text-gray-600" />
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">Manage Listings</h3>
                      <p className="text-sm text-gray-600">Edit, delete, or mark as sold</p>
                    </div>
                    <ArrowRight className="w-5 h-5 ml-auto text-gray-400" />
                  </button>

                  <button
                    onClick={() => router.push('/dashboard/transactions')}
                    className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                  >
                    <CreditCard className="w-6 h-6 text-gray-600" />
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">View Transactions</h3>
                      <p className="text-sm text-gray-600">Track payments and sales</p>
                    </div>
                    <ArrowRight className="w-5 h-5 ml-auto text-gray-400" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.push('/browse')}
                    className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl hover:from-purple-700 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    <Package className="w-6 h-6" />
                    <div className="text-left">
                      <h3 className="font-semibold">Browse Items</h3>
                      <p className="text-sm text-purple-100">Find great deals</p>
                    </div>
                    <ArrowRight className="w-5 h-5 ml-auto" />
                  </button>

                  <button
                    onClick={() => router.push('/dashboard/bids')}
                    className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                  >
                    <Gavel className="w-6 h-6 text-gray-600" />
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">My Bids</h3>
                      <p className="text-sm text-gray-600">Track your offers</p>
                    </div>
                    <ArrowRight className="w-5 h-5 ml-auto text-gray-400" />
                  </button>

                  <button
                    onClick={() => router.push('/wishlist')}
                    className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                  >
                    <Heart className="w-6 h-6 text-gray-600" />
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">Wishlist</h3>
                      <p className="text-sm text-gray-600">View saved items</p>
                    </div>
                    <ArrowRight className="w-5 h-5 ml-auto text-gray-400" />
                  </button>
                </>
              )}

              <button
                onClick={() => router.push('/messages')}
                className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              >
                <MessageCircle className="w-6 h-6 text-gray-600" />
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Messages</h3>
                  <p className="text-sm text-gray-600">Chat with {isSeller ? 'buyers' : 'sellers'}</p>
                </div>
                {(isSeller ? sellerStats.unreadMessages : buyerStats.unreadMessages) > 0 && (
                  <span className="ml-auto min-w-[20px] h-5 px-1.5 bg-purple-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {isSeller ? sellerStats.unreadMessages : buyerStats.unreadMessages}
                  </span>
                )}
                <ArrowRight className="w-5 h-5 ml-auto text-gray-400" />
              </button>
            </div>
          </div>

          {/* Right Column - Recent Activity */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {isSeller ? (
                <>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">MacBook Pro sold</p>
                      <p className="text-xs text-gray-600">2 hours ago • GH₵850</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Gavel className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">New bid on iPhone 13</p>
                      <p className="text-xs text-gray-600">5 hours ago • GH₵600</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-orange-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Message from Sarah</p>
                      <p className="text-xs text-gray-600">1 day ago • About Gaming Mouse</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <Eye className="w-5 h-5 text-purple-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Biology Textbook viewed</p>
                      <p className="text-xs text-gray-600">2 days ago • 15 new views</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Bid accepted</p>
                      <p className="text-xs text-gray-600">3 hours ago • Gaming Laptop</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Gavel className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Placed bid on iPhone</p>
                      <p className="text-xs text-gray-600">1 day ago • GH₵550</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <Heart className="w-5 h-5 text-red-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Added to wishlist</p>
                      <p className="text-xs text-gray-600">2 days ago • MacBook Air M2</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-orange-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Message from John</p>
                      <p className="text-xs text-gray-600">3 days ago • About Textbook</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => router.push('/dashboard/profile')}
              className="w-full mt-6 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors font-medium cursor-pointer"
            >
              View All Activity
            </button>
          </div>
        </div>

        {/* Account Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Account Status</h2>
            <button
              onClick={() => router.push('/dashboard/profile')}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium cursor-pointer"
            >
              Manage Account
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              {isVerified ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <AlertCircle className="w-6 h-6 text-yellow-500" />
              )}
              <div>
                <p className="font-semibold text-gray-900">
                  {isVerified ? 'Verified Account' : 'Verification Pending'}
                </p>
                <p className="text-sm text-gray-600">
                  {isVerified ? 'Your account is verified' : 'Upload Ghana Card to verify'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="w-6 h-6 text-blue-500" />
              <div>
                <p className="font-semibold text-gray-900">Profile Complete</p>
                <p className="text-sm text-gray-600">All information filled</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <div>
                <p className="font-semibold text-gray-900">Account Active</p>
                <p className="text-sm text-gray-600">Good standing</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
