import React, { useState, useRef } from 'react';
import {
  Briefcase,
  Award,
  TrendingUp,
  Users,
  ShieldCheck,
  Building2,
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
  ExternalLink,
  ChevronRight,
  Send,
  Compass
} from 'lucide-react';
import { dbStore, sanitizeInput, checkRateLimit } from '../data/dbStore';

const WHATSAPP_CAREERS_URL = "https://wa.me/918291090155?text=Hello%20Concave%20Realty%20HR%2C%20I%20am%20interested%20in%20career%20opportunities%20with%20your%20luxury%20real%20estate%20team.";
const EMAIL_ADDRESS = "concaverealtyindia@gmail.com";
const PHONE_NUMBER = "8291090155";

export const OPEN_POSITIONS = [
  {
    id: "pos-luxury-consultant",
    title: "Senior Luxury Real Estate Consultant",
    department: "Sales & Client Advisory",
    experience: "3 - 7 Years",
    location: "Bandra / South Mumbai / Western Suburbs",
    type: "Full-Time • On-Site",
    packageNote: "Competitive Base + Performance Incentives",
    tag: "High Priority",
    overview: "Provide dedicated client advisory for residential properties, penthouses, and sky residences across South Mumbai and the Western Suburbs. Manage buyers professionally from initial consultation to registration.",
    responsibilities: [
      "Manage primary buyer consultations and project presentations for marquee residential developments.",
      "Deliver organized site walkthroughs, presentation of floor plans, and developer payment schedules.",
      "Cultivate enduring advisory relationships with corporate executives, business owners, and families.",
      "Coordinate directly with developer sales teams (Lodha, Oberoi, Godrej, Kalpataru)."
    ],
    requirements: [
      "Minimum 3+ years experience in primary luxury residential sales in Western Suburbs or South Mumbai.",
      "Polished interpersonal presence with deep familiarity with Mumbai's premium real estate micro-markets.",
      "Sound understanding of MahaRERA compliance, home loan structures, and legal property registration."
    ]
  },
  {
    id: "pos-nri-specialist",
    title: "NRI & Global Investor Portfolio Specialist",
    department: "International Advisory Desk",
    experience: "2 - 6 Years",
    location: "Mumbai HQ (Global Desk / Hybrid)",
    type: "Full-Time",
    packageNote: "Competitive Base + Performance Incentives",
    tag: "Global Desk",
    overview: "Advise non-resident Indians and global expats across Dubai, Singapore, the US, and UK seeking prime residential properties and verified assets in Mumbai.",
    responsibilities: [
      "Conduct virtual video walkthroughs, digital portfolio presentations, and market briefings for NRIs.",
      "Guide global buyers on NRE/NRO banking transactions, FEMA compliance, and repatriation norms.",
      "Manage time-zone responsive communication across WhatsApp, video conferences, and correspondence.",
      "Assist with document coordination, builder agreement review, and registration diligence."
    ],
    requirements: [
      "2+ years experience handling cross-border or NRI real estate consultations.",
      "Exceptional verbal and written communication with international client-handling acumen.",
      "Comfort with digital presentation tools and remote closing workflows."
    ]
  },
  {
    id: "pos-builder-alliances",
    title: "Channel Partner & Builder Alliances Lead",
    department: "Strategic Developer Relations",
    experience: "4 - 8 Years",
    location: "Mumbai Corporate Office",
    type: "Full-Time",
    packageNote: "Competitive Base + Annual Performance Bonus",
    tag: "Key Leadership",
    overview: "Build and fortify relationships with Tier-1 developer marketing and sales teams (Lodha, Godrej, Rustomjee, Adani, Raymond, DLF). Coordinate priority project inventory access and pre-launch previews.",
    responsibilities: [
      "Serve as the primary liaison between Concave Realty and Tier-1 developer sales teams.",
      "Coordinate verified inventory access, pricing updates, and authorized marketing collateral.",
      "Track new project launches, RERA registration timelines, and micro-market supply pipelines.",
      "Equip our advisory and caller teams with up-to-date pricing grids, payment plans, and promotional offers."
    ],
    requirements: [
      "Proven track record of managing relationships with top Mumbai real estate developers.",
      "Strong commercial coordination skills and professional industry network.",
      "Deep analytical grasp of Mumbai real estate supply trends, absorption rates, and developer credibility."
    ]
  },
  {
    id: "pos-tele-advisory",
    title: "Inbound Client Tele-Advisory Executive",
    department: "Caller & Inbound Operations",
    experience: "1 - 4 Years",
    location: "Borivali / Goregaon Office",
    type: "Full-Time",
    packageNote: "Industry Standard Base + Site-Visit & Booking Incentives",
    tag: "Immediate Hiring",
    overview: "Engage with homebuyers submitting inquiries across Concave Realty's digital channels. Understand their lifestyle aspirations, budget criteria, and coordinate property site visits with our consultants.",
    responsibilities: [
      "Connect promptly with verified inbound property inquiries received through our platform.",
      "Qualify buyer preferences: location choice (Borivali to Lower Parel), BHK configuration, and budget range.",
      "Schedule and coordinate site visits between clients and our field portfolio managers.",
      "Maintain real-time call disposition logs and CRM updates in our internal portal."
    ],
    requirements: [
      "1+ years experience in real estate inside sales, tele-advisory, or premium banking voice processes.",
      "Fluent communication in English, Hindi, and Marathi/Gujarati is an advantage.",
      "Professional telephone etiquette and customer-centric mindset."
    ]
  },
  {
    id: "pos-digital-growth",
    title: "Real Estate Digital Growth & Media Strategist",
    department: "Brand & Performance Marketing",
    experience: "2 - 5 Years",
    location: "Mumbai HQ",
    type: "Full-Time",
    packageNote: "Competitive Base + Performance Milestone Bonuses",
    tag: "Creative & Tech",
    overview: "Drive the digital presence of Concave Realty. Lead real estate performance advertising, organic search visibility, and architectural video presentation to connect with verified buyers.",
    responsibilities: [
      "Manage Google Search, Meta, and professional acquisition funnels for Mumbai property inquiries.",
      "Oversee architectural photography, video walkthrough editing, and informational social media content.",
      "Optimize local SEO and relevant buyer search queries across Western Suburbs and South Mumbai.",
      "Analyze campaign performance, conversion metrics, and optimize digital outreach."
    ],
    requirements: [
      "Experience running digital campaigns in real estate or high-ticket consumer sectors.",
      "Hands-on expertise with Meta Ads Manager, Google Ads, GA4, and search engine optimization.",
      "Eye for premium design, typographic balance, and accurate architectural presentation."
    ]
  }
];

