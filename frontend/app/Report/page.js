'use client';

import { useState } from 'react';
import Link from 'next/link';

const INCIDENT_TYPES = [
  { value: 'harassment', label: 'Sexual Harassment', labelEn: 'Unwanted sexual advances or conduct' },
  { value: 'rape', label: 'Rape / Sexual Assault', labelEn: 'Non-consensual sexual act' },
  { value: 'stalking', label: 'Stalking', labelEn: 'Persistent unwanted following or monitoring' },
  { value: 'domestic', label: 'Domestic Violence', labelEn: 'Violence within the household' },
  { value: 'cyber', label: 'Cyber Bullying / Threat', labelEn: 'Online harassment or threats' },
  { value: 'other', label: 'Other', labelEn: 'Any other form of violence or abuse' },
];

const RELATION_TYPES = [
  'Stranger',
  'Acquaintance',
  'Colleague / Classmate',
  'Boss / Teacher',
  'Family Member',
  'Friend / Ex-partner',
  'Other',
];

function generateReportCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'SH-';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export default function ReportPage() {
  const [step, setStep] = useState(1);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [reportCode, setReportCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    incidentType: '',
    otherType: '',
    incidentDate: '',
    incidentTime: '',
    location: '',
    description: '',
    accusedName: '',
    accusedRelation: '',
    accusedDescription: '',
    hasEvidence: false,
    evidenceNote: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    wantsFollowUp: false,
    consentPolice: false,
  });

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    const code = generateReportCode();
    setReportCode(code);
    setSubmitted(true);
    setLoading(false);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(reportCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canNext1 = form.incidentType !== '';
  const canNext2 = form.location.trim() !== '' && form.description.trim().length >= 20;

  if (submitted) {
    return (
      <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-serif text-3xl font-bold text-indigo-900 mb-3">Report Submitted</h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Thank you for your courage. Our team will review your report as soon as possible.
          </p>

          <div className="bg-white border-2 border-dashed border-pink-300 rounded-2xl p-6 mb-8">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Your Report Code</p>
            <p className="font-mono text-3xl font-bold text-pink-500 tracking-wider mb-3">{reportCode}</p>
            <p className="text-xs text-gray-400 mb-4">Save this code — you can use it to track your report status later.</p>
            <button
              onClick={copyCode}
              className="text-sm bg-pink-50 hover:bg-pink-100 text-pink-600 px-5 py-2 rounded-full transition-colors"
            >
              {copied ? '✓ Copied!' : 'Copy Code'}
            </button>
          </div>

          <div className="bg-indigo-50 rounded-xl p-4 mb-8 text-left">
            <p className="text-xs font-semibold text-indigo-700 mb-2">What happens next?</p>
            <ul className="text-xs text-indigo-600 space-y-1">
              <li>• Our team will review your report within 24 hours</li>
              <li>• If you provided contact details, we will reach out to you directly</li>
              <li>• Keep your report code safe — use it to check your report status</li>
              <li>• You can submit a new report at any time</li>
            </ul>
          </div>

          <div className="flex gap-3 justify-center">
            <Link href="/" className="text-sm border border-pink-300 text-pink-500 hover:bg-pink-50 px-5 py-2.5 rounded-full transition-colors">
              Back to Home
            </Link>
            <button
              onClick={() => {
                setSubmitted(false);
                setStep(1);
                setForm({
                  incidentType: '', otherType: '', incidentDate: '', incidentTime: '',
                  location: '', description: '', accusedName: '', accusedRelation: '',
                  accusedDescription: '', hasEvidence: false, evidenceNote: '',
                  contactName: '', contactPhone: '', contactEmail: '',
                  wantsFollowUp: false, consentPolice: false,
                });
              }}
              className="text-sm bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-full transition-colors"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-rose-50">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl font-bold text-pink-500">SafeHer</Link>
        <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">Incident Report Form</span>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8 text-center">
          <span className="inline-block bg-pink-100 text-pink-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            100% Confidential & Secure
          </span>
          <h1 className="font-serif text-3xl font-bold text-indigo-900 mb-2">Incident Report</h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Everything you share is fully encrypted and visible only to our trusted team. You are safe here.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                step > s ? 'bg-green-500 text-white' :
                step === s ? 'bg-pink-500 text-white shadow-md shadow-pink-200' :
                'bg-gray-100 text-gray-400'
              }`}>
                {step > s ? '✓' : s}
              </div>
              <span className={`text-xs hidden sm:block ${step === s ? 'text-pink-600 font-medium' : 'text-gray-400'}`}>
                {s === 1 ? 'Incident Info' : s === 2 ? 'Details' : 'Contact'}
              </span>
              {s < 3 && (
                <div className={`flex-1 h-0.5 rounded transition-all duration-500 ${step > s ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  What type of incident occurred? <span className="text-pink-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {INCIDENT_TYPES.map(type => (
                    <button
                      key={type.value}
                      onClick={() => update('incidentType', type.value)}
                      className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                        form.incidentType === type.value
                          ? 'border-pink-400 bg-pink-50'
                          : 'border-gray-100 hover:border-pink-200 hover:bg-pink-50/50'
                      }`}
                    >
                      <p className={`text-sm font-medium ${form.incidentType === type.value ? 'text-pink-700' : 'text-gray-700'}`}>
                        {type.label}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{type.labelEn}</p>
                    </button>
                  ))}
                </div>
              </div>

              {form.incidentType === 'other' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Please describe the type of incident</label>
                  <input
                    type="text"
                    value={form.otherType}
                    onChange={e => update('otherType', e.target.value)}
                    placeholder="Describe the type of incident..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Incident</label>
                  <input
                    type="date"
                    value={form.incidentDate}
                    onChange={e => update('incidentDate', e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Approximate Time</label>
                  <input
                    type="time"
                    value={form.incidentTime}
                    onChange={e => update('incidentTime', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Where did it happen? <span className="text-pink-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={e => update('location', e.target.value)}
                  placeholder="e.g. University campus, city name, specific area..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  What happened? <span className="text-pink-500">*</span>
                  <span className="font-normal text-gray-400 ml-2">({form.description.length} chars / min. 20)</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={e => update('description', e.target.value)}
                  rows={5}
                  placeholder="Write in your own words — share only what you are comfortable with. There is no pressure."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all resize-none"
                />
              </div>

              <div className="border-t border-gray-100 pt-6">
                <p className="text-sm font-semibold text-gray-700 mb-1">Information about the accused</p>
                <p className="text-xs text-gray-400 mb-4">This section is completely optional. You may skip it.</p>

                <div className="space-y-4">
                  <input
                    type="text"
                    value={form.accusedName}
                    onChange={e => update('accusedName', e.target.value)}
                    placeholder="Name (if known)"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all"
                  />
                  <select
                    value={form.accusedRelation}
                    onChange={e => update('accusedRelation', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all text-gray-500"
                  >
                    <option value="">What is their relation to you?</option>
                    {RELATION_TYPES.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <textarea
                    value={form.accusedDescription}
                    onChange={e => update('accusedDescription', e.target.value)}
                    rows={2}
                    placeholder="Physical description or any other details (optional)"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all resize-none"
                  />
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.hasEvidence}
                    onChange={e => update('hasEvidence', e.target.checked)}
                    className="mt-0.5 accent-pink-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-amber-800">I have evidence</p>
                    <p className="text-xs text-amber-600 mt-0.5">Photos, screenshots, messages, videos, etc.</p>
                  </div>
                </label>
                {form.hasEvidence && (
                  <textarea
                    value={form.evidenceNote}
                    onChange={e => update('evidenceNote', e.target.value)}
                    rows={2}
                    placeholder="Briefly describe your evidence — our team will collect it later"
                    className="mt-3 w-full border border-amber-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-all resize-none"
                  />
                )}
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsAnonymous(true)}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    isAnonymous ? 'border-pink-400 bg-pink-50' : 'border-gray-100 hover:border-pink-200'
                  }`}
                >
                  <div className="text-2xl mb-1">🔒</div>
                  <p className={`text-sm font-semibold ${isAnonymous ? 'text-pink-700' : 'text-gray-600'}`}>Stay Anonymous</p>
                  <p className="text-xs text-gray-400 mt-0.5">Keep my identity hidden</p>
                </button>
                <button
                  onClick={() => setIsAnonymous(false)}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    !isAnonymous ? 'border-indigo-400 bg-indigo-50' : 'border-gray-100 hover:border-indigo-200'
                  }`}
                >
                  <div className="text-2xl mb-1">📞</div>
                  <p className={`text-sm font-semibold ${!isAnonymous ? 'text-indigo-700' : 'text-gray-600'}`}>Share Contact</p>
                  <p className="text-xs text-gray-400 mt-0.5">Let the team reach out to me</p>
                </button>
              </div>

              {!isAnonymous && (
                <div className="space-y-4 bg-indigo-50 rounded-xl p-5">
                  <p className="text-xs text-indigo-600 font-medium">Your information is encrypted — only our trusted team will have access.</p>
                  <input
                    type="text"
                    value={form.contactName}
                    onChange={e => update('contactName', e.target.value)}
                    placeholder="Full name (optional)"
                    className="w-full border border-indigo-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                  <input
                    type="tel"
                    value={form.contactPhone}
                    onChange={e => update('contactPhone', e.target.value)}
                    placeholder="Phone number (WhatsApp preferred)"
                    className="w-full border border-indigo-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                  <input
                    type="email"
                    value={form.contactEmail}
                    onChange={e => update('contactEmail', e.target.value)}
                    placeholder="Email address (optional)"
                    className="w-full border border-indigo-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>
              )}

              <div className="space-y-3 border-t border-gray-100 pt-5">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.wantsFollowUp}
                    onChange={e => update('wantsFollowUp', e.target.checked)}
                    className="mt-0.5 accent-pink-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-700 group-hover:text-pink-600 transition-colors">
                      I would like support and guidance from the team
                    </p>
                    <p className="text-xs text-gray-400">We will provide legal advice and emotional support</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.consentPolice}
                    onChange={e => update('consentPolice', e.target.checked)}
                    className="mt-0.5 accent-pink-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-700 group-hover:text-pink-600 transition-colors">
                      I give permission to refer this case to the police if needed
                    </p>
                    <p className="text-xs text-gray-400">This is optional — you can change your decision at any time</p>
                  </div>
                </label>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 leading-relaxed">
                  <span className="font-semibold text-gray-600">Your privacy is our commitment:</span> All information submitted through this form is protected with AES-256 encryption. We do not store your IP address or device information. Only trusted team members will have access to your report.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            {step > 1 ? (
              <button
                onClick={() => setStep(s => s - 1)}
                className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
              >
                ← Previous
              </button>
            ) : (
              <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
                ← Go back
              </Link>
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={step === 1 ? !canNext1 : !canNext2}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  (step === 1 ? canNext1 : canNext2)
                    ? 'bg-pink-500 hover:bg-pink-600 text-white shadow-md shadow-pink-200'
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }`}
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-2.5 rounded-full text-sm font-semibold bg-pink-500 hover:bg-pink-600 text-white shadow-md shadow-pink-200 transition-all disabled:opacity-70 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Submitting...
                  </>
                ) : 'Submit Report'}
              </button>
            )}
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Need immediate help? National Helpline:{' '}
          <a href="tel:10921" className="text-pink-500 font-medium hover:underline">10921</a>
          {' '}(Women & Children Affairs, Bangladesh)
        </p>
      </div>
    </div>
  );
}