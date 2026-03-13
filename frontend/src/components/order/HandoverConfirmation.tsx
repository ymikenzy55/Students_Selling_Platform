'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2, Clock } from 'lucide-react';

interface HandoverConfirmationProps {
  userRole: 'buyer' | 'seller';
  buyerConfirmedAt: string | null;
  sellerConfirmedAt: string | null;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function HandoverConfirmation({
  userRole,
  buyerConfirmedAt,
  sellerConfirmedAt,
  onConfirm,
  isLoading = false
}: HandoverConfirmationProps) {
  const hasUserConfirmed = userRole === 'buyer' ? !!buyerConfirmedAt : !!sellerConfirmedAt;
  const hasOtherConfirmed = userRole === 'buyer' ? !!sellerConfirmedAt : !!buyerConfirmedAt;
  const bothConfirmed = buyerConfirmedAt && sellerConfirmedAt;

  const getButtonText = () => {
    if (hasUserConfirmed) {
      return userRole === 'buyer' ? '✓ You Confirmed Receipt' : '✓ You Confirmed Delivery';
    }
    return userRole === 'buyer' ? 'I Received the Item' : 'I Delivered the Item';
  };

  const getStatusMessage = () => {
    if (bothConfirmed) {
      return {
        icon: CheckCircle2,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        message: 'Both parties confirmed - transaction complete!'
      };
    }
    if (hasUserConfirmed && !hasOtherConfirmed) {
      return {
        icon: Clock,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        message: `Waiting for ${userRole === 'buyer' ? 'seller' : 'buyer'} to confirm...`
      };
    }
    if (!hasUserConfirmed && hasOtherConfirmed) {
      return {
        icon: Clock,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        message: `${userRole === 'buyer' ? 'Seller' : 'Buyer'} has confirmed - please confirm on your end`
      };
    }
    return null;
  };

  const statusMessage = getStatusMessage();

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Confirm Handover</h2>
          <p className="text-sm text-gray-600">Both parties must confirm the exchange</p>
        </div>
      </div>

      {/* Status Message */}
      {statusMessage && (
        <div className={`${statusMessage.bgColor} ${statusMessage.borderColor} border rounded-lg p-4 mb-4`}>
          <div className="flex items-center gap-3">
            <statusMessage.icon className={`w-5 h-5 ${statusMessage.color}`} />
            <p className={`text-sm font-medium ${statusMessage.color}`}>
              {statusMessage.message}
            </p>
          </div>
        </div>
      )}

      {/* Confirmation Status Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className={`p-3 rounded-lg border-2 ${buyerConfirmedAt ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center gap-2 mb-1">
            {buyerConfirmedAt ? (
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            ) : (
              <Clock className="w-4 h-4 text-gray-400" />
            )}
            <span className="text-xs font-semibold text-gray-700">Buyer</span>
          </div>
          <p className={`text-xs ${buyerConfirmedAt ? 'text-green-700' : 'text-gray-500'}`}>
            {buyerConfirmedAt ? 'Confirmed' : 'Pending'}
          </p>
        </div>

        <div className={`p-3 rounded-lg border-2 ${sellerConfirmedAt ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center gap-2 mb-1">
            {sellerConfirmedAt ? (
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            ) : (
              <Clock className="w-4 h-4 text-gray-400" />
            )}
            <span className="text-xs font-semibold text-gray-700">Seller</span>
          </div>
          <p className={`text-xs ${sellerConfirmedAt ? 'text-green-700' : 'text-gray-500'}`}>
            {sellerConfirmedAt ? 'Confirmed' : 'Pending'}
          </p>
        </div>
      </div>

      {/* Confirmation Button */}
      {!hasUserConfirmed && (
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="w-full py-3.5 px-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Confirming...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>{getButtonText()}</span>
            </>
          )}
        </button>
      )}

      {hasUserConfirmed && !bothConfirmed && (
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600">
            You've confirmed. Waiting for the other party to confirm.
          </p>
        </div>
      )}

      {/* Safety Note */}
      <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-3">
        <p className="text-xs text-purple-800">
          ⚠️ Only confirm after you've physically {userRole === 'buyer' ? 'received and inspected' : 'handed over'} the item
        </p>
      </div>
    </div>
  );
}
