'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, FileText, Camera } from 'lucide-react';

export default function IDVerifications() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // only show unverified users who actually submitted an ID 
        setUsers(data.filter((u: any) => !u.isVerified && (u.ghanaCardNumber || u.ghanaCardImageUrl)));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId: string, status: boolean) => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isVerified: status })
      });
      
      if (res.ok) {
        // Remove from the pending queue
        setUsers(users.filter(u => u.id !== userId));
      }
    } catch (error) {
      console.error('Failed to verify user', error);
      alert('Network error verifying user.');
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 border-b-4 border-yellow-500 inline-block pb-1">Identity Approvals</h1>
            <p className="text-gray-500 mt-2">Manually review uploaded Ghana Cards that automated OCR failed to verify.</p>
        </div>
      </div>

      {loading ? (
          <div className="animate-pulse flex space-x-4"><div className="rounded-xl bg-purple-100 h-64 w-full"></div></div>
      ) : users.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
             <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-green-200">
                <CheckCircle className="w-8 h-8 text-green-500" />
             </div>
             <h3 className="text-xl font-bold text-gray-900">Queue Empty</h3>
             <p className="text-gray-500 mt-2 max-w-sm mx-auto">There are no pending identity verifications at this time.</p>
          </div>
      ) : (
          <div className="grid grid-cols-1 gap-6">
            {users.map(user => (
              <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-6 hover-glOW transition-all">
                
                {/* ID Evidence Column */}
                <div className="md:w-1/3 bg-gray-50 rounded-lg p-4 border border-gray-200 flex flex-col items-center justify-center">
                    {user.ghanaCardImageUrl ? (
                        <div className="relative group w-full">
                            <img src={user.ghanaCardImageUrl} alt="Ghana Card" className="w-full h-auto rounded shadow-sm" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                                <Camera className="text-white w-8 h-8" />
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 py-8">
                            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm font-medium">Text Input Only</p>
                        </div>
                    )}
                </div>

                {/* Details Column */}
                <div className="md:w-2/3 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900">{user.name}</h3>
                                <p className="text-gray-500">{user.email}</p>
                            </div>
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full uppercase tracking-wider">
                                Pending Review
                            </span>
                        </div>
                        
                        <div className="mt-6 bg-purple-50 p-4 rounded-lg border border-purple-100">
                            <p className="text-sm text-purple-900 font-semibold mb-1">Provided ID Number:</p>
                            <p className="font-mono text-lg tracking-wider bg-white px-3 py-2 rounded border border-purple-200 inline-block shadow-sm">
                                {user.ghanaCardNumber || "N/A"}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex space-x-4 border-t border-gray-100 pt-6">
                        <button 
                            onClick={() => handleVerify(user.id, true)}
                            className="flex-1 bg-purple-600 text-white font-bold py-3 rounded-lg flex items-center justify-center shadow-sm"
                        >
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Approve Identity
                        </button>
                        <button 
                            onClick={() => handleVerify(user.id, false)} // Or delete document reference here
                            className="flex-1 bg-purple-600 text-white font-bold py-3 rounded-lg flex items-center justify-center shadow-sm"
                        >
                            <XCircle className="w-5 h-5 mr-2" />
                            Reject / Request Re-load
                        </button>
                    </div>
                </div>

              </div>
            ))}
          </div>
      )}
    </div>
  );
}
