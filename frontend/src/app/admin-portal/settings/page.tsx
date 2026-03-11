'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Plus, Lock } from 'lucide-react';

export default function AdminSettings() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
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
            if (user.role === 'SUPER_ADMIN') setIsSuperAdmin(true);
            setIsAdminLoggedIn(true);
        } catch (e) {
            console.error(e);
        }
    }
    setLoading(false);
  }, []);

  const handleCreateAdmin = async (e: React.FormEvent) => {
      e.preventDefault();
      setStatusMsg({ text: '', type: '' });
      setIsSubmitting(true);

      try {
          const token = localStorage.getItem('admin_token');
          const res = await fetch('http://localhost:5000/api/admin/invite', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({ name, email, password })
          });
          
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'Failed to create admin');
          
          setStatusMsg({ text: 'Administrator successfully created!', type: 'success' });
          setName(''); setEmail(''); setPassword('');
      } catch (err: any) {
          setStatusMsg({ text: err.message, type: 'error' });
      } finally {
          setIsSubmitting(false);
      }
  };

  if (loading) return <div>Loading access controls...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 border-b-4 border-purple-600 inline-block pb-1">Platform Settings</h1>
            <p className="text-gray-500 mt-2">Manage overarching platform configuration and access control.</p>
        </div>
      </div>

      {!isSuperAdmin ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
              <Lock className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-red-900">SuperAdmin Access Required</h2>
              <p className="text-red-700 mt-2">Your current role does not have permission to view or modify platform settings. Please contact the Global Overseer.</p>
          </div>
      ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative group">
              {/* Decorative edge */}
              <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-purple-600 to-purple-400"></div>

              <div className="p-8">
                  <div className="flex items-center space-x-4 mb-6 border-b border-gray-100 pb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                          <Shield className="w-6 h-6" />
                      </div>
                      <div>
                          <h2 className="text-xl font-bold text-gray-900">Provision New Administrator</h2>
                          <p className="text-sm text-gray-500">Create a new account with platform moderation privileges.</p>
                      </div>
                  </div>

                  {statusMsg.text && (
                      <div className={`p-4 rounded-lg mb-6 font-medium text-sm ${statusMsg.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                          {statusMsg.text}
                      </div>
                  )}

                  <form onSubmit={handleCreateAdmin} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                              <input 
                                  type="text" required value={name} onChange={e => setName(e.target.value)}
                                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-600 outline-none"
                                  placeholder="Moderator Name"
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Email</label>
                              <input 
                                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-600 outline-none"
                                  placeholder="admin@studentmarket.com"
                              />
                          </div>
                      </div>
                      
                      <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Temporary Password</label>
                          <input 
                              type="password" required value={password} onChange={e => setPassword(e.target.value)}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-600 outline-none"
                              placeholder="••••••••"
                          />
                          <p className="text-xs text-gray-400 mt-2">The new administrator should change this password immediately upon their first login.</p>
                      </div>

                      <button 
                          type="submit" disabled={isSubmitting}
                          className="w-full md:w-auto px-8 bg-purple-600 text-white font-bold py-3.5 rounded-lg shadow-md flex items-center justify-center disabled:opacity-75 focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 ml-auto"
                      >
                          {isSubmitting ? 'Provisioning...' : <><Plus className="w-5 h-5 mr-2" /> Provision Admin</>}
                      </button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
}
