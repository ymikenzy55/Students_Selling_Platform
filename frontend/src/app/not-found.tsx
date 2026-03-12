'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { Home, Search, ArrowLeft, Package } from 'lucide-react';
import Image from 'next/image';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="relative w-64 h-64 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full"></div>
              <div className="absolute inset-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                <Package className="w-24 h-24 text-purple-400" />
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                404
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
              Oops! Page Not Found
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <p className="text-gray-500">
              Don't worry, let's get you back on track!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-medium hover:from-purple-700 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl cursor-pointer"
            >
              <Home className="w-5 h-5" />
              Go Home
            </button>
            
            <button
              onClick={() => router.push('/browse')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-pink-500 text-white rounded-xl font-medium hover:from-pink-700 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl cursor-pointer"
            >
              <Search className="w-5 h-5" />
              Browse Listings
            </button>
          </div>

          {/* Helpful Links */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Popular Pages
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => router.push('/browse')}
                className="p-4 text-left hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                  <Search className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Browse</h3>
                <p className="text-sm text-gray-600">Find amazing deals</p>
              </button>
              
              <button
                onClick={() => router.push('/create-listing')}
                className="p-4 text-left hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <Package className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Sell</h3>
                <p className="text-sm text-gray-600">List your items</p>
              </button>
              
              <button
                onClick={() => router.push('/messages')}
                className="p-4 text-left hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Messages</h3>
                <p className="text-sm text-gray-600">Chat with sellers</p>
              </button>
              
              <button
                onClick={() => router.push('/login')}
                className="p-4 text-left hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                  <Package className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Account</h3>
                <p className="text-sm text-gray-600">Sign in or register</p>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}