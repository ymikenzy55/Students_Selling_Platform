'use client';

import React, { useEffect, useState } from 'react';
import { Flag, CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';

const STATUS_STYLES: Record<string, string> = {
  OPEN: 'bg-red-100 text-red-700',
  IN_REVIEW: 'bg-yellow-100 text-yellow-700',
  RESOLVED: 'bg-green-100 text-green-700',
};

const CATEGORY_STYLES: Record<string, string> = {
  GENERAL: 'bg-gray-100 text-gray-700',
  LISTING: 'bg-blue-100 text-blue-700',
  USER: 'bg-purple-100 text-purple-700',
  TRANSACTION: 'bg-orange-100 text-orange-700',
};

// ---- Modal Component ----
function ConfirmModal({ title, message, onConfirm, onCancel }: { title: string; message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-orange-600" />
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

export default function Reports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [modal, setModal] = useState<{ id: string; status: string } | null>(null);

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('http://localhost:5000/api/admin/reports', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setReports(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleStatusChange = async (id: string, status: string) => {
    setModal(null);
    const token = localStorage.getItem('admin_token');
    const res = await fetch(`http://localhost:5000/api/admin/reports/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      setReports(reports.map(r => r.id === id ? { ...r, status } : r));
    }
  };

  const filtered = filter === 'ALL' ? reports : reports.filter(r => r.status === filter);

  return (
    <div className="space-y-6">
      {modal && (
        <ConfirmModal
          title="Update Report Status"
          message={`Change this report status to "${modal.status.replace('_', ' ')}"?`}
          onConfirm={() => handleStatusChange(modal.id, modal.status)}
          onCancel={() => setModal(null)}
        />
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 border-b-4 border-purple-600 inline-block pb-1">Reports</h1>
          <p className="text-gray-500 mt-2">Incoming complaints and reports from users on the platform.</p>
        </div>
        <button onClick={fetchReports} className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-semibold text-sm shadow">
          <RefreshCw className="w-4 h-4" /> <span>Refresh</span>
        </button>
      </div>

      {/* Status Filter Pills */}
      <div className="flex space-x-2 flex-wrap gap-2">
        {['ALL', 'OPEN', 'IN_REVIEW', 'RESOLVED'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${filter === s ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="animate-pulse bg-white rounded-2xl h-64 shadow-sm border border-gray-100" />
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <Flag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-gray-900 text-lg">No Reports Found</h3>
          <p className="text-gray-400 mt-1">No reports match the selected filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(report => (
            <div key={report.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${STATUS_STYLES[report.status] || 'bg-gray-100 text-gray-700'}`}>
                      {report.status.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${CATEGORY_STYLES[report.category] || 'bg-gray-100 text-gray-700'}`}>
                      {report.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 truncate">{report.subject}</h3>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{report.description}</p>
                  <div className="mt-3 text-xs text-gray-400">
                    Reported by: <span className="font-semibold text-gray-700">{report.reporter?.name || 'Unknown'}</span>
                    {' · '}{report.reporter?.email}
                    {' · '}{new Date(report.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex flex-col space-y-2 flex-shrink-0">
                  {report.status === 'OPEN' && (
                    <button
                      onClick={() => setModal({ id: report.id, status: 'IN_REVIEW' })}
                      className="px-4 py-2 bg-purple-600 text-white text-sm font-bold rounded-xl flex items-center space-x-1"
                    >
                      <Clock className="w-4 h-4 mr-1" /> Mark In Review
                    </button>
                  )}
                  {report.status !== 'RESOLVED' && (
                    <button
                      onClick={() => setModal({ id: report.id, status: 'RESOLVED' })}
                      className="px-4 py-2 bg-purple-600 text-white text-sm font-bold rounded-xl flex items-center space-x-1"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" /> Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
