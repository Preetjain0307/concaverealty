import React, { useState, useRef } from 'react';
import {
  Briefcase,
  ShieldCheck,
  Building2,
  Users,
  Sparkles,
  MapPin,
  Clock,
  IndianRupee,
  PhoneCall,
  Mail,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  ArrowRight,
  Send,
  Compass,
  Star,
  Flame,
  TrendingUp,
  Check
} from 'lucide-react';
import { dbStore, sanitizeInput, checkRateLimit } from '../data/dbStore';

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
  const [highlightRole, setHighlightRole] = useState(false);

  const formRef = useRef(null);
  const fileInputRef = useRef(null);

  // When clicking "APPLY NOW →" on an open position
  const handleApplyRole = (roleTitle) => {
    setFormData(prev => ({ ...prev, position: roleTitle }));
    setHighlightRole(true);
    setTimeout(() => setHighlightRole(false), 2500);

    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    // Anti-bot honeypot check
    if (honeypot.trim() !== '') {
      return;
    }

    // Anti-spam sliding rate limit check
    const rateCheck = checkRateLimit('career_form_submissions', 5, 300000);
    if (!rateCheck.allowed) {
      setFormError('Too many submissions in a short period. Please wait a few moments or contact our HR directly via WhatsApp.');
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
      setFormError('Please specify your expected CTC (e.g. ₹10 LPA or Negotiable).');
      return;
    }

    if (!formData.consent) {
      setFormError('Please accept the declaration to submit your application.');
      return;
    }

    setIsSubmitting(true);

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
          resumeSize: attachedFile ? `${(attachedFile.size / (1024 * 1024)).toFixed(1)} MB` : '1.2 MB'
        };

        const result = dbStore.addJobApplication(payload);

        if (result.success) {
          setSubmissionSuccess(result.application);
          // Reset form data
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
        } else {
          setFormError('Failed to save application. Please try again or WhatsApp our HR team.');
        }
      } catch (err) {
        console.error("Career submission error:", err);
        setFormError('A system error occurred. Please contact our HR desk directly.');
      } finally {
        setIsSubmitting(false);
      }
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#14221F]">
      
      {/* ============================================================== */}
      {/* 1. HERO SECTION (Matches Seek & Settle luxury reference)       */}
      {/* ============================================================== */}
      <section className="relative pt-24 sm:pt-28 pb-16 sm:pb-24 bg-[#14221F] text-white overflow-hidden border-b border-[#C59B4E]/30">
        
        {/* Ambient Luxury Lighting */}
        <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 bg-[#C59B4E]/15 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 bg-[#245348]/25 rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          
          {/* Statutory MahaRERA Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#183C32] border border-[#C59B4E]/50 text-[10px] sm:text-[11px] font-mono text-[#DFBE79] shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-[#DFBE79]" />
            <span>MahaRERA Registered Agent: A51900045781</span>
          </div>

          {/* Main Title & Slogan */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <span className="text-xs uppercase tracking-[0.3em] text-[#DFBE79] font-semibold block font-mono">
              CAREERS AT CONCAVE REALTY
            </span>
            <h1 
              className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F7F3EB] uppercase leading-tight"
              style={{ fontFamily: '"Cormorant Garamond", Cinzel, serif' }}
            >
              JOIN A TEAM WHERE YOU BELONG
            </h1>
            <p className="font-serif italic text-base sm:text-2xl text-[#D0C5B4] font-light max-w-2xl mx-auto">
              “We don’t just find homes; we build careers.”
            </p>
          </div>

          {/* We Are Hiring Bar (Matches Reference Screenshot) */}
          <div className="max-w-3xl mx-auto rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 text-left shadow-lg">
            <div className="space-y-2 w-full md:w-auto">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#DFBE79] font-bold block">
                WE ARE HIRING
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {OPEN_POSITIONS_LIST.map((pos) => (
                  <button
                    key={pos.id}
                    onClick={() => handleApplyRole(pos.title)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#DFBE79] text-gray-200 hover:text-[#14221F] border border-white/10 hover:border-[#DFBE79] text-[11px] font-medium transition-all cursor-pointer"
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
              className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-gray-100 text-[#14221F] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0 shadow-md flex items-center justify-center gap-2"
            >
              <span>VIEW OPENINGS</span>
              <span className="text-sm">↓</span>
            </button>
          </div>

          {/* Careers at Concave Realty Overview Card (Matches Seek & Settle Reference Screenshot 1) */}
          <div className="max-w-3xl mx-auto text-left rounded-2xl bg-black/50 border border-white/10 backdrop-blur-md p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#183C32] border border-[#C59B4E]/40 text-[#DFBE79] flex items-center justify-center shadow-inner shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                  Careers at Concave Realty
                </h3>
                <span className="text-[11px] font-mono text-[#DFBE79]">
                  MahaRERA: A51900045781 • Mumbai, India
                </span>
              </div>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
              <p>
                <strong className="text-white font-medium">Transparency First:</strong> Secure your financial future with documented commission payouts and a clear path to high earnings.
              </p>
              <p>
                <strong className="text-white font-medium">Smart Lead Flow:</strong> We handle the marketing so you can handle the deals. Get access to vetted real estate leads in Mumbai's most sought-after luxury developments.
              </p>
              <p>
                <strong className="text-white font-medium">Fully Licensed & Compliant:</strong> Build your personal brand as a MahaRERA-certified professional under the Concave Realty umbrella.
              </p>
              <p>
                <strong className="text-white font-medium">Supported Growth:</strong> Work within a team that recognizes your hustle and provides the tools you need to scale your portfolio.
              </p>
              <p className="pt-2 text-white/90 italic font-serif text-sm sm:text-base border-t border-white/5">
                “Launch your journey in Mumbai’s most exciting real estate market with Concave Realty.”
              </p>
            </div>
          </div>

          {/* Leadership / Founder's Message Card (Matches Seek & Settle Reference Screenshot 2) */}
          <div className="max-w-3xl mx-auto text-left rounded-2xl bg-gradient-to-r from-[#183C32]/90 to-[#14221F]/90 border border-[#C59B4E]/30 backdrop-blur-md p-6 sm:p-7 shadow-xl">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#DFBE79] font-bold">
                  LEADERSHIP
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
                Founder's Message
              </h3>
              <div className="p-4 rounded-xl bg-black/25 border border-white/5 space-y-2">
                <p className="text-sm sm:text-base text-[#DFBE79] font-serif italic">
                  “Welcome to Concave Realty, where you truly belong.”
                </p>
                <p className="text-xs text-gray-300 leading-relaxed font-light">
                  Real estate in Mumbai is built on long-term relationships, trust, and absolute market precision. We are building an advisory culture where associates are provided with verified inventory, qualified buyer appointments, and institutional backing to thrive.
                </p>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 2. OPEN POSITIONS SECTION (Exact Match to User Screenshots)     */}
          {/* ============================================================== */}
          <div id="open-positions-card" className="mt-12 sm:mt-16 text-left max-w-4xl mx-auto">
            <div className="relative rounded-2xl bg-[#183C32]/95 backdrop-blur-md border border-[#C59B4E]/40 p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.35)] space-y-8">
              
              {/* Top Eyebrow & Title */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs uppercase font-mono tracking-[0.25em] text-[#DFBE79] font-bold">
                  <Star className="w-3.5 h-3.5 fill-[#DFBE79] text-[#DFBE79]" />
                  <span>WE ARE HIRING</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-serif">
                  Open Positions
                </h2>
                <p className="text-xs sm:text-sm text-[#D0C5B4] font-light max-w-2xl leading-relaxed">
                  We're expanding our team! If you are a motivated real estate professional with a track record of driving sales in Mumbai, this is for you.
                </p>
              </div>

              {/* Package Card (Matches Screenshot 1) */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#DFBE79] font-semibold flex items-center gap-1.5">
                  <span>💰</span>
                  <span>PACKAGE</span>
                </span>

                <div className="rounded-xl border border-white/10 bg-black/30 backdrop-blur-sm p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      Performance Commission + Milestone Rewards
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
                    className="group rounded-xl border border-white/10 bg-black/20 hover:bg-black/40 hover:border-[#C59B4E]/60 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300"
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
                      className="self-start sm:self-center px-5 py-2.5 rounded-lg border border-white/30 hover:border-[#DFBE79] bg-white/5 hover:bg-[#DFBE79] text-white hover:text-[#14221F] text-xs uppercase tracking-wider font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer shrink-0 shadow-xs"
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
                  <div className="p-4 rounded-xl border border-white/10 bg-black/25 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#245348] text-[#DFBE79] flex items-center justify-center shrink-0 mt-0.5">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <h4 className="font-bold text-xs text-white">Smart Lead Flow</h4>
                      <p className="text-[11px] text-gray-400 leading-snug">
                        Vetted buyer inquiries provided for key Mumbai micro-markets.
                      </p>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="p-4 rounded-xl border border-white/10 bg-black/25 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#245348] text-[#DFBE79] flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <h4 className="font-bold text-xs text-white">Fully Compliant</h4>
                      <p className="text-[11px] text-gray-400 leading-snug">
                        Strong MahaRERA backing & complete transaction support.
                      </p>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="p-4 rounded-xl border border-white/10 bg-black/25 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#245348] text-[#DFBE79] flex items-center justify-center shrink-0 mt-0.5">
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
                  <div className="p-4 rounded-xl border border-white/10 bg-black/25 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#245348] text-[#DFBE79] flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <h4 className="font-bold text-xs text-white">Transparency First</h4>
                      <p className="text-[11px] text-gray-400 leading-snug">
                        Timely commission payouts & a clear roadmap to high earnings.
                      </p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. DIRECT CAREER APPLICATION FORM                              */}
      {/* ============================================================== */}
      <section ref={formRef} id="career-application-form" className="py-16 sm:py-24 bg-white relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

          {/* Form Header */}
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-[0.28em] text-[#C59B4E] font-semibold block font-mono">
              DIRECT TALENT APPLICATION
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#14221F] tracking-tight">
              Submit Your Candidature
            </h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#C59B4E] to-transparent mx-auto mt-2" />
            <p className="text-xs sm:text-sm text-gray-500 font-light max-w-xl mx-auto pt-1 leading-relaxed">
              Applying for an open position? Fill in your details below and our Talent Acquisition team will review your profile with complete confidentiality.
            </p>
          </div>

          {/* Success Notification Banner */}
          {submissionSuccess ? (
            <div className="p-8 sm:p-10 rounded-2xl bg-[#FAF9F6] border-2 border-[#245348] shadow-lg text-center space-y-6 anim-fade-scale">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-[#183C32] text-[#DFBE79] font-mono text-xs font-semibold uppercase tracking-wider">
                  Application ID: {submissionSuccess.id}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#14221F] pt-2">
                  Application Received Successfully!
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
                  Thank you, <strong className="text-gray-900">{submissionSuccess.name}</strong>. Your application for <strong className="text-[#245348]">{submissionSuccess.position}</strong> has been saved directly to our recruitment records.
                </p>
              </div>

              {/* Status Details Box */}
              <div className="max-w-md mx-auto p-4 rounded-xl bg-white border border-[#EAE6DF] text-xs text-left space-y-2 font-mono">
                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-400">Candidate:</span>
                  <span className="text-gray-800 font-bold">{submissionSuccess.name}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-400">Position:</span>
                  <span className="text-gray-800 font-bold">{submissionSuccess.position}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-400">Contact:</span>
                  <span className="text-gray-800">+91 {submissionSuccess.mobile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Initial Status:</span>
                  <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded">Under Review</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/91${PHONE_NUMBER}?text=Hello%20Concave%20Realty%20Talent%20Acquisition%2C%20I%20have%20submitted%20my%20application%20(Ref%3A%20${submissionSuccess.id})%20for%20${encodeURIComponent(submissionSuccess.position)}%20and%20would%20like%20to%20connect.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>WhatsApp Talent Desk</span>
                </a>

                <button
                  onClick={() => setSubmissionSuccess(null)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white border border-[#EAE6DF] hover:border-[#14221F] text-xs font-semibold uppercase tracking-wider text-gray-700 transition-colors"
                >
                  Submit Another Profile
                </button>
              </div>
            </div>
          ) : (
            <div className={`bg-[#FAF9F6] border ${highlightRole ? 'border-[#C59B4E] ring-2 ring-[#C59B4E]/30' : 'border-[#EAE6DF]'} rounded-2xl shadow-subtle p-6 sm:p-10 transition-all`}>
              
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
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Section 1: Candidate Contact Info */}
                <div className="space-y-4">
                  <h4 className="font-serif text-lg font-bold text-[#14221F] border-b border-[#EAE6DF] pb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#183C32] text-[#DFBE79] text-xs flex items-center justify-center font-mono">1</span>
                    <span>Personal Details & Contact</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="text-gray-700 font-semibold block">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full bg-white border border-[#EAE6DF] focus:border-[#245348] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-gray-700 font-semibold block">Official Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="rahul.sharma@example.com"
                        className="w-full bg-white border border-[#EAE6DF] focus:border-[#245348] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Mobile */}
                    <div className="space-y-1">
                      <label className="text-gray-700 font-semibold block">Mobile Number (WhatsApp Enabled) *</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-[#EAE6DF] bg-gray-50 text-gray-500 font-mono text-xs">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={formData.mobile}
                          onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                          placeholder="98201 XXXXX"
                          className="w-full bg-white border border-[#EAE6DF] focus:border-[#245348] rounded-r-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Current City / Area */}
                    <div className="space-y-1">
                      <label className="text-gray-700 font-semibold block">Current City / Micro-Market *</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="e.g. Borivali / Bandra / Mumbai"
                        className="w-full bg-white border border-[#EAE6DF] focus:border-[#245348] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-colors"
                      />
                    </div>

                  </div>
                </div>

                {/* Section 2: Professional Background & Role */}
                <div className="space-y-4 pt-2">
                  <h4 className="font-serif text-lg font-bold text-[#14221F] border-b border-[#EAE6DF] pb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#183C32] text-[#DFBE79] text-xs flex items-center justify-center font-mono">2</span>
                    <span>Applied Position & Experience</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    
                    {/* Applied Position */}
                    <div className="space-y-1">
                      <label className="text-gray-700 font-semibold block flex items-center justify-between">
                        <span>Position Applied For *</span>
                        {highlightRole && (
                          <span className="text-[10px] text-emerald-700 font-mono font-bold animate-pulse">
                            ✓ Pre-Selected
                          </span>
                        )}
                      </label>
                      <select
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        className={`w-full bg-white border ${highlightRole ? 'border-[#C59B4E] ring-2 ring-[#C59B4E]/30' : 'border-[#EAE6DF]'} focus:border-[#245348] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-colors font-semibold text-[#14221F]`}
                      >
                        {DOMAIN_OPTIONS.map((opt, idx) => (
                          <option key={idx} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Total Experience */}
                    <div className="space-y-1">
                      <label className="text-gray-700 font-semibold block">Relevant Real Estate Experience *</label>
                      <select
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        className="w-full bg-white border border-[#EAE6DF] focus:border-[#245348] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-colors"
                      >
                        <option value="Fresher / < 1 Year">Fresher / &lt; 1 Year</option>
                        <option value="1 - 3 Years">1 - 3 Years</option>
                        <option value="3 - 5 Years">3 - 5 Years</option>
                        <option value="5 - 8 Years">5 - 8 Years</option>
                        <option value="8+ Years (Leadership)">8+ Years (Leadership Profile)</option>
                      </select>
                    </div>

                    {/* Current Company */}
                    <div className="space-y-1">
                      <label className="text-gray-700 font-semibold block">Current Organization (Optional)</label>
                      <input
                        type="text"
                        value={formData.currentCompany}
                        onChange={(e) => setFormData({ ...formData, currentCompany: e.target.value })}
                        placeholder="e.g. Lodha / Anarock / Square Yards"
                        className="w-full bg-white border border-[#EAE6DF] focus:border-[#245348] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Current Designation */}
                    <div className="space-y-1">
                      <label className="text-gray-700 font-semibold block">Current Designation (Optional)</label>
                      <input
                        type="text"
                        value={formData.currentRole}
                        onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                        placeholder="e.g. Sales Executive / BDM"
                        className="w-full bg-white border border-[#EAE6DF] focus:border-[#245348] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Current CTC */}
                    <div className="space-y-1">
                      <label className="text-gray-700 font-semibold block">Current CTC (Optional)</label>
                      <input
                        type="text"
                        value={formData.currentCtc}
                        onChange={(e) => setFormData({ ...formData, currentCtc: e.target.value })}
                        placeholder="e.g. ₹5.5 LPA"
                        className="w-full bg-white border border-[#EAE6DF] focus:border-[#245348] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Expected CTC */}
                    <div className="space-y-1">
                      <label className="text-gray-700 font-semibold block">Expected CTC *</label>
                      <input
                        type="text"
                        required
                        value={formData.expectedCtc}
                        onChange={(e) => setFormData({ ...formData, expectedCtc: e.target.value })}
                        placeholder="e.g. ₹8 - 10 LPA or Negotiable"
                        className="w-full bg-white border border-[#EAE6DF] focus:border-[#245348] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Notice Period */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-gray-700 font-semibold block">Notice Period *</label>
                      <select
                        value={formData.noticePeriod}
                        onChange={(e) => setFormData({ ...formData, noticePeriod: e.target.value })}
                        className="w-full bg-white border border-[#EAE6DF] focus:border-[#245348] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-colors"
                      >
                        <option value="Immediate (< 15 Days)">Immediate (Available in &lt; 15 Days)</option>
                        <option value="30 Days">30 Days</option>
                        <option value="45 Days">45 Days</option>
                        <option value="60 Days">60 Days</option>
                        <option value="90 Days">90 Days</option>
                      </select>
                    </div>

                  </div>
                </div>

                {/* Section 3: Resume Document & Credentials */}
                <div className="space-y-4 pt-2">
                  <h4 className="font-serif text-lg font-bold text-[#14221F] border-b border-[#EAE6DF] pb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#183C32] text-[#DFBE79] text-xs flex items-center justify-center font-mono">3</span>
                    <span>Resume Document & Credentials</span>
                  </h4>

                  <div className="space-y-4 text-xs">
                    
                    {/* LinkedIn Link */}
                    <div className="space-y-1">
                      <label className="text-gray-700 font-semibold flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 fill-[#0A66C2]" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25c-.9 0-1.63.73-1.63 1.63s.73 1.63 1.63 1.63 1.63-.73 1.63-1.63-.73-1.63-1.63Z" />
                        </svg>
                        <span>LinkedIn Profile URL (Optional)</span>
                      </label>
                      <input
                        type="url"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                        placeholder="https://www.linkedin.com/in/yourprofile"
                        className="w-full bg-white border border-[#EAE6DF] focus:border-[#245348] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Resume Upload Area */}
                    <div className="space-y-1">
                      <label className="text-gray-700 font-semibold block">Upload Resume / CV (PDF or Word, max 5MB) *</label>
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleFileChange}
                        className="hidden"
                      />

                      {!attachedFile ? (
                        <div
                          onClick={() => fileInputRef.current && fileInputRef.current.click()}
                          className="border-2 border-dashed border-[#EAE6DF] hover:border-[#245348] rounded-2xl p-6 text-center cursor-pointer bg-white transition-all hover:bg-emerald-50/20 group"
                        >
                          <UploadCloud className="w-8 h-8 text-[#245348] mx-auto mb-2 group-hover:scale-110 transition-transform" />
                          <span className="font-semibold text-xs text-[#14221F] block">
                            Click to upload your Resume / CV
                          </span>
                          <span className="text-[11px] text-gray-400 block mt-0.5">
                            Supports PDF, DOC, DOCX up to 5MB
                          </span>
                        </div>
                      ) : (
                        <div className="p-3.5 rounded-xl bg-white border border-emerald-300 flex items-center justify-between shadow-xs">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <FileText className="w-5 h-5 text-emerald-700 shrink-0" />
                            <div className="min-w-0">
                              <span className="font-semibold text-xs text-[#14221F] truncate block">
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
                            className="p-1 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
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

                    {/* Cover Note / Brief Introduction */}
                    <div className="space-y-1">
                      <label className="text-gray-700 font-semibold block">Brief Cover Note / Pitch (Optional)</label>
                      <textarea
                        rows={3}
                        value={formData.coverNote}
                        onChange={(e) => setFormData({ ...formData, coverNote: e.target.value })}
                        placeholder="Highlight your previous real estate sales achievements, developer relationships, or why you want to join Concave Realty..."
                        className="w-full bg-white border border-[#EAE6DF] focus:border-[#245348] rounded-xl p-3 text-xs focus:outline-none transition-colors"
                      />
                    </div>

                  </div>
                </div>

                {/* Consent Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.consent}
                      onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                      className="mt-0.5 w-4 h-4 rounded border-[#EAE6DF] text-[#245348] focus:ring-[#245348] cursor-pointer"
                    />
                    <span className="text-xs text-gray-600 leading-snug">
                      I declare that all details submitted are genuine and authorize Concave Realty's Talent Acquisition team to review my application and contact me regarding career opportunities.
                    </span>
                  </label>
                </div>

                {/* Submit Application Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#14221F] via-[#1D3530] to-[#245348] hover:from-[#245348] hover:to-[#183C32] text-white text-xs uppercase tracking-widest font-bold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Submitting Your Application...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-[#DFBE79]" />
                        <span>Submit Career Application</span>
                      </>
                    )}
                  </button>
                </div>

              </form>

            </div>
          )}

          {/* Direct HR Connect Strip */}
          <div className="p-5 rounded-2xl bg-[#183C32] text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#C59B4E]/40 shadow-sm">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-full bg-[#14221F] border border-[#C59B4E] flex items-center justify-center text-[#DFBE79] shrink-0">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <span className="font-serif text-sm font-bold text-white block">
                  Prefer Direct Executive Discussion?
                </span>
                <span className="text-[11px] text-[#D0C5B4] font-light block">
                  Reach out to our Talent Acquisition desk directly via WhatsApp or Email.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <a
                href={WHATSAPP_CAREERS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-xs"
              >
                <span>WhatsApp HR</span>
              </a>
              <a
                href={`mailto:${EMAIL_ADDRESS}?subject=Concave%20Realty%20Career%20Application`}
                className="px-4 py-2 rounded-lg bg-[#245348] hover:bg-[#1B3F37] text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Mail className="w-3.5 h-3.5 text-[#DFBE79]" />
                <span>Email CV</span>
              </a>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

export default CareerPage;
