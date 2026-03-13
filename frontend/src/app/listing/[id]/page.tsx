'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import { MOCK_LISTINGS } from '@/lib/mockData';
import { 
  MapPin, 
  Package, 
  Calendar, 
  ShieldCheck, 
  User,
  MessageCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Image from 'next/image';

interface Bid {
  id: string;
  amount: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  buyer: {
    name: string;
  };
}

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [listing, setListing] = useState<any>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBidSuccess, setShowBidSuccess] = useState(false);

  // Mock bids data
  const mockBids: Bid[] = [
    {
      id: 'bid_1',
      amount: listing?.price ? listing.price * 0.9 : 0,
      status: 'PENDING',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      buyer: { name: 'Alex M.' }
    },
    {
      id: 'bid_2',
      amount: listing?.price ? listing.price * 0.85 : 0,
      status: 'REJECTED',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      buyer: { name: 'Sarah K.' }
    }
  ];

  const [bids, setBids] = useState<Bid[]>(mockBids);

  useEffect(() => {
    // Mock API call - find listing by ID
    const foundListing = MOCK_LISTINGS.find(l => l.id === id);
    if (foundListing) {
      setListing(foundListing);
      // Update mock bids with actual price
      setBids([
        {
          id: 'bid_1',
          amount: foundListing.price * 0.9,
          status: 'PENDING',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          buyer: { name: 'Alex M.' }
        },
        {
          id: 'bid_2',
          amount: foundListing.price * 0.85,
          status: 'REJECTED',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          buyer: { name: 'Sarah K.' }
        }
      ]);
    }
  }, [id]);

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }

    setIsSubmitting(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newBid: Bid = {
      id: `bid_${Date.now()}`,
      amount: parseFloat(bidAmount),
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      buyer: { name: user.name }
    };
    
    setBids([newBid, ...bids]);
    setBidAmount('');
    setShowBidSuccess(true);
    setIsSubmitting(false);

    setTimeout(() => setShowBidSuccess(false), 3000);
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

  const formatTimeAgo = (dateString: string) => {
    const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  // Mock image gallery (using same image multiple times for demo)
  const images = listing ? [listing.imageUrl, listing.imageUrl, listing.imageUrl] : [];

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Listing not found</h2>
          <p className="text-gray-600 mb-6">This listing may have been removed or doesn't exist.</p>
          <button
            onClick={() => router.push('/browse')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-medium hover:from-purple-700 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            Browse Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb 
          items={[
            { label: 'Browse', href: '/browse' },
            { label: listing.title }
          ]} 
        />
        
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to listings
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative h-96 bg-gray-100">
                <Image
                  src={images[currentImageIndex]}
                  alt={listing.title}
                  fill
                  className="object-cover"
                />
                {listing.isSoldOut && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-6 py-3 rounded-full text-lg font-bold">
                      SOLD OUT
                    </span>
                  </div>
                )}
                
                {/* Image Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((currentImageIndex - 1 + images.length) % images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg hover:shadow-xl"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-900" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((currentImageIndex + 1) % images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg hover:shadow-xl"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-900" />
                    </button>
                    
                    {/* Image Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/20 backdrop-blur-sm px-3 py-2 rounded-full">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`h-2 rounded-full transition-all hover:scale-110 ${
                            idx === currentImageIndex ? 'bg-white w-8' : 'bg-white/60 w-2 hover:bg-white/80'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{listing.title}</h1>
              
              <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  <span>{formatCondition(listing.condition)}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{listing.campus}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Posted {formatDate(listing.createdAt)}</span>
                </div>
              </div>

              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {listing.category}
                </span>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {listing.description}
                </p>
              </div>
            </div>

            {/* Bid History */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Bid History</h2>
              {bids.length > 0 ? (
                <div className="space-y-3">
                  {bids.map((bid, index) => (
                    <div
                      key={bid.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Bidder #{bids.length - index}</p>
                          <p className="text-sm text-gray-500">{formatTimeAgo(bid.createdAt)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">GH₵{bid.amount.toFixed(2)}</p>
                        <span className={`text-xs font-medium ${
                          bid.status === 'PENDING' ? 'text-yellow-600' :
                          bid.status === 'ACCEPTED' ? 'text-green-600' :
                          'text-red-600'
                        }`}>
                          {bid.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No bids yet. Be the first to bid!</p>
              )}
            </div>
          </div>

          {/* Right Column - Seller Info and Bid Form */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-1">Asking Price</p>
                <p className="text-4xl font-extrabold text-purple-600">
                  GH₵{listing.price.toFixed(2)}
                </p>
              </div>

              {/* Seller Info */}
              <div className="border-t border-gray-100 pt-6 mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Seller Information</h3>
                <button
                  onClick={() => router.push(`/seller/${listing.seller.id}`)}
                  className="flex items-center gap-3 mb-4 w-full hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-gray-900 hover:text-purple-600 transition-colors">{listing.seller.name}</p>
                      {listing.seller.isVerified && (
                        <ShieldCheck className="w-4 h-4 text-green-500" title="Verified Seller" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {listing.seller.isVerified ? 'Verified Seller' : 'Unverified'}
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => user ? router.push('/messages') : router.push('/login')}
                  className="w-full px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-900 rounded-xl font-medium hover:from-gray-200 hover:to-gray-100 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:scale-[1.02]"
                >
                  <MessageCircle className="w-5 h-5" />
                  Message Seller
                </button>
              </div>

              {/* Bid Form */}
              {!listing.isSoldOut && (
                <div className="border-t border-gray-100 pt-6">
                  {user ? (
                    user.role === 'SELLER' && user.id === listing.seller.id ? (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-600">This is your listing</p>
                      </div>
                    ) : (
                      <form onSubmit={handleBidSubmit}>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Place Your Bid
                        </label>
                        <div className="relative mb-4">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                            GH₵
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            placeholder="Enter amount"
                            required
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isSubmitting || !bidAmount}
                          className="w-full px-6 py-3.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-bold hover:from-purple-700 hover:to-purple-600 transition-all disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit Bid'}
                        </button>
                        {showBidSuccess && (
                          <p className="mt-3 text-sm text-green-600 text-center font-medium">
                            Bid submitted successfully!
                          </p>
                        )}
                      </form>
                    )
                  ) : (
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-4">Log in to place a bid</p>
                      <button
                        onClick={() => router.push('/login')}
                        className="w-full px-6 py-3.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-bold hover:from-purple-700 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Log In to Bid
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
