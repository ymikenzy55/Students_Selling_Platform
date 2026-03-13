'use client';

import { useState } from 'react';
import { Lock, CreditCard, Loader2 } from 'lucide-react';

interface MockPaymentSectionProps {
  amount: number;
  platformFee: number;
  onPaymentComplete: () => void;
  disabled?: boolean;
}

export default function MockPaymentSection({ 
  amount, 
  platformFee, 
  onPaymentComplete,
  disabled = false 
}: MockPaymentSectionProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMockPayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsProcessing(false);
    onPaymentComplete();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Payment Required</h2>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Item Price</span>
          <span className="font-semibold text-gray-900">GH₵ {amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Platform Fee (5%)</span>
          <span className="font-semibold text-gray-900">GH₵ {platformFee.toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-200 pt-2 mt-2">
          <div className="flex justify-between">
            <span className="font-bold text-gray-900">Total Amount</span>
            <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              GH₵ {(amount + platformFee).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
        <p className="text-sm text-purple-800">
          <Lock className="w-4 h-4 inline mr-1" />
          Your payment is held securely in escrow until you confirm receipt of the item
        </p>
      </div>

      <button
        onClick={handleMockPayment}
        disabled={disabled || isProcessing}
        className="w-full py-3.5 px-4 bg-white border-2 border-transparent rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
        style={{
          backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, rgb(147, 51, 234), rgb(236, 72, 153))',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box'
        }}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Processing Payment...
            </span>
          </>
        ) : (
          <>
            <Lock className="w-5 h-5 text-purple-600" />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Pay GH₵ {(amount + platformFee).toFixed(2)} (Mock)
            </span>
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center mt-3">
        This is a simulated payment for development purposes
      </p>
    </div>
  );
}
