'use client';

import React, { useEffect, useState } from 'react';
import { Search, Trash2, Tag, ShoppingBag, ChevronRight, X, User } from 'lucide-react';

export default function AllListings() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedListing, setSelectedListing] = useState<any | null>(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('http://localhost:5000/api/admin/listings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setListings(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteListing = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this listing from the marketplace?')) return;
    
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`http://localhost:5000/api/admin/listings/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        setListings(listings.filter(l => l.id !== id));
        if (selectedListing?.id === id) setSelectedListing(null);
      } else {
        alert('Failed to delete listing.');
      }
    } catch (error) {
      console.error(error);
      alert('Network error.');
    }
  };

  const filteredListings = listings.filter(l => 
    l.title.toLowerCase().includes(search.toLowerCase()) || 
    (l.category && l.category.toLowerCase().includes(search.toLowerCase())) ||
    (l.seller?.name && l.seller.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex gap-6 relative">
      <div className={`space-y-6 flex-1 transition-all ${selectedListing ? 'w-2/3' : 'w-full'}`}>
        <div className="flex justify-between items-center mb-8">
          <div>
              <h1 className="text-3xl font-bold text-gray-900 border-b-4 border-purple-600 inline-block pb-1">All Listings</h1>
              <p className="text-gray-500 mt-2">Monitor all items posted on the marketplace across every category.</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <Search className="text-gray-400 w-5 h-5 ml-2" />
          <input 
              type="text" 
              placeholder="Search by title, category, or seller name..." 
              className="flex-1 p-2 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Listings Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm font-medium">
              <tr>
                <th className="py-4 px-6">Item Title</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                  <tr><td colSpan={5} className="py-8 text-center text-gray-400">Loading listings...</td></tr>
              ) : filteredListings.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-gray-400">No listings found.</td></tr>
              ) : (
                  filteredListings.map(listing => (
                    <tr key={listing.id} className={`transition-colors cursor-pointer ${selectedListing?.id === listing.id ? 'bg-purple-50' : 'hover:bg-gray-50'}`} onClick={() => setSelectedListing(listing)}>
                      <td className="py-4 px-6">
                        <div className="font-bold text-gray-900">{listing.title}</div>
                        <div className="text-sm text-gray-500 flex items-center mt-1"><User className="w-3 h-3 mr-1"/> {listing.seller?.name || 'Unknown'}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold inline-flex items-center">
                            <Tag className="w-3 h-3 mr-1" />
                            {listing.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono font-medium text-gray-900">
                          ${listing.price.toFixed(2)}
                      </td>
                      <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              listing.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                              listing.status === 'SOLD' ? 'bg-gray-200 text-gray-600' :
                              'bg-yellow-100 text-yellow-700'
                          }`}>
                              {listing.status}
                          </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button 
                            onClick={(e) => { e.stopPropagation(); setSelectedListing(listing); }}
                            className="text-purple-600 hover:text-purple-800 p-2 rounded hover:bg-purple-100 transition-colors font-medium flex items-center justify-end w-full"
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

      {/* Side Pane for Selected Listing Details */}
      {selectedListing && (
          <div className="w-1/3 bg-white border border-gray-100 shadow-lg rounded-xl overflow-hidden self-start sticky top-6 flex flex-col max-h-[90vh]">
              <div className="bg-purple-600 p-6 flex justify-between items-start text-white flex-shrink-0">
                  <div className="pr-4">
                      <h2 className="text-xl font-bold line-clamp-2">{selectedListing.title}</h2>
                      <p className="text-purple-200 font-mono mt-1">${selectedListing.price.toFixed(2)}</p>
                  </div>
                  <button onClick={() => setSelectedListing(null)} className="text-purple-200 hover:text-white">
                      <X className="w-6 h-6" />
                  </button>
              </div>
              
              <div className="p-6 space-y-6 overflow-y-auto w-full">
                  <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Item Details</label>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                          <div className="bg-gray-50 p-3 rounded border border-gray-100">
                              <span className="text-xs text-gray-500 block mb-1">Category</span>
                              <span className="font-semibold text-gray-900 flex items-center"><Tag className="w-4 h-4 mr-1 text-gray-400"/> {selectedListing.category || 'N/A'}</span>
                          </div>
                          <div className="bg-gray-50 p-3 rounded border border-gray-100">
                              <span className="text-xs text-gray-500 block mb-1">Condition</span>
                              <span className="font-semibold text-gray-900 flex items-center"><ShoppingBag className="w-4 h-4 mr-1 text-gray-400"/> {selectedListing.condition || 'N/A'}</span>
                          </div>
                      </div>
                  </div>

                  <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Description</label>
                      <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded border border-gray-100 whitespace-pre-wrap">
                          {selectedListing.description || 'No description provided.'}
                      </p>
                  </div>

                  <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Seller Information</label>
                      <div className="flex items-center space-x-3 bg-purple-50 p-3 rounded-lg border border-purple-100">
                          <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-700">
                              <User className="w-5 h-5" />
                          </div>
                          <div>
                              <p className="font-bold text-purple-900">{selectedListing.seller?.name}</p>
                              <p className="text-xs text-purple-700">{selectedListing.seller?.email}</p>
                          </div>
                      </div>
                  </div>

                  <hr className="border-gray-100" />
                  
                  <button 
                      onClick={() => deleteListing(selectedListing.id)}
                      className="w-full py-3 bg-purple-600 text-white font-bold rounded-lg shadow-sm flex items-center justify-center space-x-2"
                  >
                      <Trash2 className="w-5 h-5" />
                      <span>Take down listing</span>
                  </button>
              </div>
          </div>
      )}
    </div>
  );
}
