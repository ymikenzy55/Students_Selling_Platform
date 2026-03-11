'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import { Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('BUYER');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Password validation states
  const [pwdStrength, setPwdStrength] = useState(0);
  const [pwdValidations, setPwdValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const validations = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    };
    setPwdValidations(validations);
    
    const strength = Object.values(validations).filter(Boolean).length;
    setPwdStrength(strength);
  }, [password]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (pwdStrength < 4) {
      setError('Please choose a stronger password before continuing.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to register');
      }

      login(data.token, data.user);
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const strengthColors = ['bg-gray-200', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-600'];

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle Polygon Background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <svg className="absolute right-0 bottom-0 h-full w-full" preserveAspectRatio="xMidYMid slice" fill="none" viewBox="0 0 1463 859">
          <path className="text-purple-300" fill="currentColor" d="M-82.673 72l1761.85 472.086-134.33 501.315-1761.85-472.086z" />
          <path className="text-purple-400" fill="currentColor" d="M-217.088 544.086L1544.76 1016.17 1410.43 1517.49 -217.088 544.086z" />
        </svg>
      </div>

      <div className="relative z-10 max-w-md w-full space-y-8 bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20">
        <div>
          <h2 className="mt-2 text-center text-4xl font-extrabold text-gray-900 tracking-tight">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            Join the premium student marketplace
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          {error && (
            <div className="bg-red-50/80 backdrop-blur-sm p-4 rounded-xl text-red-600 text-sm font-medium border border-red-100">
              {error}
            </div>
          )}
          <div className="rounded-md space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all sm:text-sm bg-gray-50/50"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                required
                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all sm:text-sm bg-gray-50/50"
                placeholder="jane@student.edu"
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
              
              {/* Password Strength Indicator */}
              {password.length > 0 && (
                <div className="mt-3">
                  <div className="flex h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${strengthColors[pwdStrength]}`} 
                      style={{ width: `${(pwdStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      {pwdValidations.length ? <CheckCircle2 size={12} className="text-green-500" /> : <XCircle size={12} />}
                      <span>8+ characters</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {pwdValidations.uppercase ? <CheckCircle2 size={12} className="text-green-500" /> : <XCircle size={12} />}
                      <span>Uppercase letter</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {pwdValidations.lowercase ? <CheckCircle2 size={12} className="text-green-500" /> : <XCircle size={12} />}
                      <span>Lowercase letter</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {pwdValidations.number ? <CheckCircle2 size={12} className="text-green-500" /> : <XCircle size={12} />}
                      <span>Number</span>
                    </div>
                    <div className="flex items-center space-x-1 col-span-2">
                      {pwdValidations.special ? <CheckCircle2 size={12} className="text-green-500" /> : <XCircle size={12} />}
                      <span>Special character</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Account Role</label>
              <select
                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all sm:text-sm bg-gray-50/50"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="BUYER">I want to Buy properties</option>
                <option value="SELLER">I want to Sell properties</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || pwdStrength < 4}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </button>
          </div>
        </form>
        <div className="text-center mt-6">
          <Link href="/login" className="font-semibold text-purple-600 hover:text-purple-500 transition-colors">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
