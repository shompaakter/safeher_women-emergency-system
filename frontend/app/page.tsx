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
      <nav className={`sticky top-0 z-50 bg-white/80 backdrop-blur-md px-6 md:px-16 py-4 flex items-center justify-between transition-all duration-300 ${scrolled ? 'shadow-sm border-b border-gray-100' : ''}`}>
        <span className="font-serif text-2xl font-bold text-pink-500 tracking-tight">SafeHer</span>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-gray-600 hover:text-pink-500 transition-colors">Home</Link>
          <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-pink-500 transition-colors">About</Link>
          <Link href="/report" className="text-sm font-medium text-gray-600 hover:text-pink-500 transition-colors">Report Incident</Link>
          <div className="flex items-center gap-3 ml-4">
            <Link href="/login" className="text-sm font-bold bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full transition-all">Login</Link>
            <Link href="/register" className="text-sm font-bold border-2 border-pink-500 text-pink-500 hover:bg-pink-50 px-6 py-2 rounded-full transition-all">Register</Link>
          </div>
        </div>

        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)} title="Toggle menu" aria-label="Toggle navigation menu">
          <div className="w-6 h-5 flex flex-col justify-between">
            <span className={`block h-0.5 bg-gray-600 transition-transform ${menuOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
            <span className={`block h-0.5 bg-gray-600 transition-opacity ${menuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block h-0.5 bg-gray-600 transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </div>
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 md:px-16 pt-12 pb-16 bg-linear-to-b from-pink-50/30 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
          
          <div className="text-left md:w-1/2">
            <span className="inline-block bg-pink-100 text-pink-600 text-[10px] font-black px-3 py-1 rounded-full mb-6 tracking-widest uppercase">
              Women Safety Platform — Bangladesh
            </span>
            <h1 className="font-serif text-5xl md:text-6xl font-black text-indigo-950 mb-6 leading-tight">
              Her safety, <br />
              <span className="text-pink-500">our priority.</span>
            </h1>
            <p className="text-gray-500 mb-10 text-lg max-w-md">
              Real-time SOS alerts, GPS tracking, and confidential reporting to protect women everywhere.
            </p>
            <div className="flex gap-4">
              <Link href="/sos" className="bg-pink-500 hover:bg-pink-600 text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-pink-200 transition-all hover:-translate-y-1">
                Try SOS Demo
              </Link>
              <Link href="/report" className="border-2 border-pink-500 text-pink-500 hover:bg-pink-50 px-10 py-4 rounded-full font-bold transition-all hover:-translate-y-1">
                Report Incident
              </Link>
            </div>
          </div>

          <div className="md:w-1/2 w-full flex justify-center">
            <div className="relative w-full max-w-md">
              <Image 
                src="/safeher-hero.png" 
                alt="Hero"
                width={500}
                height={500}
                className="w-full h-auto object-contain drop-shadow-2xl z-10 relative"
              />
              {/* Image Border Type Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-pink-200/40 blur-[80px] rounded-full z-0" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid - COMPACT VERSION */}
      <section className="px-6 md:px-16 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {features.map((f, i) => (
            <div key={i} className="bg-white border border-gray-100 p-5 rounded-3xl hover:shadow-xl hover:shadow-pink-100/50 transition-all duration-300 group text-center flex flex-col items-center">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3 transition-transform group-hover:scale-110 ${f.color}`}>
                {f.icon}
              </div>
              <h3 className="text-sm font-bold text-indigo-950 mb-1">{f.title}</h3>
              <p className="text-[11px] text-gray-400 leading-snug">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Report Banner with Wings */}
      <section className="mx-6 md:mx-16 my-8 relative overflow-hidden rounded-[2.5rem] bg-linear-to-r from-pink-500 to-pink-400 p-10 md:p-14 shadow-xl shadow-pink-100 group text-center md:text-left">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none translate-x-1/4 -translate-y-1/4 scale-150">
          <span className="text-[200px]">👼</span>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-serif text-3xl font-bold text-white mb-2">Did something happen to you?</h2>
            <p className="text-pink-50 text-sm opacity-90">Report incidents confidentially. Your identity is protected.</p>
          </div>
          <Link href="/report" className="bg-white text-pink-500 hover:bg-pink-50 px-10 py-4 rounded-full font-black text-sm shadow-lg transition-all hover:scale-105">
            Submit Report →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-16 py-10 text-center">
        <p className="text-gray-400 text-xs">SafeHer © 2026 — Women Safety Platform [cite: 56]</p>
      </footer>

    </main>
  );
}

const features = [
  { icon: '🆘', title: 'One-tap SOS', desc: 'Instant alerts [cite: 25]', color: 'bg-red-50 text-red-500' },
  { icon: '📍', title: 'Live location', desc: 'GPS tracking [cite: 40]', color: 'bg-blue-50 text-blue-500' },
  { icon: '👥', title: 'Trusted contacts', desc: 'Family alerts [cite: 24]', color: 'bg-purple-50 text-purple-500' },
  { icon: '📱', title: 'Auto SMS', desc: 'n8n integrated [cite: 45]', color: 'bg-orange-50 text-orange-500' },
  { icon: '🔒', title: 'Secure', desc: 'JWT protected [cite: 47]', color: 'bg-green-50 text-green-500' },
  { icon: '📋', title: 'Incident report', desc: 'File reports ', color: 'bg-pink-50 text-pink-500' },
];