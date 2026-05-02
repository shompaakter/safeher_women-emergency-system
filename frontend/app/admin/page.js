'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || 'Login failed.');
  localStorage.setItem('adminToken', data.token);
      router.push('/admin/reports');
    } catch {
      setError('Server error. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-pink-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">🛡️</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-indigo-900">SafeHer Admin</h1>
          <p className="text-gray-400 text-sm mt-1">Authorized team access only</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-5 border border-red-100">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Admin Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="admin@safeher.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Password</label>
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-sm" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-indigo-900 hover:bg-indigo-800 disabled:bg-indigo-300 text-white py-3 rounded-xl text-sm font-semibold transition-colors mt-2">
              {loading ? 'Signing in...' : 'Sign in to Admin Panel'}
            </button>
          </form>
        </div>
      </div>
      <div className="mt-8 flex justify-center">
  <Link
    href="/"
    className="text-xs text-gray-400 hover:text-pink-500 transition-colors"
  >
    ← Back to Home
  </Link>
</div>
</main>

  );
}
