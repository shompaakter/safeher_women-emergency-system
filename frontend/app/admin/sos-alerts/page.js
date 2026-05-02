'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AdminSosAlerts() {
  const router = useRouter();
  const [alerts,   setAlerts]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('all'); // all | sent | active | resolved

  const fetchAlerts = useCallback(async () => {
 const token = localStorage.getItem('adminToken');
if (!token) { router.push('/admin'); return; }
   
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/admin/sos-alerts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlerts(res.data?.alerts || []);
    } catch {
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

  const filtered = alerts.filter(a => {
    const matchStatus = filter === 'all' || a.status === filter;
    const matchSearch = !search ||
      a.address?.toLowerCase().includes(search.toLowerCase()) ||
      a.userName?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const statusBadge = (status) => {
    const map = {
      sent:     'bg-green-100 text-green-700',
      active:   'bg-yellow-100 text-yellow-700',
      resolved: 'bg-blue-100 text-blue-700',
    };
    return map[status] || 'bg-gray-100 text-gray-500';
  };

  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <Link href="/" className="font-serif text-xl font-black text-pink-500">SafeHer</Link>
        <span className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full">Admin — SOS Alerts</span>
        <Link href="/admin" className="text-xs text-gray-400 hover:text-pink-500">← Admin Panel</Link>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-indigo-900">SOS Alerts</h1>
            <p className="text-sm text-gray-400 mt-0.5">All emergency alerts sent by users</p>
          </div>
          <button
            onClick={fetchAlerts}
            className="text-xs border border-gray-200 px-4 py-2 rounded-lg text-gray-500 hover:border-pink-300 hover:text-pink-500 transition-colors"
          >
            ↻ Refresh
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by location or user..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
          />
          <div className="flex gap-2">
            {['all', 'active', 'sent', 'resolved'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all capitalize ${
                  filter === f
                    ? 'bg-pink-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-500 hover:border-pink-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Alerts',   value: alerts.length,                                    bg: 'bg-pink-50',   color: 'text-pink-600'  },
            { label: 'Active',         value: alerts.filter(a => a.status === 'active').length,  bg: 'bg-yellow-50', color: 'text-yellow-600' },
            { label: 'Sent',           value: alerts.filter(a => a.status === 'sent').length,    bg: 'bg-green-50',  color: 'text-green-600'  },
            { label: 'Resolved',       value: alerts.filter(a => a.status === 'resolved').length,bg: 'bg-blue-50',   color: 'text-blue-600'   },
          ].map((s, i) => (
            <div key={i} className={`${s.bg} rounded-2xl p-4 text-center`}>
              <div className={`text-2xl font-bold ${s.color}`}>{loading ? '—' : s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-4xl mb-2">🛡️</p>
            <p className="text-gray-400 text-sm">No SOS alerts found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((alert, i) => (
              <div key={alert._id || i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full mt-2 shrink-0 ${
                      alert.status === 'sent'     ? 'bg-green-500' :
                      alert.status === 'active'   ? 'bg-yellow-400 animate-pulse' :
                      alert.status === 'resolved' ? 'bg-blue-500' : 'bg-gray-400'
                    }`} />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        📍 {alert.address || 'Location unavailable'}
                      </p>
                      {alert.userName && (
                        <p className="text-xs text-indigo-500 mt-0.5">👤 {alert.userName}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(alert.status)}`}>
                          {alert.status}
                        </span>
                        <span className="text-xs text-gray-400">
                          📧 {alert.emailSent ?? 0} email{(alert.emailSent ?? 0) !== 1 ? 's' : ''} sent
                        </span>
                        <span className="text-xs text-gray-300">
                          {new Date(alert.createdAt).toLocaleString('en-BD', {
                            timeZone: 'Asia/Dhaka',
                            day: '2-digit', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {alert.mapLink && (
                      <a
                        href={alert.mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        📍 Map
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}