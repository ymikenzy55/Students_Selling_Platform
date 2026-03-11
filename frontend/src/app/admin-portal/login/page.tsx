'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Check if they are actually an admin
      if (data.user?.role !== 'ADMIN' && data.user?.role !== 'SUPER_ADMIN') {
        throw new Error('Access Denied: This account lacks administrator privileges.');
      }

      // Store the admin token separately
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      
      // Redirect to the secret admin dashboard
      router.push('/admin-portal');
      
    } catch (err: any) {
      setError(err.message || 'Unable to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Decorative Background Elements */}
      <div 
        className="absolute top-0 right-0 w-1/3 h-1/2 bg-purple-600/5 rounded-bl-[100px] -z-10"
        style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }}
      ></div>
      <div 
        className="absolute bottom-0 left-0 w-1/2 h-1/3 bg-purple-600/10 rounded-tr-[150px] -z-10"
        style={{ clipPath: 'polygon(0 100%, 100% 100%, 0 0)' }}
      ></div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 hover-glOW">
        
        {/* Top Header Banner */}
        <div className="bg-purple-600 px-8 py-10 text-center relative overflow-hidden">
          {/* Internal Slash Accents for the Banner */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%, 0% 100%)', transform: 'rotate(25deg)' }}></div>
            <div className="absolute -bottom-20 -right-10 w-40 h-32 bg-white" style={{ clipPath: 'polygon(50% 0%, 100% 0, 100% 100%, 0% 100%)', transform: 'rotate(-15deg)' }}></div>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center mb-4 transform -rotate-3 hover:rotate-0 transition-transform">
              <Lock className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-widest uppercase">Admin Portal</h1>
            <p className="text-purple-200 mt-2 text-sm font-medium">Restricted Access Zone</p>
          </div>
        </div>

        {/* Login Form */}
        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded-r">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Administrator Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all outline-none"
                placeholder="admin@studentmarket.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Secure Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 px-4 rounded-lg shadow-lg shadow-purple-200 transform hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </span>
              ) : (
                'Access Dashboard'
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-xs text-gray-400 font-medium">
              Protected by StudentMarket Security Systems<br/>
              Unauthorized access is strictly prohibited.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
