'use client';

import { useState } from 'react';
import { Phone, MessageCircle, Copy, Lock, Check } from 'lucide-react';

interface ContactRevealSectionProps {
  isLocked: boolean;
  sellerName: string;
  phone: string;
  whatsapp: string;
  isVerified: boolean;
}

export default function ContactRevealSection({ 
  isLocked, 
  sellerName, 
  phone, 
  whatsapp,
  isVerified 
}: ContactRevealSectionProps) {
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(`Hi ${sellerName}, I'm contacting you about the item I purchased on sBay.`);
    window.open(`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

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
            Complete payment to unlock seller's phone number and WhatsApp
          </p>
          <div className="mt-6 space-y-2">
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 border border-gray-200">
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <Phone className="w-4 h-4" />
                <span className="blur-sm select-none">+233 XX XXX XXXX</span>
              </div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 border border-gray-200">
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <MessageCircle className="w-4 h-4" />
                <span className="blur-sm select-none">WhatsApp Locked</span>
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
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
          <Phone className="w-5 h-5 text-white" />
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

      <div className="space-y-3">
        {/* Phone Number */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                <p className="font-semibold text-gray-900">{phone}</p>
              </div>
            </div>
            <button
              onClick={handleCopyPhone}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-2"
            >
              {copiedPhone ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* WhatsApp Button */}
        <button
          onClick={handleWhatsAppClick}
          className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          Message on WhatsApp
        </button>
      </div>

      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          💡 <strong>Safety Tip:</strong> Meet in a public place on campus during daylight hours
        </p>
      </div>
    </div>
  );
}
