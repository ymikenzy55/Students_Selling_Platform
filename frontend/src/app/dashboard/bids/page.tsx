'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import DashboardHeader from '@/components/DashboardHeader';
import Breadcrumb from '@/components/Breadcrumb';
import { Package, Clock, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface Bid {
  id: string;
  amount: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  listing: {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
    seller: {
      name: string;
    };
  };
}

export default function MyBidsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  
  // Mock bids data
  const MOCK_BIDS: Bid[] = [
    {
      id: 'bid_1',
      amount: 800.00,
      status: 'PENDING',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      listing: {
        id: 'listing_101',
        title: 'MacBook Pro M2 - Excellent Condition',
        price: 850.00,
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
        seller: {
          name: 'John Smith'
        }
      }
    },
    {
      id: 'bid_2',
      amount: 600.00,
      status: 'ACCEPTED',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      listing: {
        id: 'listing_103',
        title: 'iPhone 13 Pro - 256GB',
        price: 650.00,
        imageUrl: 'https://images.unsplash.com/photo-1592286927505-c0d0e0c5d7c0?w=500',
        seller: {
          name: 'Mike Johnson'
        }
      }
    },
    {
      id: 'bid_3',
      amount: 40.00,
      status: 'REJECTED',
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      listing: {
        id: 'listing_102',
        title: 'Biology 101 Textbook 5th Edition',
        price: 45.00,
        imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
        seller: {
          name: 'Sarah Connor'
        }
      }
    },
    {
      id: 'bid_4',
      amount: 50.00,
      status: 'PENDING',
      createdAt: new Date(Date.now() - 345600000).toISOString(),
      listing: {
        id: 'listing_106',
        title: 'Gaming Mouse - Logitech G502',
        price: 55.00,
        imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
        seller: {
          name: 'Chris Lee'
        }
      }
    }
  ];

  const [bids, setBids] = useState<Bid[]>(MOCK_BIDS);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'ACCEPTED' | 'REJECTED'>('ALL');

  // Redirect if not authorized
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/');
      } else if (user.role !== 'BUYER') {
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, router]);

  // Show loading while checking auth
  if (isLoading || !user || user.role !== 'BUYER') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'ACCEPTED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'REJECTED':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-700';
      case 'REJECTED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredBids = filterStatus === 'ALL' 
    ? bids 
    : bids.filter(bid => bid.status === filterStatus);

  const stats = {
    total: bids.length,
    pending: bids.filter(b => b.status === 'PENDING').length,
    accepted: bids.filter(b => b.status === 'ACCEPTED').length,
    rejected: bids.filter(b => b.status === 'REJECTED').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb 
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'My Bids' }
          ]} 
        />

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">My Bids</h1>
          <p className="text-gray-600">Track all your bids in one place</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Bids</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Accepted</p>
                <p className="text-3xl font-bold text-green-600">{stats.accepted}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Rejected</p>
                <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 mb-6 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
              filterStatus === 'ALL'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setFilterStatus('PENDING')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
              filterStatus === 'PENDING'
                ? 'bg-yellow-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Pending ({stats.pending})
          </button>
          <button
            onClick={() => setFilterStatus('ACCEPTED')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
              filterStatus === 'ACCEPTED'
                ? 'bg-green-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Accepted ({stats.accepted})
          </button>
          <button
            onClick={() => setFilterStatus('REJECTED')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
              filterStatus === 'REJECTED'
                ? 'bg-red-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Rejected ({stats.rejected})
          </button>
        </div>

        {/* Bids List */}
        {filteredBids.length > 0 ? (
          <div className="space-y-4">
            {filteredBids.map(bid => (
              <div
                key={bid.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-6">
                  {/* Listing Image */}
                  <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={bid.listing.imageUrl}
                      alt={bid.listing.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {bid.listing.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Seller: {bid.listing.seller.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(bid.status)}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(bid.status)}`}>
                          {bid.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Your Bid</p>
                        <p className="text-xl font-bold text-purple-600">GH₵{bid.amount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Asking Price</p>
                        <p className="text-lg font-semibold text-gray-900">GH₵{bid.listing.price.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Bid Placed</p>
                        <p className="text-sm text-gray-900">{formatDate(bid.createdAt)}</p>
                        <p className="text-xs text-gray-500">{formatTimeAgo(bid.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => router.push(`/listing/${bid.listing.id}`)}
                        className="px-4 py-2 text-sm font-medium bg-white text-purple-600 rounded-lg border-2 border-purple-300 hover:border-purple-400 transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        View Listing
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      
                      {bid.status === 'ACCEPTED' && (
                        <button
                          onClick={() => router.push(`/orders/order_${bid.id}`)}
                          className="px-4 py-2 text-sm font-medium bg-white text-green-600 rounded-lg border-2 border-green-300 hover:border-green-400 transition-colors cursor-pointer"
                        >
                          Proceed to Payment
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {filterStatus === 'ALL' ? 'No bids yet' : `No ${filterStatus.toLowerCase()} bids`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filterStatus === 'ALL' 
                ? 'Start bidding on listings to see them here'
                : `You don't have any ${filterStatus.toLowerCase()} bids`
              }
            </p>
            <button
              onClick={() => router.push('/browse')}
              className="px-6 py-3 bg-white text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg border-2 border-transparent hover:border-purple-300 transition-all font-medium cursor-pointer relative before:absolute before:inset-0 before:rounded-lg before:p-[2px] before:bg-gradient-to-r before:from-purple-600 before:to-pink-600 before:-z-10 before:m-[-2px]"
            >
              <span className="text-purple-600">Browse Listings</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
