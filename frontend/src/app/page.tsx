'use client';

import Link from "next/link";
import { useAuth } from "@/lib/auth";

export default function Home() {
  const { user, logout, isLoading } = useAuth();

  return (
    <div className="relative min-h-screen bg-gray-50 flex flex-col font-sans overflow-hidden">
      {/* Subtle Polygon Background */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <svg className="absolute left-0 top-0 h-full w-full" preserveAspectRatio="xMidYMid slice" fill="none" viewBox="0 0 1463 859">
          <path className="text-purple-200" fill="currentColor" d="M-82.673 72l1761.85 472.086-134.33 501.315-1761.85-472.086z" />
          <path className="text-purple-300" fill="currentColor" d="M-217.088 544.086L1544.76 1016.17 1410.43 1517.49 -217.088 544.086z" />
        </svg>
      </div>

      <header className="relative z-10 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-800 tracking-tight">
            Student Market
          </h1>
          <nav>
            {isLoading ? (
              <span className="text-gray-500 font-medium animate-pulse">Loading...</span>
            ) : user ? (
              <div className="flex items-center space-x-6">
                <span className="text-sm font-semibold text-gray-700 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-100">
                  Welcome, {user.name || user.email}
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-red-500 hover:text-red-700 font-bold transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-5">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-purple-700 font-semibold transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="bg-purple-600 text-white px-5 py-2.5 rounded-xl hover:bg-purple-700 font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Sign up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center text-center">
        <div className="bg-white/60 backdrop-blur-2xl p-12 rounded-3xl shadow-xl border border-white/50 max-w-4xl mx-auto">
          <h2 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
            <span className="block mb-2">The Marketplace for</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 pb-2">Students & Friends</span>
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 sm:text-xl md:mt-8 leading-relaxed font-medium">
            Buy, sell, and trade textbooks, electronics, dorm essentials, and more with other students on your campus in a secure, sleek environment.
          </p>
          <div className="mt-10 max-w-md mx-auto sm:flex sm:justify-center md:mt-12">
            {user ? (
              <div className="rounded-xl shadow-lg hover:shadow-xl transition-all w-full sm:w-auto">
                <Link
                  href="/create-listing"
                  className="w-full flex items-center justify-center px-10 py-4 border border-transparent text-lg font-bold rounded-xl text-white bg-purple-600 hover:bg-purple-700 transition-colors"
                >
                  Create a Listing
                </Link>
              </div>
            ) : (
              <div className="rounded-xl shadow-lg hover:shadow-xl transition-all w-full sm:w-auto">
                <Link
                  href="/register"
                  className="w-full flex items-center justify-center px-10 py-4 border border-transparent text-lg font-bold rounded-xl text-white bg-purple-600 hover:bg-purple-700 transition-colors"
                >
                  Get Started Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
