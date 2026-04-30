'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

function useInView(threshold = 0.15) {
  const ref    = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

export default function HomePage() {
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [scrolled,  setScrolled]  = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [cardsRef,  cardsInView]  = useInView(0.1);
  const [bannerRef, bannerInView] = useInView(0.2);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="min-h-screen bg-white font-sans overflow-x-hidden">
      <nav className={`sticky top-0 z-50 bg-white px-6 py-4 flex items-center justify-between transition-all duration-300 ${scrolled ? 'shadow-sm border-b border-gray-100' : ''}`}>
        <span className="font-serif text-2xl font-bold text-pink-500 tracking-tight">SafeHer</span>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/"       className="text-sm text-gray-500 hover:text-pink-500 transition-colors">Home</Link>
          <Link href="/about"  className="text-sm text-gray-500 hover:text-pink-500 transition-colors">About</Link>
          <Link href="/report" className="text-sm text-gray-500 hover:text-pink-500 transition-colors font-medium">Report Incident</Link>
          <Link href="/login"
            className="text-sm bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full transition-all hover:scale-105 active:scale-95">
            Login
          </Link>
          <Link href="/register"
            className="text-sm border border-pink-500 text-pink-500 hover:bg-pink-50 px-4 py-2 rounded-full transition-colors">
            Register
          </Link>
        </div>

        <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <span className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-6 py-4 flex flex-col gap-4 z-40">
          <Link href="/"       onClick={() => setMenuOpen(false)} className="text-sm text-gray-500">Home</Link>
          <Link href="/about"  onClick={() => setMenuOpen(false)} className="text-sm text-gray-500">About</Link>
          <Link href="/report" onClick={() => setMenuOpen(false)} className="text-sm text-pink-600 font-medium">Report Incident</Link>
          <Link href="/login"  onClick={() => setMenuOpen(false)} className="text-sm bg-pink-500 text-white px-4 py-2 rounded-full text-center">Login</Link>
          <Link href="/register" onClick={() => setMenuOpen(false)} className="text-sm border border-pink-500 text-pink-500 px-4 py-2 rounded-full text-center">Register</Link>
        </div>
      )}

      <section className="relative px-6 md:px-16 pt-14 pb-12 bg-linear-to-br from-pink-50 via-orange-50 to-pink-50 overflow-hidden">

        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-200 rounded-full opacity-20 blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-200 rounded-full opacity-20 blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative grid grid-cols-1 md:grid-cols-2 items-center gap-10">

          <div>
            <span
              className={`inline-block bg-pink-100 text-pink-700 text-xs font-semibold px-3 py-1 rounded-full mb-5 tracking-widest uppercase transition-all duration-500 ${heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '0ms' }}>
              Women Safety Platform — Bangladesh
            </span>

            <h1
              className={`font-serif text-5xl md:text-6xl font-black leading-tight text-indigo-900 mb-5 transition-all duration-700 ${heroReady ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
              style={{ transitionDelay: '150ms' }}>
              Her safety,<br />
              <span className="text-pink-500">our priority.</span>
            </h1>

            <p
              className={`text-base text-gray-500 leading-relaxed mb-8 max-w-md transition-all duration-700 ${heroReady ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
              style={{ transitionDelay: '280ms' }}>
              Real-time SOS alerts, GPS tracking, and confidential reporting to protect women everywhere.
            </p>

            <div
              className={`flex gap-3 flex-wrap transition-all duration-700 ${heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: '400ms' }}>
              <Link href="/sos"
                className="bg-pink-500 hover:bg-pink-600 text-white px-7 py-3.5 rounded-full text-base font-semibold transition-all shadow-lg shadow-pink-200 hover:scale-105 active:scale-95">
                Try SOS Demo
              </Link>
              <Link href="/report"
                className="border-2 border-pink-500 text-pink-500 hover:bg-pink-50 px-7 py-3.5 rounded-full text-base font-semibold transition-all hover:scale-105 active:scale-95">
                Report Incident
              </Link>
            </div>
          </div>

          <div
            className={`flex items-center justify-center relative transition-all duration-1000 ${heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '200ms' }}>
            <div className="animate-float relative">
              <div className="relative w-full max-w-md overflow-hidden rounded-3xl shadow-2xl shadow-pink-200">
                <Image
                  src="/safeher-hero.png"
                  alt="SafeHer — Women walking safely"
                  width={500}
                  height={480}
                  loading="eager"
                  priority
                  className="w-full h-auto object-cover"
                />
       
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-pink-50/60 to-transparent" />
              </div>
              <div
                className={`absolute top-4 -right-4 bg-white shadow-lg rounded-xl px-3 py-2 flex items-center gap-2 text-xs font-semibold text-indigo-900 transition-all duration-700 ${heroReady ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
                style={{ transitionDelay: '700ms' }}>
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                SOS Sent — 3 contacts notified
              </div>
              <div
                className={`absolute bottom-8 -left-4 bg-white shadow-lg rounded-xl px-3 py-2 flex items-center gap-2 text-xs font-semibold text-indigo-900 transition-all duration-700 ${heroReady ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
                style={{ transitionDelay: '900ms' }}>
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Live location shared
              </div>
            </div>
          </div>
        </div>

        <div ref={cardsRef} className="relative mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {features.map((f, i) => (
            <div
              key={i}
              className={`bg-white/80 backdrop-blur-sm border border-pink-100 hover:border-pink-300 hover:shadow-md hover:-translate-y-2 rounded-2xl p-4 flex flex-col items-start gap-2 transition-all duration-500 cursor-default ${cardsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: cardsInView ? `${i * 80}ms` : '0ms' }}>
              <span className="text-2xl">{f.icon}</span>
              <p className="text-sm font-semibold text-indigo-900 leading-snug">{f.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        ref={bannerRef}
        className={`mx-6 md:mx-16 my-10 p-8 rounded-2xl bg-linear-to-r from-pink-500 to-pink-400 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-pink-200 transition-all duration-700 ${bannerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div>
          <h2 className="font-serif text-2xl font-bold text-white mb-1">Did something happen to you?</h2>
          <p className="text-sm text-pink-100 max-w-md">Report incidents confidentially. Your identity is protected. Our team will review and take action — you are not alone.</p>
        </div>
        <Link href="/report"
          className="bg-white text-pink-500 hover:bg-pink-50 px-8 py-3 rounded-full font-semibold text-sm whitespace-nowrap shadow transition-all hover:scale-105 active:scale-95">
          Submit a Report →
        </Link>
      </section>
      <div className="mx-6 md:mx-16 mb-10 p-8 rounded-2xl bg-linear-to-r from-indigo-900 to-indigo-700 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white mb-1">In danger? One button is all it takes.</h2>
          <p className="text-sm text-indigo-300">Your trusted contacts receive your location via email in under 10 seconds.</p>
        </div>
        <Link href="/sos"
          className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full font-medium text-sm whitespace-nowrap shadow-lg shadow-pink-900/30 transition-all hover:scale-105 active:scale-95">
          See how SOS works →
        </Link>
      </div>
      <footer className="px-6 md:px-16 py-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-400">SafeHer © 2026 — Women Safety Platform</p>
        <div className="flex gap-5 items-center">
          <Link href="/about"  className="text-xs text-gray-400 hover:text-pink-500">About</Link>
          <Link href="/report" className="text-xs text-gray-400 hover:text-pink-500">Report</Link>
          <Link href="#"       className="text-xs text-gray-400 hover:text-pink-500">Privacy</Link>
          <Link href="#"       className="text-xs text-gray-400 hover:text-pink-500">GitHub</Link>
    
          <Link href="/admin" className="text-xs text-gray-200 hover:text-gray-400 transition-colors ml-2">Admin</Link>
        </div>
      </footer>

    </main>
  );
}

const features = [
  { icon: '🆘', title: 'One-tap SOS',      desc: 'Alert all trusted contacts with your GPS location instantly.' },
  { icon: '📍', title: 'Live location',     desc: 'Real-time GPS — contacts always know where you are.' },
  { icon: '👥', title: 'Trusted contacts',  desc: 'Add family & friends who get instant email alerts.' },
  { icon: '📧', title: 'Email alerts',      desc: 'Location + Google Maps link sent in seconds.' },
  { icon: '🔒', title: 'Secure & private',  desc: 'JWT auth, encrypted data — your info stays yours.' },
  { icon: '📋', title: 'Report incidents',  desc: 'Submit confidential reports — anonymous or with contact.' },
];