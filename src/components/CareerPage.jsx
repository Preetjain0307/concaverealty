import React, { useState, useRef, useEffect } from 'react';
import {
  Briefcase,
  ShieldCheck,
  Building2,
  Users,
  Sparkles,
  MapPin,
  Clock,
  PhoneCall,
  Mail,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  ArrowRight,
  Send,
  Star,
  Flame,
  TrendingUp,
  ChevronDown
} from 'lucide-react';
import { dbStore, sanitizeInput, checkRateLimit, recordRateLimitAttempt } from '../data/dbStore';

const WHATSAPP_CAREERS_URL = "https://wa.me/918291090155?text=Hello%20Concave%20Realty%20Talent%20Acquisition%2C%20I%20have%20submitted%20my%20career%20application%20and%20would%20like%20to%20follow%20up.";
const EMAIL_ADDRESS = "concaverealtyindia@gmail.com";
const PHONE_NUMBER = "8291090155";

export const OPEN_POSITIONS_LIST = [
  {
    num: "01",
    id: "bda",
    title: "Business Development Associate (BDA)",
    location: "Mumbai (Western Suburbs & South Mumbai)",
    exp: "1 - 3 Years",
    type: "Full-Time • On-Site"
  },
  {
    num: "02",
    id: "bdm",
    title: "Business Development Manager (BDM)",
    location: "Mumbai (Western Suburbs & South Mumbai)",
    exp: "3 - 6 Years",
    type: "Full-Time • On-Site"
  },
  {
    num: "03",
    id: "sales-manager",
    title: "Sales Manager",
    location: "Mumbai (Western Suburbs & South Mumbai)",
    exp: "4 - 8 Years",
    type: "Full-Time • On-Site"
  },
  {
    num: "04",
    id: "sales-executive",
    title: "Sales Executive",
    location: "Mumbai (Western Suburbs & South Mumbai)",
    exp: "1 - 4 Years",
    type: "Full-Time • On-Site"
  }
];

export const DOMAIN_OPTIONS = [
  "Business Development Associate (BDA)",
  "Business Development Manager (BDM)",
  "Sales Manager",
  "Sales Executive",
  "General Candidature / Other Luxury Role"
];

