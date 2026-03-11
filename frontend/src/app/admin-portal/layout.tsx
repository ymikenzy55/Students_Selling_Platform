'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Exclude Login from layout
  const isLoginPage = pathname === '/admin-portal/login';

  useEffect(() => {
    // 1. Check if we have an admin token
    const token = localStorage.getItem('admin_token');
    if (!token && !isLoginPage) {
      router.push('/admin-portal/login');
    } else if (token) {
      setIsAdminLoggedIn(true);
    }
    setIsLoading(false);
  }, [pathname, router, isLoginPage]);

  // Polygon background effect
  const bgStyles = `
    .admin-bg {
      background-color: #f8f9fa;
      background-image: 
        linear-gradient(135deg, rgba(109, 40, 217, 0.03) 25%, transparent 25%),
        linear-gradient(225deg, rgba(109, 40, 217, 0.03) 25%, transparent 25%),
        linear-gradient(45deg, rgba(109, 40, 217, 0.03) 25%, transparent 25%),
        linear-gradient(315deg, rgba(109, 40, 217, 0.03) 25%, #f8f9fa 25%);
      background-position: 10px 0, 10px 0, 0 0, 0 0;
      background-size: 20px 20px;
      background-repeat: repeat;
      min-height: 100vh;
    }
    .hover-glOW:hover {
        box-shadow: 0 0 15px rgba(109, 40, 217, 0.3);
        transform: translateY(-2px);
        transition: all 0.3s ease;
    }
  `;

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

  if (isLoginPage) {
    return (
        <>
            <style>{bgStyles}</style>
            <div className="admin-bg">{children}</div>
        </>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin-portal/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/admin-portal', icon: '📊' },
    { name: 'User Management', path: '/admin-portal/users', icon: '👥' },
    { name: 'All Listings', path: '/admin-portal/listings', icon: '🛍️' },
    { name: 'ID Verifications', path: '/admin-portal/verifications', icon: '🆔' },
    { name: 'Escrow Disputes', path: '/admin-portal/disputes', icon: '⚖️' },
    { name: 'Manage Admins', path: '/admin-portal/settings', icon: '⚙️' }
  ];

  return (
    <>
      <style>{bgStyles}</style>
      <div className="admin-bg flex h-screen overflow-hidden text-gray-800">
        
        {/* Mobile overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          absolute lg:static inset-y-0 left-0 z-30
          w-64 bg-white border-r border-gray-200 
          transform transition-transform duration-300 ease-in-out
          flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="flex items-center justify-center h-20 border-b border-gray-100 px-6">
            {/* Polygon slash logo design */}
            <div className="relative font-black text-2xl tracking-tighter">
                <span className="text-gray-900">STUDENT</span>
                <span className="text-purple-600 hidden">MARKET</span>
                <span className="text-white absolute -right-20 italic" style={{clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)', background: '#9333ea', padding: '0 8px'}}>ADMIN</span>
            </div>
          </div>

          <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link 
                  key={link.path} 
                  href={link.path}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 border-l-4
                    ${isActive 
                      ? 'bg-purple-600 text-white font-bold shadow-md border-purple-800' 
                      : 'text-gray-600 bg-white hover:bg-gray-50 border-transparent'}
                  `}
                >
                  <span className="text-xl">{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-100">
            <button 
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-red-600 font-bold bg-white hover:bg-gray-50 rounded-lg transition-colors flex items-center"
            >
              Sign Out Securely
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          
          {/* Top Navbar */}
          <header className="flex items-center justify-between h-20 px-6 bg-white border-b border-gray-200 lg:justify-end">
            <button 
              className="lg:hidden text-gray-500 hover:text-primary focus:outline-none"
              onClick={() => setIsSidebarOpen(true)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center space-x-4">
              <span className="hidden sm:block text-sm font-medium text-gray-500">Global Overseer</span>
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-purple-100">
                GO
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 overflow-auto p-6 md:p-8">
            <div className="max-w-6xl mx-auto">
                {children}
            </div>
          </div>
          
        </main>
      </div>
    </>
  );
}
