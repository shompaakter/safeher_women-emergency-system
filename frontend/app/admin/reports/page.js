'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const STATUS_COLORS = {
  pending:         'bg-yellow-100 text-yellow-700',
  reviewing:       'bg-blue-100 text-blue-700',
  action_taken:    'bg-purple-100 text-purple-700',
  resolved:        'bg-green-100 text-green-700',
  police_referred: 'bg-red-100 text-red-700',
  closed:          'bg-gray-100 text-gray-500',
};

const TYPE_COLORS = {
  harassment: 'bg-orange-100 text-orange-700',
  rape:       'bg-red-100 text-red-700',
  stalking:   'bg-amber-100 text-amber-700',
  domestic:   'bg-purple-100 text-purple-700',
  cyber:      'bg-blue-100 text-blue-700',
  other:      'bg-gray-100 text-gray-600',
};

export default function AdminReports() {
  const router = useRouter();
  const [reports,  setReports]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('all');
  const [selected, setSelected] = useState(null);
  const [note,     setNote]     = useState('');
  const [saving,   setSaving]   = useState(false);
  const [stats,    setStats]    = useState({});

  const adminToken = () => localStorage.getItem('adminToken');

  const fetchReports = useCallback(async () => {
    try {
      const url = filter === 'all'
        ? `${API_URL}/api/admin/reports`
        : `${API_URL}/api/admin/reports?status=${filter}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${adminToken()}` } });
      if (res.status === 401) { router.push('/admin'); return; }
      const data = await res.json();
      setReports(data.reports || []);
      setStats(data.stats || {});
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [filter, router]);

  useEffect(() => {
    if (!adminToken()) { router.push('/admin'); return; }
    fetchReports();
  }, [fetchReports, router]);

  const updateStatus = async (id, status) => {
    setSaving(true);
    try {
      await fetch(`${API_URL}/api/admin/reports/${id}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken()}` },
        body:    JSON.stringify({ status, adminNote: note }),
      });
      setSelected(prev => prev ? { ...prev, status, adminNote: note } : null);
      fetchReports();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const logout = () => { localStorage.setItem('adminToken', data.token);router.push('/admin'); };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="bg-indigo-900 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <span className="text-white text-lg">🛡️</span>
          <span className="font-serif text-lg font-bold text-white">SafeHer Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin/sos-alerts" className="text-indigo-300 hover:text-white text-sm transition-colors">SOS Alerts</Link>
          <button onClick={logout} className="text-xs border border-indigo-700 text-indigo-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors">Logout</button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Reports',  value: stats.total    || 0, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Pending',        value: stats.pending  || 0, color: 'text-yellow-600', bg: 'bg-yellow-50' },
            { label: 'Reviewing',      value: stats.reviewing|| 0, color: 'text-blue-600',   bg: 'bg-blue-50'   },
            { label: 'Resolved',       value: stats.resolved || 0, color: 'text-green-600',  bg: 'bg-green-50'  },
          ].map((s, i) => (
            <div key={i} className={`${s.bg} rounded-2xl p-4 text-center`}>
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
        
          <div className="flex-1">
          
            <div className="flex gap-2 flex-wrap mb-4">
              {['all','pending','reviewing','action_taken','resolved','police_referred'].map(s => (
                <button key={s} onClick={() => setFilter(s)}
                  className={`text-xs px-3 py-1.5 rounded-full transition-all capitalize ${
                    filter === s ? 'bg-indigo-900 text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-indigo-300'
                  }`}>
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
                    <div className="h-4 bg-gray-100 rounded w-1/3 mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : reports.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <p className="text-4xl mb-2">📋</p>
                <p className="text-gray-400 text-sm">No reports found.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map(r => (
                  <div key={r._id}
                    onClick={() => { setSelected(r); setNote(r.adminNote || ''); }}
                    className={`bg-white rounded-2xl border p-4 cursor-pointer transition-all hover:border-indigo-200 hover:shadow-sm ${
                      selected?._id === r._id ? 'border-indigo-400 ring-1 ring-indigo-200' : 'border-gray-100'
                    }`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-mono text-xs font-bold text-pink-500">{r.reportCode}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${TYPE_COLORS[r.incidentType] || 'bg-gray-100 text-gray-600'}`}>
                            {r.incidentType}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[r.status] || 'bg-gray-100 text-gray-500'}`}>
                            {r.status.replace('_', ' ')}
                          </span>
                          {!r.isAnonymous && <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">Has contact</span>}
                        </div>
                        <p className="text-xs text-gray-500 truncate">📍 {r.location || 'Location not provided'}</p>
                        <p className="text-xs text-gray-300 mt-1">
                          {new Date(r.createdAt).toLocaleString('en-BD', {
                            timeZone: 'Asia/Dhaka', day: '2-digit', month: 'short',
                            year: 'numeric', hour: '2-digit', minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <span className="text-gray-300 text-lg shrink-0">→</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

      
          <div className="w-full lg:w-96 shrink-0">
            {!selected ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center sticky top-24">
                <p className="text-4xl mb-2">👆</p>
                <p className="text-gray-400 text-sm">Select a report to view details</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-lg font-bold text-pink-500">{selected.reportCode}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(selected.createdAt).toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' })}
                    </p>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-gray-300 hover:text-gray-500 text-xl">×</button>
                </div>

                {/* Type + Status */}
                <div className="flex gap-2 flex-wrap">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${TYPE_COLORS[selected.incidentType]}`}>
                    {selected.incidentType}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[selected.status]}`}>
                    {selected.status.replace('_', ' ')}
                  </span>
                </div>

               
                <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
                  <div><span className="text-gray-400 text-xs">📍 Location</span><p className="text-gray-800 text-sm">{selected.location || 'Not provided'}</p></div>
                  {selected.incidentDate && <div><span className="text-gray-400 text-xs">📅 Incident date</span><p className="text-gray-800 text-sm">{new Date(selected.incidentDate).toLocaleDateString()}</p></div>}
                  <div><span className="text-gray-400 text-xs">📝 Description</span><p className="text-gray-800 text-sm leading-relaxed bg-gray-50 rounded-lg p-3 mt-1">{selected.description}</p></div>
                </div>

          
                {selected.accusedName && (
                  <div className="border-t border-gray-100 pt-4 space-y-1">
                    <p className="text-xs font-semibold text-gray-500">Accused</p>
                    <p className="text-sm text-gray-800">{selected.accusedName} · {selected.accusedRelation}</p>
                    {selected.accusedDescription && <p className="text-xs text-gray-500">{selected.accusedDescription}</p>}
                  </div>
                )}

              
                {!selected.isAnonymous && (
                  <div className="border-t border-gray-100 pt-4 bg-green-50 rounded-xl p-3 space-y-1">
                    <p className="text-xs font-semibold text-green-700">Contact Info</p>
                    {selected.contactName  && <p className="text-sm text-gray-800">👤 {selected.contactName}</p>}
                    {selected.contactPhone && <p className="text-sm text-gray-800">📱 {selected.contactPhone}</p>}
                    {selected.contactEmail && <p className="text-sm text-gray-800">📧 {selected.contactEmail}</p>}
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {selected.wantsFollowUp && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Wants follow-up</span>}
                      {selected.consentPolice && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Police consent given</span>}
                    </div>
                  </div>
                )}

                
                {selected.hasEvidence && (
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-xs font-semibold text-amber-700 mb-1">📎 Evidence available</p>
                    <p className="text-xs text-gray-500">{selected.evidenceNote}</p>
                  </div>
                )}

              
                <div className="border-t border-gray-100 pt-4">
                  <label className="block text-xs font-semibold text-gray-500 mb-2">Admin Note</label>
                  <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
                    placeholder="Add internal note..."
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 resize-none" />
                </div>

            
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs font-semibold text-gray-500 mb-2">Update Status</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'reviewing',       label: 'Reviewing',      color: 'bg-blue-500 hover:bg-blue-600'   },
                      { value: 'action_taken',    label: 'Action Taken',   color: 'bg-purple-500 hover:bg-purple-600'},
                      { value: 'resolved',        label: 'Resolved',       color: 'bg-green-500 hover:bg-green-600' },
                      { value: 'police_referred', label: 'Police Referred',color: 'bg-red-500 hover:bg-red-600'     },
                    ].map(s => (
                      <button key={s.value} onClick={() => updateStatus(selected._id, s.value)} disabled={saving}
                        className={`${s.color} text-white text-xs py-2 px-3 rounded-xl transition-colors disabled:opacity-50`}>
                        {saving ? '...' : s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}