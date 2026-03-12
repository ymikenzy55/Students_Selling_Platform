'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useState } from 'react';
import { 
  LogOut, 
  Menu, 
  X, 
  LayoutDashboard,
  Package,
  Gavel,
  CreditCard,
  User,
  MessageCircle,
  Heart,
  Plus
} from 'lucide-react';

export default function DashboardHeader() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Don't render if still loading or no user
  if (isLoading || !user) {
    return (
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex-shrink-0 cursor-pointer">
              <video
                src="/logo.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="h-10 w-auto rounded-lg pointer-events-none"
              />
            </Link>
          </div>
        </div>
      </header>
    );
  }

  const isSeller = user.role === 'SELLER';

  const menuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Profile', href: '/dashboard/profile', icon: User },
    { label: 'Messages', href: '/messages', icon: MessageCircle },
    { label: 'Wishlist', href: '/wishlist', icon: Heart },
    ...(isSeller ? [
      { label: 'Create Listing', href: '/create-listing', icon: Plus },
      { label: 'My Listings', href: '/dashboard/listings', icon: Package },
      { label: 'Transactions', href: '/dashboard/transactions', icon: CreditCard },
    ] : [
      { label: 'My Bids', href: '/dashboard/bids', icon: Gavel },
    ]),
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex-shrink-0 cursor-pointer">
                <video
                  src="/logo.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-10 w-auto rounded-lg pointer-events-none"
                />
              </Link>
            </div>

            <div className="flex items-center gap-4">
              {/* Hamburger Menu Button - Always Visible */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-gray-700 hover:text-purple-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
          {/* Sidebar Panel */}
          <div className="absolute right-0 top-0 h-full w-80 max-w-sm bg-white shadow-2xl pointer-events-auto">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">{user.role.toLowerCase()}</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-6 py-6">
              <div className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors font-medium"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Sidebar Footer */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 p-6 bg-white">
              <button
                onClick={() => {
                  handleLogout();
                  setSidebarOpen(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
