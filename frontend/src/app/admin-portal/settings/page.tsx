'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Plus, Lock, UserCheck, Mail, Calendar, RefreshCw, Trash2, AlertCircle } from 'lucide-react';

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
          <button onClick={onConfirm} className="flex-1 py-3 bg-purple-600 text-white font-bold rounded-xl shadow">Confirm</button>
        </div>
      </div>
    </div>
  );
}

export default function ManageAdmins() {
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allAdmins, setAllAdmins] = useState<any[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [modal, setModal] = useState<{ id: string; name: string } | null>(null);

  // Provision form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('admin_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setIsSuperAdmin(user.role === 'SUPER_ADMIN');
      } catch {}
    }
    setLoading(false);
  }, []);

  const fetchAdmins = async () => {
    setLoadingAdmins(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const users = await res.json();
        setAllAdmins(users.filter((u: any) => ['ADMIN', 'SUPER_ADMIN'].includes(u.role)));
      }
    } catch (err) { console.error(err); }
    finally { setLoadingAdmins(false); }
  };

  useEffect(() => { fetchAdmins(); }, []);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg({ text: '', type: '' });
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('http://localhost:5000/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create admin');
      setStatusMsg({ text: `✅ Administrator "${name}" has been provisioned successfully!`, type: 'success' });
      setName(''); setEmail(''); setPassword('');
      fetchAdmins();
    } catch (err: any) {
      setStatusMsg({ text: err.message, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuspendAdmin = async (userId: string) => {
    setModal(null);
    const token = localStorage.getItem('admin_token');
    const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/suspend`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      setAllAdmins(allAdmins.map(a => a.id === userId ? { ...a, role: 'SUSPENDED' } : a));
    }
  };

  if (loading) return null;

  return (
    <div className="space-y-8 max-w-5xl">
      {modal && (
        <ConfirmModal
          title="Revoke Admin Access"
          message={`Are you sure you want to suspend "${modal.name}"? They will lose all admin privileges immediately.`}
          onConfirm={() => handleSuspendAdmin(modal.id)}
          onCancel={() => setModal(null)}
        />
      )}

      <div>
        <h1 className="text-3xl font-bold text-gray-900 border-b-4 border-purple-600 inline-block pb-1">Manage Administrators</h1>
        <p className="text-gray-500 mt-2">View all admins, track their access, and provision new moderators.</p>
      </div>

      {/* Current Admins List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <UserCheck className="w-5 h-5 text-purple-600 mr-2" /> Current Administrators
          </h2>
          <button onClick={fetchAdmins} className="flex items-center space-x-1 text-purple-600 text-sm font-semibold px-3 py-1.5 rounded-lg bg-purple-50">
            <RefreshCw className={`w-3.5 h-3.5 ${loadingAdmins ? 'animate-spin' : ''}`} /> <span>Refresh</span>
          </button>
        </div>

        <div className="divide-y divide-gray-50">
          {loadingAdmins ? (
            <div className="p-8 text-center text-gray-400 animate-pulse">Loading admins...</div>
          ) : allAdmins.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No administrators found.</div>
          ) : (
            allAdmins.map(admin => (
              <div key={admin.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold shadow">
                    {(admin.name || 'A').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{admin.name || 'Unnamed Admin'}</p>
                    <p className="text-sm text-gray-400 flex items-center">
                      <Mail className="w-3.5 h-3.5 mr-1" />{admin.email}
                      <span className="mx-2 text-gray-200">·</span>
                      <Calendar className="w-3.5 h-3.5 mr-1" />{new Date(admin.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${admin.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {admin.role}
                  </span>
                  {isSuperAdmin && admin.role !== 'SUPER_ADMIN' && (
                    <button
                      onClick={() => setModal({ id: admin.id, name: admin.name || 'this admin' })}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      title="Revoke access"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Provision New Admin Form */}
      {!isSuperAdmin ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <Lock className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-red-900">SuperAdmin Only</h2>
          <p className="text-red-700 mt-1 text-sm">Only the SuperAdmin can provision new administrators.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center space-x-3 p-5 border-b border-gray-100">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Provision New Administrator</h2>
              <p className="text-sm text-gray-500">Create a new account with platform moderation access.</p>
            </div>
          </div>

          <div className="p-6">
            {statusMsg.text && (
              <div className={`p-4 rounded-xl mb-5 font-medium text-sm ${statusMsg.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                {statusMsg.text}
              </div>
            )}

            <form onSubmit={handleCreateAdmin} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                  <input
                    type="text" required value={name} onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-600 outline-none text-sm"
                    placeholder="Admin Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Admin Email</label>
                  <input
                    type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-600 outline-none text-sm"
                    placeholder="admin@studentmarket.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Temporary Password</label>
                <input
                  type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-600 outline-none text-sm"
                  placeholder="••••••••"
                />
                <p className="text-xs text-gray-400 mt-1.5">Admin should change this on first login.</p>
              </div>

              <div className="pt-2">
                <button
                  type="submit" disabled={isSubmitting}
                  className="flex items-center space-x-2 px-8 py-3.5 bg-purple-600 text-white font-bold rounded-xl shadow-md text-sm disabled:opacity-70"
                >
                  <Plus className="w-5 h-5" />
                  <span>{isSubmitting ? 'Provisioning...' : 'Provision Administrator'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
