'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function Dashboard() {
  const router = useRouter();

  const [user,     setUser]     = useState(null);
  const [contacts, setContacts] = useState([]);
  const [history,  setHistory]  = useState([]);
 
const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    const token  = localStorage.getItem('token');

    if (!stored || !token) {
      router.push('/login');
      return;
    }

    let parsedUser;
    try {
      parsedUser = JSON.parse(stored);
    } catch {
      router.push('/login');
      return;
    }

    const h = { Authorization: `Bearer ${token}` };

    // fetch contacts and history separately so one failure doesn't block both
    Promise.allSettled([
      axios.get(`${API_URL}/api/contacts`,    { headers: h }),
      axios.get(`${API_URL}/api/sos/history`, { headers: h }),
    ]).then(([cResult, hResult]) => {
      // contacts
      if (cResult.status === 'fulfilled') {
        const raw = cResult.value.data;
        // handle both { contacts: [...] } and direct array
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.contacts)
            ? raw.contacts
            : [];
        setContacts(list);
      } else {
        console.error('Contacts fetch failed:', cResult.reason?.message);
      }

      // history
      if (hResult.status === 'fulfilled') {
        const raw = hResult.value.data;
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.alerts)
            ? raw.alerts
            : [];
        setHistory(list);
      } else {
        console.error('History fetch failed:', hResult.reason?.message);
      }

      setUser(parsedUser);
      setLoading(false);
    });
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 font-sans">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <Link href="/" className="font-serif text-xl font-black text-pink-500">SafeHer</Link>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-700 font-bold text-sm">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <span className="text-sm text-gray-600 font-medium">{user?.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg text-gray-500 hover:border-red-200 hover:text-red-500 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-5">

      
        {/* SOS Banner */}
        <div className="bg-linear-to-r from-indigo-900 to-indigo-700 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-white">Are you in danger?</h2>
            <p className="text-indigo-300 text-sm mt-1">Press SOS — contacts get email with your location instantly</p>
          </div>
          <Link
            href="/sos"
            className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3.5 rounded-full font-bold text-base shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <span className="text-xl">🆘</span> Send SOS
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: 'Trusted Contacts', value: contacts.length, color: 'text-pink-500',  bg: 'bg-pink-50'  },
            { label: 'SOS Sent',         value: history.length,  color: 'text-red-500',   bg: 'bg-red-50'   },
            { label: 'Account Active',   value: '✓',             color: 'text-green-600', bg: 'bg-green-50' },
          ].map((s, i) => (
            <div key={i} className={`${s.bg} rounded-2xl p-4 text-center`}>
              <div className={`font-serif text-3xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              href: '/contacts', icon: '👥', title: 'Trusted Contacts',
              sub: `${contacts.length} contact${contacts.length !== 1 ? 's' : ''} added`,
              border: 'hover:border-pink-200', iconBg: 'bg-pink-50',
              iconHover: 'group-hover:bg-pink-100', arrow: 'group-hover:text-pink-400',
            },
            {
              href: '/sos', icon: '🆘', title: 'Send SOS',
              sub: 'Emergency alert to contacts',
              border: 'hover:border-red-200', iconBg: 'bg-red-50',
              iconHover: 'group-hover:bg-red-100', arrow: 'group-hover:text-red-400',
            },
            {
              href: '/Map', icon: '🗺️', title: 'Incident Map',
              sub: 'View reported incidents nearby',
              border: 'hover:border-blue-200', iconBg: 'bg-blue-50',
              iconHover: 'group-hover:bg-blue-100', arrow: 'group-hover:text-blue-400',
            },
          ].map((item, i) => (
            <Link
              key={i} href={item.href}
              className={`bg-white rounded-2xl border border-gray-100 ${item.border} p-5 flex items-center gap-4 transition-all group`}
            >
              <div className={`w-12 h-12 rounded-xl ${item.iconBg} ${item.iconHover} flex items-center justify-center text-2xl transition-colors`}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{item.sub}</p>
              </div>
              <span className={`text-gray-200 ${item.arrow} transition-colors text-lg`}>→</span>
            </Link>
          ))}
        </div>

        {/* Contacts preview */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Trusted Contacts</h3>
            <Link href="/contacts" className="text-xs text-pink-500 hover:underline">Manage →</Link>
          </div>

          {contacts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-2">👥</p>
              <p className="text-gray-400 text-sm mb-3">No contacts added yet.</p>
              <Link href="/contacts" className="inline-block bg-pink-500 text-white text-xs px-5 py-2 rounded-full hover:bg-pink-600 transition-colors">
                Add Contact
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {contacts.slice(0, 3).map((c, i) => (
                <div key={c._id || i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center text-pink-700 font-semibold text-sm shrink-0">
                    {c.contactName?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{c.contactName}</p>
                    <p className="text-xs text-gray-400">
                      📱 {c.phone} {c.relationship ? `· ${c.relationship}` : ''}
                    </p>
                    {c.email
                      ? <p className="text-xs text-green-600 mt-0.5">✉️ {c.email}</p>
                      : <p className="text-xs text-amber-500 mt-0.5">⚠️ No email — add email for SOS</p>
                    }
                  </div>
                </div>
              ))}
              {contacts.length > 3 && (
                <p className="text-xs text-gray-400 text-center pt-1">
                  +{contacts.length - 3} more —{' '}
                  <Link href="/contacts" className="text-pink-500 hover:underline">view all</Link>
                </p>
              )}
            </div>
          )}
        </div>

        {/* SOS History */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">SOS History</h3>
            <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
              {history.length} alert{history.length !== 1 ? 's' : ''}
            </span>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-2">🛡️</p>
              <p className="text-gray-400 text-sm">No SOS alerts sent yet. Stay safe!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((alert, i) => (
                <div key={alert._id || i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                    alert.status === 'sent'   ? 'bg-green-500' :
                    alert.status === 'active' ? 'bg-yellow-400 animate-pulse' :
                    'bg-gray-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        📍 {alert.address || 'Location unavailable'}
                      </p>
                      {alert.mapLink && (
                        <a href={alert.mapLink} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-blue-500 hover:underline shrink-0">
                          View map →
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <span className="text-xs text-gray-400">
                        📧 {alert.emailSent ?? 0} email{(alert.emailSent ?? 0) !== 1 ? 's' : ''} sent
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        alert.status === 'sent'   ? 'bg-green-100 text-green-700'   :
                        alert.status === 'active' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {alert.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 mt-1">
                      {new Date(alert.createdAt).toLocaleString('en-BD', {
                        timeZone: 'Asia/Dhaka',
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}