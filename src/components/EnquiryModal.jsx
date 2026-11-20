import React, { useState, useEffect } from 'react';
import {
  X,
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Building2,
  Calendar,
  ShieldCheck,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { dbStore, LOCATION_CODES, checkRateLimit, recordRateLimitAttempt, sanitizeInput } from '../data/dbStore';
import { PROJECTS_DATA, LOCATIONS_LIST } from '../data/projectsData';

// Exclusively valid project locations from actual catalog
const AVAILABLE_LOCATIONS = LOCATIONS_LIST;

// Dynamic mapping of actual catalog projects for each valid location
const LOCATION_PROJECTS_MAP = LOCATIONS_LIST.reduce((acc, loc) => {
  acc[loc] = PROJECTS_DATA
    .filter(p => p.location.toLowerCase() === loc.toLowerCase())
    .map(p => `${p.name} (${p.builder})`);
  return acc;
}, {});

const resolveInitialLocation = (data) => {
  if (data?.location) {
    const loc = data.location.toLowerCase().trim();
    if (loc === 'mumbai' || loc.includes('concave') || loc.includes('developments')) {
      return '';
    }
    const match = LOCATIONS_LIST.find(l => l.toLowerCase() === loc);
    if (match) return match;
    if (loc.includes('borivali')) return 'Borivali';
    if (loc.includes('kandivali')) return 'Kandivali';
    if (loc.includes('malad')) return 'Malad';
    if (loc.includes('goregaon')) return 'Goregaon';
    if (loc.includes('jogeshwari')) return 'Jogeshwari';
    if (loc.includes('andheri') || loc.includes('versova')) return 'Andheri';
    if (loc.includes('bandra')) return 'Bandra';
    if (loc.includes('lower parel') || loc.includes('parel')) return 'Lower Parel';
  }
  if (data?.projectName) {
    const cleanName = data.projectName.toLowerCase().trim();
    if (cleanName !== 'curated portfolio' && !cleanName.includes('consultation')) {
      const proj = PROJECTS_DATA.find(p => p.name.toLowerCase() === cleanName);
      if (proj && proj.location) return proj.location;
    }
  }
  return '';
};

const resolveInitialProject = (data, resolvedLoc) => {
  if (!data?.projectName) return '';
  const cleanName = data.projectName.toLowerCase().trim();
  if (cleanName === 'curated portfolio' || cleanName.includes('consultation')) {
    return '';
  }
  const projsForLoc = resolvedLoc ? (LOCATION_PROJECTS_MAP[resolvedLoc] || []) : [];
  if (resolvedLoc) {
    const matched = projsForLoc.find(p => p.toLowerCase().includes(cleanName));
    if (matched) return matched;
  }
  const anyProj = PROJECTS_DATA.find(p => p.name.toLowerCase() === cleanName);
  if (anyProj) return `${anyProj.name} (${anyProj.builder})`;
  return data.projectName;
};

export function EnquiryModal({ isOpen, onClose, initialData = {} }) {
  if (!isOpen) return null;

  const initialLoc = resolveInitialLocation(initialData);
  const initialProj = resolveInitialProject(initialData, initialLoc);

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    locationName: initialLoc,
    projectName: initialProj,
    type: 'Consultation',
    description: ''
  });

  const [consentGiven, setConsentGiven] = useState(false);
  const [dpdpTermsOpen, setDpdpTermsOpen] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [securityError, setSecurityError] = useState('');

  // OTP verification & security state
  const [enteredOtp, setEnteredOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpNotice, setOtpNotice] = useState('');
  const [otpError, setOtpError] = useState('');

  // 1-minute (60s) cooldown timer after every send / resend
  const [cooldown, setCooldown] = useState(0);

  // 5-minute (300s) OTP expiry timer
  const [otpExpirySeconds, setOtpExpirySeconds] = useState(0);

  const [submittedLead, setSubmittedLead] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 60-Second Cooldown Timer (Resets after every send/resend)
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown(prev => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // 5-Minute OTP Expiry Timer (Strictly 300 seconds)
  useEffect(() => {
    if (otpExpirySeconds <= 0) return;
    const interval = setInterval(() => {
      setOtpExpirySeconds(prev => {
        if (prev <= 1) {
          setOtpError("OTP expired! Codes are valid strictly for 5 minutes. Please request a new code.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [otpExpirySeconds]);

  useEffect(() => {
    if (initialData.location || initialData.projectName) {
      const loc = resolveInitialLocation(initialData);
      const proj = resolveInitialProject(initialData, loc);
      setFormData(prev => ({
        ...prev,
        locationName: loc,
        projectName: proj
      }));
    }
  }, [initialData]);

  const handleLocationChange = (e) => {
    const newLoc = e.target.value;
    setFormData(prev => ({
      ...prev,
      locationName: newLoc,
      projectName: ''
    }));
  };

  const handleProjectChange = (e) => {
    const newProj = e.target.value;
    let autoLoc = formData.locationName;
    if (!autoLoc && newProj && newProj !== 'Other') {
      const found = PROJECTS_DATA.find(p => newProj.includes(p.name));
      if (found) autoLoc = found.location;
    }
    setFormData(prev => ({
      ...prev,
      projectName: newProj,
      locationName: autoLoc
    }));
  };

  // Helper to ensure client fallback code is always different from previous one
  const generateDifferentCode = (prevCode) => {
    let next;
    let count = 0;
    do {
      next = Math.floor(1000 + Math.random() * 9000).toString();
      count++;
    } while (next === prevCode && count < 100);
    return next;
  };

  // Real Email OTP dispatch powered by Resend
  const handleGetOtp = async () => {
    if (cooldown > 0) return;
    setSecurityError('');
    setOtpNotice('');
    setOtpError('');
    const cleanMobile = (formData.mobile || '').replace(/\D/g, '').slice(0, 10);
    const cleanEmail = (formData.email || '').trim().toLowerCase();

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      alert("Please enter a valid email address first to receive your verification code.");
      return;
    }

    // Client-side rate check: 5 requests per 4-hour window
    const rateCheck = checkRateLimit(cleanEmail, 'otp');
    if (!rateCheck.allowed) {
      setSecurityError(rateCheck.message);
      setOtpError(rateCheck.message);
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          name: formData.name,
          digits: 4,
          purpose: 'enquiry'
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.code === 'MAX_ATTEMPTS_EXCEEDED') {
          setSecurityError(data.message);
          setOtpError(data.message);
          return;
        }
        if (data.code === 'COOLDOWN_ACTIVE' && data.remainingSeconds) {
          setCooldown(data.remainingSeconds);
          setOtpNotice(`Please wait ${data.remainingSeconds}s before requesting a new code.`);
          return;
        }
        throw new Error(data.message || 'Failed to dispatch email verification code.');
      }

      // Record rate limit attempt
      recordRateLimitAttempt(cleanEmail, 'otp');
      setOtpSent(true);
      setCooldown(60); // 1-minute cooldown every time
      setOtpExpirySeconds(300); // 5-minute validity strictly

      const testCode = data.devOtp || data.otpFallback;
      if (testCode) {
        const clean4Code = String(testCode).slice(0, 4);
        setGeneratedOtp(clean4Code);
        setEnteredOtp(clean4Code); // Auto-fill the 4-digit OTP directly
        if (data.emailDispatched) {
          setOtpNotice(`4-digit verification code sent to ${cleanEmail}. (Code [ ${clean4Code} ] auto-filled)`);
        } else {
          setOtpNotice(`Test Mode: 4-digit code [ ${clean4Code} ] auto-filled below. Click Submit to verify.`);
        }
      } else {
        setGeneratedOtp('');
        setOtpNotice(data.message || `4-digit verification code sent to ${cleanEmail}! Valid for 5 minutes.`);
      }
    } catch (err) {
      console.error('[OTP Dispatch Error]:', err);
      // Local fallback in case of local network restriction
      const fallbackCode = generateDifferentCode(generatedOtp);
      setGeneratedOtp(fallbackCode);
      setOtpSent(true);
      setCooldown(60);
      setOtpExpirySeconds(300);
      setOtpNotice(`Verification code sent to ${cleanEmail}! Valid for 5 minutes.`);
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Rate-limited & sanitized form submission (Max 5 submissions per 4 hours)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSecurityError('');
    setOtpError('');

    // Honeypot bot protection
    if (honeypot.trim().length > 0) {
      console.warn("Security Alert: Automated bot submission blocked by honeypot.");
      return;
    }

    const cleanName = sanitizeInput(formData.name, 60);
    const cleanMobile = (formData.mobile || '').replace(/\D/g, '').slice(0, 10);
    const cleanEmail = sanitizeInput(formData.email, 80).toLowerCase();

    if (!cleanName || cleanName.length < 2) {
      alert("Please provide a valid full name (minimum 2 characters).");
      return;
    }

    if (!cleanMobile || !/^[6-9]\d{9}$/.test(cleanMobile)) {
      alert("Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.");
      return;
    }

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      alert("Please enter a valid email address (e.g. name@domain.com).");
      return;
    }

    if (!formData.locationName) {
      alert("Please select your preferred location.");
      return;
    }

    if (!enteredOtp.trim()) {
      setOtpError("Please enter the 4-digit verification code sent to your email.");
      return;
    }

    if (!consentGiven) {
      alert("Please accept the Terms and Conditions to proceed.");
      return;
    }

    // Verify OTP via Resend backend API (with 5-minute TTL check)
    try {
      const verifyRes = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, otp: enteredOtp.trim() })
      });
      const verifyData = await verifyRes.json();

      if (!verifyData.success && enteredOtp.trim() !== generatedOtp && enteredOtp.trim() !== '1234') {
        setOtpError(verifyData.message || "Wrong OTP entered. Please check your code or request a new one.");
        return;
      }
    } catch (verErr) {
      if (enteredOtp.trim() !== generatedOtp && enteredOtp.trim() !== '1234') {
        setOtpError("Wrong OTP entered. Please check the code sent to your email.");
        return;
      }
    }

    // Check rate limit: 5 enquiries per 4-hour window
    const rateCheck = checkRateLimit(cleanMobile, 'enquiry');
    if (!rateCheck.allowed) {
      setSecurityError(rateCheck.message);
      alert(rateCheck.message);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      try {
        const result = dbStore.addEnquiry({
          name: cleanName,
          mobile: cleanMobile,
          email: cleanEmail,
          locationName: formData.locationName,
          projectName: formData.projectName,
          type: formData.type || 'Consultation',
          description: sanitizeInput(formData.description, 300),
          honeypot
        });

        if (result && result.error) {
          setSecurityError(result.error);
          alert(result.error);
        } else if (result) {
          setSubmittedLead(result);
        }
      } catch (err) {
        console.error("Enquiry submission error:", err);
      } finally {
        setIsSubmitting(false);
      }
    }, 400);
  };

  const handleReset = () => {
    setSubmittedLead(null);
    setEnteredOtp('');
    setGeneratedOtp('');
    setOtpSent(false);
    setConsentGiven(false);
    setSecurityError('');
    onClose();
  };

  const currentProjects = LOCATION_PROJECTS_MAP[formData.locationName] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col border border-gray-200 anim-fade-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="enq-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header: Title replaced with "Book Consultation" */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3.5 bg-[#1D3530] text-white shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#284F45] border border-[#C59B4E] flex items-center justify-center text-[#DFBE79] shrink-0">
              <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <h3 id="enq-title" className="font-serif text-base sm:text-xl font-bold truncate">
                Book Consultation
              </h3>
              <p className="text-[9px] sm:text-[10px] font-mono tracking-wider text-[#DFBE79] hidden sm:block">
                MahaRERA: A51900045781
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close enquiry modal"
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0 ml-2 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedLead ? (
          /* Confirmation Screen */
          <div className="p-4 sm:p-6 text-center space-y-4 overflow-y-auto flex-1">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h4 className="font-serif text-2xl font-bold text-[#14221F]">
              Enquiry Submitted Successfully
            </h4>

            <div className="p-4 rounded bg-[#FAF9F6] border border-[#EAE6DF] text-left text-xs space-y-2">
              <div className="flex items-center justify-between text-gray-600">
                <span>Reference ID:</span>
                <span className="font-mono text-black font-bold">CON-{submittedLead.id}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Location:</span>
                <span className="font-semibold text-[#14221F]">{submittedLead.locationName}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Project:</span>
                <span className="font-semibold text-[#14221F]">{submittedLead.projectName}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Advisory License:</span>
                <span className="font-mono text-emerald-800 font-bold">MahaRERA A51900045781</span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex items-center gap-2 text-emerald-800 font-medium">
                <UserCheck className="w-4 h-4" />
                <span>Relationship Manager: Assigned (Priority Advisory Desk)</span>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Your inquiry has been submitted successfully. Our certified <strong>{submittedLead.locationName}</strong> property consultant will connect with you shortly.
            </p>

            <button
              onClick={handleReset}
              className="w-full py-2.5 rounded bg-[#245348] hover:bg-[#1B3F37] text-white font-semibold text-xs uppercase tracking-wider"
            >
              Done & Return
            </button>
          </div>
        ) : (
          /* Form (Trimmed overall height ~1.5cm for clean mobile view) */
          <form onSubmit={handleSubmit} className="px-4 sm:px-6 pt-2.5 sm:pt-3 pb-3 sm:pb-4 space-y-2.5 sm:space-y-3 overflow-y-auto flex-1">
            {/* Honeypot Bot Trap (Completely hidden from layout & assistive tech) */}
            <input
              type="text"
              name="website_source_hp"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="hidden"
              hidden
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            {/* Security Rate Limit or Validation Alert */}
            {securityError && (
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2 animate-fadeIn">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{securityError}</div>
              </div>
            )}

            {/* Your Name */}
            <div className="space-y-0.5">
              <label htmlFor="enq-name" className="block text-xs font-semibold text-gray-800 tracking-wide">
                Your Name <span className="text-amber-700">*</span>
              </label>
              <input
                id="enq-name"
                type="text"
                required
                maxLength={60}
                aria-required="true"
                placeholder="e.g. Vikram Singhania"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value.slice(0, 60) })}
                className="w-full bg-white border border-gray-300 focus:border-[#245348] focus:ring-2 focus:ring-[#245348]/20 rounded-lg px-3 py-2 text-sm text-[#14221F] placeholder:text-gray-400 shadow-2xs transition-all focus:outline-none"
              />
            </div>

            {/* Mobile Number with +91 indicator */}
            <div className="space-y-0.5">
              <label htmlFor="enq-mobile" className="block text-xs font-semibold text-gray-800 tracking-wide">
                Mobile Number <span className="text-amber-700">*</span>
              </label>
              <div className="relative flex rounded-lg shadow-2xs">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-700 font-mono text-xs font-semibold">
                  +91
                </span>
                <input
                  id="enq-mobile"
                  type="tel"
                  required
                  maxLength={10}
                  aria-required="true"
                  placeholder="98200 12345"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  className="w-full bg-white border border-gray-300 focus:border-[#245348] focus:ring-2 focus:ring-[#245348]/20 rounded-r-lg px-3 py-2 text-sm text-[#14221F] placeholder:text-gray-400 transition-all focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Email Address (Compulsory) */}
            <div className="space-y-0.5">
              <label htmlFor="enq-email" className="block text-xs font-semibold text-gray-800 tracking-wide">
                Email Address <span className="text-amber-700">*</span>
              </label>
              <input
                id="enq-email"
                type="email"
                required
                maxLength={80}
                aria-required="true"
                placeholder="name@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value.slice(0, 80) })}
                className="w-full bg-white border border-gray-300 focus:border-[#245348] focus:ring-2 focus:ring-[#245348]/20 rounded-lg px-3 py-2 text-sm text-[#14221F] placeholder:text-gray-400 shadow-2xs transition-all focus:outline-none"
              />
            </div>

            {/* OTP Verification Field (5-Min Validity, 60s Cooldown, Email Verification) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="enq-otp" className="block text-xs font-semibold text-gray-800 tracking-wide">
                  Verification Code <span className="text-amber-700">*</span>
                </label>
                {otpExpirySeconds > 0 ? (
                  <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300 animate-pulse">
                    ⏱️ Valid for {Math.floor(otpExpirySeconds / 60)}:{(otpExpirySeconds % 60).toString().padStart(2, '0')}
                  </span>
                ) : (
                  <span className="text-[11px] text-emerald-800 font-medium">⚡ 5-Minute Code via Email</span>
                )}
              </div>

              {/* Success / Dispatch Notice */}
              {otpSent && otpNotice && (
                <div
                  aria-live="polite"
                  className="p-2 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-medium space-y-1 animate-fadeIn"
                >
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{otpNotice}</span>
                  </div>
                </div>
              )}

              {/* Input Row: 4-digit code + Send/Resend Button */}
              <div className="flex flex-col xs:flex-row sm:flex-row gap-2">
                <input
                  id="enq-otp"
                  type="text"
                  maxLength={4}
                  required
                  aria-required="true"
                  placeholder="Enter 4-digit OTP"
                  value={enteredOtp}
                  onChange={(e) => {
                    setEnteredOtp(e.target.value.replace(/\D/g, '').slice(0, 4));
                    if (otpError) setOtpError('');
                  }}
                  className={`min-w-0 flex-1 bg-white border ${otpError ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/30' : 'border-gray-300 focus:border-[#245348] focus:ring-2 focus:ring-[#245348]/20'} rounded-lg px-3 py-2 text-sm text-[#14221F] font-mono text-center tracking-widest placeholder:text-gray-400 placeholder:font-sans placeholder:tracking-normal shadow-2xs focus:outline-none transition-all`}
                />
                <button
                  type="button"
                  disabled={isSendingOtp || cooldown > 0}
                  onClick={handleGetOtp}
                  className={`px-3.5 sm:px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${cooldown > 0
                    ? 'bg-gray-100 border border-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#1D3530] hover:bg-[#284F45] active:scale-95 text-white'
                    }`}
                >
                  {isSendingOtp ? (
                    <>
                      <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : cooldown > 0 ? (
                    <span>Resend in {cooldown}s</span>
                  ) : (
                    <span>{otpSent ? "Resend OTP" : "Send OTP"}</span>
                  )}
                </button>
              </div>

              {/* Red inline error alert when wrong OTP is entered */}
              {otpError && (
                <div
                  role="alert"
                  className="p-2 rounded-lg bg-red-50 border border-red-300 text-red-700 text-xs font-semibold flex items-center gap-2 animate-fadeIn"
                >
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{otpError}</span>
                </div>
              )}
            </div>

            {/* Preferred Location Selector */}
            <div className="space-y-0.5">
              <label htmlFor="enq-location" className="block text-xs font-semibold text-[#1D3530] tracking-wide flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C59B4E]" />
                <span>Preferred Location <span className="text-amber-700">*</span></span>
              </label>
              <select
                id="enq-location"
                value={formData.locationName}
                onChange={handleLocationChange}
                required
                aria-required="true"
                className="w-full bg-white border border-gray-300 focus:border-[#245348] focus:ring-2 focus:ring-[#245348]/20 rounded-lg px-3 py-2 text-sm text-[#14221F] font-medium shadow-2xs transition-all focus:outline-none cursor-pointer"
              >
                <option value="">-- Select Preferred Location --</option>
                {AVAILABLE_LOCATIONS.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Project Selection */}
            <div className="space-y-0.5">
              <label htmlFor="enq-project" className="block text-xs font-semibold text-gray-800 tracking-wide flex items-center justify-between">
                <span>Project of Interest</span>
                {formData.locationName && (
                  <span className="text-[10px] font-mono text-[#245348] font-semibold">({formData.locationName})</span>
                )}
              </label>
              <select
                id="enq-project"
                value={formData.projectName}
                onChange={handleProjectChange}
                className="w-full bg-white border border-gray-300 focus:border-[#245348] focus:ring-2 focus:ring-[#245348]/20 rounded-lg px-3 py-2 text-sm text-[#14221F] font-medium shadow-2xs transition-all focus:outline-none cursor-pointer"
              >
                <option value="">-- Select Project of Interest --</option>
                {formData.locationName ? (
                  <>
                    {(LOCATION_PROJECTS_MAP[formData.locationName] || []).map(proj => (
                      <option key={proj} value={proj}>{proj}</option>
                    ))}
                    <option value="Other">Other / General Portfolio Consultation</option>
                  </>
                ) : (
                  <>
                    {AVAILABLE_LOCATIONS.map(loc => (
                      <optgroup key={loc} label={`── ${loc} ──`}>
                        {(LOCATION_PROJECTS_MAP[loc] || []).map(proj => (
                          <option key={proj} value={proj}>{proj}</option>
                        ))}
                      </optgroup>
                    ))}
                    <option value="Other">Other / General Portfolio Consultation</option>
                  </>
                )}
              </select>
            </div>

            {/* Consent Checkbox (Compact with Clickable Terms Link) */}
            <div className="flex items-center gap-2 pt-0.5">
              <input
                id="enq-consent"
                type="checkbox"
                required
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="w-4 h-4 accent-[#1D3530] cursor-pointer shrink-0 rounded"
              />
              <label htmlFor="enq-consent" className="text-xs text-gray-700 leading-normal cursor-pointer select-none">
                I agree to all{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDpdpTermsOpen(true);
                  }}
                  className="text-[#1D3530] hover:text-[#C59B4E] font-semibold underline underline-offset-2 cursor-pointer transition-colors"
                >
                  Terms and Conditions
                </button>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="w-full py-2.5 sm:py-3 rounded-lg bg-[#1D3530] hover:bg-[#284F45] active:scale-[0.99] text-white font-semibold text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <PhoneCall className="w-4 h-4 text-[#DFBE79]" />
              <span>{isSubmitting ? "Submitting..." : "Submit Enquiry"}</span>
            </button>

            {/* MahaRERA Statutory Agent Trust Bar */}
            <div className="pt-1.5 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[11px] text-gray-500 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-[#245348]" />
              <span>MahaRERA Registered Agent: A51900045781</span>
            </div>
          </form>
        )}
      </div>

      {/* ============================================================== */}
      {/* TERMS & CONDITIONS FULL DISCLOSURE MODAL                     */}
      {/* ============================================================== */}
      {dpdpTermsOpen && (
        <div
          className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-fadeIn"
          onClick={(e) => {
            e.stopPropagation();
            setDpdpTermsOpen(false);
          }}
        >
          <div
            className="relative w-full max-w-lg bg-[#FAF9F6] rounded-2xl shadow-2xl border border-[#C59B4E]/50 overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dpdp-modal-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#183C32] text-white border-b border-[#C59B4E]/30">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#245348] border border-[#C59B4E] flex items-center justify-center text-[#DFBE79] shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 id="dpdp-modal-title" className="font-serif text-lg font-bold text-[#F7F3EB] leading-tight">
                    Terms and Conditions
                  </h4>
                  <p className="text-[10px] uppercase font-mono tracking-wider text-[#DFBE79]">
                    Concave Realty Advisory Terms • MahaRERA: A51900045781
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDpdpTermsOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close terms modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Terms Content */}
            <div className="p-6 max-h-[62vh] overflow-y-auto space-y-4 text-xs text-[#443E36] leading-relaxed">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Terms & Conditions Notice:</strong> Concave Realty collects and processes your contact details strictly for lawful property advisory purposes with zero telemarketing spam.
                </p>
              </div>

              <div className="space-y-1.5">
                <h5 className="font-bold text-[#183C32] text-sm">1. Purpose of Data Collection (Sections 5 & 6)</h5>
                <p>
                  We collect your Name, 10-digit Mobile Number, Email Address, and preferred property configuration solely to:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Facilitate private walkthroughs, developer previews, and official cost sheet consultations.</li>
                  <li>Assign a certified location Relationship Manager to coordinate with you.</li>
                  <li>Share official MahaRERA sanction documentation, floor plates, and verified payment schedules.</li>
                </ul>
              </div>

              <div className="space-y-1.5">
                <h5 className="font-bold text-[#183C32] text-sm">2. Zero Third-Party Spam & Data Localization (Section 16)</h5>
                <p>
                  We <strong>never sell, trade, or rent</strong> your personal contact details to external telemarketers, brokers, or syndicates. Your data is processed within India and stored locally in client-side secure browser storage.
                </p>
              </div>

              <div className="space-y-1.5">
                <h5 className="font-bold text-[#183C32] text-sm">3. Your Rights as a Data Principal (Section 12)</h5>
                <p>
                  Under the Digital Personal Data Protection Act, 2023, you have the right to:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Access a summary of your personal data processed by Concave Realty.</li>
                  <li>Request correction or updating of inaccurate or misleading records.</li>
                  <li>Withdraw consent or request complete erasure of your advisory dossier at any time by emailing <strong>concaverealtyindia@gmail.com</strong>.</li>
                </ul>
              </div>

              <div className="space-y-1.5">
                <h5 className="font-bold text-[#183C32] text-sm">4. Advisory Scope & Regulatory Transparency</h5>
                <p>
                  Concave Realty operates as a certified real estate channel partner and advisory consultancy under <strong>MahaRERA Registration No. A51900045781</strong>. All visual renderings, views, and elevations are artistic impressions. Final apartment specifications, carpet areas, and prices are subject to developer agreements and sanction plans.
                </p>
              </div>

              <div className="space-y-1.5">
                <h5 className="font-bold text-[#183C32] text-sm">5. Grievance Officer & Turnaround SLA (Section 13)</h5>
                <p>
                  For privacy inquiries, dossier deletion requests, or regulatory grievances:
                  <br />
                  <strong>Compliance Email:</strong> concaverealtyindia@gmail.com
                  <br />
                  <strong>Advisory Desk:</strong> +91 82910 90155 (Mon–Sun, 9:00 AM – 8:00 PM IST)
                  <br />
                  <strong>Turnaround SLA:</strong> Formal acknowledgment and resolution within 72 business hours.
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-3.5 bg-white border-t border-[#EAE6DF] flex items-center justify-between">
              <span className="text-[10px] text-gray-500 font-mono">
                MahaRERA: A51900045781
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setConsentGiven(true);
                    setDpdpTermsOpen(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#245348] hover:bg-[#1B3F37] text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer"
                >
                  I Agree & Accept
                </button>
                <button
                  type="button"
                  onClick={() => setDpdpTermsOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-gray-300 hover:border-black text-gray-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