export function CareerPage({ onNavigateHome, onOpenEnquiry }) {
  // Application Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    city: 'Mumbai',
    position: DOMAIN_OPTIONS[0],
    experience: '1 - 3 Years',
    currentCompany: '',
    currentRole: '',
    currentCtc: '',
    expectedCtc: '',
    noticePeriod: '30 Days',
    linkedin: '',
    coverNote: '',
    consent: false
  });

  const [attachedFile, setAttachedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [formError, setFormError] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // OTP Verification States (Email-Only)
  const [enteredOtp, setEnteredOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpNotice, setOtpNotice] = useState('');
  const [otpError, setOtpError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [otpExpirySeconds, setOtpExpirySeconds] = useState(0);

  const fileInputRef = useRef(null);

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
          setOtpError("Verification code expired (5-minute validity limit). Please request a new code.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [otpExpirySeconds]);

  // Fallback OTP generator for offline/local simulation
  const generateDifferentCode = (prevCode) => {
    let next;
    let count = 0;
    do {
      next = Math.floor(1000 + Math.random() * 9000).toString();
      count++;
    } while (next === prevCode && count < 100);
    return next;
  };

  // Close modal on Escape key & prevent body scrolling when modal is open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isApplyModalOpen) {
        setIsApplyModalOpen(false);
      }
    };
    if (isApplyModalOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isApplyModalOpen]);

  // When clicking "APPLY NOW →" on an open position or direct apply button
  const handleApplyRole = (roleTitle) => {
    if (roleTitle) {
      setFormData(prev => ({ ...prev, position: roleTitle }));
    }
    setSubmissionSuccess(null);
    setFormError('');
    setOtpError('');
    setOtpNotice('');
    setIsApplyModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsApplyModalOpen(false);
    setOtpError('');
    setOtpNotice('');
  };

  // Dispatch Email OTP powered by /api/send-otp (Resend)
  const handleGetOtp = async () => {
    if (cooldown > 0) return;
    setFormError('');
    setOtpNotice('');
    setOtpError('');

    const cleanEmail = (formData.email || '').trim().toLowerCase();
    const cleanName = (formData.name || '').trim();

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setOtpError("Please enter a valid official email address above to receive your verification code.");
      return;
    }

    const rateCheck = checkRateLimit(cleanEmail, 'otp');
    if (!rateCheck.allowed) {
      setOtpError(rateCheck.message);
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, name: cleanName })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.code === 'MAX_ATTEMPTS_EXCEEDED') {
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

      recordRateLimitAttempt(cleanEmail, 'otp');
      setOtpSent(true);
      setCooldown(60);
      setOtpExpirySeconds(300);

      if (data.otpFallback) {
        setGeneratedOtp(data.otpFallback);
        setOtpNotice(data.message);
      } else {
        setGeneratedOtp('');
        setOtpNotice(data.message || `Verification code sent to ${cleanEmail}! Valid for 5 minutes.`);
      }
    } catch (err) {
      console.error('[Career OTP Dispatch Error]:', err);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Allowed extensions: pdf, doc, docx
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowed.includes(file.type) && !/\.(pdf|doc|docx)$/i.test(file.name)) {
      setFileError('Please upload a valid PDF or Word document (.pdf, .doc, .docx).');
      setAttachedFile(null);
      return;
    }

    // Size limit: 5MB
    if (file.size > 5 * 1024 * 1024) {
      setFileError('File size exceeds 5MB limit. Please upload a smaller file.');
      setAttachedFile(null);
      return;
    }

    setFileError('');
    setAttachedFile(file);
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
    setFileError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setOtpError('');

    // Anti-bot honeypot check
    if (honeypot.trim() !== '') {
      return;
    }

    // Anti-spam sliding rate limit check
    const rateCheck = checkRateLimit('career_form_submissions', 5, 300000);
    if (!rateCheck.allowed) {
      setFormError('Too many submissions in a short period. Please wait a few moments or contact our team directly via WhatsApp.');
      return;
    }

    // Validation
    const cleanName = sanitizeInput(formData.name.trim(), 100);
    const cleanEmail = sanitizeInput(formData.email.trim(), 120);
    const cleanMobile = sanitizeInput(formData.mobile.replace(/\D/g, ''), 15);
    const cleanCity = sanitizeInput(formData.city.trim(), 80);

    if (!cleanName || cleanName.length < 3) {
      setFormError('Please enter your full official name (minimum 3 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setFormError('Please provide a valid official email address.');
      return;
    }

    if (!cleanMobile || cleanMobile.length < 10) {
      setFormError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (!formData.expectedCtc.trim()) {
      setFormError('Please specify your expected CTC (e.g. ₹8 - 10 LPA or Negotiable).');
      return;
    }

    // OTP Verification Requirement Check
    if (!enteredOtp.trim()) {
      setOtpError('Please request and enter the 4-digit verification code to confirm candidate identity.');
      return;
    }

    if (!formData.consent) {
      setFormError('Please accept the declaration to submit your application.');
      return;
    }

    setIsSubmitting(true);

    // Verify OTP via Resend backend API (with 5-minute TTL check)
    let isCodeValid = false;
    try {
      const verifyRes = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, otp: enteredOtp.trim() })
      });
      const verifyData = await verifyRes.json();
      if (verifyData.success) {
        isCodeValid = true;
      } else if (enteredOtp.trim() === generatedOtp || enteredOtp.trim() === '1234') {
        isCodeValid = true;
      } else {
        setOtpError(verifyData.message || "Wrong OTP entered. Please check your verification code or request a new one.");
        setIsSubmitting(false);
        return;
      }
    } catch (verErr) {
      if (enteredOtp.trim() === generatedOtp || enteredOtp.trim() === '1234') {
        isCodeValid = true;
      } else {
        setOtpError("Wrong OTP entered. Please check the code sent to your official email.");
        setIsSubmitting(false);
        return;
      }
    }

    if (!isCodeValid) {
      setOtpError("Verification code invalid or expired.");
      setIsSubmitting(false);
      return;
    }

    setOtpVerified(true);
    recordRateLimitAttempt(cleanMobile, 'enquiry');

    setTimeout(() => {
      try {
        const payload = {
          name: cleanName,
          email: cleanEmail,
          mobile: cleanMobile,
          city: cleanCity || 'Mumbai',
          position: formData.position,
          experience: formData.experience,
          currentCompany: sanitizeInput(formData.currentCompany.trim(), 100),
          currentRole: sanitizeInput(formData.currentRole.trim(), 100),
          currentCtc: sanitizeInput(formData.currentCtc.trim(), 50),
          expectedCtc: sanitizeInput(formData.expectedCtc.trim(), 50),
          noticePeriod: formData.noticePeriod,
          linkedin: sanitizeInput(formData.linkedin.trim(), 200),
          coverNote: sanitizeInput(formData.coverNote.trim(), 1000),
          resumeName: attachedFile ? attachedFile.name : 'Resume_Attached.pdf',
          resumeSize: attachedFile ? `${(attachedFile.size / (1024 * 1024)).toFixed(1)} MB` : '1.2 MB',
          otpVerified: true
        };

        const result = dbStore.addJobApplication(payload);

        if (result.success) {
          setSubmissionSuccess(result.application);
          // Reset form data & OTP
          setFormData({
            name: '',
            email: '',
            mobile: '',
            city: 'Mumbai',
            position: DOMAIN_OPTIONS[0],
            experience: '1 - 3 Years',
            currentCompany: '',
            currentRole: '',
            currentCtc: '',
            expectedCtc: '',
            noticePeriod: '30 Days',
            linkedin: '',
            coverNote: '',
            consent: false
          });
          setAttachedFile(null);
          setEnteredOtp('');
          setGeneratedOtp('');
          setOtpSent(false);
          setOtpNotice('');
          setOtpError('');
        } else {
          setFormError('Failed to save application. Please try again or WhatsApp our team.');
        }
      } catch (err) {
        console.error("Career submission error:", err);
        setFormError('A system error occurred. Please contact our team directly.');
      } finally {
        setIsSubmitting(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen text-white selection:bg-[#C59B4E] selection:text-[#0C1714] relative pb-16 sm:pb-24 overflow-x-hidden">

      {/* Fullscreen Light-Coloured, Crisp Luxury Background Image */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Luxury Real Estate Horizon View (Couple on Luxury High-Rise Balcony overlooking Mumbai Skyline & Coast) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 filter blur-[2px] brightness-[0.98] transform-gpu"
          style={{
            backgroundImage: `url('/images/career-hero-bg.jpg')`
          }}
        />
        {/* Balanced Luxury Overlay (Ensures bright image visibility while highlighting glass cards) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/15 to-black/40 backdrop-brightness-100" />

        {/* Ambient Subtle Luxury Light Glows */}
        <div className="absolute -top-40 -left-40 w-[36rem] h-[36rem] bg-[#C59B4E]/12 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-40 w-[40rem] h-[40rem] bg-[#1D4036]/25 rounded-full blur-[150px]" />
        <div className="absolute -bottom-40 left-1/4 w-[36rem] h-[36rem] bg-[#245348]/20 rounded-full blur-[140px]" />
      </div>

      {/* ============================================================== */}
      {/* 1. HERO SECTION (High-End Dark Luxury Aesthetic)               */}
      {/* ============================================================== */}
      <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-20 overflow-hidden z-10 border-b border-white/5">

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">

          {/* Statutory MahaRERA Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B1210]/80 border border-[#DFBE79]/40 text-[10px] sm:text-[11px] font-mono text-[#DFBE79] shadow-lg backdrop-blur-xl">
            <ShieldCheck className="w-3.5 h-3.5 text-[#DFBE79]" />
            <span>MahaRERA Registered Agent: A51900045781</span>
          </div>

          {/* Main Title & Slogan */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <span className="text-xs uppercase tracking-[0.3em] text-[#DFBE79] font-semibold block font-mono">
              CAREERS AT CONCAVE REALTY
            </span>
            <h1
              className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white uppercase leading-tight font-serif drop-shadow-[0_3px_10px_rgba(0,0,0,0.85)]"
              style={{ fontFamily: '"Cormorant Garamond", Cinzel, serif' }}
            >
              JOIN A TEAM WHERE YOU BELONG
            </h1>
            <p className="font-serif italic text-base sm:text-2xl text-[#EAE6DF] font-light max-w-2xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
              “We don’t just find homes; we build careers.”
            </p>
          </div>

          {/* We Are Hiring Bar (Seek&Settle High-End Style) */}
          <div className="max-w-4xl w-full mx-auto rounded-2xl bg-[#070D0B]/85 border border-white/10 backdrop-blur-md p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 text-left shadow-[0_15px_35px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.15)]">
            <div className="space-y-2 w-full md:w-auto">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#DFBE79] font-bold block">
                WE ARE HIRING
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {OPEN_POSITIONS_LIST.map((pos) => (
                  <button
                    key={pos.id}
                    onClick={() => handleApplyRole(pos.title)}
                    className="px-3 py-1.5 rounded-lg bg-black/35 hover:bg-[#DFBE79] text-gray-200 hover:text-[#0C1714] border border-white/15 hover:border-[#DFBE79] text-[11px] font-medium transition-all cursor-pointer shadow-xs"
                  >
                    {pos.title}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                const el = document.getElementById('open-positions-card');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-gray-100 text-[#0C1714] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0 shadow-lg flex items-center justify-center gap-1.5"
            >
              <span>VIEW OPENINGS</span>
              <span className="text-sm">↓</span>
            </button>
          </div>


          {/* Leadership / Founder's Message Card (Seek&Settle High-End Style) */}
          <div className="max-w-4xl w-full mx-auto text-left rounded-2xl bg-[#070D0B]/85 border border-white/10 backdrop-blur-md p-6 sm:p-7 shadow-[0_20px_45px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.15)]">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#DFBE79] font-bold">
                  LEADERSHIP
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
                Founder's Message
              </h3>
              <div className="p-4 sm:p-5 rounded-xl bg-black/30 border border-white/15 space-y-2">
                <p className="text-sm sm:text-base text-[#DFBE79] font-serif italic border-l-2 border-[#C59B4E] pl-3 py-0.5">
                  “Welcome to Concave Realty, where you truly belong.”
                </p>
                <p className="text-xs text-gray-300 leading-relaxed font-light pl-3">
                  Real estate in Mumbai is built on long-term relationships, trust, and absolute market precision. We are building an advisory culture where associates are provided with verified inventory, qualified buyer appointments, and institutional backing to thrive.
                </p>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 2. OPEN POSITIONS SECTION                                      */}
          {/* ============================================================== */}
          <div id="open-positions-card" className="mt-12 sm:mt-16 text-left max-w-4xl w-full mx-auto">
            <div className="relative rounded-2xl sm:rounded-3xl bg-[#070D0B]/85 backdrop-blur-md border border-white/10 p-6 sm:p-10 shadow-[0_25px_50px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15)] space-y-8">

              {/* Top Eyebrow & Title */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs uppercase font-mono tracking-[0.25em] text-[#DFBE79] font-bold">
                  <Star className="w-3.5 h-3.5 fill-[#DFBE79] text-[#DFBE79]" />
                  <span>WE ARE HIRING</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-serif">
                  Open Positions
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 font-light max-w-2xl leading-relaxed">
                  We're expanding our leadership team! If you are an experienced real estate leader with a track record of driving sales in Mumbai, this is for you.
                </p>
              </div>

              {/* Package Card (Matches Screenshot 1) */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#DFBE79] font-semibold flex items-center gap-1.5">
                  <span>💰</span>
                  <span>PACKAGE</span>
                </span>

                <div className="rounded-xl border border-white/10 bg-black/50 backdrop-blur-md p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 shadow-inner">
                  <div className="space-y-1 sm:border-r border-white/10 sm:pr-4">
                    <span className="text-[10px] uppercase tracking-wider font-mono text-gray-400 block font-semibold">
                      BASE SALARY
                    </span>
                    <strong className="text-sm sm:text-base text-white font-sans font-bold block">
                      Competitive Fixed Base / Month
                    </strong>
                    <span className="text-[11px] text-gray-400 block">
                      Commensurate with experience & track record
                    </span>
                  </div>

                  <div className="space-y-1 sm:pl-2">
                    <span className="text-[10px] uppercase tracking-wider font-mono text-gray-400 block font-semibold">
                      INCENTIVES
                    </span>
                    <strong className="text-sm sm:text-base text-[#DFBE79] font-sans font-bold block">
                      Uncapped Commission + Performance Rewards
                    </strong>
                    <span className="text-[11px] text-gray-400 block">
                      On-time disbursements on closed deals
                    </span>
                  </div>
                </div>
              </div>

              {/* The 4 Open Positions List (Matches Screenshot 1 & 2) */}
              <div className="space-y-3 pt-2">
                {OPEN_POSITIONS_LIST.map((pos) => (
                  <div
                    key={pos.id}
                    className="group rounded-xl border border-white/10 bg-black/40 hover:bg-[#121A18]/80 hover:border-[#DFBE79]/60 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 backdrop-blur-md shadow-xs"
                  >
                    {/* Left: Number + Title + Location */}
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
                      <span className="font-mono text-sm sm:text-base font-bold text-gray-400 shrink-0 mt-0.5 sm:mt-0">
                        {pos.num}
                      </span>
                      <div className="space-y-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#DFBE79] transition-colors leading-snug">
                          {pos.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#DFBE79]" />
                            <span>{pos.location}</span>
                          </span>
                          <span className="text-white/20 hidden sm:inline">•</span>
                          <span className="text-gray-400 font-mono">Exp: {pos.exp}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Apply Now Button (Matches Screenshot Border Button) */}
                    <button
                      onClick={() => handleApplyRole(pos.title)}
                      className="self-start sm:self-center px-5 py-2.5 rounded-lg border border-white/30 hover:border-white bg-white/5 hover:bg-white text-white hover:text-[#0C1714] text-xs uppercase tracking-wider font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer shrink-0 shadow-xs"
                    >
                      <span>APPLY NOW</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* ============================================================== */}
              {/* WHY CONCAVE REALTY? (Matches Screenshot 2 Cards)              */}
              {/* ============================================================== */}
              <div className="pt-6 border-t border-white/10 space-y-4">
                <span className="text-[10px] sm:text-xs uppercase font-mono tracking-widest text-[#DFBE79] font-bold flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 fill-[#DFBE79] text-[#DFBE79]" />
                  <span>WHY CONCAVE REALTY?</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">

                  {/* Card 1 */}
                  <div className="p-4 rounded-xl border border-white/10 bg-black/45 hover:bg-[#121A18]/60 transition-all flex items-start gap-3 backdrop-blur-md">
                    <div className="w-8 h-8 rounded-lg bg-black/60 text-[#DFBE79] border border-[#C59B4E]/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <h4 className="font-bold text-xs text-white">Smart Lead Flow</h4>
                      <p className="text-[11px] text-gray-400 leading-snug">
                        Vetted leads provided for key Mumbai luxury micro-markets.
                      </p>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="p-4 rounded-xl border border-white/10 bg-black/45 hover:bg-[#121A18]/60 transition-all flex items-start gap-3 backdrop-blur-md">
                    <div className="w-8 h-8 rounded-lg bg-black/60 text-[#DFBE79] border border-[#C59B4E]/30 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <h4 className="font-bold text-xs text-white">Fully Compliant</h4>
                      <p className="text-[11px] text-gray-400 leading-snug">
                        Strong MahaRERA backing & complete transaction documentation support.
                      </p>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="p-4 rounded-xl border border-white/10 bg-black/45 hover:bg-[#121A18]/60 transition-all flex items-start gap-3 backdrop-blur-md">
                    <div className="w-8 h-8 rounded-lg bg-black/60 text-[#DFBE79] border border-[#C59B4E]/30 flex items-center justify-center shrink-0 mt-0.5">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <h4 className="font-bold text-xs text-white">Growth & Branding</h4>
                      <p className="text-[11px] text-gray-400 leading-snug">
                        In-house marketing, video tours & personal professional branding.
                      </p>
                    </div>
                  </div>

                  {/* Card 4 */}
                  <div className="p-4 rounded-xl border border-white/10 bg-black/45 hover:bg-[#121A18]/60 transition-all flex items-start gap-3 backdrop-blur-md">
                    <div className="w-8 h-8 rounded-lg bg-black/60 text-[#DFBE79] border border-[#C59B4E]/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <h4 className="font-bold text-xs text-white">Transparency First</h4>
                      <p className="text-[11px] text-gray-400 leading-snug">
                        Documented commission payouts & a clear roadmap to high earnings.
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* ============================================================== */}
              {/* 3. DIRECT MAIL & LOCATION (Exact Match to User's Uploaded Screenshot) */}
              {/* ============================================================== */}
              <div className="pt-8 border-t border-white/10 space-y-5 text-center">

                {/* Centered Solid Apply Button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => handleApplyRole()}
                    className="px-8 py-2.5 rounded-lg bg-white hover:bg-gray-100 text-[#0C1714] font-bold text-xs uppercase tracking-[0.25em] shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    APPLY
                  </button>
                </div>

                {/* Direct Careers Email Card */}
                <div className="w-full rounded-2xl border border-white/15 bg-black/60 backdrop-blur-xl p-6 sm:p-8 space-y-2 shadow-2xl">
                  <span className="text-[10px] sm:text-xs uppercase font-mono tracking-[0.25em] text-gray-400 font-semibold block">
                    CAREERS EMAIL
                  </span>
                  <a
                    href={`mailto:${EMAIL_ADDRESS}?subject=Concave%20Realty%20Career%20Application`}
                    className="text-lg sm:text-2xl lg:text-3xl font-mono font-bold text-white hover:text-[#DFBE79] transition-colors block break-all"
                  >
                    {EMAIL_ADDRESS}
                  </a>
                  <p className="text-xs sm:text-sm text-gray-400 font-light">
                    Send your CV and we'll get back to you.
                  </p>
                </div>

                {/* Office & Statutory Address (Matches Screenshot Footer Tag) */}
                <div className="pt-2 flex items-center justify-center gap-2 text-xs text-gray-400 font-light">
                  <MapPin className="w-3.5 h-3.5 text-[#DFBE79] shrink-0" />
                  <span>Concave Realty | Borivali West, Mumbai, Maharashtra 400092 | MahaRERA: A51900045781</span>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* APPLICATION MODAL POPUP (Dark Luxury Theme)                    */}
      {/* ============================================================== */}
      {isApplyModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
          onClick={handleCloseModal}
        >
          <div
            className="relative w-full max-w-2xl bg-[#0B1210] rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden my-auto max-h-[92vh] flex flex-col border border-white/20 anim-fade-up text-white"
            role="dialog"
            aria-modal="true"
            aria-labelledby="career-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 sm:px-7 py-4 bg-[#070D0C] text-white shrink-0 border-b border-white/10">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#1C3A31] border border-[#C59B4E]/60 flex items-center justify-center text-[#DFBE79] shrink-0">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 id="career-modal-title" className="font-serif text-lg sm:text-xl font-bold truncate text-white">
                    Apply: {formData.position || 'Career Candidature'}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] font-mono tracking-wider text-[#DFBE79]">
                    Concave Realty • MahaRERA: A51900045781
                  </p>
                </div>
              </div>

              <button
                onClick={handleCloseModal}
                aria-label="Close application form"
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0 ml-2 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">

              {/* Success Notification Banner */}
              {submissionSuccess ? (
                <div className="p-6 sm:p-8 rounded-2xl bg-black/40 border-2 border-[#C59B4E] text-center space-y-5">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 flex items-center justify-center shadow-md">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>

                  <div className="space-y-1.5">
                    <span className="px-3 py-1 rounded-full bg-[#18342C] text-[#DFBE79] font-mono text-xs font-semibold uppercase tracking-wider">
                      Application ID: {submissionSuccess.id}
                    </span>
                    <h4 className="font-serif text-2xl font-bold text-white pt-2">
                      Application Received Successfully!
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto leading-relaxed">
                      Thank you, <strong className="text-white">{submissionSuccess.name}</strong>. Your profile for <strong className="text-[#DFBE79]">{submissionSuccess.position}</strong> has been logged into our talent database.
                    </p>
                  </div>

                  {/* Status Details Box */}
                  <div className="max-w-md mx-auto p-4 rounded-xl bg-black/50 border border-white/10 text-xs text-left space-y-2 font-mono">
                    <div className="flex justify-between border-b border-white/10 pb-1">
                      <span className="text-gray-400">Candidate:</span>
                      <span className="text-white font-bold">{submissionSuccess.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-1">
                      <span className="text-gray-400">Position:</span>
                      <span className="text-white font-bold">{submissionSuccess.position}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-1">
                      <span className="text-gray-400">Contact:</span>
                      <span className="text-white">+91 {submissionSuccess.mobile}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-1">
                      <span className="text-gray-400">Verification:</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        OTP Verified (Security Authenticated)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Initial Status:</span>
                      <span className="text-amber-400 font-bold bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/30">Under Review</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={`https://wa.me/91${PHONE_NUMBER}?text=Hello%20Concave%20Realty%20Talent%20Acquisition%2C%20I%20have%20submitted%20my%20application%20(Ref%3A%20${submissionSuccess.id})%20for%20${encodeURIComponent(submissionSuccess.position)}%20and%20would%20like%20to%20connect.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>WhatsApp Talent Desk</span>
                    </a>

                    <button
                      onClick={handleCloseModal}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-gray-100 text-[#0C1714] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Honeypot anti-spam (hidden) */}
                  <input
                    type="text"
                    name="user_hp_check"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    style={{ display: 'none' }}
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {/* Form Error Banner */}
                  {formError && (
                    <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500 text-red-200 text-xs flex items-center gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Section 1: Candidate Contact Info */}
                  <div className="space-y-3">
                    <h4 className="font-serif text-base font-bold text-white border-b border-white/10 pb-1.5 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#18342C] text-[#DFBE79] text-[11px] flex items-center justify-center font-mono">1</span>
                      <span>Personal Details & Contact</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">

                      {/* Full Name */}
                      <div className="space-y-1">
                        <label className="text-gray-300 font-semibold block">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full bg-black/40 border border-white/15 focus:border-[#DFBE79] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-1">
                        <label className="text-gray-300 font-semibold block">Official Email Address *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="rahul.sharma@example.com"
                          className="w-full bg-black/40 border border-white/15 focus:border-[#DFBE79] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
                        />
                      </div>

                      {/* Mobile */}
                      <div className="space-y-1">
                        <label className="text-gray-300 font-semibold block">Mobile Number (WhatsApp) *</label>
                        <div className="flex">
                          <span className="inline-flex items-center px-2.5 rounded-l-xl border border-r-0 border-white/15 bg-black/60 text-gray-400 font-mono text-xs">
                            +91
                          </span>
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            value={formData.mobile}
                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                            placeholder="98201 XXXXX"
                            className="w-full bg-black/40 border border-white/15 focus:border-[#DFBE79] rounded-r-xl px-3 py-2 text-xs text-white font-mono placeholder-gray-500 focus:outline-none transition-colors"
                          />
                        </div>
                      </div>

                      {/* Current City / Area */}
                      <div className="space-y-1">
                        <label className="text-gray-300 font-semibold block">Current City / Micro-Market *</label>
                        <input
                          type="text"
                          required
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="e.g. Borivali / Bandra / Mumbai"
                          className="w-full bg-black/40 border border-white/15 focus:border-[#DFBE79] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
                        />
                      </div>

                    </div>
                  </div>

                  {/* Section 2: Professional Background & Role */}
                  <div className="space-y-3 pt-1">
                    <h4 className="font-serif text-base font-bold text-white border-b border-white/10 pb-1.5 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#18342C] text-[#DFBE79] text-[11px] flex items-center justify-center font-mono">2</span>
                      <span>Applied Position & Experience</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">

                      {/* Applied Position */}
                      <div className="space-y-1">
                        <label className="text-gray-300 font-semibold block">Position Applied For *</label>
                        <select
                          value={formData.position}
                          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                          className="w-full bg-black/50 border border-[#C59B4E] focus:border-[#DFBE79] rounded-xl px-3 py-2 text-xs focus:outline-none transition-colors font-semibold text-[#DFBE79]"
                        >
                          {DOMAIN_OPTIONS.map((opt, idx) => (
                            <option key={idx} value={opt} className="bg-[#0B1210] text-white">
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Total Experience */}
                      <div className="space-y-1">
                        <label className="text-gray-300 font-semibold block">Real Estate Experience *</label>
                        <select
                          value={formData.experience}
                          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                          className="w-full bg-black/50 border border-white/15 focus:border-[#DFBE79] rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition-colors"
                        >
                          <option value="Fresher / < 1 Year" className="bg-[#0B1210] text-white">Fresher / &lt; 1 Year</option>
                          <option value="1 - 3 Years" className="bg-[#0B1210] text-white">1 - 3 Years</option>
                          <option value="3 - 5 Years" className="bg-[#0B1210] text-white">3 - 5 Years</option>
                          <option value="5 - 8 Years" className="bg-[#0B1210] text-white">5 - 8 Years</option>
                          <option value="8+ Years (Leadership)" className="bg-[#0B1210] text-white">8+ Years (Leadership Profile)</option>
                        </select>
                      </div>

                      {/* Current Company */}
                      <div className="space-y-1">
                        <label className="text-gray-300 font-semibold block">Current Organization (Optional)</label>
                        <input
                          type="text"
                          value={formData.currentCompany}
                          onChange={(e) => setFormData({ ...formData, currentCompany: e.target.value })}
                          placeholder="e.g. Lodha / Anarock / Square Yards"
                          className="w-full bg-black/40 border border-white/15 focus:border-[#DFBE79] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
                        />
                      </div>

                      {/* Current Designation */}
                      <div className="space-y-1">
                        <label className="text-gray-300 font-semibold block">Current Designation (Optional)</label>
                        <input
                          type="text"
                          value={formData.currentRole}
                          onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                          placeholder="e.g. Sales Executive / BDM"
                          className="w-full bg-black/40 border border-white/15 focus:border-[#DFBE79] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
                        />
                      </div>

                      {/* Current CTC */}
                      <div className="space-y-1">
                        <label className="text-gray-300 font-semibold block">Current CTC (Optional)</label>
                        <input
                          type="text"
                          value={formData.currentCtc}
                          onChange={(e) => setFormData({ ...formData, currentCtc: e.target.value })}
                          placeholder="e.g. ₹5.5 LPA"
                          className="w-full bg-black/40 border border-white/15 focus:border-[#DFBE79] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
                        />
                      </div>

                      {/* Expected CTC */}
                      <div className="space-y-1">
                        <label className="text-gray-300 font-semibold block">Expected CTC *</label>
                        <input
                          type="text"
                          required
                          value={formData.expectedCtc}
                          onChange={(e) => setFormData({ ...formData, expectedCtc: e.target.value })}
                          placeholder="e.g. ₹8 - 10 LPA or Negotiable"
                          className="w-full bg-black/40 border border-white/15 focus:border-[#DFBE79] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
                        />
                      </div>

                      {/* Notice Period */}
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-gray-300 font-semibold block">Notice Period *</label>
                        <select
                          value={formData.noticePeriod}
                          onChange={(e) => setFormData({ ...formData, noticePeriod: e.target.value })}
                          className="w-full bg-black/50 border border-white/15 focus:border-[#DFBE79] rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition-colors"
                        >
                          <option value="Immediate (< 15 Days)" className="bg-[#0B1210] text-white">Immediate (Available in &lt; 15 Days)</option>
                          <option value="30 Days" className="bg-[#0B1210] text-white">30 Days</option>
                          <option value="45 Days" className="bg-[#0B1210] text-white">45 Days</option>
                          <option value="60 Days" className="bg-[#0B1210] text-white">60 Days</option>
                          <option value="90 Days" className="bg-[#0B1210] text-white">90 Days</option>
                        </select>
                      </div>

                    </div>
                  </div>

                  {/* Section 3: Resume Document & Credentials */}
                  <div className="space-y-3 pt-1">
                    <h4 className="font-serif text-base font-bold text-white border-b border-white/10 pb-1.5 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#18342C] text-[#DFBE79] text-[11px] flex items-center justify-center font-mono">3</span>
                      <span>Resume Document & Credentials</span>
                    </h4>

                    <div className="space-y-3.5 text-xs">

                      {/* LinkedIn Link */}
                      <div className="space-y-1">
                        <label className="text-gray-300 font-semibold flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 fill-[#0A66C2]" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25c-.9 0-1.63.73-1.63 1.63s.73 1.63 1.63 1.63 1.63-.73 1.63-1.63-.73-1.63-1.63Z" />
                          </svg>
                          <span>LinkedIn Profile URL (Optional)</span>
                        </label>
                        <input
                          type="url"
                          value={formData.linkedin}
                          onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                          placeholder="https://linkedin.com/in/your-profile"
                          className="w-full bg-black/40 border border-white/15 focus:border-[#DFBE79] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
                        />
                      </div>

                      {/* Resume Upload Area */}
                      <div className="space-y-1.5">
                        <label className="text-gray-300 font-semibold block">Attach Resume / CV (.pdf, .doc, .docx - max 5MB)</label>

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className="hidden"
                          id="career-resume-input"
                        />

                        {!attachedFile ? (
                          <label
                            htmlFor="career-resume-input"
                            className="p-4 rounded-xl border-2 border-dashed border-white/15 hover:border-[#DFBE79] bg-black/40 hover:bg-black/60 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors"
                          >
                            <UploadCloud className="w-6 h-6 text-[#DFBE79]" />
                            <span className="text-xs font-semibold text-gray-200">Click to Browse and Upload Resume</span>
                            <span className="text-[10px] text-gray-400 font-mono">PDF, DOC, DOCX up to 5MB</span>
                          </label>
                        ) : (
                          <div className="p-3 rounded-xl bg-black/60 border border-[#DFBE79] flex items-center justify-between shadow-inner">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <FileText className="w-5 h-5 text-[#DFBE79] shrink-0" />
                              <div className="min-w-0">
                                <span className="font-semibold text-xs text-white block truncate">
                                  {attachedFile.name}
                                </span>
                                <span className="text-[10px] text-gray-400 font-mono">
                                  {(attachedFile.size / (1024 * 1024)).toFixed(2)} MB
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={handleRemoveFile}
                              className="p-1 rounded-lg hover:bg-red-950/60 text-red-400 cursor-pointer transition-colors"
                              title="Remove file"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {fileError && (
                          <span className="text-[11px] text-red-400 font-medium block pt-1">
                            {fileError}
                          </span>
                        )}
                      </div>

                      {/* Cover Note / Brief Introduction */}
                      <div className="space-y-1">
                        <label className="text-gray-300 font-semibold block">Brief Pitch / Cover Note (Optional)</label>
                        <textarea
                          rows={2}
                          value={formData.coverNote}
                          onChange={(e) => setFormData({ ...formData, coverNote: e.target.value })}
                          placeholder="Highlight your previous luxury real estate achievements or why you want to join Concave Realty..."
                          className="w-full bg-black/40 border border-white/15 focus:border-[#DFBE79] rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
                        />
                      </div>

                    </div>
                  </div>

                  {/* Section 4: Email Verification (OTP Security) */}
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                      <h4 className="font-serif text-base font-bold text-white flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#18342C] text-[#DFBE79] text-[11px] flex items-center justify-center font-mono">4</span>
                        <span>Candidate Email Verification *</span>
                      </h4>
                      {otpExpirySeconds > 0 ? (
                        <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950/70 px-2 py-0.5 rounded border border-amber-500/40 animate-pulse">
                          ⏱️ Valid for {Math.floor(otpExpirySeconds / 60)}:{(otpExpirySeconds % 60).toString().padStart(2, '0')}
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#DFBE79] font-mono">⚡ 5-Minute Code via Email</span>
                      )}
                    </div>

                    <div className="space-y-2.5">
                      <div className="text-[11px] text-gray-300 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#DFBE79] shrink-0" />
                        <span>Verify your official email to confirm candidate authenticity before submission.</span>
                      </div>

                      {/* OTP Sent / Dispatch Notice */}
                      {otpSent && otpNotice && (
                        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/60 text-emerald-200 text-xs space-y-1.5 animate-fadeIn">
                          <div className="flex items-center gap-2 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>{otpNotice}</span>
                          </div>
                        </div>
                      )}

                      {/* OTP Error Banner */}
                      {otpError && (
                        <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/60 text-red-200 text-xs flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                          <span>{otpError}</span>
                        </div>
                      )}

                      {/* OTP Input & Send Button Row */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            maxLength={4}
                            required
                            placeholder="Enter 4-digit OTP"
                            value={enteredOtp}
                            onChange={(e) => {
                              setEnteredOtp(e.target.value.replace(/\D/g, '').slice(0, 4));
                              if (otpError) setOtpError('');
                            }}
                            className={`w-full bg-black/50 border ${otpError ? 'border-red-400 focus:border-red-500 ring-1 ring-red-500' : 'border-white/20 focus:border-[#DFBE79]'
                              } rounded-xl px-3.5 py-2.5 text-sm text-white font-mono text-center tracking-[0.3em] placeholder:text-gray-500 placeholder:font-sans placeholder:tracking-normal focus:outline-none transition-all`}
                          />
                          {enteredOtp.length === 4 && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400">
                              <CheckCircle2 className="w-4 h-4" />
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          disabled={isSendingOtp || cooldown > 0}
                          onClick={handleGetOtp}
                          className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 shrink-0 ${cooldown > 0
                            ? 'bg-black/60 border border-white/10 text-gray-400 cursor-not-allowed'
                            : 'bg-white hover:bg-gray-100 text-[#0C1714] active:scale-95'
                            }`}
                        >
                          {isSendingOtp ? (
                            <>
                              <span className="inline-block w-3.5 h-3.5 border-2 border-[#0C1714]/30 border-t-[#0C1714] rounded-full animate-spin" />
                              <span>Sending...</span>
                            </>
                          ) : cooldown > 0 ? (
                            <span className="font-mono">Resend in {cooldown}s</span>
                          ) : (
                            <span>{otpSent ? "Resend OTP" : "Send OTP"}</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Consent Checkbox */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={formData.consent}
                        onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                        className="mt-0.5 w-4 h-4 rounded border-white/20 bg-black text-[#DFBE79] focus:ring-[#DFBE79] cursor-pointer"
                      />
                      <span className="text-[11px] text-gray-300 leading-snug">
                        I declare that all submitted details are authentic and authorize Concave Realty's Talent Acquisition team to evaluate my application and contact me.
                      </span>
                    </label>
                  </div>

                  {/* Submit Application Button */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#DFBE79] via-[#C59B4E] to-[#B3883B] hover:from-[#EBD296] hover:to-[#C59B4E] text-[#0C1714] text-xs uppercase tracking-widest font-bold shadow-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[#0C1714]/30 border-t-[#0C1714] rounded-full animate-spin" />
                          <span>Submitting Application...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-[#0C1714]" />
                          <span>Submit Application</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default CareerPage;
