import Link from 'next/link';
import { BadgeCheck, MapPin, Calendar } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ProductListItemProps {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: string;
  category: string;
  campus: string;
  imageUrl: string;
  isSoldOut: boolean;
  seller: {
    id: string;
    name: string;
    isVerified: boolean;
  };
  createdAt: string;
}

export default function ProductListItem({
  id,
  title,
  description,
  price,
  condition,
  category,
  campus,
  imageUrl,
  isSoldOut,
  seller,
  createdAt
}: ProductListItemProps) {
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

  const formatCategory = (cat: string) => {
    return cat.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) {
      return;
    }
    router.push(`/listing/${id}`);
  };

  const handleSellerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/seller/${seller.id}`);
  };

  return (
    <div 
      className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-purple-200 flex items-center p-4 gap-4 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image */}
      <div className="relative w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
              SOLD
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1 group-hover:text-purple-600 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {description}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <span className="text-2xl font-extrabold text-purple-600 block">
              GH₵{price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
          <div className="flex items-center gap-1">
            <span className="font-medium text-gray-700">{formatCondition(condition)}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
              {formatCategory(category)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{campus}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(createdAt)}</span>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={handleSellerClick}
              className="text-gray-700 hover:text-purple-600 transition-colors cursor-pointer font-medium"
            >
              {seller.name}
            </button>
            {seller.isVerified && (
              <BadgeCheck className="w-4 h-4 text-blue-500" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
