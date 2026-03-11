'use client';

import React, { useEffect, useState } from 'react';
import { Users, AlertTriangle, ShieldCheck, DollarSign } from 'lucide-react';

export default function AdminDashboardOverview() {
  const [stats, setStats] = useState({ users: 0, pendingIds: 0, disputes: 0, escrowVolume: 0 });
  const [loading, setLoading] = useState(true);

  // Note: We simulate fetching global stats here because building a complex /stats backend
  // was not requested in Phase 6, but we can aggregate basic data for the MVP placeholder.
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const headers = { Authorization: `Bearer ${token}` };

        // We fetch the data independently and aggregate it
        const [usersRes, dispRes] = await Promise.all([
          fetch('http://localhost:5000/api/admin/users', { headers }),
          fetch('http://localhost:5000/api/admin/transactions/disputes', { headers })
        ]);

        if (usersRes.ok && dispRes.ok) {
            const users = await usersRes.json();
            const disputes = await dispRes.json();
            
            setStats({
                users: users.length,
                pendingIds: users.filter((u: any) => u.ghanaCardImageUrl && !u.isVerified).length,
                disputes: disputes.length,
                escrowVolume: disputes.reduce((sum: number, tx: any) => sum + (tx.amount || 0), 0) // rough estimate
            });
        }
      } catch (error) {
        console.error("Error loading stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 border-b-4 border-primary inline-block pb-1">Platform Overview</h1>
            <p className="text-gray-500 mt-2">Welcome back, SuperAdmin. Here is what is happening today.</p>
        </div>
      </div>

      {loading ? (
          <div className="animate-pulse flex space-x-4"><div className="rounded-xl bg-purple-100 h-32 w-full"></div></div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Stat Card 1 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover-glOW transition-all group">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-1">Total Users</p>
                  <h3 className="text-3xl font-black text-gray-900">{stats.users}</h3>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover-glOW transition-all group">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-1">Pending IDs</p>
                  <h3 className="text-3xl font-black text-gray-900">{stats.pendingIds}</h3>
                </div>
                <div className="w-12 h-12 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-600 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>
              {stats.pendingIds > 0 && <p className="text-xs text-yellow-600 mt-4 font-medium flex items-center">Requires attention &rarr;</p>}
            </div>

            {/* Stat Card 3 */}
            <div className="bg-white rounded-xl shadow-sm border border-red-50 p-6 hover-glOW transition-all group">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-red-400 uppercase tracking-widest mb-1 shadow-sm">Active Disputes</p>
                  <h3 className="text-3xl font-black text-red-600">{stats.disputes}</h3>
                </div>
                <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              </div>
              {stats.disputes > 0 && <p className="text-xs text-red-500 mt-4 font-bold">Escrow funds frozen</p>}
            </div>

            {/* Stat Card 4 */}
            <div className="relative bg-gradient-to-br from-primary to-purple-800 rounded-xl shadow-lg p-6 hover:-translate-y-1 transition-transform overflow-hidden group">
              {/* Internal abstract shapes */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="relative flex justify-between items-start z-10">
                <div>
                  <p className="text-sm font-medium text-purple-200 uppercase tracking-widest mb-1">Vol in Dispute</p>
                  <h3 className="text-3xl font-black text-white">${stats.escrowVolume.toFixed(2)}</h3>
                </div>
                <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
            </div>

          </div>
      )}

      {/* Decorative Empty State Feed */}
      <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiLz48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjZjNmM2Y0Ii8+PC9zdmc+')]">
         <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-gray-200">
            <ShieldCheck className="w-8 h-8 text-gray-400" />
         </div>
         <h3 className="text-lg font-bold text-gray-900">Activity Feed Online</h3>
         <p className="text-gray-500 mt-1 max-w-sm mx-auto">All systems operational. Navigate using the sidebar to begin moderating StudentMarket.</p>
      </div>

    </div>
  );
}
