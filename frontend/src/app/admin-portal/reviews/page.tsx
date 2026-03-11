'use client';

import React, { useEffect, useState } from 'react';
import { Star, Eye, EyeOff, CheckCircle, RefreshCw } from 'lucide-react';

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PUBLISHED: 'bg-green-100 text-green-700',
  HIDDEN: 'bg-gray-100 text-gray-600',
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex space-x-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`w-4 h-4 ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
      ))}
    </div>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('http://localhost:5000/api/admin/reviews', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setReviews(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const changeStatus = async (id: string, status: string) => {
    const token = localStorage.getItem('admin_token');
    await fetch(`http://localhost:5000/api/admin/reviews/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status })
    });
    setReviews(reviews.map(r => r.id === id ? { ...r, status } : r));
  };

  const filtered = filter === 'ALL' ? reviews : reviews.filter(r => r.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 border-b-4 border-purple-600 inline-block pb-1">Reviews & Feedback</h1>
          <p className="text-gray-500 mt-2">Review and moderate user-submitted platform feedback.</p>
        </div>
        <button onClick={fetchReviews} className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-semibold text-sm shadow">
          <RefreshCw className="w-4 h-4" /> <span>Refresh</span>
        </button>
      </div>

      <div className="flex space-x-2 flex-wrap gap-2">
        {['ALL', 'PENDING', 'PUBLISHED', 'HIDDEN'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-semibold ${filter === s ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="animate-pulse bg-white rounded-2xl h-64 shadow-sm border border-gray-100" />
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-gray-900 text-lg">No Reviews Yet</h3>
          <p className="text-gray-400 mt-1">Platform reviews will appear here once users submit them.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(review => (
            <div key={review.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    <StarRating rating={review.rating} />
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${STATUS_STYLES[review.status]}`}>
                      {review.status}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-1">{review.title}</h3>
                <p className="text-gray-600 text-sm">{review.body}</p>
                <p className="text-xs text-gray-400 mt-3">
                  by <span className="font-semibold text-gray-600">{review.author?.name || 'Anonymous'}</span>
                  {' · '}{review.type} review
                </p>
              </div>

              <div className="flex space-x-2 mt-4 border-t border-gray-100 pt-4">
                {review.status !== 'PUBLISHED' && (
                  <button
                    onClick={() => changeStatus(review.id, 'PUBLISHED')}
                    className="flex-1 py-2 bg-purple-600 text-white text-sm font-bold rounded-xl flex items-center justify-center"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" /> Publish
                  </button>
                )}
                {review.status !== 'HIDDEN' && (
                  <button
                    onClick={() => changeStatus(review.id, 'HIDDEN')}
                    className="flex-1 py-2 bg-purple-600 text-white text-sm font-bold rounded-xl flex items-center justify-center"
                  >
                    <EyeOff className="w-4 h-4 mr-1" /> Hide
                  </button>
                )}
                {review.status === 'HIDDEN' && (
                  <button
                    onClick={() => changeStatus(review.id, 'PENDING')}
                    className="flex-1 py-2 bg-purple-600 text-white text-sm font-bold rounded-xl flex items-center justify-center"
                  >
                    <Eye className="w-4 h-4 mr-1" /> Restore
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
