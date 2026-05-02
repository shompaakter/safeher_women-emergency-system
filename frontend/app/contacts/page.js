'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import axios from 'axios';

const API_URL      = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const RELATIONSHIPS = ['Mother', 'Father', 'Sister', 'Brother', 'Friend', 'Husband', 'Colleague', 'Relative', 'Other'];
const EMPTY        = { contactName: '', phone: '', email: '', relationship: '' };

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [form,     setForm]     = useState(EMPTY);
  const [editId,   setEditId]   = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/contacts`, authHeader());
          console.log("API RESPONSE:", res.data);
  const data = Array.isArray(res.data) ? res.data : res.data.contacts || [];
setContacts(data.filter(c => c && c.contactName));
    } catch {
      setError('Failed to load contacts.');
    } finally {
      setLoading(false);
    }
  
}, []);
  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  const flash = (msg, type = 'ok') => {
    if (type === 'ok') { setSuccess(msg); setTimeout(() => setSuccess(''), 3500); }
    else               { setError(msg);   setTimeout(() => setError(''),   4000); }
  };

  const handleSubmit = async () => {
    setError('');
    if (!form.contactName.trim()) return flash('Name is required.', 'err');
    if (!form.phone.trim())       return flash('Phone is required.', 'err');
    if (!form.relationship)       return flash('Please select a relationship.', 'err');

    setSaving(true);
    try {
      if (editId) {
        const res = await axios.put(`${API_URL}/api/contacts/${editId}`, form, authHeader());
        setContacts(prev => prev.map(c => c._id === editId ? res.data.contact : c));
        flash('Contact updated successfully!');
      } else {
        const res = await axios.post(`${API_URL}/api/contacts`, form, authHeader());
        setContacts(prev => [res.data.contact, ...prev]);
        flash('Contact added successfully!');
      }
      setForm(EMPTY);
      setEditId(null);
    } catch (err) {
      flash(err.response?.data?.message || 'Failed to save contact.', 'err');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await axios.delete(`${API_URL}/api/contacts/${id}`, authHeader());
      setContacts(prev => prev.filter(c => c._id !== id));
      flash('Contact deleted.');
    } catch {
      flash('Failed to delete.', 'err');
    }
  };


  const handleEdit = (c) => {
    setEditId(c._id);
    setForm({
      contactName:  c.contactName  || '',
      phone:        c.phone        || '',
      email:        c.email        || '',   // ← email must be here
      relationship: c.relationship || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => { setEditId(null); setForm(EMPTY); setError(''); };

  const COLORS = [
    'bg-pink-100 text-pink-600',
    'bg-indigo-100 text-indigo-600',
    'bg-green-100 text-green-600',
    'bg-amber-100 text-amber-600',
    'bg-purple-100 text-purple-600',
  ];

  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link href="/" className="font-serif text-xl font-black text-pink-500">SafeHer</Link>
        <Link href="/dashboard" className="text-sm text-gray-400 hover:text-pink-500 transition-colors">← Dashboard</Link>
      </nav>

      <div className="max-w-xl mx-auto px-4 py-8 space-y-6">

        <div>
          <h1 className="font-serif text-2xl font-bold text-indigo-900">Trusted Contacts</h1>
          <p className="text-sm text-gray-500 mt-1">Add up to 5 contacts. SOS email alert will be sent to them.</p>
        </div>

        {error   && <div className="bg-red-50   border border-red-200   text-red-600   text-sm rounded-xl px-4 py-3">{error}</div>}
        {success && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">✅ {success}</div>}

      
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">{editId ? '✏️ Edit Contact' : '+ Add New Contact'}</h2>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Full Name <span className="text-red-400">*</span></label>
            <input
              type="text" value={form.contactName}
              onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))}
              placeholder="Contact's full name"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Phone Number <span className="text-red-400">*</span></label>
            <input
              type="tel" value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="01XXXXXXXXX"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Email Address <span className="text-pink-500 font-medium">★ Required for SOS alerts</span>
            </label>
            <input
              type="email" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="contact@email.com"
              className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 text-sm"
            />
            <p className="text-xs text-amber-500 mt-1">⚠️ Without email, SOS alert cannot be sent to this contact.</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Relationship <span className="text-red-400">*</span></label>
            <select
              value={form.relationship}
              onChange={e => setForm(f => ({ ...f, relationship: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 text-sm bg-white"
            >
              <option value="">Select relationship</option>
              {RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              onClick={handleSubmit}
              disabled={saving || (contacts.length >= 5 && !editId)}
              className="flex-1 bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white py-3 rounded-xl font-medium text-sm transition-colors"
            >
              {saving ? 'Saving...' : editId ? 'Update Contact' : '+ Add Contact'}
            </button>
            {editId && (
              <button onClick={cancelEdit} className="px-5 py-3 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 text-sm">
                Cancel
              </button>
            )}
          </div>

          {contacts.length >= 5 && !editId && (
            <p className="text-xs text-amber-600 text-center">Maximum 5 contacts reached. Delete one to add another.</p>
          )}
        </div>

        <div className="flex items-center justify-between px-1">
          <p className="text-sm font-medium text-gray-600">{contacts.length} / 5 contacts</p>
          <div className="flex gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`w-2.5 h-2.5 rounded-full transition-colors ${i < contacts.length ? 'bg-pink-400' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-10">
            <div className="w-6 h-6 border-2 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
            <span className="text-sm text-gray-400">Loading contacts...</span>
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-400 text-sm">No contacts added yet.</p>
            <p className="text-gray-300 text-xs mt-1">Add a contact above to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {contacts.map((c, i) => (
              <div key={c._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-base shrink-0 ${COLORS[i % COLORS.length]}`}>
                  {c.contactName?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-800 text-sm">{c.contactName}</span>
                    {c.relationship && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{c.relationship}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">📱 {c.phone}</p>
                  {c.email ? (
                    <p className="text-xs text-green-600 mt-0.5">✉️ {c.email}</p>
                  ) : (
                    <p className="text-xs text-amber-500 mt-0.5">⚠️ No email — SOS alert won&apos;t be sent</p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleEdit(c)} className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">Edit</button>
                  <button onClick={() => handleDelete(c._id, c.contactName)} className="px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-pink-50 border border-pink-100 rounded-2xl p-4">
          <p className="text-xs text-pink-700 font-medium mb-1">💡 How SOS works</p>
          <p className="text-xs text-pink-600 leading-relaxed">
           When SOS is triggered, an emergency email with your real-time GPS location is sent to all trusted contacts. Without a valid email, SOS alerts cannot be delivered.
          </p>
        </div>
      </div>
</main>
  );
}
   
 