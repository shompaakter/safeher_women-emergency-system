'use client';

import Link from 'next/link';
import Image from 'next/image';

const teamMembers = [
  {
    initials: 'T1',
    name: 'MST:Shompa Akther Jui',       
    role: 'full stack developer', 
    bio: 'Passionate about building tech solutions that make real-world impact.',
    photo: null,
  },
  {
    initials: 'T2',
    name: 'Mahmuda Choudhury',
    role: 'full stack developer',
    bio: 'Focused on backend architecture, APIs, and database design.',
    photo: null,
  },
];

const stats = [
  { value: '3s', label: 'SOS response time' },
  { value: '∞', label: 'Contacts supported' },
  { value: '24/7', label: 'Always active' },
];

const techStack = [
  { name: 'Next.js', category: 'Frontend' },
  { name: 'Tailwind CSS', category: 'Frontend' },
  { name: 'Node.js', category: 'Backend' },
  { name: 'Express.js', category: 'Backend' },
  { name: 'MongoDB', category: 'Database' },
  { name: 'Socket.io', category: 'Real-time' },
  { name: 'n8n', category: 'Automation' },
  { name: 'Twilio', category: 'SMS' },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white font-sans">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl font-bold text-pink-500 tracking-tight">SafeHer</Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-pink-500 transition-colors">Home</Link>
          <Link href="/about" className="text-sm text-pink-500 font-medium">About</Link>
          <Link href="/login" className="text-sm bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full transition-colors">Login</Link>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="px-6 md:px-16 py-16 bg-linear-to-br from-pink-50 to-orange-50 text-center">
        <span className="inline-block bg-pink-100 text-pink-700 text-xs font-medium px-3 py-1 rounded-full mb-4">
          About SafeHer
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-black text-indigo-900 mb-4">
          Built with purpose,<br />
          <span className="text-pink-500">designed for safety.</span>
        </h1>
        <p className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed">
          SafeHer is a women safety platform created as a university project to address the real need for accessible emergency tools in Bangladesh.
        </p>
      </section>

  
      <section className="px-6 md:px-16 py-10 bg-white border-b border-gray-100">
        <div className="flex flex-wrap justify-center gap-12">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="font-serif text-4xl font-bold text-pink-500">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-16 py-14 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-xs font-medium text-pink-500 uppercase tracking-widest mb-2">Our Mission</p>
          <h2 className="font-serif text-3xl font-bold text-indigo-900 mb-4">Why we built this</h2>
          <p className="text-gray-500 leading-relaxed mb-4">
            Women across Bangladesh face safety challenges every day. We built SafeHer to provide a simple, fast, and reliable tool that can make a real difference in an emergency.
          </p>
          <p className="text-gray-500 leading-relaxed">
            By combining real-time GPS, automated SMS alerts via n8n and Twilio, and an intuitive interface, we created a platform that works when it matters most.
          </p>
        </div>
        <div className="bg-pink-50 rounded-2xl p-8 border border-pink-100">
          <p className="text-xs font-medium text-pink-500 uppercase tracking-widest mb-4">How it works</p>
          <ol className="space-y-4">
            {[
              'User registers and adds trusted contacts',
              'In an emergency, press the SOS button',
              'GPS location is captured instantly',
              'n8n sends SMS to all trusted contacts via Twilio',
              'Admin monitors alerts in real-time',
            ].map((step, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-full bg-pink-500 text-white text-xs flex items-center justify-center shrink-0 mt-0.5 font-medium">{i + 1}</span>
                <span className="text-sm text-gray-600 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-6 md:px-16 py-14 bg-gray-50">
        <p className="text-xs font-medium text-pink-500 uppercase tracking-widest mb-2">Meet the team</p>
        <h2 className="font-serif text-3xl font-bold text-indigo-900 mb-8">The people behind SafeHer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
          {teamMembers.map((member, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 text-center hover:border-pink-200 transition-colors">
              <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden border-2 border-pink-200 bg-linear-to-br from-pink-100 to-orange-100 flex items-center justify-center">
                {member.photo ? (
                  <Image src={member.photo} alt={member.name} width={80} height={80} className="object-cover" />
                ) : (
                  <span className="font-serif text-2xl font-bold text-orange-700">{member.initials}</span>
                )}
              </div>
              <h3 className="font-medium text-base text-gray-900 mb-1">{member.name}</h3>
              <p className="text-xs text-pink-500 font-medium mb-3">{member.role}</p>
              <p className="text-sm text-gray-400 leading-relaxed">{member.bio}</p>
              {!member.photo && (
                <span className="inline-block mt-3 text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">
                  Photo coming soon
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

   
      <section className="px-6 md:px-16 py-14 bg-white">
        <p className="text-xs font-medium text-pink-500 uppercase tracking-widest mb-2">Tech Stack</p>
        <h2 className="font-serif text-3xl font-bold text-indigo-900 mb-8">Built with modern tools</h2>
        <div className="flex flex-wrap gap-3">
          {techStack.map((t, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-100 bg-gray-50 hover:border-pink-200 transition-colors">
              <span className="text-sm font-medium text-gray-800">{t.name}</span>
              <span className="text-xs text-gray-400">{t.category}</span>
            </div>
          ))}
        </div>
      </section>

  
      <section className="mx-6 md:mx-16 mb-12 p-8 rounded-2xl bg-linear-to-r from-indigo-900 to-indigo-700 text-center">
        <h2 className="font-serif text-2xl font-bold text-white mb-2">Ready to try SafeHer?</h2>
        <p className="text-indigo-300 text-sm mb-6">Register now and set up your safety network in minutes.</p>
        <div className="flex justify-center gap-4">
          <Link href="/register" className="bg-pink-500 hover:bg-pink-600 text-white px-7 py-3 rounded-full text-sm font-medium transition-colors">
            Get Started
          </Link>
          <Link href="/" className="border border-indigo-400 text-indigo-200 hover:bg-indigo-800 px-7 py-3 rounded-full text-sm font-medium transition-colors">
            Back to Home
          </Link>
        </div>
      </section>

  
      <footer className="px-6 md:px-16 py-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-400">SafeHer © 2026 — Women Safety Platform</p>
        <div className="flex gap-5">
          <Link href="/about" className="text-xs text-gray-400 hover:text-pink-500">About</Link>
          <Link href="#" className="text-xs text-gray-400 hover:text-pink-500">Privacy</Link>
          <Link href="#" className="text-xs text-gray-400 hover:text-pink-500">GitHub</Link>
        </div>
      </footer>
    </main>
  );
}