import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, 
  CheckCircle2, 
  MapPin, 
  Building2, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Mail, 
  User, 
  Phone, 
  FileText, 
  ChevronRight, 
  Home, 
  ArrowLeft,
  MessageSquare,
  Lock,
  Layers,
  Award
} from 'lucide-react';
import { dbStore, LOCATION_CODES, checkRateLimit, sanitizeInput } from '../data/dbStore';
import { PROJECTS_DATA, LOCATIONS_LIST } from '../data/projectsData';

export function EnquiryPage({ initialData = {}, onNavigateHome, onNavigateProjects }) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    mobile: initialData.mobile || '',
    email: initialData.email || '',
    locationName: initialData.location || 'Borivali',
    projectName: initialData.projectName || 'Kalpataru Advay',
    configuration: initialData.configuration || '3 BHK',
    consultationType: 'Site Visit & Tour',
    preferredDate: '',
    timeSlot: 'Morning (10:00 AM - 1:00 PM)',
    description: ''
  });

  const [submittedLead, setSubmittedLead] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [dpdpTermsOpen, setDpdpTermsOpen] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [securityError, setSecurityError] = useState('');

  // Sync when initialData changes
  useEffect(() => {
    if (initialData.projectName || initialData.location) {
      setFormData(prev => ({
        ...prev,
        projectName: initialData.projectName || prev.projectName,
        locationName: initialData.location || prev.locationName,
        configuration: initialData.configuration || prev.configuration
      }));
    }
  }, [initialData]);

  // Selected project reference object if available
  const selectedProjObj = PROJECTS_DATA.find(
    p => p.name.toLowerCase() === formData.projectName.toLowerCase()
  ) || PROJECTS_DATA[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSecurityError('');

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

    if (!consentGiven) {
      alert("Please accept the Terms and Conditions to proceed.");
      return;
    }

    // Rate limit check: 5 enquiries per 4 hours
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
          type: `${formData.consultationType} (${formData.configuration})`,
          description: `Time slot: ${formData.timeSlot} | Date: ${formData.preferredDate || 'Earliest available'} | Note: ${sanitizeInput(formData.description, 300)}`,
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

  return (
    <div className="bg-[#FAF9F6] text-[#14221F] min-h-screen pt-20">
      
      {/* ============================================================== */}
      {/* PAGE HERO BANNER & BREADCRUMBS                                 */}
      {/* ============================================================== */}
      <div className="bg-[#14221F] text-white pt-8 pb-12 border-b border-[#284F45]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400 font-mono">
            <button 
              onClick={onNavigateHome}
              className="hover:text-[#C59B4E] transition-colors flex items-center gap-1"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <ChevronRight className="w-3 h-3 text-[#C59B4E]" />
            <button 
              onClick={onNavigateProjects}
              className="hover:text-[#C59B4E] transition-colors"
            >
              Our Projects
            </button>
            <ChevronRight className="w-3 h-3 text-[#C59B4E]" />
            <span className="text-[#C59B4E] font-semibold">Book Consultation</span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#C59B4E] font-semibold font-mono block">
              DIRECT DEVELOPER ADVISORY
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Project Consultation & Site Booking
            </h1>
            <p className="text-sm text-gray-300 font-light max-w-2xl leading-relaxed">
              Connect with our authorized micro-market advisors for verified pricing, confidential floor plans, unit allocations, and private site tours.
            </p>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-3 flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-gray-300 font-mono border-t border-white/10">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>MahaRERA Registered Collateral</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#DFBE79]" />
              <span>4-Hour Advisor Response Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#C59B4E]" />
              <span>100% Confidential & Secure</span>
            </div>
          </div>

        </div>
      </div>

      {/* ============================================================== */}
      {/* MAIN ENQUIRY CONTENT AREA                                      */}
      {/* ============================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {submittedLead ? (
          /* SUCCESS SCREEN */
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#EAE6DF] shadow-xl p-8 sm:p-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#245348] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-semibold">
                ENQUIRY RECORDED • REF #{submittedLead.id || 'CNCV-LEAD'}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#14221F]">
                Consultation Request Confirmed
              </h2>
              <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.name}</strong>. Your enquiry for <strong>{formData.projectName}</strong> ({formData.locationName}) has been routed to our senior advisory desk.
              </p>
            </div>

            {/* Summary Box */}
            <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#EAE6DF] text-xs text-left grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] uppercase text-gray-400 block font-mono">Project</span>
                <span className="font-semibold text-[#14221F] mt-0.5 block">{formData.projectName}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-gray-400 block font-mono">Location</span>
                <span className="font-semibold text-[#14221F] mt-0.5 block">{formData.locationName}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-gray-400 block font-mono">Typology</span>
                <span className="font-semibold text-[#14221F] mt-0.5 block">{formData.configuration}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-gray-400 block font-mono">Consultation</span>
                <span className="font-semibold text-[#14221F] mt-0.5 block">{formData.consultationType}</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <span>An authorized relationship manager will contact you at <strong>+91 {formData.mobile}</strong>.</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={onNavigateProjects}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#245348] hover:bg-[#1B3F37] text-white text-xs uppercase tracking-wider font-semibold transition-all shadow-md"
              >
                Explore More Projects
              </button>
              <button
                onClick={() => setSubmittedLead(null)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#14221F] hover:bg-[#14221F] hover:text-white text-xs uppercase tracking-wider font-semibold transition-colors"
              >
                Submit Another Enquiry
              </button>
            </div>
          </div>
        ) : (
          /* MAIN TWO-COLUMN ENQUIRY GRID */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Selected Project Preview Card & Advisor Contact Info (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Selected Project Card */}
              <div className="bg-white rounded-2xl border border-[#EAE6DF] overflow-hidden shadow-sm">
                <div className="relative h-48 overflow-hidden bg-gray-900">
                  <img
                    src={selectedProjObj.coverImage}
                    alt={selectedProjObj.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider text-[#14221F]">
                    {selectedProjObj.locality || selectedProjObj.location}
                  </div>
                  
                  <div className="absolute top-3 right-3 bg-[#1D3530]/90 text-[#DFBE79] px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border border-[#C59B4E]/40">
                    {selectedProjObj.builder}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-serif text-xl font-bold truncate">
                      {selectedProjObj.name}
                    </h3>
                    <p className="text-xs text-[#DFBE79] mt-0.5">
                      Indicative Quoted Price: {selectedProjObj.priceRange || selectedProjObj.priceDisplay}
                    </p>
                  </div>
                </div>

                <div className="p-5 space-y-3.5 text-xs">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 rounded bg-[#FAF9F6] border border-[#EAE6DF]">
                      <span className="text-[10px] uppercase text-gray-400 block font-mono">Configurations</span>
                      <span className="font-semibold text-[#14221F] mt-0.5 block truncate">
                        {selectedProjObj.configurations.map(c => c.bhk.split(' ')[0]).join(', ')} BHK
                      </span>
                    </div>
                    <div className="p-2 rounded bg-[#FAF9F6] border border-[#EAE6DF]">
                      <span className="text-[10px] uppercase text-gray-400 block font-mono">Possession</span>
                      <span className="font-semibold text-[#14221F] mt-0.5 block truncate">
                        {selectedProjObj.possession}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-[#FAF9F6] border border-[#EAE6DF] font-mono text-[11px] text-[#245348] flex items-center justify-between">
                    <span>MahaRERA Registration:</span>
                    <span className="font-semibold">{selectedProjObj.rera}</span>
                  </div>

                  <p className="text-gray-500 text-[11px] font-light leading-relaxed">
                    {selectedProjObj.overview}
                  </p>
                </div>
              </div>

              {/* Concave Corporate Advisory Contacts Card */}
              <div className="bg-white rounded-2xl border border-[#EAE6DF] p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#C59B4E]" />
                  <h4 className="font-serif text-base font-bold text-[#14221F]">
                    Concave Realty Advisory Desk
                  </h4>
                </div>

                <div className="space-y-3 text-xs text-gray-600">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#245348] flex-shrink-0 mt-0.5" />
                    <span>Link Road, Western Suburbs, Mumbai - 400092</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#245348] flex-shrink-0" />
                    <a href="https://wa.me/918291090155" target="_blank" rel="noopener noreferrer" className="hover:text-[#245348] transition-colors">
                      WhatsApp Business: <strong className="text-gray-900 font-semibold">+91 8291090155</strong>
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#245348] flex-shrink-0" />
                    <a href="mailto:concaverealtyindia@gmail.com" className="hover:text-[#245348] transition-colors">
                      Email: <strong className="text-gray-900 font-semibold">concaverealtyindia@gmail.com</strong>
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-[#245348] flex-shrink-0" />
                    <span>Operating Hours: 10:00 AM – 8:00 PM (All 7 Days)</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EAE6DF] text-[11px] text-gray-500 italic">
                  *Site visits are coordinated directly with developer sales offices upon prior appointment.
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: The Consultation Enquiry Form (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-[#EAE6DF] p-6 sm:p-8 shadow-sm space-y-6">
              
              <div className="border-b border-[#EAE6DF] pb-4">
                <h3 className="font-serif text-2xl font-bold text-[#14221F]">
                  Book Consultation
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Please provide your contact details to schedule a site tour or unlock confidential developer collateral.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-800 tracking-wide flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#245348]" />
                    <span>Full Name <span className="text-amber-700">*</span></span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-gray-300 focus:border-[#245348] focus:ring-2 focus:ring-[#245348]/20 rounded-lg px-3.5 py-2.5 text-sm text-[#14221F] placeholder:text-gray-400 shadow-2xs focus:outline-none transition-colors"
                  />
                </div>

                {/* Mobile Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-800 tracking-wide flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#245348]" />
                    <span>Mobile Number <span className="text-amber-700">*</span></span>
                  </label>
                  <div className="flex items-center shadow-2xs rounded-lg">
                    <span className="bg-gray-50 text-gray-700 px-3.5 py-2.5 rounded-l-lg border border-r-0 border-gray-300 font-mono text-xs font-semibold">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="98200 12345"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full bg-white border border-gray-300 focus:border-[#245348] focus:ring-2 focus:ring-[#245348]/20 rounded-r-lg px-3.5 py-2.5 text-sm text-[#14221F] placeholder:text-gray-400 focus:outline-none font-mono transition-colors"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-800 tracking-wide flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#245348]" />
                    <span>Email Address (For Official Quotation & Brochure)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="rajesh.sharma@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border border-gray-300 focus:border-[#245348] focus:ring-2 focus:ring-[#245348]/20 rounded-lg px-3.5 py-2.5 text-sm text-[#14221F] placeholder:text-gray-400 shadow-2xs focus:outline-none transition-colors"
                  />
                </div>

                {/* Micro-market & Interested Project */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-800 tracking-wide flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#245348]" />
                      <span>Micro-Market</span>
                    </label>
                    <select
                      value={formData.locationName}
                      onChange={(e) => {
                        const newLoc = e.target.value;
                        const firstProjInLoc = PROJECTS_DATA.find(p => p.location.toLowerCase() === newLoc.toLowerCase());
                        setFormData({
                          ...formData,
                          locationName: newLoc,
                          projectName: firstProjInLoc ? firstProjInLoc.name : formData.projectName
                        });
                      }}
                      className="w-full bg-white border border-gray-300 focus:border-[#245348] focus:ring-2 focus:ring-[#245348]/20 rounded-lg px-3.5 py-2.5 text-sm text-[#14221F] shadow-2xs focus:outline-none transition-colors cursor-pointer"
                    >
                      {LOCATIONS_LIST.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-800 tracking-wide flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#245348]" />
                      <span>Project Name</span>
                    </label>
                    <select
                      value={formData.projectName}
                      onChange={(e) => {
                        const proj = PROJECTS_DATA.find(p => p.name === e.target.value);
                        setFormData({
                          ...formData,
                          projectName: e.target.value,
                          locationName: proj ? proj.location : formData.locationName
                        });
                      }}
                      className="w-full bg-white border border-gray-300 focus:border-[#245348] focus:ring-2 focus:ring-[#245348]/20 rounded-lg px-3.5 py-2.5 text-sm text-[#14221F] shadow-2xs focus:outline-none transition-colors cursor-pointer"
                    >
                      {PROJECTS_DATA.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name} ({p.builder})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Typology & Consultation Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-800 tracking-wide flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#245348]" />
                      <span>Desired Typology</span>
                    </label>
                    <select
                      value={formData.configuration}
                      onChange={(e) => setFormData({ ...formData, configuration: e.target.value })}
                      className="w-full bg-white border border-gray-300 focus:border-[#245348] focus:ring-2 focus:ring-[#245348]/20 rounded-lg px-3.5 py-2.5 text-sm text-[#14221F] shadow-2xs focus:outline-none transition-colors cursor-pointer"
                    >
                      <option value="2 BHK">2 BHK Luxury</option>
                      <option value="3 BHK">3 BHK Premium / Grande</option>
                      <option value="4 BHK">4 BHK Royal Suite</option>
                      <option value="5 BHK">5 BHK Sky Bungalow</option>
                      <option value="Palatial Jodi">Palatial Jodi Layout</option>
                      <option value="Master Floor View & Unit Layout">Master Floor View & Unit Layout</option>
                      <option value="Penthouse">Penthouse Duplex</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-800 tracking-wide flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#245348]" />
                      <span>Consultation Type</span>
                    </label>
                    <select
                      value={formData.consultationType}
                      onChange={(e) => setFormData({ ...formData, consultationType: e.target.value })}
                      className="w-full bg-white border border-gray-300 focus:border-[#245348] focus:ring-2 focus:ring-[#245348]/20 rounded-lg px-3.5 py-2.5 text-sm text-[#14221F] shadow-2xs focus:outline-none transition-colors cursor-pointer"
                    >
                      <option value="Site Visit & Tour">Site Visit & Tour</option>
                      <option value="Direct Phone Callback">Direct Phone Callback (Senior Advisor)</option>
                      <option value="WhatsApp Quotation & Brochure">WhatsApp Quotation & Floor Plans</option>
                      <option value="Virtual 360° Walkthrough">Virtual 360° Guided Walkthrough</option>
                    </select>
                  </div>
                </div>

                {/* Site Visit Preferred Date & Time Slot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-800 tracking-wide flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#245348]" />
                      <span>Preferred Visit Date</span>
                    </label>
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full bg-white border border-gray-300 focus:border-[#245348] focus:ring-2 focus:ring-[#245348]/20 rounded-lg px-3.5 py-2.5 text-sm text-[#14221F] shadow-2xs focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-800 tracking-wide flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#245348]" />
                      <span>Preferred Time Window</span>
                    </label>
                    <select
                      value={formData.timeSlot}
                      onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                      className="w-full bg-white border border-gray-300 focus:border-[#245348] focus:ring-2 focus:ring-[#245348]/20 rounded-lg px-3.5 py-2.5 text-sm text-[#14221F] shadow-2xs focus:outline-none transition-colors cursor-pointer"
                    >
                      <option value="Morning (10:00 AM - 1:00 PM)">Morning (10:00 AM - 1:00 PM)</option>
                      <option value="Afternoon (1:00 PM - 4:00 PM)">Afternoon (1:00 PM - 4:00 PM)</option>
                      <option value="Evening (4:00 PM - 7:00 PM)">Evening (4:00 PM - 7:00 PM)</option>
                      <option value="Anytime (Immediate Callback)">Anytime (Immediate Callback)</option>
                    </select>
                  </div>
                </div>

                {/* Special Requests / Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-800 tracking-wide flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#245348]" />
                    <span>Special Requirements / Specific Floor Inquiries</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Higher floor sea view preferred, require official cost sheet & payment schedule..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-white border border-gray-300 focus:border-[#245348] focus:ring-2 focus:ring-[#245348]/20 rounded-lg p-3 text-sm text-[#14221F] placeholder:text-gray-400 shadow-2xs focus:outline-none transition-colors"
                  />
                </div>

                {/* Honeypot Bot Trap */}
                <input
                  type="text"
                  name="website_source_hp"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  style={{ display: 'none', position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                {/* Security Rate Limit or Error Message */}
                {securityError && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-medium">
                    {securityError}
                  </div>
                )}

                {/* Terms and Conditions Consent Checkbox */}
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#FAF9F6] border border-[#EAE6DF]">
                  <input
                    id="enq-page-consent"
                    type="checkbox"
                    required
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="w-4 h-4 accent-[#245348] cursor-pointer shrink-0 rounded"
                  />
                  <label htmlFor="enq-page-consent" className="text-xs text-gray-600 leading-normal cursor-pointer select-none">
                    I agree to all{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDpdpTermsOpen(true);
                      }}
                      className="text-[#245348] hover:text-[#C59B4E] font-semibold underline underline-offset-2 cursor-pointer transition-colors"
                    >
                      Terms and Conditions
                    </button>
                  </label>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-[#245348] hover:bg-[#1B3F37] text-white text-xs uppercase tracking-widest font-semibold transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
                >
                  <PhoneCall className="w-4 h-4 text-[#DFBE79] group-hover:rotate-12 transition-transform" />
                  <span>
                    {isSubmitting ? "Connecting with Advisory Desk..." : "Book Consultation"}
                  </span>
                </button>

              </form>

            </div>

          </div>
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
            aria-labelledby="dpdp-page-modal-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#183C32] text-white border-b border-[#C59B4E]/30">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#245348] border border-[#C59B4E] flex items-center justify-center text-[#DFBE79] shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 id="dpdp-page-modal-title" className="font-serif text-lg font-bold text-[#F7F3EB] leading-tight">
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
                  <strong>Terms & Conditions Notice:</strong> Concave Realty processes your contact information solely to coordinate luxury property consultations with zero spam or advertising syndication.
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
export default EnquiryPage;

