'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LogOut, LayoutDashboard, Users, ShoppingBag, ShieldCheck, Scale, Settings, Flag, MessageSquare, Star } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isLoginPage = pathname === '/admin-portal/login';

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const userStr = localStorage.getItem('admin_user');
    if (!token && !isLoginPage) {
      router.push('/admin-portal/login');
    } else if (token) {
      if (userStr) {
        try { setAdminUser(JSON.parse(userStr)); } catch (e) {}
      }
    }
    // Default: open on desktop, closed on mobile
    const isMobile = window.innerWidth < 1024;
    setIsSidebarOpen(!isMobile);
    setIsLoading(false);
  }, [pathname, router, isLoginPage]);

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
  `;

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  );

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
    localStorage.removeItem('admin_user');
    router.push('/admin-portal/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/admin-portal', icon: LayoutDashboard },
    { name: 'User Management', path: '/admin-portal/users', icon: Users },
    { name: 'All Listings', path: '/admin-portal/listings', icon: ShoppingBag },
    { name: 'ID Verifications', path: '/admin-portal/verifications', icon: ShieldCheck },
    { name: 'Escrow Disputes', path: '/admin-portal/disputes', icon: Scale },
    { name: 'Reports', path: '/admin-portal/reports', icon: Flag },
    { name: 'Reviews & Feedback', path: '/admin-portal/reviews', icon: Star },
    { name: 'Manage Admins', path: '/admin-portal/settings', icon: Settings },
  ];

  const adminInitials = adminUser?.name
    ? adminUser.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'AD';

  return (
    <>
      <style>{bgStyles}</style>
      <div className="admin-bg flex h-screen overflow-hidden text-gray-800">

        {/* Mobile overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:relative inset-y-0 left-0 z-30
          flex flex-col bg-white border-r border-gray-200 shadow-xl
          transition-all duration-300 ease-in-out flex-shrink-0
          ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden'}
        `}>
          <div className="flex items-center justify-between h-20 border-b border-gray-100 px-5 flex-shrink-0">
            <div className="relative font-black text-xl tracking-tighter">
              <span className="text-gray-900">STUDENT</span>
              <span
                className="text-white italic ml-2 px-2 py-0.5 text-sm rounded"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}
              >
                ADMIN
              </span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {navLinks.map((link) => {
              const isActive = pathname === link.path || (link.path !== '/admin-portal' && pathname.startsWith(link.path));
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => { if (window.innerWidth < 1024) setIsSidebarOpen(false); }}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-150 font-medium text-sm
                    ${isActive
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{link.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-100 flex-shrink-0">
            <div className="flex items-center space-x-3 px-2 mb-3">
              <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
                {adminInitials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{adminUser?.name || 'Admin'}</p>
                <p className="text-xs text-purple-600 font-medium truncate">{adminUser?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 px-4 py-2.5 text-red-600 font-semibold bg-red-50 hover:bg-red-100 rounded-xl transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Top Navbar */}
          <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200 flex-shrink-0 shadow-sm">
            <div className="flex items-center space-x-4">
              {/* Hamburger always visible */}
              <button
                className="p-2 rounded-lg text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-colors focus:outline-none"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                title="Toggle sidebar"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">Admin Control Panel</p>
                <p className="text-xs text-gray-400">{pathname.replace('/admin-portal', '') || '/ Dashboard'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className="hidden sm:block text-sm text-gray-500 font-medium">
                {adminUser?.email || ''}
              </span>
              <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-md ring-2 ring-purple-100">
                {adminInitials}
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