export function CareerPage({ onNavigateHome, onOpenEnquiry }) {
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedRoleForForm, setSelectedRoleForForm] = useState(OPEN_POSITIONS[0].title);
  
  // Application Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    city: 'Mumbai',
    position: OPEN_POSITIONS[0].title,
    experience: '3 - 5 Years',
    currentCompany: '',
    currentRole: '',
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

  const formRef = useRef(null);
  const fileInputRef = useRef(null);

  const departments = ['All', 'Sales & Client Advisory', 'International Advisory Desk', 'Strategic Developer Relations', 'Caller & Inbound Operations', 'Brand & Performance Marketing'];

  const filteredPositions = selectedDepartment === 'All'
    ? OPEN_POSITIONS
    : OPEN_POSITIONS.filter(p => p.department === selectedDepartment);

  const handleApplyClick = (roleTitle) => {
    setSelectedRoleForForm(roleTitle);
    setFormData(prev => ({ ...prev, position: roleTitle }));
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Allowed extensions: pdf, doc, docx
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type) && !/\.(pdf|doc|docx)$/i.test(file.name)) {
      setFileError('Please upload a valid PDF or Word document (.pdf, .doc, .docx).');
      setAttachedFile(null);
      return;
    }

    // Size limit: 5 MB
    if (file.size > 5 * 1024 * 1024) {
      setFileError('File size exceeds 5 MB. Please upload a smaller document.');
      setAttachedFile(null);
      return;
    }

    setFileError('');
    setAttachedFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    // Spam honeypot
    if (honeypot) {
      return;
    }

    // Validation
    const cleanName = sanitizeInput(formData.name.trim(), 100);
    const cleanEmail = sanitizeInput(formData.email.trim(), 120);
    const cleanMobile = formData.mobile.replace(/\D/g, '');

    if (!cleanName || cleanName.length < 2) {
      setFormError('Please enter your full official name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setFormError('Please provide a valid corporate or personal email address.');
      return;
    }

    if (cleanMobile.length !== 10) {
      setFormError('Please provide a valid 10-digit Indian mobile number.');
      return;
    }

    if (!formData.consent) {
      setFormError('Please accept the data privacy declaration to proceed.');
      return;
    }

    // Rate limiting: max 3 applications per hour
    const rateCheck = checkRateLimit(cleanMobile, 'careers');
    if (!rateCheck.allowed) {
      setFormError(rateCheck.message);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const result = dbStore.addJobApplication({
          name: cleanName,
          email: cleanEmail,
          mobile: cleanMobile,
          city: formData.city,
          position: formData.position,
          experience: formData.experience,
          currentCompany: formData.currentCompany,
          currentRole: formData.currentRole,
          expectedCtc: formData.expectedCtc,
          noticePeriod: formData.noticePeriod,
          linkedin: formData.linkedin,
          coverNote: formData.coverNote,
          resumeName: attachedFile ? attachedFile.name : 'Candidate_Profile_Summary.pdf',
          resumeSize: attachedFile ? `${(attachedFile.size / (1024 * 1024)).toFixed(1)} MB` : '1.2 MB'
        });

        if (result && result.success) {
          setSubmissionSuccess(result.application);
        } else {
          setFormError(result.error || 'Failed to submit application. Please try again.');
        }
      } catch (err) {
        console.error('Career application submission failed:', err);
        setFormError('A system error occurred. Please reach out to our HR desk directly on WhatsApp.');
      } finally {
        setIsSubmitting(false);
      }
    }, 600);
  };

  const handleResetForm = () => {
    setSubmissionSuccess(null);
    setFormData({
      name: '',
      email: '',
      mobile: '',
      city: 'Mumbai',
      position: OPEN_POSITIONS[0].title,
      experience: '3 - 5 Years',
      currentCompany: '',
      currentRole: '',
      expectedCtc: '',
      noticePeriod: '30 Days',
      linkedin: '',
      coverNote: '',
      consent: false
    });
    setAttachedFile(null);
    setFileError('');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#14221F]">

      {/* ============================================================== */}
      {/* 1. HERO BANNER: LUXURY BRANDING & CALL TO LEGACY               */}
      {/* ============================================================== */}
      <section className="relative pt-24 sm:pt-28 pb-16 sm:pb-24 bg-[#14221F] text-white overflow-hidden border-b border-[#C59B4E]/30">
        {/* Subtle Ambient Background Gradients */}
        <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 bg-[#C59B4E]/15 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 bg-[#245348]/30 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          
          {/* Statutory MahaRERA Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#183C32] border border-[#C59B4E]/50 text-[10px] sm:text-[11px] font-mono text-[#DFBE79] shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-[#DFBE79]" />
            <span>MahaRERA: A51900045781 • Careers & Talent Acquisition</span>
          </div>

          {/* Heading */}
          <div className="space-y-3 max-w-4xl mx-auto">
            <span className="text-xs uppercase tracking-[0.3em] text-[#DFBE79] font-semibold block font-mono">
              JOIN CONCAVE REALTY
            </span>
            <h1 
              className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F7F3EB] leading-tight"
              style={{ fontFamily: '"Cormorant Garamond", Cinzel, serif' }}
            >
              Shape Mumbai's Skylines. <br className="hidden sm:inline" />
              Build Your Career Legacy.
            </h1>
            <p className="text-xs sm:text-base text-[#D0C5B4] font-light max-w-2xl mx-auto leading-relaxed pt-2">
              Explore rewarding career opportunities in Mumbai's luxury real estate sector. Collaborate with leading developers and provide professional, RERA-compliant advisory to prospective homebuyers.
            </p>
          </div>

          {/* Dual Action CTA Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => {
                const el = document.getElementById('open-positions-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 sm:px-8 py-3 rounded-xl bg-gradient-to-r from-[#DFBE79] via-[#C59B4E] to-[#B3883B] hover:from-[#EBD296] hover:to-[#C59B4E] text-[#14221F] font-bold text-xs uppercase tracking-widest shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <span>Explore Openings</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (formRef.current) formRef.current.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 sm:px-8 py-3 rounded-xl bg-[#1D3530] hover:bg-[#284F45] text-white border border-[#C59B4E]/60 text-xs uppercase tracking-widest font-semibold transition-all shadow-sm hover:border-[#DFBE79] cursor-pointer flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-[#DFBE79]" />
              <span>Apply Online</span>
            </button>
          </div>

          {/* Real Estate Professional Metrics Banner */}
          <div className="pt-8 sm:pt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#183C32]/80 border border-[#C59B4E]/30 text-center">
              <span className="block font-serif text-2xl sm:text-3xl font-bold text-[#DFBE79]">8+</span>
              <span className="text-[10px] sm:text-xs text-gray-300 uppercase tracking-wider font-mono">Micro-Markets</span>
            </div>
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#183C32]/80 border border-[#C59B4E]/30 text-center">
              <span className="block font-serif text-2xl sm:text-3xl font-bold text-[#DFBE79]">43+</span>
              <span className="text-[10px] sm:text-xs text-gray-300 uppercase tracking-wider font-mono">Curated Projects</span>
            </div>
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#183C32]/80 border border-[#C59B4E]/30 text-center">
              <span className="block font-serif text-2xl sm:text-3xl font-bold text-[#DFBE79]">Tier-1</span>
              <span className="text-[10px] sm:text-xs text-gray-300 uppercase tracking-wider font-mono">Developer Network</span>
            </div>
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#183C32]/80 border border-[#C59B4E]/30 text-center">
              <span className="block font-serif text-xl sm:text-2xl font-bold text-[#DFBE79] truncate">A51900045781</span>
              <span className="text-[10px] sm:text-xs text-gray-300 uppercase tracking-wider font-mono">MahaRERA Registered</span>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. THE CONCAVE ADVANTAGE: WHY JOIN OUR ADVISORY TEAM           */}
      {/* ============================================================== */}
      <section className="py-16 sm:py-24 bg-white border-b border-[#EAE6DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-[0.28em] text-[#C59B4E] font-semibold block font-mono">
              THE CONCAVE ADVANTAGE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#14221F] tracking-tight">
              Why Build Your Career at Concave Realty
            </h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#C59B4E] to-transparent mx-auto mt-2" />
            <p className="text-xs sm:text-sm text-gray-500 font-light max-w-xl mx-auto pt-1 leading-relaxed">
              We empower real estate professionals with direct developer inventory access, structured operational support, and a collaborative team culture.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Advantage 1 */}
            <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-[#EAE6DF] hover:border-[#C59B4E] transition-all hover:-translate-y-1 group space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#1D3530] text-[#DFBE79] flex items-center justify-center group-hover:scale-105 transition-transform">
                <IndianRupee className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#14221F] group-hover:text-[#245348] transition-colors">
                Structured Earnings & Incentives
              </h3>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                Enjoy transparent base compensation paired with clear performance-linked incentives on successful property closings and timely disbursements.
              </p>
            </div>

            {/* Advantage 2 */}
            <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-[#EAE6DF] hover:border-[#C59B4E] transition-all hover:-translate-y-1 group space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#1D3530] text-[#DFBE79] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#14221F] group-hover:text-[#245348] transition-colors">
                Tier-1 Developer Projects
              </h3>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                Present Mumbai's reputed developers: Lodha, Godrej, Oberoi Realty, Kalpataru, Rustomjee, Adani, Raymond, and DLF.
              </p>
            </div>

            {/* Advantage 3 */}
            <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-[#EAE6DF] hover:border-[#C59B4E] transition-all hover:-translate-y-1 group space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#1D3530] text-[#DFBE79] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#14221F] group-hover:text-[#245348] transition-colors">
                Homebuyers & NRI Network
              </h3>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                Advise corporate executives, business owners, and non-resident Indian families looking for verified residences in Mumbai.
              </p>
            </div>

            {/* Advantage 4 */}
            <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-[#EAE6DF] hover:border-[#C59B4E] transition-all hover:-translate-y-1 group space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#1D3530] text-[#DFBE79] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#14221F] group-hover:text-[#245348] transition-colors">
                Digital Platform & CRM
              </h3>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                Access our digital property catalog, virtual walkthrough tools, and lead management CRM to serve clients professionally.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. CURRENT OPEN POSITIONS (CURATED LUXURY ROLES)               */}
      {/* ============================================================== */}
      <section id="open-positions-section" className="py-16 sm:py-24 bg-[#FAF9F6] border-b border-[#EAE6DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.28em] text-[#C59B4E] font-semibold block font-mono">
                OPPORTUNITIES
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#14221F] tracking-tight mt-1">
                Current Open Positions
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-light mt-1">
                Showing {filteredPositions.length} active opportunities across Mumbai.
              </p>
            </div>

            {/* Department Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                    selectedDepartment === dept
                      ? 'bg-[#1D3530] text-[#DFBE79] border border-[#C59B4E]/60 shadow-xs font-semibold'
                      : 'bg-white text-gray-600 border border-[#EAE6DF] hover:border-[#C59B4E]/40'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Job Openings Grid */}
          <div className="space-y-6">
            {filteredPositions.map((pos) => (
              <div 
                key={pos.id}
                className="bg-white rounded-2xl border border-[#EAE6DF] hover:border-[#C59B4E] p-6 sm:p-8 transition-all duration-300 shadow-sm hover:shadow-md space-y-5 group"
              >
                {/* Header row */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#183C32] text-[#DFBE79] text-[10px] font-mono font-semibold uppercase tracking-wider">
                        {pos.department}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-mono font-bold">
                        {pos.tag}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl font-bold text-[#14221F] group-hover:text-[#245348] transition-colors">
                      {pos.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleApplyClick(pos.title)}
                    className="self-start lg:self-center px-5 py-2.5 rounded-xl bg-[#245348] hover:bg-[#1B3F37] text-white text-xs uppercase tracking-wider font-semibold transition-all shadow-xs flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <span>Apply For This Role</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#DFBE79]" />
                  </button>
                </div>

                {/* Key metadata pills */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-gray-600 font-mono pt-1 pb-1 border-y border-[#EAE6DF]">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#C59B4E]" />
                    <span>{pos.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#C59B4E]" />
                    <span>{pos.type}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-[#C59B4E]" />
                    <span>Experience: {pos.experience}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#245348] font-bold">
                    <IndianRupee className="w-4 h-4 text-[#C59B4E]" />
                    <span>{pos.packageNote}</span>
                  </div>
                </div>

                {/* Role Overview */}
                <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                  {pos.overview}
                </p>

                {/* Responsibilities & Requirements dual grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EAE6DF] space-y-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-gray-500 font-semibold block">
                      Key Responsibilities:
                    </span>
                    <ul className="space-y-1.5 text-xs text-gray-600 font-light">
                      {pos.responsibilities.map((r, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#245348] shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EAE6DF] space-y-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-gray-500 font-semibold block">
                      Candidate Profile Requirements:
                    </span>
                    <ul className="space-y-1.5 text-xs text-gray-600 font-light">
                      {pos.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-[#C59B4E] shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. APPLICATION FORM: MULTI-STEP LUXURY CANDIDATE APPLICATION   */}
      {/* ============================================================== */}
      <section ref={formRef} className="py-16 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-[0.28em] text-[#C59B4E] font-semibold block font-mono">
              TALENT APPLICATION
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#14221F] tracking-tight">
              Submit Your Candidature
            </h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#C59B4E] to-transparent mx-auto mt-2" />
            <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed">
              Complete your profile details below. Our talent acquisition committee reviews every application with strict confidentiality within 48 hours.
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-[#FAF9F6] rounded-2xl border border-[#EAE6DF] shadow-md p-6 sm:p-10">

            {submissionSuccess ? (
              /* Success Confirmation Banner */
              <div className="py-8 text-center space-y-5 animate-fade-up">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-700 mx-auto flex items-center justify-center border-2 border-emerald-500">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                
                <div className="space-y-2">
                  <span className="text-xs uppercase font-mono tracking-widest text-[#C59B4E] font-bold block">
                    APPLICATION SUBMITTED SUCCESSFULLY
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#14221F]">
                    Thank You, {submissionSuccess.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto font-light leading-relaxed">
                    Your profile for <strong>{submissionSuccess.position}</strong> has been assigned application tracking number:
                  </p>
                  <div className="inline-block px-4 py-1.5 rounded-lg bg-[#183C32] text-[#DFBE79] font-mono text-sm font-bold border border-[#C59B4E]">
                    {submissionSuccess.id}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#EAE6DF] max-w-md mx-auto text-xs text-gray-600 text-left space-y-2">
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Application status: <strong className="text-emerald-700">Under Review</strong></span>
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Our HR team will reach out via phone & email within 48 hours.</span>
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={WHATSAPP_CAREERS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs uppercase tracking-wider font-semibold transition-all shadow-sm flex items-center gap-2"
                  >
                    <span>Connect with HR on WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={handleResetForm}
                    className="px-5 py-2.5 rounded-xl bg-[#183C32] hover:bg-[#245348] text-[#DFBE79] text-xs uppercase tracking-wider font-semibold transition-all shadow-sm"
                  >
                    Submit Another Application
                  </button>
                </div>
              </div>
            ) : (
              /* Candidate Form */
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Error Banner */}
                {formError && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Honeypot for Bot Prevention */}
                <input
                  type="text"
                  name="user_corporate_website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                {/* Section 1: Personal & Contact Information */}
                <div className="space-y-4">
                  <h4 className="font-serif text-lg font-bold text-[#14221F] border-b border-[#EAE6DF] pb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#183C32] text-[#DFBE79] text-xs flex items-center justify-center font-mono">1</span>
                    <span>Personal & Contact Information</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
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

                    <div className="space-y-1">
                      <label className="text-gray-700 font-semibold block">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. rahul.sharma@example.com"
                        className="w-full bg-white border border-[#EAE6DF] focus:border-[#245348] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-700 font-semibold block">Mobile / WhatsApp Number *</label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        placeholder="10-digit mobile number"
                        className="w-full bg-white border border-[#EAE6DF] focus:border-[#245348] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-colors font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-700 font-semibold block">Current Residential Suburb / City *</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="e.g. Andheri West, Mumbai"
                        className="w-full bg-white border border-[#EAE6DF] focus:border-[#245348] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Professional Background & Role Selection */}
                <div className="space-y-4 pt-4">
                  <h4 className="font-serif text-lg font-bold text-[#14221F] border-b border-[#EAE6DF] pb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#183C32] text-[#DFBE79] text-xs flex items-center justify-center font-mono">2</span>
                    <span>Role & Professional Background</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    
                    {/* Role Selection Dropdown */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-gray-700 font-semibold block">Position Applied For *</label>
                      <select
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        className="w-full bg-white border border-[#EAE6DF] focus:border-[#245348] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-colors font-medium text-[#14221F]"
                      >
                        {OPEN_POSITIONS.map(p => (
                          <option key={p.id} value={p.title}>
                            {p.title} ({p.department})
                          </option>
                        ))}
                        <option value="General Candidature / Other">General Candidature / Other Luxury Role</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-700 font-semibold block">Relevant Sales / Real Estate Experience *</label>
                      <select
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        className="w-full bg-white border border-[#EAE6DF] focus:border-[#245348] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-colors"
                      >
                        <option value="Fresher / < 1 Year">Fresher / &lt; 1 Year</option>
                        <option value="1 - 3 Years">1 - 3 Years</option>
                        <option value="3 - 5 Years">3 - 5 Years</option>
                        <option value="5 - 8 Years">5 - 8 Years</option>
                        <option value="8+ Years">8+ Years (Leadership Profile)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-700 font-semibold block">Notice Period / Earliest Joining *</label>
                      <select
                        value={formData.noticePeriod}
                        onChange={(e) => setFormData({ ...formData, noticePeriod: e.target.value })}
                        className="w-full bg-white border border-[#EAE6DF] focus:border-[#245348] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-colors"
                      >
                        <option value="Immediate">Immediate</option>
                        <option value="15 Days">15 Days</option>
                        <option value="30 Days">30 Days</option>
                        <option value="60 Days">60 Days</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-700 font-semibold block">Current / Most Recent Organization</label>
                      <input
                        type="text"
                        value={formData.currentCompany}
                        onChange={(e) => setFormData({ ...formData, currentCompany: e.target.value })}
                        placeholder="e.g. Anarock, Knight Frank, Lodha, or Self-Employed"
                        className="w-full bg-white border border-[#EAE6DF] focus:border-[#245348] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-700 font-semibold block">Current Designation</label>
                      <input
                        type="text"
                        value={formData.currentRole}
                        onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                        placeholder="e.g. Sales Manager, Associate Consultant"
                        className="w-full bg-white border border-[#EAE6DF] focus:border-[#245348] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-gray-700 font-semibold block">Expected Annual CTC / Compensation Range</label>
                      <input
                        type="text"
                        value={formData.expectedCtc}
                        onChange={(e) => setFormData({ ...formData, expectedCtc: e.target.value })}
                        placeholder="e.g. ₹10 LPA Fixed + Commission, or Open for Discussion"
                        className="w-full bg-white border border-[#EAE6DF] focus:border-[#245348] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-colors"
                      />
                    </div>

                  </div>
                </div>

                {/* Section 3: Resume Attachment & Profile Links */}
                <div className="space-y-4 pt-4">
                  <h4 className="font-serif text-lg font-bold text-[#14221F] border-b border-[#EAE6DF] pb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#183C32] text-[#DFBE79] text-xs flex items-center justify-center font-mono">3</span>
                    <span>Resume Attachment & Pitch</span>
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
                    <div className="space-y-1.5">
                      <label className="text-gray-700 font-semibold block">Resume / Curriculum Vitae (.pdf, .doc, max 5MB)</label>
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleFileChange}
                        className="hidden"
                      />

                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`p-5 rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-2 ${
                          attachedFile 
                            ? 'bg-emerald-50/60 border-emerald-400' 
                            : 'bg-white border-[#EAE6DF] hover:border-[#C59B4E]'
                        }`}
                      >
                        {attachedFile ? (
                          <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-emerald-600" />
                            <div className="text-left min-w-0">
                              <span className="font-semibold text-xs text-gray-800 block truncate">{attachedFile.name}</span>
                              <span className="text-[10px] text-gray-500 font-mono">{(attachedFile.size / 1024).toFixed(1)} KB • Attached</span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAttachedFile(null);
                              }}
                              className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 ml-2"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <UploadCloud className="w-8 h-8 text-[#C59B4E]" />
                            <div>
                              <span className="font-semibold text-xs text-[#14221F] block">
                                Click to upload your resume
                              </span>
                              <span className="text-[11px] text-gray-500 font-light">
                                PDF, DOCX or DOC formats accepted (Max 5 MB)
                              </span>
                            </div>
                          </>
                        )}
                      </div>

                      {fileError && (
                        <p className="text-[11px] text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{fileError}</span>
                        </p>
                      )}
                    </div>

                    {/* Brief Introduction / Pitch */}
                    <div className="space-y-1">
                      <label className="text-gray-700 font-semibold block">Brief Introduction / Pitch (Optional)</label>
                      <textarea
                        rows={3}
                        value={formData.coverNote}
                        onChange={(e) => setFormData({ ...formData, coverNote: e.target.value })}
                        placeholder="Tell us about your most proud real estate deal, client relationship success, or what excites you about joining Concave Realty..."
                        className="w-full bg-white border border-[#EAE6DF] focus:border-[#245348] rounded-xl p-3 text-xs focus:outline-none transition-colors"
                      />
                    </div>

                  </div>
                </div>

                {/* Section 4: Privacy & Consent */}
                <div className="pt-2 border-t border-[#EAE6DF]">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-gray-600">
                    <input
                      type="checkbox"
                      required
                      checked={formData.consent}
                      onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                      className="mt-0.5 rounded border-gray-300 text-[#245348] focus:ring-[#245348]"
                    />
                    <span>
                      I declare that all information provided is accurate and grant Concave Realty consent to review my profile for employment opportunities in compliance with India's <strong>DPDP Act, 2023</strong>.
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#14221F] via-[#1D3530] to-[#245348] hover:from-[#245348] hover:to-[#183C32] text-white text-xs uppercase tracking-widest font-bold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Submitting Candidature...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-[#DFBE79]" />
                        <span>Submit Application to HR Desk</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}

          </div>

          {/* Hiring Workflow Steps */}
          <div className="p-6 rounded-2xl bg-white border border-[#EAE6DF] space-y-4">
            <h4 className="font-serif text-lg font-bold text-[#14221F] text-center">
              Our 4-Stage Executive Hiring Process
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EAE6DF] space-y-1">
                <span className="w-6 h-6 rounded-full bg-[#183C32] text-[#DFBE79] text-xs font-mono font-bold mx-auto flex items-center justify-center">1</span>
                <span className="font-semibold text-xs block text-[#14221F]">Profile Screening</span>
                <span className="text-[11px] text-gray-500 font-light block">Evaluation within 48 hours</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EAE6DF] space-y-1">
                <span className="w-6 h-6 rounded-full bg-[#183C32] text-[#DFBE79] text-xs font-mono font-bold mx-auto flex items-center justify-center">2</span>
                <span className="font-semibold text-xs block text-[#14221F]">Talent Discovery</span>
                <span className="text-[11px] text-gray-500 font-light block">Telephonic alignment & credentials</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EAE6DF] space-y-1">
                <span className="w-6 h-6 rounded-full bg-[#183C32] text-[#DFBE79] text-xs font-mono font-bold mx-auto flex items-center justify-center">3</span>
                <span className="font-semibold text-xs block text-[#14221F]">Leadership Discussion</span>
                <span className="text-[11px] text-gray-500 font-light block">In-person interview with Partners</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EAE6DF] space-y-1">
                <span className="w-6 h-6 rounded-full bg-[#183C32] text-[#DFBE79] text-xs font-mono font-bold mx-auto flex items-center justify-center">4</span>
                <span className="font-semibold text-xs block text-[#14221F]">Offer & Onboarding</span>
                <span className="text-[11px] text-gray-500 font-light block">Executive contract & welcome</span>
              </div>
            </div>
          </div>

          {/* Direct HR Queries Card */}
          <div className="p-5 rounded-2xl bg-[#183C32] text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#C59B4E]/40">
            <div className="space-y-1 text-center sm:text-left">
              <span className="font-serif text-lg font-bold block text-[#F7F3EB]">
                Have questions regarding careers at Concave Realty?
              </span>
              <p className="text-xs text-[#D0C5B4] font-light">
                Reach out directly to our HR & Talent Acquisition desk.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={WHATSAPP_CAREERS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>WhatsApp HR</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={`mailto:${EMAIL_ADDRESS}?subject=Career%20Inquiry%20-%20Concave%20Realty`}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#DFBE79] hover:text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all border border-white/20"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email HR</span>
              </a>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

export default CareerPage;
