'use client';

import { useState } from 'react';
import { X, ShieldCheck, Upload, Loader2, CheckCircle2 } from 'lucide-react';

interface VerificationPromptModalProps {
  onClose: () => void;
  onSkip: () => void;
  onVerify: (file: File) => void;
}

export default function VerificationPromptModal({ 
  onClose, 
  onSkip, 
  onVerify 
}: VerificationPromptModalProps) {
  const [ghanaCardFile, setGhanaCardFile] = useState<File | null>(null);
  const [ghanaCardPreview, setGhanaCardPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setGhanaCardFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setGhanaCardPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (!ghanaCardFile) {
      setError('Please upload your Ghana Card');
      return;
    }

    setIsSubmitting(true);
    await onVerify(ghanaCardFile);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
            Verify Your Identity
          </h2>
          <p className="text-gray-600">
            Upload your Ghana Card to build trust with buyers and unlock full seller features
          </p>
        </div>

        {/* Benefits */}
        <div className="bg-purple-50 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-purple-900 mb-3">Why Verify Now?</h3>
          <ul className="space-y-2 text-sm text-purple-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Get a verified badge on all your listings</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Buyers trust verified sellers 3x more</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Higher visibility in search results</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Faster transaction approvals</span>
            </li>
          </ul>
        </div>

        {/* Upload Section */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {ghanaCardPreview ? (
          <div className="space-y-4 mb-6">
            <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={ghanaCardPreview}
                alt="Ghana Card preview"
                className="w-full h-full object-contain"
              />
            </div>
            <button
              onClick={() => {
                setGhanaCardFile(null);
                setGhanaCardPreview('');
              }}
              className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              Remove and choose different file
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors cursor-pointer mb-6">
            <input
              type="file"
              id="ghana-card-upload-modal"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="ghana-card-upload-modal" className="cursor-pointer">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                  <Upload className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-1">Upload Ghana Card</p>
                  <p className="text-sm text-gray-500">JPG, PNG (Max 5MB)</p>
                </div>
              </div>
            </label>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleSubmit}
            disabled={!ghanaCardFile || isSubmitting}
            className="w-full py-3.5 px-4 bg-white border-2 border-transparent rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            style={{
              backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, rgb(147, 51, 234), rgb(236, 72, 153))',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box'
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Uploading...
                </span>
              </>
            ) : (
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Verify Now
              </span>
            )}
          </button>

          <button
            onClick={onSkip}
            className="w-full px-4 py-3 bg-white text-gray-700 rounded-xl border-2 border-gray-300 hover:border-gray-400 transition-colors font-medium cursor-pointer"
          >
            Skip for Now
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          You can verify later from your profile settings
        </p>
      </div>
    </div>
  );
}
