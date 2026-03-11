'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to login');
      }

      login(data.token, data.user);
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle Polygon Background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <svg className="absolute left-0 top-0 h-full w-full" preserveAspectRatio="xMidYMid slice" fill="none" viewBox="0 0 1463 859">
          <path className="text-purple-300" fill="currentColor" d="M-82.673 72l1761.85 472.086-134.33 501.315-1761.85-472.086z" />
          <path className="text-purple-400" fill="currentColor" d="M-217.088 544.086L1544.76 1016.17 1410.43 1517.49 -217.088 544.086z" />
        </svg>
      </div>

      <div className="relative z-10 max-w-md w-full space-y-8 bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20">
        <div>
          <h2 className="mt-2 text-center text-4xl font-extrabold text-gray-900 tracking-tight">
            Welcome back
          </h2>
          <p className="mt-3 text-center text-sm text-gray-500">
            Sign in to access the Student Market
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50/80 backdrop-blur-sm p-4 rounded-xl text-red-600 text-sm font-medium border border-red-100">
              {error}
            </div>
          )}
          <div className="rounded-md space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                required
                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all sm:text-sm bg-gray-50/50"
                placeholder="you@student.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all sm:text-sm bg-gray-50/50 pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-purple-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
        <div className="text-center mt-6">
          <Link href="/register" className="font-semibold text-purple-600 hover:text-purple-500 transition-colors">
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
