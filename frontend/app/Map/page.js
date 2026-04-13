'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SAMPLE_INCIDENTS = [
  { id: 1, lat: 23.7461, lng: 90.3742, type: 'harassment', area: 'Dhanmondi, Dhaka',    date: '2025-03-10', severity: 'high' },
  { id: 2, lat: 23.7515, lng: 90.3756, type: 'stalking',   area: 'Dhanmondi, Dhaka',    date: '2025-03-12', severity: 'medium' },
  { id: 3, lat: 23.7272, lng: 90.4093, type: 'harassment', area: 'Shahbag, Dhaka',       date: '2025-03-14', severity: 'high' },
  { id: 4, lat: 23.8103, lng: 90.4125, type: 'cyber',      area: 'Uttara, Dhaka',        date: '2025-03-15', severity: 'low' },
  { id: 5, lat: 23.7104, lng: 90.4074, type: 'domestic',   area: 'Wari, Dhaka',          date: '2025-03-16', severity: 'high' },
  { id: 6, lat: 24.8949, lng: 91.8687, type: 'harassment', area: 'Sylhet Sadar',         date: '2025-03-17', severity: 'medium' },
  { id: 7, lat: 24.9045, lng: 91.8611, type: 'stalking',   area: 'Zindabazar, Sylhet',   date: '2025-03-18', severity: 'medium' },
  { id: 8, lat: 22.3569, lng: 91.7832, type: 'harassment', area: 'GEC, Chittagong',      date: '2025-03-19', severity: 'high' },
  { id: 9, lat: 22.3384, lng: 91.8317, type: 'rape',       area: 'Halishahar, Ctg',      date: '2025-03-20', severity: 'high' },
  { id: 10, lat: 24.3636, lng: 88.6241, type: 'domestic',  area: 'Rajshahi City',        date: '2025-03-21', severity: 'medium' },
];

const TYPE_CONFIG = {
  harassment: { color: '#E8593C', label: 'Sexual Harassment' },
  rape:       { color: '#A32D2D', label: 'Rape / Sexual Assault' },
  stalking:   { color: '#BA7517', label: 'Stalking' },
  domestic:   { color: '#534AB7', label: 'Domestic Violence' },
  cyber:      { color: '#185FA5', label: 'Cyber Bullying' },
  other:      { color: '#888780', label: 'Other' },
};

const SEVERITY_SIZE = { high: 18, medium: 14, low: 10 };

