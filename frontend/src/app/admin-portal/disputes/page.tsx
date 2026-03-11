'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle, ArrowLeftRight, CreditCard, ShieldAlert } from 'lucide-react';

export default function EscrowDisputes() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('http://localhost:5000/api/admin/transactions/disputes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setDisputes(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resolveDispute = async (id: string, resolution: 'REFUND_BUYER' | 'RELEASE_TO_SELLER') => {
    if (!confirm(`Are you sure you want to FORCE ${resolution.replace(/_/g, ' ')}? This action is irreversible.`)) return;
    
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`http://localhost:5000/api/admin/transactions/${id}/resolve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ resolution })
      });
      
      if (res.ok) {
        setDisputes(disputes.filter(d => d.id !== id));
      } else {
        alert('Failed to resolve dispute.');
      }
    } catch (error) {
      console.error(error);
      alert('Network error.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 border-b-4 border-red-500 inline-block pb-1">Escrow Disputes</h1>
            <p className="text-gray-500 mt-2">Manage frozen funds and force transaction resolutions between buyers and sellers.</p>
        </div>
      </div>

      {loading ? (
          <div className="animate-pulse flex space-x-4"><div className="rounded-xl bg-purple-100 h-64 w-full"></div></div>
      ) : disputes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
             <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-green-200">
                <ShieldAlert className="w-8 h-8 text-green-500" />
             </div>
             <h3 className="text-xl font-bold text-gray-900">Zero Active Disputes</h3>
             <p className="text-gray-500 mt-2 max-w-sm mx-auto">All escrow transactions are proceeding smoothly.</p>
          </div>
      ) : (
          <div className="grid grid-cols-1 gap-6">
            {disputes.map(tx => (
              <div key={tx.id} className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden hover-glOW transition-all relative">
                
                {/* Decorative absolute element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -z-0"></div>

                <div className="p-6 relative z-10 w-full">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900">{tx.listing?.title || 'Unknown Item'}</h3>
                                <p className="text-sm font-mono text-gray-500">TX_ID: {tx.id.split('-')[0]}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Frozen Amount</p>
                            <p className="text-3xl font-black text-red-600">${tx.amount.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        {/* Buyer Info */}
                        <div className="flex flex-col space-y-1">
                            <span className="text-xs font-bold text-gray-400 uppercase">The Buyer</span>
                            <span className="font-semibold text-gray-900">{tx.buyer?.name || 'Unknown'}</span>
                            <span className="text-sm text-gray-500">{tx.buyer?.email}</span>
                        </div>
                        {/* Seller Info */}
                        <div className="flex flex-col space-y-1">
                            <span className="text-xs font-bold text-gray-400 uppercase">The Seller</span>
                            <span className="font-semibold text-gray-900">{tx.listing?.seller?.name || 'Unknown'}</span>
                            <span className="text-sm text-gray-500">{tx.listing?.seller?.email}</span>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row gap-4">
                        <button 
                            onClick={() => resolveDispute(tx.id, 'REFUND_BUYER')}
                            className="flex-1 bg-purple-600 text-white font-bold py-3 rounded-lg flex items-center justify-center shadow-sm"
                        >
                            <ArrowLeftRight className="w-5 h-5 mr-2" />
                            Force Refund to Buyer
                        </button>
                        <button 
                            onClick={() => resolveDispute(tx.id, 'RELEASE_TO_SELLER')}
                            className="flex-1 bg-purple-600 text-white font-bold py-3 rounded-lg flex items-center justify-center shadow-sm"
                        >
                            <CreditCard className="w-5 h-5 mr-2" />
                            Force Payout to Seller
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
