'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function Register() {
  const router = useRouter();
  const [step, setStep] = useState('form');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => /^01[3-9]\d{8}$/.test(phone);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.phone || !form.password || !form.confirmPassword) {
      return setError('Please fill in all fields.');
    }
    if (!isValidEmail(form.email)) {
      return setError('Please enter a valid email address.');
    }
    if (!isValidPhone(form.phone)) {
      return setError('Enter a valid Bangladeshi phone number (e.g. 01XXXXXXXXX).');
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match.');
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/send-otp`, {
        phone: form.phone,
        email: form.email,
        name: form.name,
      });
      setSuccess('A 6-digit OTP has been sent to your email address.');
      setStep('otp');
      startResendCooldown();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      document.getElementById('otp-5')?.focus();
    }
    e.preventDefault();
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) return setError('Please enter the full 6-digit OTP.');
    setError('');
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/register`, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        otp: otpCode,
      });
      router.push('/login?registered=true');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError('');
    setSuccess('');
    try {
      await axios.post(`${API_URL}/api/auth/send-otp`, {
        phone: form.phone,
        email: form.email,
        name: form.name,
      });
      setSuccess('OTP resent to your email successfully.');
      startResendCooldown();
    } catch {
      setError('Failed to resend OTP.');
    }
  };

  const startResendCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-pink-50 via-white to-orange-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Link href="/" className="font-serif text-3xl font-black text-pink-500">SafeHer</Link>
          <p className="text-sm text-gray-400 mt-1">
            {step === 'form' ? 'Create your account' : 'Verify your email'}
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">

          <div className="flex items-center gap-2 mb-6">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step === 'form' ? 'bg-pink-500 text-white' : 'bg-green-100 text-green-600'}`}>
              {step === 'form' ? '1' : '✓'}
            </div>
            <div className={`flex-1 h-1 rounded-full ${step === 'otp' ? 'bg-pink-500' : 'bg-gray-100'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step === 'otp' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
              2
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-100 text-green-600 text-sm px-4 py-3 rounded-xl mb-4">
              {success}
            </div>
          )}

          {step === 'form' && (
            <>
              <h2 className="font-serif text-2xl font-bold text-indigo-900 mb-5">Register</h2>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Full Name</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 text-sm transition-all" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Email Address</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange}
                    placeholder="you@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 text-sm transition-all" />
                  <p className="text-xs text-gray-400 mt-1">OTP will be sent to this email.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Phone Number</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 text-sm transition-all" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Password</label>
                  <input type="password" name="password" value={form.password} onChange={handleChange}
                    placeholder="At least 6 characters"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 text-sm transition-all" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Confirm Password</label>
                  <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
                    placeholder="Re-enter password"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 text-sm transition-all" />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white py-3 rounded-xl text-sm font-medium transition-colors mt-2">
                  {loading ? 'Sending OTP...' : 'Continue →'}
                </button>
              </form>
            </>
          )}

          {step === 'otp' && (
            <>
              <h2 className="font-serif text-2xl font-bold text-indigo-900 mb-2">Verify Email</h2>
              <p className="text-sm text-gray-400 mb-6">
                Enter the 6-digit code sent to <span className="font-medium text-gray-600">{form.email}</span>
              </p>

              <form onSubmit={handleOtpSubmit} className="space-y-5">
                <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-gray-200 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all"
                    />
                  ))}
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white py-3 rounded-xl text-sm font-medium transition-colors">
                  {loading ? 'Verifying...' : 'Verify & Create Account'}
                </button>
              </form>

              <div className="flex items-center justify-between mt-4 text-sm">
                <button onClick={() => { setStep('form'); setError(''); setSuccess(''); setOtp(['','','','','','']); }}
                  className="text-gray-400 hover:text-gray-600 transition-colors">
                  ← Change details
                </button>
                <button onClick={handleResend} disabled={resendCooldown > 0}
                  className={`font-medium transition-colors ${resendCooldown > 0 ? 'text-gray-300 cursor-not-allowed' : 'text-pink-500 hover:text-pink-600'}`}>
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                </button>
              </div>
            </>
          )}

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-pink-500 font-medium hover:underline">Log in</Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-300 mt-6">
          <Link href="/" className="hover:text-pink-400">← Back to home</Link>
        </p>
      </div>
    </main>
  );
}