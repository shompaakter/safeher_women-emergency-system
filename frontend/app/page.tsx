'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-white font-sans overflow-x-hidden">

      {/* Navbar */}
      <nav className={`sticky top-0 z-50 bg-white px-6 md:px-16 py-4 flex items-center justify-between transition-all duration-300 ${scrolled ? 'shadow-sm border-b border-gray-100' : ''}`}>
        <span className="font-serif text-2xl font-bold text-pink-500 tracking-tight">SafeHer</span>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-pink-500 transition-colors">Home</Link>
          <Link href="/about" className="text-sm text-gray-500 hover:text-pink-500 transition-colors">About</Link>
          <Link href="/report" className="text-sm text-gray-500 hover:text-pink-500 transition-colors font-medium">Report Incident</Link>
          <Link href="/login" className="text-sm bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full transition-colors">Login</Link>
          <Link href="/register" className="text-sm border border-pink-500 text-pink-500 hover:bg-pink-50 px-4 py-2 rounded-full transition-colors">Register</Link>
        </div>

        {/* Mobile Hamburger */}
        <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setMenuOpen(!menuOpen)} title="Toggle mobile menu" aria-label="Toggle mobile menu">
          <span className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-6 py-4 flex flex-col gap-4 z-40 relative">
          <Link href="/" onClick={() => setMenuOpen(false)} className="text-sm text-gray-500 hover:text-pink-500">Home</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)} className="text-sm text-gray-500 hover:text-pink-500">About</Link>
          <Link href="/report" onClick={() => setMenuOpen(false)} className="text-sm text-pink-600 font-medium hover:text-pink-700">Report Incident</Link>
          <Link href="/login" onClick={() => setMenuOpen(false)} className="text-sm bg-pink-500 text-white px-4 py-2 rounded-full text-center">Login</Link>
          <Link href="/register" onClick={() => setMenuOpen(false)} className="text-sm border border-pink-500 text-pink-500 px-4 py-2 rounded-full text-center">Register</Link>
        </div>
      )}

      {/* ── Hero Section ── */}
      <section className="relative px-6 md:px-16 pt-16 pb-10 bg-linear-to-br from-pink-50 via-orange-50 to-pink-50 overflow-hidden">
        {/* Background Map Image */}
        <div className="absolute inset-0 z-0 opacity-10">
          <Image src="/map-bg.png" alt="Map background" fill className="w-full h-full object-cover" />
        </div>

        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200 rounded-full opacity-20 blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-200 rounded-full opacity-20 blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none z-10" />

        <div className="relative z-20 grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          {/* Left: Text */}
          <div className="animate-fade-in-up">
            <span className="inline-block bg-pink-100 text-pink-700 text-xs font-semibold px-3 py-1 rounded-full mb-5 tracking-wide">
              Women Safety Platform — Bangladesh
            </span>
            <h1 className="font-serif text-5xl md:text-6xl font-black leading-tight text-indigo-900 mb-5">
              Her safety,<br />
              <span className="text-pink-500">our priority.</span>
            </h1>
            <p className="text-base text-gray-500 leading-relaxed mb-8 max-w-md">
              Real-time SOS alerts, trusted contacts, GPS tracking, and confidential incident reporting — designed to protect and empower women everywhere.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/sos" className="bg-pink-500 hover:bg-pink-600 text-white px-7 py-3 rounded-full text-base font-medium transition-colors shadow-lg shadow-pink-200">
                Try SOS Demo
              </Link>
              <Link href="/report" className="border-2 border-pink-500 text-pink-500 hover:bg-pink-50 px-7 py-3 rounded-full text-base font-medium transition-colors">
                Report Incident
              </Link>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative animate-fade-in-delay">
            <Image src="/hero-women.webp" alt="Women using phone safely" width={500} height={500} className="w-full h-auto drop-shadow-2xl" />
            
            {/* Status indicators */}
            <div className="absolute top-[15%] -right-4 bg-white/90 backdrop-blur-sm shadow-md rounded-xl px-3 py-2 flex items-center gap-2 text-xs font-medium text-indigo-900 animate-slide-in-right">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              SOS Sent — 3 contacts notified
            </div>
            <div className="absolute bottom-[25%] -left-4 bg-white/90 backdrop-blur-sm shadow-md rounded-xl px-3 py-2 flex items-center gap-2 text-xs font-medium text-indigo-900 animate-slide-in-left">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              Live location shared
            </div>

            {/* Shield icon */}
            <div className="absolute top-[35%] right-[20%] w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg border border-pink-100 p-2 animate-bounce-slow">
              <Image src="/shield-heart.png" alt="Safety Shield" width={48} height={48} className="w-full h-auto" />
            </div>
          </div>
        </div>

        {/* ── Feature Cards ── */}
        <div className="relative z-20 mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-sm border border-pink-100 hover:border-pink-300 hover:shadow-md hover:-translate-y-1 transition-all duration-200 rounded-2xl p-4 flex flex-col items-start gap-2 cursor-default"
            >
              <span className="text-2xl">{f.icon}</span>
              <p className="text-sm font-semibold text-indigo-900 leading-snug">{f.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Report Incident Banner ── */}
      <section className="mx-6 md:mx-16 my-10 p-8 rounded-2xl bg-linear-to-r from-pink-500 to-pink-400 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-pink-200">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white mb-1">
            Did something happen to you?
          </h2>
          <p className="text-sm text-pink-100 max-w-md">
            Report incidents confidentially. Your identity is protected. Our team will review and take action — you are not alone.
          </p>
        </div>
        <Link
          href="/report"
          className="bg-white text-pink-500 hover:bg-pink-50 px-8 py-3 rounded-full font-semibold text-sm whitespace-nowrap shadow transition-colors"
        >
          Submit a Report →
        </Link>
      </section>

      {/* ── SOS Banner ── */}
      <div className="mx-6 md:mx-16 mb-10 p-8 rounded-2xl bg-linear-to-r from-indigo-900 to-indigo-700 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
        <div className="absolute inset-0 bg-indigo-950 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <h2 className="font-serif text-2xl font-bold text-white mb-1">In danger? One button is all it takes.</h2>
          <p className="text-sm text-indigo-300">Your trusted contacts receive your location via SMS in under 10 seconds.</p>
        </div>
        <Link href="/sos" className="relative z-10 bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full font-medium text-sm whitespace-nowrap shadow-lg shadow-pink-900/30 transition-colors">
          See how SOS works →
        </Link>
      </div>

      {/* ── Footer ── */}
      <footer className="px-6 md:px-16 py-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white relative z-10">
        <p className="text-xs text-gray-400">SafeHer © 2025 — Women Safety Platform</p>
        <div className="flex gap-5">
          <Link href="/about" className="text-xs text-gray-400 hover:text-pink-500">About</Link>
          <Link href="/report" className="text-xs text-gray-400 hover:text-pink-500">Report</Link>
          <Link href="#" className="text-xs text-gray-400 hover:text-pink-500">Privacy</Link>
          <Link href="#" className="text-xs text-gray-400 hover:text-pink-500">GitHub</Link>
        </div>
      </footer>

    </main>
  );
}

const features = [
  {
    icon: '🆘',
    title: 'One-tap SOS',
    desc: 'Alert all trusted contacts with your GPS location instantly.',
  },
  {
    icon: '📍',
    title: 'Live location',
    desc: 'Real-time GPS tracking — contacts always know where you are.',
  },
  {
    icon: '👥',
    title: 'Trusted contacts',
    desc: 'Add family & friends who get instant SMS alerts.',
  },
  {
    icon: '📱',
    title: 'Auto SMS alerts',
    desc: 'Powered by n8n + Twilio — sent within seconds.',
  },
  {
    icon: '🔒',
    title: 'Secure & private',
    desc: 'JWT auth, encrypted data — your information stays yours.',
  },
  {
    icon: '📋',
    title: 'Incident reporting',
    desc: 'Submit confidential reports — anonymous or with contact.',
  },
];