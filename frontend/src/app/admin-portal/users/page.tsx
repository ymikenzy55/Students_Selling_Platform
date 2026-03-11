'use client';

import React, { useEffect, useState } from 'react';
import { Search, Ban, CheckCircle, Clock, ChevronRight, X } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

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
    <div className="flex gap-6 relative">
      <div className={`space-y-6 flex-1 transition-all ${selectedUser ? 'w-2/3' : 'w-full'}`}>
        <div className="flex justify-between items-center mb-8">
          <div>
              <h1 className="text-3xl font-bold text-gray-900 border-b-4 border-purple-600 inline-block pb-1">User Management</h1>
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
                <th className="py-4 px-6 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                  <tr><td colSpan={5} className="py-8 text-center text-gray-400">Loading users...</td></tr>
              ) : filteredUsers.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-gray-400">No users found.</td></tr>
              ) : (
                  filteredUsers.map(user => (
                    <tr key={user.id} className={`transition-colors ${selectedUser?.id === user.id ? 'bg-purple-50' : 'hover:bg-gray-50'}`}>
                      <td className="py-4 px-6 cursor-pointer" onClick={() => setSelectedUser(user)}>
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
                      <td className="py-4 px-6 text-right">
                        <button 
                            onClick={() => setSelectedUser(user)}
                            className="text-purple-600 hover:text-purple-800 p-2 rounded hover:bg-purple-50 transition-colors font-medium flex items-center justify-end w-full"
                        >
                            View <ChevronRight className="w-5 h-5 ml-1" />
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side Pane for Selected User Details */}
      {selectedUser && (
          <div className="w-1/3 bg-white border border-gray-100 shadow-lg rounded-xl overflow-hidden self-start sticky top-6">
              <div className="bg-purple-600 p-6 flex justify-between items-center text-white">
                  <h2 className="text-xl font-bold truncate pr-4">{selectedUser.name || 'User Details'}</h2>
                  <button onClick={() => setSelectedUser(null)} className="text-purple-200 hover:text-white">
                      <X className="w-6 h-6" />
                  </button>
              </div>
              <div className="p-6 space-y-4">
                  <div>
                      <label className="text-xs font-bold text-gray-400 uppercase">Email Address</label>
                      <p className="text-gray-900 font-medium break-all">{selectedUser.email}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="text-xs font-bold text-gray-400 uppercase">Role</label>
                          <p className="text-gray-900 font-medium">{selectedUser.role}</p>
                      </div>
                      <div>
                          <label className="text-xs font-bold text-gray-400 uppercase">Joined</label>
                          <p className="text-gray-900 font-medium">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                      </div>
                  </div>
                  <div>
                      <label className="text-xs font-bold text-gray-400 uppercase">Verification Status</label>
                      <p className="text-gray-900 font-medium flex items-center">
                          {selectedUser.isVerified ? <CheckCircle className="text-green-500 w-5 h-5 mr-2" /> : <Clock className="text-yellow-500 w-5 h-5 mr-2" />}
                          {selectedUser.isVerified ? 'Fully Verified' : 'Pending Verification'}
                      </p>
                  </div>
                  {selectedUser.ghanaCardNumber && (
                      <div className="bg-gray-50 p-4 rounded-lg mt-4 border border-gray-100">
                          <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Ghana Card Number</label>
                          <p className="font-mono text-lg tracking-wider bg-white py-1 px-3 border border-gray-200 rounded inline-block">{selectedUser.ghanaCardNumber}</p>
                      </div>
                  )}

                  <hr className="my-6 border-gray-100" />
                  
                  {selectedUser.role !== 'SUPER_ADMIN' && (
                      <button className="w-full py-3 bg-red-600 text-white font-bold rounded-lg shadow-md flex items-center justify-center space-x-2">
                          <Ban className="w-5 h-5" />
                          <span>Suspend User Account</span>
                      </button>
                  )}
              </div>
          </div>
      )}
    </div>
  );
}
