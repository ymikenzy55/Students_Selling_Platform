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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        id: 'user_id_new_' + Date.now(),
        email: email,
        name: name,
        role: role
      };
      
      const mockToken = 'mock_jwt_token_' + Date.now();
      
      login(mockToken, mockUser);
      
      // Redirect based on role
      if (role === 'SELLER') {
        router.push('/dashboard');
      } else {
        router.push('/browse');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = (provider: string) => {
    console.log(`Sign up with ${provider}`);
    // TODO: Implement social signup
  };

  const strengthColors = ['bg-gray-200', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-600'];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-600 to-pink-600 items-center justify-center p-12">
        <div className="text-center text-white max-w-lg">
          <h2 className="text-4xl font-extrabold mb-6">Join sBay Today</h2>
          <p className="text-xl text-white/90 mb-8">
            Connect with students on campus. Buy and sell safely.
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h3 className="font-bold text-lg mb-4">Why Join?</h3>
            <ul className="text-left space-y-3 text-white/90">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Verified students only</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Secure payments</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Easy bidding</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Campus listings</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-white">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <img src="/favi-sbay.png" alt="sBay" className="h-16 w-auto mx-auto mb-4" />
            </Link>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Create account</h2>
            <p className="text-gray-600">Start trading on your campus</p>
          </div>

          {/* Social Signup Buttons */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={() => handleSocialSignup('google')}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-transparent rounded-xl text-gray-700 font-semibold transition-all group hover:scale-[1.02] cursor-pointer"
              style={{
                backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, rgb(147, 51, 234), rgb(236, 72, 153))',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box'
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or sign up with email</span>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleRegister}>
            {error && (
              <div className="bg-red-50 p-4 rounded-xl text-red-600 text-sm font-medium border border-red-100">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email address
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="jane@student.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-purple-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
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
                      <span>Uppercase</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {pwdValidations.lowercase ? <CheckCircle2 size={12} className="text-green-500" /> : <XCircle size={12} />}
                      <span>Lowercase</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {pwdValidations.number ? <CheckCircle2 size={12} className="text-green-500" /> : <XCircle size={12} />}
                      <span>Number</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                I want to
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('BUYER')}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all border-2 cursor-pointer ${
                    role === 'BUYER'
                      ? 'bg-white border-transparent shadow-lg hover:scale-[1.02]'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                  style={role === 'BUYER' ? {
                    backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, rgb(147, 51, 234), rgb(236, 72, 153))',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box'
                  } : {}}
                >
                  <span className={role === 'BUYER' ? 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent' : 'text-gray-700'}>
                    Buy items
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('SELLER')}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all border-2 cursor-pointer ${
                    role === 'SELLER'
                      ? 'bg-white border-transparent shadow-lg hover:scale-[1.02]'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                  style={role === 'SELLER' ? {
                    backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, rgb(147, 51, 234), rgb(236, 72, 153))',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box'
                  } : {}}
                >
                  <span className={role === 'SELLER' ? 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent' : 'text-gray-700'}>
                    Sell items
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || pwdStrength < 4}
              className="w-full py-3.5 px-4 bg-white border-2 border-transparent rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              style={{
                backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, rgb(147, 51, 234), rgb(236, 72, 153))',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box'
              }}
            >
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">
                {isLoading ? 'Creating account...' : 'Sign Up'}
              </span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">Already have an account? </span>
            <Link href="/login" className="text-sm text-purple-600 hover:text-purple-700 font-semibold transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
