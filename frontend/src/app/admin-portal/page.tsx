'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, AlertTriangle, ShieldCheck, DollarSign, ShoppingBag, Flag, ArrowRight, RefreshCw } from 'lucide-react';

interface Stats {
  totalUsers: number;
  pendingVerifications: number;
  activeDisputes: number;
  openReports: number;
  totalListings: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('http://localhost:5000/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setStats(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  const statCards = stats ? [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
      action: () => router.push('/admin-portal/users'),
      actionLabel: 'Manage Users',
    },
    {
      label: 'Total Listings',
      value: stats.totalListings,
      icon: ShoppingBag,
      color: 'bg-purple-50 text-purple-600',
      action: () => router.push('/admin-portal/listings'),
      actionLabel: 'View Listings',
    },
    {
      label: 'Pending ID Reviews',
      value: stats.pendingVerifications,
      icon: ShieldCheck,
      color: 'bg-yellow-50 text-yellow-600',
      action: () => router.push('/admin-portal/verifications'),
      actionLabel: 'Review IDs',
      alert: stats.pendingVerifications > 0,
    },
    {
      label: 'Active Disputes',
      value: stats.activeDisputes,
      icon: DollarSign,
      color: 'bg-red-50 text-red-600',
      action: () => router.push('/admin-portal/disputes'),
      actionLabel: 'Resolve Disputes',
      alert: stats.activeDisputes > 0,
    },
    {
      label: 'Open Reports',
      value: stats.openReports,
      icon: Flag,
      color: 'bg-orange-50 text-orange-600',
      action: () => router.push('/admin-portal/reports'),
      actionLabel: 'View Reports',
      alert: stats.openReports > 0,
    },
  ] : [];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 border-b-4 border-purple-600 inline-block pb-1">
            Platform Overview
          </h1>
          <p className="text-gray-500 mt-2">Live system metrics and quick-action shortcuts.</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-semibold text-sm shadow disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-2xl h-40 border border-gray-100 shadow-sm" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className={`bg-white rounded-2xl shadow-sm border ${card.alert ? 'border-orange-200' : 'border-gray-100'} p-6 flex flex-col justify-between`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{card.label}</p>
                    <h3 className={`text-4xl font-black ${card.alert ? 'text-red-600' : 'text-gray-900'}`}>
                      {card.value}
                    </h3>
                    {card.alert && (
                      <span className="flex items-center text-xs text-orange-600 font-semibold mt-1">
                        <AlertTriangle className="w-3 h-3 mr-1" /> Needs attention
                      </span>
                    )}
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <button
                  onClick={card.action}
                  className="mt-6 flex items-center justify-between w-full px-4 py-2.5 bg-gray-50 hover:bg-purple-50 rounded-xl text-sm font-semibold text-gray-700 hover:text-purple-700 transition-colors"
                >
                  {card.actionLabel}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'View All Sellers', action: () => router.push('/admin-portal/users?role=SELLER') },
            { label: 'View All Buyers', action: () => router.push('/admin-portal/users?role=BUYER') },
            { label: 'Open ID Queue', action: () => router.push('/admin-portal/verifications') },
            { label: 'Manage Admins', action: () => router.push('/admin-portal/settings') },
          ].map((btn) => (
            <button
              key={btn.label}
              onClick={btn.action}
              className="py-3 px-4 bg-purple-600 text-white rounded-xl text-sm font-bold shadow-sm text-center"
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
