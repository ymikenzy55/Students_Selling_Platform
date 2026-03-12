import Link from 'next/link';
import { BadgeCheck, Heart } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Listing {
  id: string;
  title: string;
  price: number;
  condition: string;
  imageUrl: string;
  isSoldOut: boolean;
  seller: {
    id: string;
    name: string;
    isVerified: boolean;
  };
  createdAt: string;
}

interface ProductCardProps {
  listing: Listing;
  viewMode?: 'grid' | 'list';
  showWishlistButton?: boolean;
  isWishlisted?: boolean;
  onWishlistToggle?: () => void;
}

export default function ProductCard({
  listing,
  viewMode = 'grid',
  showWishlistButton = false,
  isWishlisted = false,
  onWishlistToggle
}: ProductCardProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const formatCondition = (cond: string) => {
    return cond.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onWishlistToggle?.();
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) {
      return;
    }
    router.push(`/listing/${listing.id}`);
  };

  if (viewMode === 'list') {
    return (
      <div 
        className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-purple-200 p-4 cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex gap-4">
          {/* Image */}
          <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={listing.imageUrl}
              alt={listing.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {listing.isSoldOut && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                  SOLD
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors">
                {listing.title}
              </h3>
              {showWishlistButton && (
                <button
                  onClick={handleWishlistClick}
                  className={`p-2 rounded-full transition-all hover:scale-110 ${
                    isWishlisted 
                      ? 'text-red-500 hover:bg-red-50' 
                      : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              )}
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-extrabold text-purple-600">
                GH₵{listing.price.toFixed(2)}
              </span>
              <div className="bg-gray-100 px-2 py-1 rounded text-xs font-semibold text-gray-700">
                {formatCondition(listing.condition)}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2 text-gray-600">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/seller/${listing.seller.id}`);
                  }}
                  className="hover:text-purple-600 transition-colors cursor-pointer font-medium"
                >
                  {listing.seller.name}
                </button>
                {listing.seller.isVerified && (
                  <BadgeCheck className="w-4 h-4 text-blue-500" />
                )}
              </div>
              <span className="text-gray-500">
                {formatDate(listing.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-purple-200 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image */}
      <div className="relative h-56 bg-gray-100 overflow-hidden">
        <Image
          src={listing.imageUrl}
          alt={listing.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {listing.isSoldOut && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm">
              SOLD OUT
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
          {formatCondition(listing.condition)}
        </div>
        {showWishlistButton && (
          <button
            onClick={handleWishlistClick}
            className={`absolute top-3 left-3 p-2 rounded-full backdrop-blur-sm transition-all hover:scale-110 ${
              isWishlisted 
                ? 'bg-red-500 text-white' 
                : 'bg-white/90 text-gray-600 hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
          {listing.title}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-extrabold text-purple-600">
            GH₵{listing.price.toFixed(2)}
          </span>
          <span className="text-xs text-gray-500">
            {formatDate(listing.createdAt)}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/seller/${listing.seller.id}`);
            }}
            className="hover:text-purple-600 transition-colors cursor-pointer font-medium"
          >
            {listing.seller.name}
          </button>
          {listing.seller.isVerified && (
            <BadgeCheck className="w-4 h-4 text-blue-500" />
          )}
        </div>
      </div>
    </div>
  );
}
