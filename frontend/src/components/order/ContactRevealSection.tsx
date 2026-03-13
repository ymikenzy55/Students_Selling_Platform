'use client';

import { useRouter } from 'next/navigation';
import { MessageCircle, Lock } from 'lucide-react';

interface ContactRevealSectionProps {
  isLocked: boolean;
  sellerName: string;
  sellerId: string;
  isVerified: boolean;
}

export default function ContactRevealSection({ 
  isLocked, 
  sellerName, 
  sellerId,
  isVerified 
}: ContactRevealSectionProps) {
  const router = useRouter();

  if (isLocked) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50 backdrop-blur-sm"></div>
        <div className="relative z-10 text-center py-8">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Seller Contact Locked</h3>
          <p className="text-sm text-gray-600">
            Complete payment to unlock messaging with the seller
          </p>
          <div className="mt-6">
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <MessageCircle className="w-5 h-5" />
                <span className="blur-sm select-none">Message Seller</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900">Contact Seller</h2>
          <p className="text-sm text-gray-600">Arrange meetup on campus</p>
        </div>
        {isVerified && (
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
            Verified
          </span>
        )}
      </div>

      {/* Message Button */}
      <button
        onClick={() => router.push('/messages')}
        className="w-full py-4 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
      >
        <MessageCircle className="w-5 h-5" />
        Message {sellerName}
      </button>

      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          💡 <strong>Safety Tip:</strong> Meet in a public place on campus during daylight hours
        </p>
      </div>
    </div>
  );
}
