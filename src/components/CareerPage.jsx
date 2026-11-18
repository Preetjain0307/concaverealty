import React, { useState, useRef, useEffect } from 'react';
import {
  Briefcase,
  ShieldCheck,
  Building2,
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
  ChevronDown
} from 'lucide-react';
import { dbStore, sanitizeInput, checkRateLimit, recordRateLimitAttempt } from '../data/dbStore';

const WHATSAPP_CAREERS_URL = "https://wa.me/918291090155?text=Hello%20Concave%20Realty%20Talent%20Acquisition%2C%20I%20have%20submitted%20my%20career%20application%20and%20would%20like%20to%20follow%20up.";
const EMAIL_ADDRESS = "concaverealtyindia@gmail.com";
const PHONE_NUMBER = "8291090155";

const OPEN_POSITIONS_LIST = [
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

const DOMAIN_OPTIONS = [
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
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpNotice, setOtpNotice] = useState('');
  const [otpError, setOtpError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [otpExpirySeconds, setOtpExpirySeconds] = useState(0);

  const fileInputRef = useRef(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = Boolean(formData.email && emailRegex.test(formData.email.trim()));

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

  // Step 4: Handle Email Change
  // If the applicant changes their email address after verification, automatically reset verification
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setFormData(prev => ({ ...prev, email: newEmail }));
    if (formError) setFormError('');

    const cleanNew = newEmail.trim().toLowerCase();
    const cleanVerified = verifiedEmail.trim().toLowerCase();

    if (otpVerified && cleanNew !== cleanVerified) {
      setOtpVerified(false);
      setVerificationToken('');
      setOtpSent(false);
      setEnteredOtp('');
      setOtpNotice('');
      setOtpError('Email address changed. Please verify your new email address.');
    } else if (otpSent && cleanNew !== cleanVerified) {
      setOtpSent(false);
      setEnteredOtp('');
      setOtpNotice('');
      setOtpError('');
    }
  };

  // Step 2: Send OTP
  const handleSendOtp = async () => {
    if (cooldown > 0 || isSendingOtp) return;
    setFormError('');
    setOtpNotice('');
    setOtpError('');

    const cleanEmail = (formData.email || '').trim().toLowerCase();
    const cleanName = (formData.name || '').trim();

    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setOtpError("Please enter a valid official email address.");
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
        body: JSON.stringify({
          email: cleanEmail,
          name: cleanName,
          digits: 6,
          purpose: 'career'
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.code === 'MAX_ATTEMPTS_EXCEEDED') {
          setOtpError(data.message || 'Maximum OTP attempts reached. Please try again later.');
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
      setOtpNotice('OTP sent successfully. Please check your email.');
      setOtpError('');
    } catch (err) {
      setOtpError(err.message || 'Failed to send OTP. Please check your connection and try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Step 3: Verify OTP
  const handleVerifyOtp = async () => {
    if (isVerifyingOtp) return;
    setFormError('');
    setOtpNotice('');
    setOtpError('');

    const cleanEmail = (formData.email || '').trim().toLowerCase();
    const cleanOtp = enteredOtp.trim();

    if (!cleanEmail) {
      setOtpError('Please enter your official email address.');
      return;
    }

    if (!cleanOtp || cleanOtp.length !== 6) {
      setOtpError('Please enter the complete 6-digit OTP received in your email.');
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, otp: cleanOtp })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Incorrect OTP. Please check your code.');
      }

      setOtpVerified(true);
      setVerifiedEmail(cleanEmail);
      setVerificationToken(data.token || '');
      setOtpNotice('Email Verified Successfully.');
      setOtpError('');
      setEnteredOtp('');
    } catch (err) {
      setOtpError(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsVerifyingOtp(false);
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

    // Mandatory Email OTP Verification Check
    if (!otpVerified || !verificationToken || cleanEmail.toLowerCase() !== verifiedEmail.toLowerCase()) {
      setFormError('Please verify your email address before submitting your application.');
      return;
    }

    if (!formData.consent) {
      setFormError('Please accept the declaration to submit your application.');
      return;
    }

    setIsSubmitting(true);

    // Backend Verification Validation: Prevent manual variable manipulation or bypass
    try {
      const verifyRes = await fetch('/api/career-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          verificationToken
        })
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        setFormError(verifyData.message || 'Please verify your email address before submitting your application.');
        setIsSubmitting(false);
        return;
      }
    } catch (verErr) {
      console.warn('[Career Apply Backend Validation Notice]:', verErr.message);
    }

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
          currentCompany: sanitizeInput((formData.currentCompany || '').trim(), 100) || 'Not Disclosed',
          currentRole: sanitizeInput((formData.currentRole || '').trim(), 100) || 'N/A',
          currentCtc: sanitizeInput((formData.currentCtc || '').trim(), 50) || 'Not Disclosed',
          expectedCtc: sanitizeInput((formData.expectedCtc || '').trim(), 50) || 'Negotiable',
          noticePeriod: formData.noticePeriod || 'Immediate',
          linkedin: sanitizeInput(formData.linkedin.trim(), 200),
          coverNote: sanitizeInput(formData.coverNote.trim(), 1000),
          resumeName: attachedFile ? attachedFile.name : 'Resume_Attached.pdf',
          resumeSize: attachedFile ? `${(attachedFile.size / (1024 * 1024)).toFixed(1)} MB` : '1.2 MB',
          otpVerified: true,
          verificationToken
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
          setOtpSent(false);
          setOtpVerified(false);
          setVerifiedEmail('');
          setVerificationToken('');
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/65 backdrop-brightness-95" />

        {/* Ambient Subtle Luxury Light Glows */}
        <div className="absolute -top-40 -left-40 w-[36rem] h-[36rem] bg-[#C59B4E]/12 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-40 w-[40rem] h-[40rem] bg-[#1D4036]/25 rounded-full blur-[150px]" />
        <div className="absolute -bottom-40 left-1/4 w-[36rem] h-[36rem] bg-[#245348]/20 rounded-full blur-[140px]" />
      </div>

      {/* ============================================================== */}
      {/* 1. HERO SECTION (High-End Dark Luxury Aesthetic)               */}
      {/* ============================================================== */}
      <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-20 overflow-hidden z-10 border-b border-white/5">

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">

          {/* Statutory MahaRERA Tag (Off-White & Deep Forest Green Luxury Pill) */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-[#FAF9F6]/95 backdrop-blur-md border border-[#EAE6DF] shadow-[0_10px_30px_rgba(20,34,31,0.2)] hover:border-[#C59B4E] transition-all duration-300">
              <ShieldCheck className="w-4 h-4 text-[#C59B4E] shrink-0" />
              <span className="text-xs sm:text-sm font-mono font-bold tracking-wide text-[#1D3530]">
                MahaRERA Registered Agent: <span className="text-[#C59B4E] font-bold">A51900045781</span>
              </span>
            </div>
          </div>

          {/* Main Title & Slogan */}
          <div className="space-y-5 max-w-5xl mx-auto">
            {/* Careers Eyebrow Badge (Forest Green & Gold High-Contrast Pill) */}
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#1D3530] border border-[#C59B4E]/60 text-xs sm:text-sm uppercase tracking-[0.25em] text-[#DFBE79] font-bold font-mono shadow-[0_8px_25px_rgba(20,34,31,0.35)]">
                <span className="w-2 h-2 rounded-full bg-[#C59B4E] animate-pulse" />
                <span>CAREERS AT CONCAVE REALTY</span>
              </span>
            </div>

            <h1
              className="anim-luxury-title text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight uppercase leading-tight font-serif"
              style={{ fontFamily: '"Cormorant Garamond", Cinzel, serif' }}
            >
              JOIN A TEAM WHERE YOU BELONG
            </h1>
            <div>
              <p className="anim-slogan-pulse font-serif italic text-lg sm:text-2xl text-[#FAF9F6] font-light max-w-2xl mx-auto">
                “We don’t just find homes; <span className="text-white font-normal not-italic tracking-wide">we build careers.</span>”
              </p>
            </div>
          </div>

          {/* We Are Hiring Bar (Wider Luxury Grid with Smooth Animations) */}
          <div className="relative overflow-hidden max-w-5xl w-full mx-auto rounded-2xl bg-[#FAF9F6]/95 backdrop-blur-md border border-[#EAE6DF] p-5 sm:p-6 text-left shadow-[0_15px_35px_rgba(20,34,31,0.12)] hover:shadow-[0_22px_45px_rgba(20,34,31,0.2)] hover:border-[#C59B4E] transition-all duration-300 hover:-translate-y-1 space-y-4 group">
            {/* Top Luxury Accent Strip */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1D3530] via-[#C59B4E] to-[#1D3530]" />

            {/* Header Row: "WE ARE HIRING" + "4 Openings" on Left, "VIEW OPENINGS ↓" on Right */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3.5 border-b border-[#EAE6DF] pt-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1D3530]/10 border border-[#245348]/20 text-xs sm:text-sm font-mono tracking-widest text-[#1D3530] font-bold">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#245348]"></span>
                  </span>
                  <span>WE ARE HIRING</span>
                </span>
                <span className="text-xs font-mono text-[#63706B] hidden sm:inline">•</span>
                <span className="text-xs font-mono font-bold text-[#C59B4E] bg-[#F4F1EA] px-3 py-1 rounded-full border border-[#E2DDD3]">
                  4 Immediate Openings
                </span>
              </div>

              <button
                onClick={() => {
                  const el = document.getElementById('open-positions-card');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#1D3530] hover:bg-[#284F45] text-[#DFBE79] hover:text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0 shadow-sm hover:shadow-md flex items-center justify-center gap-2 border border-[#C59B4E]/40 hover:scale-105 active:scale-95 group/btn"
              >
                <span>VIEW OPENINGS</span>
                <span className="text-sm group-hover/btn:translate-y-1 transition-transform">↓</span>
              </button>
            </div>

            {/* Symmetrically Aligned 4-Column Role Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              {OPEN_POSITIONS_LIST.map((pos) => (
                <button
                  key={pos.id}
                  onClick={() => handleApplyRole(pos.title)}
                  className="group/chip text-left p-3.5 rounded-xl bg-[#F4F1EA] hover:bg-[#1D3530] border border-[#E2DDD3] hover:border-[#1D3530] transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-1 cursor-pointer flex flex-col justify-between h-full relative overflow-hidden"
                >
                  {/* Subtle top indicator bar */}
                  <div className="w-8 h-0.5 bg-[#C59B4E] rounded-full mb-2.5 group-hover/chip:w-full transition-all duration-300" />

                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#C59B4E] font-bold block">
                      Role {pos.num}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-[#14221F] group-hover/chip:text-white transition-colors leading-snug line-clamp-2">
                      {pos.title}
                    </h4>
                  </div>

                  <div className="pt-3 mt-3 flex items-center justify-between text-[11px] border-t border-[#EAE6DF] group-hover/chip:border-[#284F45]">
                    <span className="text-[#63706B] group-hover/chip:text-[#DFBE79] font-mono font-medium transition-colors">
                      {pos.exp}
                    </span>
                    <span className="text-[#1D3530] group-hover/chip:text-[#DFBE79] font-bold group-hover/chip:translate-x-1 transition-transform">
                      Apply →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>


          {/* Leadership / Founder's Message Card (Off-White & Green Luxury Editorial Card) */}
          <div className="relative overflow-hidden max-w-5xl w-full mx-auto text-left rounded-2xl bg-[#FAF9F6]/95 backdrop-blur-md border border-[#EAE6DF] p-6 sm:p-9 shadow-[0_20px_50px_rgba(20,34,31,0.14)] hover:shadow-[0_28px_60px_rgba(20,34,31,0.22)] hover:border-[#C59B4E] transition-all duration-300 hover:-translate-y-1 text-[#14221F] space-y-6 group">
            {/* Top Luxury Accent Strip */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1D3530] via-[#C59B4E] to-[#1D3530]" />

            {/* Header Row: "LEADERSHIP" + "Founder's Message" on Left, "Verified Vision" on Right */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#EAE6DF] pt-1">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1D3530] text-[#DFBE79] text-xs font-mono font-bold tracking-widest border border-[#C59B4E]/50 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#DFBE79]" />
                  <span>LEADERSHIP</span>
                </span>
                <span className="text-xs sm:text-sm font-mono text-[#63706B] font-bold tracking-wider uppercase">
                  Founder's Message
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#245348] font-bold bg-[#F4F1EA] px-3 py-1 rounded-full border border-[#E2DDD3]">
                <ShieldCheck className="w-4 h-4 text-[#C59B4E]" />
                <span>Verified Vision</span>
              </div>
            </div>

            {/* Body Quote Block with Decorative Gold Watermark */}
            <div className="relative">
              {/* Decorative Gold Watermark Quote */}
              <span className="absolute -top-6 -left-3 text-7xl sm:text-8xl font-serif text-[#C59B4E]/15 select-none pointer-events-none leading-none">
                “
              </span>

              <blockquote className="relative z-10 pl-5 sm:pl-7 border-l-4 border-l-[#C59B4E] space-y-3.5">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif italic font-bold text-[#1D3530] leading-snug tracking-tight">
                  “Welcome to Concave Realty, where you truly belong.”
                </h3>
                <p className="text-sm sm:text-base lg:text-lg text-[#2D3A37] font-normal leading-relaxed max-w-4xl">
                  Real estate in Mumbai is built on long-term relationships, trust, and absolute market precision. We are building an advisory culture where associates are provided with verified inventory, qualified buyer appointments, and institutional backing to thrive.
                </p>
              </blockquote>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 2. OPEN POSITIONS SECTION                                      */}
          {/* ============================================================== */}
          <div id="open-positions-card" className="mt-12 sm:mt-16 text-left max-w-5xl w-full mx-auto">
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#FAF9F6]/95 backdrop-blur-md border border-[#EAE6DF] p-6 sm:p-10 shadow-[0_25px_55px_rgba(20,34,31,0.16)] hover:border-[#C59B4E]/60 transition-all duration-300 text-[#14221F] space-y-8">
              {/* Top Luxury Accent Strip */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1D3530] via-[#C59B4E] to-[#1D3530]" />

              {/* Top Title & Description (Center Aligned with Animated Gradient Fill) */}
              <div className="text-center max-w-3xl mx-auto space-y-3 pt-1">
                <div>
                  <h2
                    className="anim-open-positions-title text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight font-serif"
                    style={{ fontFamily: '"Cormorant Garamond", Cinzel, serif' }}
                  >
                    Open Positions
                  </h2>
                </div>

                {/* Animated Gold Fill Accent Line */}
                <div className="w-20 sm:w-28 h-0.5 mx-auto rounded-full anim-fill-divider" />

                <p className="text-sm sm:text-base text-[#4A5854] font-normal leading-relaxed mx-auto">
                  We're expanding our leadership team! If you are an experienced real estate leader with a track record of driving sales in Mumbai, this is for you.
                </p>
              </div>

              {/* The 4 Open Positions List */}
              <div className="space-y-3.5 pt-2">
                {OPEN_POSITIONS_LIST.map((pos) => (
                  <div
                    key={pos.id}
                    className="group rounded-xl border border-[#E2DDD3] bg-[#FAF9F6] hover:bg-[#F4F1EA] hover:border-[#1D3530] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                  >
                    {/* Left: Number + Title + Location */}
                    <div className="flex items-start sm:items-center gap-3.5 sm:gap-5 min-w-0">
                      <span className="font-mono text-base sm:text-lg font-bold text-[#C59B4E] group-hover:scale-110 transition-transform shrink-0 mt-0.5 sm:mt-0">
                        {pos.num}
                      </span>
                      <div className="space-y-1.5 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-[#14221F] group-hover:text-[#1D3530] transition-colors leading-snug">
                          {pos.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm text-[#4A5854]">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-[#245348]" />
                            <span>{pos.location}</span>
                          </span>
                          <span className="text-gray-300 hidden sm:inline">•</span>
                          <span className="text-[#1D3530] font-mono font-semibold">Exp: {pos.exp}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Apply Now Button */}
                    <button
                      onClick={() => handleApplyRole(pos.title)}
                      className="self-start sm:self-center px-6 py-3 rounded-lg bg-[#1D3530] hover:bg-[#284F45] text-[#DFBE79] hover:text-white border border-[#C59B4E]/40 text-xs sm:text-sm uppercase tracking-wider font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer shrink-0 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 group/btn"
                    >
                      <span>APPLY NOW</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                ))}
              </div>

              {/* ============================================================== */}
              {/* 3. DIRECT MAIL & LOCATION                                      */}
              {/* ============================================================== */}
              <div className="pt-8 border-t border-[#EAE6DF] space-y-6 text-center">

                {/* Centered Solid Apply Button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => handleApplyRole()}
                    className="px-10 py-3.5 rounded-xl bg-[#1D3530] hover:bg-[#284F45] text-[#DFBE79] hover:text-white font-bold text-xs sm:text-sm uppercase tracking-[0.25em] shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer border border-[#C59B4E]/50 flex items-center gap-2.5"
                  >
                    <span>APPLY NOW</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Direct Careers Email Card */}
                <div className="w-full rounded-2xl border border-[#EAE6DF] bg-[#FAF9F6] p-6 sm:p-8 space-y-2.5 shadow-sm hover:border-[#1D3530] transition-colors">
                  <span className="text-xs sm:text-sm uppercase font-mono tracking-[0.25em] text-[#63706B] font-bold block">
                    CAREERS EMAIL
                  </span>
                  <a
                    href={`mailto:${EMAIL_ADDRESS}?subject=Concave%20Realty%20Career%20Application`}
                    className="text-xl sm:text-2xl lg:text-3xl font-mono font-bold text-[#1D3530] hover:text-[#C59B4E] transition-colors block break-all"
                  >
                    {EMAIL_ADDRESS}
                  </a>
                  <p className="text-sm sm:text-base text-[#4A5854] font-normal">
                    Send your CV and we'll get back to you.
                  </p>
                </div>

                {/* Office & Statutory Address */}
                <div className="pt-2 flex items-center justify-center gap-2 text-xs sm:text-sm text-[#4A5854] font-medium">
                  <MapPin className="w-4 h-4 text-[#245348] shrink-0" />
                  <span>Concave Realty | Borivali West, Mumbai, Maharashtra 400092 | MahaRERA: A51900045781</span>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* APPLICATION MODAL POPUP (White & Green Luxury Aesthetic)       */}
      {/* ============================================================== */}
      {isApplyModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md overflow-y-auto"
          onClick={handleCloseModal}
        >
          <div
            className="relative w-full max-w-2xl bg-[#FAF9F6] rounded-2xl shadow-[0_25px_70px_rgba(20,34,31,0.35)] overflow-hidden my-auto max-h-[92vh] flex flex-col border border-[#EAE6DF] anim-fade-up text-[#14221F]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="career-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header (Deep Forest Green with Gold Accents matching Website Theme) */}
            <div className="flex items-center justify-between px-5 sm:px-7 py-4 bg-[#1D3530] text-white shrink-0 border-b-2 border-[#C59B4E]/40 shadow-sm">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-white/10 border border-[#C59B4E]/60 flex items-center justify-center text-[#DFBE79] shrink-0">
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
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0 ml-3 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6 bg-[#FAF9F6]">

              {/* Success Notification Banner */}
              {submissionSuccess ? (
                <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF9F6] border-2 border-[#C59B4E] text-center space-y-5">
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#1D3530] border-2 border-[#C59B4E] text-[#DFBE79] flex items-center justify-center shadow-md">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>

                  <div className="space-y-1.5">
                    <span className="px-3 py-1 rounded-full bg-[#1D3530]/10 border border-[#245348]/20 text-[#245348] font-mono text-xs font-semibold uppercase tracking-wider">
                      Application ID: {submissionSuccess.id}
                    </span>
                    <h4 className="font-serif text-2xl font-bold text-[#1D3530] pt-2">
                      Application Received Successfully!
                    </h4>
                    <p className="text-xs sm:text-sm text-[#4A5854] max-w-lg mx-auto leading-relaxed">
                      Thank you, <strong className="text-[#1D3530]">{submissionSuccess.name}</strong>. Your profile for <strong className="text-[#C59B4E]">{submissionSuccess.position}</strong> has been logged into our talent database.
                    </p>
                  </div>

                  {/* Status Details Box */}
                  <div className="max-w-md mx-auto p-4 rounded-xl bg-[#F4F1EA] border border-[#E2DDD3] text-xs text-left space-y-2 font-mono shadow-xs">
                    <div className="flex justify-between border-b border-[#EAE6DF] pb-1">
                      <span className="text-[#63706B]">Candidate:</span>
                      <span className="text-[#1D3530] font-bold">{submissionSuccess.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#EAE6DF] pb-1">
                      <span className="text-[#63706B]">Position:</span>
                      <span className="text-[#1D3530] font-bold">{submissionSuccess.position}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#EAE6DF] pb-1">
                      <span className="text-[#63706B]">Contact:</span>
                      <span className="text-[#1D3530]">+91 {submissionSuccess.mobile}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#EAE6DF] pb-1">
                      <span className="text-[#63706B]">Verification:</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        OTP Verified (Security Authenticated)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#63706B]">Initial Status:</span>
                      <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-300">Under Review</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={`https://wa.me/91${PHONE_NUMBER}?text=Hello%20Concave%20Realty%20Talent%20Acquisition%2C%20I%20have%20submitted%20my%20application%20(Ref%3A%20${submissionSuccess.id})%20for%20${encodeURIComponent(submissionSuccess.position)}%20and%20would%20like%20to%20connect.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>WhatsApp Talent Desk</span>
                    </a>

                    <button
                      onClick={handleCloseModal}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#1D3530] hover:bg-[#284F45] text-[#DFBE79] hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border border-[#C59B4E]/40"
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
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Section 1: Candidate Contact Info */}
                  <div className="space-y-3.5">
                    <h4 className="font-serif text-base sm:text-lg font-bold text-[#1D3530] border-b border-[#EAE6DF] pb-2 flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#1D3530] text-[#DFBE79] text-xs flex items-center justify-center font-mono font-bold">1</span>
                      <span>Personal Details & Contact</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">

                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <label className="text-[#14221F] font-semibold block text-xs sm:text-sm">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#1D3530] focus:ring-1 focus:ring-[#1D3530]/20 rounded-xl px-3.5 py-2.5 text-sm text-[#14221F] placeholder-gray-400 focus:outline-none transition-colors"
                        />
                      </div>

                      {/* Mobile */}
                      <div className="space-y-1.5">
                        <label className="text-[#14221F] font-semibold block text-xs sm:text-sm">Mobile Number (WhatsApp) *</label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-[#EAE6DF] bg-[#FAF9F6] text-[#63706B] font-mono text-sm font-semibold">
                            +91
                          </span>
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            value={formData.mobile}
                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                            placeholder="98201 XXXXX"
                            className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#1D3530] focus:ring-1 focus:ring-[#1D3530]/20 rounded-r-xl px-3.5 py-2.5 text-sm text-[#14221F] font-mono placeholder-gray-400 focus:outline-none transition-colors"
                          />
                        </div>
                      </div>

                      {/* Current City / Area */}
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-[#14221F] font-semibold block text-xs sm:text-sm">Current City / Micro-Market *</label>
                        <input
                          type="text"
                          required
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="e.g. Borivali / Bandra / Mumbai"
                          className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#1D3530] focus:ring-1 focus:ring-[#1D3530]/20 rounded-xl px-3.5 py-2.5 text-sm text-[#14221F] placeholder-gray-400 focus:outline-none transition-colors"
                        />
                      </div>

                      {/* Official Email Address with Integrated Email OTP Verification */}
                      <div className="space-y-2 sm:col-span-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[#14221F] font-semibold block text-xs sm:text-sm">
                            Official Email Address *
                          </label>
                          {otpVerified && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Email Verified</span>
                            </span>
                          )}
                        </div>

                        {/* Email Input + Send OTP Button */}
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <input
                              type="email"
                              required
                              value={formData.email}
                              onChange={handleEmailChange}
                              placeholder="rahul.sharma@example.com"
                              className={`w-full bg-[#FAF9F6] border ${
                                otpVerified
                                  ? 'border-emerald-500 bg-emerald-50/20 text-emerald-950 pr-9'
                                  : 'border-[#EAE6DF] focus:border-[#1D3530]'
                              } focus:ring-1 focus:ring-[#1D3530]/20 rounded-xl px-3.5 py-2.5 text-sm text-[#14221F] placeholder-gray-400 focus:outline-none transition-colors`}
                            />
                            {otpVerified && (
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600">
                                <CheckCircle2 className="w-4 h-4" />
                              </span>
                            )}
                          </div>

                          {!otpVerified && (
                            <button
                              type="button"
                              disabled={!isEmailValid || isSendingOtp || cooldown > 0}
                              onClick={handleSendOtp}
                              className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all shrink-0 cursor-pointer flex items-center justify-center gap-1.5 ${
                                !isEmailValid || isSendingOtp || cooldown > 0
                                  ? 'bg-[#FAF9F6] border border-[#EAE6DF] text-[#A09A8E] cursor-not-allowed'
                                  : 'bg-[#1D3530] hover:bg-[#284F45] text-[#DFBE79] hover:text-white border border-[#C59B4E]/40 active:scale-95 shadow-xs'
                              }`}
                            >
                              {isSendingOtp ? (
                                <>
                                  <span className="inline-block w-3.5 h-3.5 border-2 border-[#DFBE79]/30 border-t-[#DFBE79] rounded-full animate-spin" />
                                  <span>Sending...</span>
                                </>
                              ) : cooldown > 0 ? (
                                <span className="font-mono">Resend in {cooldown}s</span>
                              ) : (
                                <span>{otpSent ? 'Resend OTP' : 'Send OTP'}</span>
                              )}
                            </button>
                          )}
                        </div>

                        {/* Inline OTP Input & Verify OTP (Displayed immediately below when OTP is sent) */}
                        {otpSent && !otpVerified && (
                          <div className="p-3.5 rounded-xl bg-white border border-[#EAE6DF] shadow-xs space-y-2.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[#1D3530] font-semibold flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5 text-[#C59B4E]" />
                                <span>Enter 6-digit OTP sent to your email:</span>
                              </span>
                              {otpExpirySeconds > 0 && (
                                <span className="font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                  ⏱️ {Math.floor(otpExpirySeconds / 60)}:{(otpExpirySeconds % 60).toString().padStart(2, '0')}
                                </span>
                              )}
                            </div>

                            <div className="flex gap-2">
                              <input
                                type="text"
                                maxLength={6}
                                value={enteredOtp}
                                onChange={(e) => {
                                  setEnteredOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                                  if (otpError) setOtpError('');
                                }}
                                placeholder="6-digit OTP"
                                className="flex-1 bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#1D3530] focus:ring-1 focus:ring-[#1D3530]/20 rounded-xl px-3.5 py-2 text-sm font-mono tracking-widest text-[#1D3530] placeholder:font-sans placeholder:tracking-normal placeholder-gray-400 focus:outline-none text-center font-bold"
                              />

                              <button
                                type="button"
                                disabled={isVerifyingOtp || enteredOtp.length !== 6}
                                onClick={handleVerifyOtp}
                                className={`px-5 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all shrink-0 cursor-pointer flex items-center justify-center gap-1.5 ${
                                  isVerifyingOtp || enteredOtp.length !== 6
                                    ? 'bg-[#FAF9F6] border border-[#EAE6DF] text-[#A09A8E] cursor-not-allowed'
                                    : 'bg-[#1D3530] hover:bg-[#284F45] text-[#DFBE79] hover:text-white border border-[#C59B4E]/40 active:scale-95 shadow-xs'
                                }`}
                              >
                                {isVerifyingOtp ? (
                                  <>
                                    <span className="inline-block w-3.5 h-3.5 border-2 border-[#DFBE79]/30 border-t-[#DFBE79] rounded-full animate-spin" />
                                    <span>Verifying...</span>
                                  </>
                                ) : (
                                  <span>Verify OTP</span>
                                )}
                              </button>
                            </div>

                            {/* Status Notices */}
                            {otpNotice && (
                              <p className="text-xs text-emerald-700 flex items-center gap-1.5 font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>{otpNotice}</span>
                              </p>
                            )}

                            {otpError && (
                              <p className="text-xs text-red-600 flex items-center gap-1.5 font-medium">
                                <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                                <span>{otpError}</span>
                              </p>
                            )}
                          </div>
                        )}

                        {/* Re-verification alert when applicant modifies email address after verification */}
                        {verifiedEmail && formData.email.trim().toLowerCase() !== verifiedEmail.toLowerCase() && !otpVerified && (
                          <p className="text-xs text-amber-700 flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>Email address changed. Please verify your new email address.</span>
                          </p>
                        )}
                      </div>

                    </div>
                  </div>

                  {/* Section 2: Professional Background & Role */}
                  <div className="space-y-3.5 pt-1">
                    <h4 className="font-serif text-base sm:text-lg font-bold text-[#1D3530] border-b border-[#EAE6DF] pb-2 flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#1D3530] text-[#DFBE79] text-xs flex items-center justify-center font-mono font-bold">2</span>
                      <span>Applied Position & Experience</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">

                      {/* Applied Position */}
                      <div className="space-y-1.5">
                        <label className="text-[#14221F] font-semibold block text-xs sm:text-sm">Position Applied For *</label>
                        <select
                          value={formData.position}
                          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                          className="w-full bg-[#FAF9F6] border border-[#C59B4E] focus:border-[#1D3530] focus:ring-1 focus:ring-[#1D3530]/20 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none transition-colors font-bold text-[#1D3530]"
                        >
                          {DOMAIN_OPTIONS.map((opt, idx) => (
                            <option key={idx} value={opt} className="bg-white text-[#14221F]">
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Total Experience */}
                      <div className="space-y-1.5">
                        <label className="text-[#14221F] font-semibold block text-xs sm:text-sm">Real Estate Experience *</label>
                        <select
                          value={formData.experience}
                          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                          className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#1D3530] focus:ring-1 focus:ring-[#1D3530]/20 rounded-xl px-3.5 py-2.5 text-sm text-[#14221F] focus:outline-none transition-colors"
                        >
                          <option value="Fresher / < 1 Year" className="bg-white text-[#14221F]">Fresher / &lt; 1 Year</option>
                          <option value="1 - 3 Years" className="bg-white text-[#14221F]">1 - 3 Years</option>
                          <option value="3 - 5 Years" className="bg-white text-[#14221F]">3 - 5 Years</option>
                          <option value="5 - 8 Years" className="bg-white text-[#14221F]">5 - 8 Years</option>
                          <option value="8+ Years (Leadership)" className="bg-white text-[#14221F]">8+ Years (Leadership Profile)</option>
                        </select>
                      </div>

                    </div>
                  </div>

                  {/* Section 3: Resume Document & Credentials */}
                  <div className="space-y-3.5 pt-1">
                    <h4 className="font-serif text-base sm:text-lg font-bold text-[#1D3530] border-b border-[#EAE6DF] pb-2 flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#1D3530] text-[#DFBE79] text-xs flex items-center justify-center font-mono font-bold">3</span>
                      <span>Resume Document & Credentials</span>
                    </h4>

                    <div className="space-y-3.5 text-xs">

                      {/* Resume Upload Area */}
                      <div className="space-y-1.5">
                        <label className="text-[#14221F] font-semibold block">Attach Resume / CV (.pdf, .doc, .docx - max 5MB)</label>

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
                            className="p-4 rounded-xl border-2 border-dashed border-[#EAE6DF] hover:border-[#1D3530] bg-[#F4F1EA] hover:bg-[#EAE6DF] flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors"
                          >
                            <UploadCloud className="w-6 h-6 text-[#245348]" />
                            <span className="text-xs font-semibold text-[#1D3530]">Click to Browse and Upload Resume</span>
                            <span className="text-[10px] text-[#63706B] font-mono">PDF, DOC, DOCX up to 5MB</span>
                          </label>
                        ) : (
                          <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#1D3530] flex items-center justify-between shadow-xs">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <FileText className="w-5 h-5 text-[#245348] shrink-0" />
                              <div className="min-w-0">
                                <span className="font-semibold text-xs text-[#1D3530] block truncate">
                                  {attachedFile.name}
                                </span>
                                <span className="text-[10px] text-[#63706B] font-mono">
                                  {(attachedFile.size / (1024 * 1024)).toFixed(2)} MB
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={handleRemoveFile}
                              className="p-1 rounded-lg hover:bg-red-100 text-red-600 cursor-pointer transition-colors"
                              title="Remove file"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {fileError && (
                          <span className="text-[11px] text-red-600 font-medium block pt-1">
                            {fileError}
                          </span>
                        )}
                      </div>

                    </div>
                  </div>

                  {/* Consent Checkbox */}
                  <div className="pt-1">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={formData.consent}
                        onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                        className="mt-1 w-4 h-4 rounded border-[#EAE6DF] text-[#1D3530] focus:ring-[#1D3530] cursor-pointer"
                      />
                      <span className="text-xs sm:text-sm text-[#4A5854] leading-relaxed">
                        I declare that all submitted details are authentic and authorize Concave Realty's Talent Acquisition team to evaluate my application and contact me.
                      </span>
                    </label>
                  </div>

                  {/* Submit Application Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-6 rounded-xl bg-[#1D3530] hover:bg-[#284F45] text-[#DFBE79] hover:text-white border border-[#C59B4E]/40 text-xs sm:text-sm uppercase tracking-widest font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 hover:scale-[1.01] active:scale-95"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[#DFBE79]/30 border-t-[#DFBE79] rounded-full animate-spin" />
                          <span>Submitting Application...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-[#DFBE79]" />
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
