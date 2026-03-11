'use client';

import React, { useEffect, useState } from 'react';
import { Search, Ban, CheckCircle, Clock } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setUsers(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(search.toLowerCase()) || 
    (u.name && u.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 border-b-4 border-primary inline-block pb-1">User Management</h1>
            <p className="text-gray-500 mt-2">View, moderate, and manage all users on the platform.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
        <Search className="text-gray-400 w-5 h-5 ml-2" />
        <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="flex-1 p-2 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm font-medium">
            <tr>
              <th className="py-4 px-6">User</th>
              <th className="py-4 px-6">Role</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Joined</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
                <tr><td colSpan={5} className="py-8 text-center text-gray-400">Loading users...</td></tr>
            ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-gray-400">No users found.</td></tr>
            ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{user.name || 'Anonymous'}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          user.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700' :
                          user.role === 'ADMIN' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                      }`}>
                          {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                        {user.isVerified ? (
                            <span className="flex items-center text-green-600 text-sm font-medium"><CheckCircle className="w-4 h-4 mr-1"/> Verified</span>
                        ) : (
                            <span className="flex items-center text-yellow-600 text-sm font-medium"><Clock className="w-4 h-4 mr-1"/> Unverified</span>
                        )}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      {user.role !== 'SUPER_ADMIN' && (
                          <button className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors" title="Suspend User">
                              <Ban className="w-5 h-5" />
                          </button>
                      )}
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
