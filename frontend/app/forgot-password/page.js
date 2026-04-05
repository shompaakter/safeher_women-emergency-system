'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    if (!email) return setError('Please enter your email.');
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
      setSuccess('OTP sent to your email.');
      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    const otpCode = otp.join('');
    if (otpCode.length < 6) return setError('Please enter the full 6-digit OTP.');
    if (!newPassword || newPassword.length < 6) return setError('Password must be at least 6 characters.');
    if (newPassword !== confirmPassword) return setError('Passwords do not match.');
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/reset-password`, {
        email,
        otp: otpCode,
        newPassword,
      });
      setSuccess('Password reset successfully!');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-pink-50 via-white to-orange-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-serif text-3xl font-black text-pink-500">SafeHer</Link>
          <p className="text-sm text-gray-400 mt-1">Reset your password</p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <h2 className="font-serif text-2xl font-bold text-indigo-900 mb-5">Forgot Password</h2>

          {error && <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
          {success && <div className="bg-green-50 border border-green-100 text-green-600 text-sm px-4 py-3 rounded-xl mb-4">{success}</div>}

          {step === 'email' && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 text-sm" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white py-3 rounded-xl text-sm font-medium transition-colors">
                {loading ? 'Sending OTP...' : 'Send OTP →'}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-3">Enter OTP sent to {email}</label>
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, i) => (
                    <input key={i} id={`otp-${i}`} type="text" inputMode="numeric" maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-gray-200 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all" />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 text-sm" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Confirm New Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 text-sm" />
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white py-3 rounded-xl text-sm font-medium transition-colors">
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-400 mt-6">
            Remember your password?{' '}
            <Link href="/login" className="text-pink-500 font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}