export default function MapPage() {
  const router = useRouter();
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [filter, setFilter] = useState('all');
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const markersRef = useRef([]);

  // ✅ FIXED: useMemo এর বদলে useEffect+setState সরানো হয়েছে
  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = SAMPLE_INCIDENTS.filter(i => {
      const d = new Date(i.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
    return {
      total: SAMPLE_INCIDENTS.length,
      thisMonth,
      highSeverity: SAMPLE_INCIDENTS.filter(i => i.severity === 'high').length,
    };
  }, []);

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem('safeher_token');
    if (!token) {
      router.push('/login?redirect=/map');
    }
  }, [router]);

  // Load Leaflet and render map
  useEffect(() => {
    if (mapInstance.current || !mapRef.current) return;

    const linkEl = document.createElement('link');
    linkEl.rel = 'stylesheet';
    linkEl.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(linkEl);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      const L = window.L;
      const map = L.map(mapRef.current, { zoomControl: false }).setView([23.8103, 90.4125], 7);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CARTO',
        maxZoom: 18,
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstance.current = map;
      setMapLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update markers when filter changes
  useEffect(() => {
    if (!mapLoaded || !mapInstance.current) return;
    const L = window.L;
    const map = mapInstance.current;

    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    const filtered = filter === 'all'
      ? SAMPLE_INCIDENTS
      : SAMPLE_INCIDENTS.filter(i => i.type === filter);

    filtered.forEach(incident => {
      const config = TYPE_CONFIG[incident.type] || TYPE_CONFIG.other;
      const size = SEVERITY_SIZE[incident.severity] || 12;

      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width:${size}px;height:${size}px;
          background:${config.color};
          border:2px solid white;
          border-radius:50%;
          box-shadow:0 2px 6px rgba(0,0,0,0.3);
          cursor:pointer;
          transition:transform .15s;
        " onmouseover="this.style.transform='scale(1.4)'" onmouseout="this.style.transform='scale(1)'"></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker([incident.lat, incident.lng], { icon })
        .addTo(map)
        .on('click', () => setSelectedIncident(incident));

      markersRef.current.push(marker);
    });
  }, [mapLoaded, filter]);

  const filteredCount = filter === 'all'
    ? SAMPLE_INCIDENTS.length
    : SAMPLE_INCIDENTS.filter(i => i.type === filter).length;

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">

      {/* Navbar */}
      <nav className="flex-none z-50 bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl font-bold text-pink-500">SafeHer</Link>
        <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
          Incident Heat Map
        </span>
        <Link href="/dashboard" className="text-xs text-gray-400 hover:text-pink-500 transition-colors">
          ← Dashboard
        </Link>
      </nav>

      <div className="flex-1 flex overflow-hidden relative">

        {/* Left Sidebar */}
        <aside className="w-72 flex-none bg-white border-r border-gray-100 flex flex-col overflow-y-auto z-10">

          {/* Stats */}
          <div className="p-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Overview</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-pink-50 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-pink-600">{stats.total}</p>
                <p className="text-xs text-pink-400 mt-0.5">Total</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-amber-600">{stats.thisMonth}</p>
                <p className="text-xs text-amber-400 mt-0.5">This month</p>
              </div>
              <div className="bg-red-50 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-red-600">{stats.highSeverity}</p>
                <p className="text-xs text-red-400 mt-0.5">High risk</p>
              </div>
            </div>
          </div>

          {/* Filter */}
          <div className="p-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Filter by type</p>
            <div className="space-y-1.5">
              <button
                onClick={() => setFilter('all')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-all ${
                  filter === 'all' ? 'bg-gray-100 font-medium text-gray-800' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-400 inline-block" />
                  All incidents
                </span>
                <span className="text-xs text-gray-400">{SAMPLE_INCIDENTS.length}</span>
              </button>
              {Object.entries(TYPE_CONFIG).map(([key, cfg]) => {
                const count = SAMPLE_INCIDENTS.filter(i => i.type === key).length;
                if (count === 0) return null;
                return (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-all ${
                      filter === key ? 'bg-gray-100 font-medium text-gray-800' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: cfg.color }} />
                      {cfg.label}
                    </span>
                    <span className="text-xs text-gray-400">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="p-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Severity</p>
            <div className="space-y-2">
              {[['high', 18, 'High risk'], ['medium', 14, 'Medium risk'], ['low', 10, 'Low risk']].map(([s, sz, label]) => (
                <div key={s} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6">
                    <div className="rounded-full bg-gray-400 border-2 border-white shadow" style={{ width: sz, height: sz }} />
                  </div>
                  <span className="text-xs text-gray-500">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Showing count */}
          <div className="p-4">
            <p className="text-xs text-gray-400">
              Showing <span className="font-semibold text-gray-600">{filteredCount}</span> incident{filteredCount !== 1 ? 's' : ''}  on map
            </p>
            <p className="text-xs text-gray-300 mt-1">
              Data is anonymized — no personal info is shown
            </p>
          </div>

          {/* Selected Incident Detail */}
          {selectedIncident && (
            <div className="mx-3 mb-4 bg-indigo-50 border border-indigo-100 rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                  style={{ background: TYPE_CONFIG[selectedIncident.type]?.color || '#888' }}
                >
                  {TYPE_CONFIG[selectedIncident.type]?.label || 'Incident'}
                </span>
                <button
                  onClick={() => setSelectedIncident(null)}
                  className="text-gray-300 hover:text-gray-500 text-lg leading-none"
                >×</button>
              </div>
              <p className="text-sm font-semibold text-indigo-900 mt-1">{selectedIncident.area}</p>
              <p className="text-xs text-indigo-400 mt-1">
                {new Date(selectedIncident.date).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  selectedIncident.severity === 'high'   ? 'bg-red-100 text-red-600' :
                  selectedIncident.severity === 'medium' ? 'bg-amber-100 text-amber-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {selectedIncident.severity.charAt(0).toUpperCase() + selectedIncident.severity.slice(1)} severity
                </span>
              </div>
              <p className="text-xs text-indigo-300 mt-3">
                All location details are approximate to protect victim privacy.
              </p>
            </div>
          )}
        </aside>

        {/* Map */}
        <div className="flex-1 relative">
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-20">
              <div className="text-center">
                <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-gray-400">Loading map...</p>
              </div>
            </div>
          )}
          <div ref={mapRef} className="w-full h-full" />

          {/* Map top-right badge */}
          <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm shadow-md rounded-xl px-4 py-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-gray-700">Live incident data</span>
          </div>

          {/* Privacy notice */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-white/90 backdrop-blur-sm shadow rounded-full px-4 py-1.5">
            <p className="text-xs text-gray-400">
              🔒 Locations are approximate · No personal data is displayed · Visible to registered users only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}