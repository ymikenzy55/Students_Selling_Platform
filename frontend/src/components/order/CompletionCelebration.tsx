'use client';

import { useState } from 'react';
import { CheckCircle2, Star, X, Loader2 } from 'lucide-react';

interface CompletionCelebrationProps {
  sellerName: string;
  itemTitle: string;
  onReviewSubmit: (rating: number, comment: string) => void;
  onClose: () => void;
}

export default function CompletionCelebration({
  sellerName,
  itemTitle,
  onReviewSubmit,
  onClose
}: CompletionCelebrationProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    setIsSubmitting(true);
    await onReviewSubmit(rating, comment);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Success Animation */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
            Transaction Complete! 🎉
          </h2>
          <p className="text-gray-600">
            Thank you for using sBay. Your payment has been released to the seller.
          </p>
        </div>

        {/* Review Section */}
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <h3 className="font-bold text-gray-900 mb-3">Rate Your Experience</h3>
          
          {/* Star Rating */}
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="cursor-pointer transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Comment */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={`Share your experience with ${sellerName}...`}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white resize-none"
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-white text-gray-700 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors font-medium cursor-pointer"
          >
            Skip for Now
          </button>
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className="flex-1 px-4 py-3 bg-white text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg border-2 border-transparent hover:border-purple-300 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer relative before:absolute before:inset-0 before:rounded-lg before:p-[2px] before:bg-gradient-to-r before:from-purple-600 before:to-pink-600 before:-z-10 before:m-[-2px] flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                <span className="text-purple-600">Submitting...</span>
              </>
            ) : (
              <span className="text-purple-600">Submit Review</span>
            )}
          </button>
        </div>

        {/* Transaction Details */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Item: <span className="font-semibold text-gray-700">{itemTitle}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
