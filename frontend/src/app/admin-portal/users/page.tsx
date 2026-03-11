'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Search, CheckCircle, Clock, ChevronRight, X, Shield, ShoppingBag, DollarSign, AlertCircle } from 'lucide-react';

// ---- Confirm Modal ----
function ConfirmModal({ title, message, onConfirm, onCancel }: { title: string; message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">{title}</h2>
        <p className="text-gray-500 text-center mb-8">{message}</p>
        <div className="flex space-x-3">
          <button onClick={onCancel} className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl shadow">Suspend</button>
        </div>
      </div>
    </div>
  );
}

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'SELLER' | 'BUYER' | 'ADMIN'>('ALL');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [userDetail, setUserDetail] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [modal, setModal] = useState<string | null>(null); // userId to suspend

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setUsers(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchUserDetail = useCallback(async (id: string) => {
    setLoadingDetail(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setUserDetail(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoadingDetail(false); }
  }, []);

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    fetchUserDetail(user.id);
  };

  const handleSuspend = async (userId: string) => {
    setModal(null);
    const token = localStorage.getItem('admin_token');
    const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/suspend`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      setUsers(users.map(u => u.id === userId ? { ...u, role: 'SUSPENDED' } : u));
      if (userDetail?.id === userId) setUserDetail({ ...userDetail, role: 'SUSPENDED' });
    }
  };

  const tabs: { key: typeof activeTab; label: string }[] = [
    { key: 'ALL', label: 'All Users' },
    { key: 'SELLER', label: 'Sellers' },
    { key: 'BUYER', label: 'Buyers' },
    { key: 'ADMIN', label: 'Admins' },
  ];

  const filteredUsers = users.filter(u => {
    const matchesTab = activeTab === 'ALL' || u.role === activeTab || (activeTab === 'ADMIN' && ['ADMIN','SUPER_ADMIN'].includes(u.role));
    const matchesSearch = !search || u.email.toLowerCase().includes(search.toLowerCase()) || (u.name && u.name.toLowerCase().includes(search.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const totalSales = (userDetail?.listings || []).reduce((sum: number, listing: any) =>
    sum + (listing.transactions || []).filter((t: any) => t.status === 'RELEASED_TO_SELLER').reduce((s: number, t: any) => s + t.amount, 0), 0);

  return (
    <div className="flex gap-6 relative">
      {modal && (
        <ConfirmModal
          title="Suspend User Account"
          message="This user will be blocked from accessing the platform. Are you sure?"
          onConfirm={() => handleSuspend(modal)}
          onCancel={() => setModal(null)}
        />
      )}

      <div className={`space-y-5 ${selectedUser ? 'w-3/5' : 'w-full'} transition-all`}>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 border-b-4 border-purple-600 inline-block pb-1">User Management</h1>
          <p className="text-gray-500 mt-2">Browse and moderate all users by role.</p>
        </div>

        {/* Role Tabs */}
        <div className="flex space-x-2 bg-white rounded-xl p-1 border border-gray-100 shadow-sm w-fit">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.key ? 'bg-purple-600 text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {tab.label}
              <span className="ml-2 px-1.5 py-0.5 rounded-full text-xs bg-black/10">
                {tab.key === 'ALL' ? users.length :
                 tab.key === 'ADMIN' ? users.filter(u => ['ADMIN','SUPER_ADMIN'].includes(u.role)).length :
                 users.filter(u => u.role === tab.key).length}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-3">
          <Search className="text-gray-400 w-5 h-5 ml-1 flex-shrink-0" />
          <input
            type="text" placeholder="Search by name or email..."
            className="flex-1 outline-none text-sm"
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-5">User</th>
                <th className="py-3 px-5">Role</th>
                <th className="py-3 px-5">Verified</th>
                <th className="py-3 px-5 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={4} className="py-12 text-center text-gray-400">Loading users...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={4} className="py-12 text-center text-gray-400">No users found.</td></tr>
              ) : (
                filteredUsers.map(user => (
                  <tr
                    key={user.id}
                    className={`cursor-pointer transition-colors ${selectedUser?.id === user.id ? 'bg-purple-50' : 'hover:bg-gray-50/70'}`}
                    onClick={() => handleSelectUser(user)}
                  >
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-gray-900 text-sm">{user.name || 'Anonymous'}</div>
                      <div className="text-xs text-gray-400">{user.email}</div>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        user.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'ADMIN' ? 'bg-blue-100 text-blue-700' :
                        user.role === 'SELLER' ? 'bg-green-100 text-green-700' :
                        user.role === 'SUSPENDED' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>{user.role}</span>
                    </td>
                    <td className="py-3.5 px-5">
                      {user.isVerified
                        ? <span className="flex items-center text-green-600 text-xs font-semibold"><CheckCircle className="w-3.5 h-3.5 mr-1"/> Verified</span>
                        : <span className="flex items-center text-yellow-600 text-xs font-semibold"><Clock className="w-3.5 h-3.5 mr-1"/> Pending</span>}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Side Pane */}
      {selectedUser && (
        <div className="w-2/5 bg-white border border-gray-100 shadow-xl rounded-2xl overflow-hidden self-start sticky top-4 flex flex-col max-h-[92vh]">
          <div className="bg-purple-600 p-5 flex justify-between items-start text-white flex-shrink-0">
            <div>
              <h2 className="text-lg font-bold">{selectedUser.name || 'User Details'}</h2>
              <p className="text-purple-200 text-sm">{selectedUser.role}</p>
            </div>
            <button onClick={() => { setSelectedUser(null); setUserDetail(null); }}>
              <X className="w-6 h-6 text-purple-200 hover:text-white" />
            </button>
          </div>

          <div className="p-5 space-y-5 overflow-y-auto flex-1">
            {loadingDetail ? (
              <div className="animate-pulse space-y-3">
                {[...Array(4)].map((_,i) => <div key={i} className="h-8 bg-gray-100 rounded" />)}
              </div>
            ) : userDetail ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-xs text-gray-400 block">Email</span>
                    <span className="font-semibold text-gray-900 text-sm break-all">{userDetail.email}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-xs text-gray-400 block">Joined</span>
                    <span className="font-semibold text-gray-900 text-sm">{new Date(userDetail.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-purple-50 p-3 rounded-xl text-center border border-purple-100">
                    <ShoppingBag className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                    <div className="text-xl font-black text-purple-700">{userDetail.listings?.length || 0}</div>
                    <div className="text-xs text-purple-500 font-medium">Listings</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-xl text-center border border-green-100">
                    <DollarSign className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <div className="text-xl font-black text-green-700">${totalSales.toFixed(0)}</div>
                    <div className="text-xs text-green-500 font-medium">Sales</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-xl text-center border border-blue-100">
                    <Shield className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <div className="text-xl font-black text-blue-700">{userDetail.isVerified ? '✓' : '✗'}</div>
                    <div className="text-xs text-blue-500 font-medium">Verified</div>
                  </div>
                </div>

                {/* Listings */}
                {userDetail.listings?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-700 mb-2">Listings ({userDetail.listings.length})</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {userDetail.listings.map((l: any) => (
                        <div key={l.id} className="flex justify-between items-center p-2.5 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                          <div className="truncate flex-1 mr-2">
                            <span className="font-medium text-gray-800">{l.title}</span>
                            <span className="text-gray-400 ml-1 text-xs">· {l.category}</span>
                          </div>
                          <span className="font-mono font-bold text-gray-700 flex-shrink-0">${l.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : null}

            <hr className="border-gray-100" />

            {selectedUser.role !== 'SUPER_ADMIN' && selectedUser.role !== 'SUSPENDED' && (
              <button
                onClick={() => setModal(selectedUser.id)}
                className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl shadow text-sm"
              >
                Suspend Account
              </button>
            )}
            {selectedUser.role === 'SUSPENDED' && (
              <div className="py-3 text-center text-red-600 font-bold bg-red-50 rounded-xl text-sm border border-red-100">
                Account is currently Suspended
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
