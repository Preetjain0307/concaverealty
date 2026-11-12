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
import { dbStore, LOCATION_CODES } from '../data/dbStore';
import { PROJECTS_DATA, LOCATIONS_LIST } from '../data/projectsData';

export function EnquiryPage({ initialData = {}, onNavigateHome, onNavigateProjects }) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    mobile: initialData.mobile || '',
    email: initialData.email || '',
    locationName: initialData.location || 'Borivali',
    projectName: initialData.projectName || 'Kalpataru Advay',
    configuration: initialData.configuration || '3 BHK',
    consultationType: 'VIP Site Visit & Tour',
    preferredDate: '',
    timeSlot: 'Morning (10:00 AM - 1:00 PM)',
    description: ''
  });

  const [submittedLead, setSubmittedLead] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!formData.name.trim() || !formData.mobile.trim()) {
      alert("Please provide your full name and mobile number for verification.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      try {
        const lead = dbStore.addEnquiry({
          name: formData.name,
          mobile: formData.mobile,
          email: formData.email,
          locationName: formData.locationName,
          projectName: formData.projectName,
          type: `${formData.consultationType} (${formData.configuration})`,
          description: `Time slot: ${formData.timeSlot} | Date: ${formData.preferredDate || 'Earliest available'} | Note: ${formData.description}`
        });
        setSubmittedLead(lead);
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
            <span className="text-[#C59B4E] font-semibold">VIP Enquiry & Site Visit</span>
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
                ENQUIRY RECORDED • REF #{submittedLead.id || 'CNCV-VIP'}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#14221F]">
                VIP Consultation Request Confirmed
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
                  *All site visits include complimentary chauffeur pick-up upon prior confirmation.
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: The Comprehensive VIP Enquiry Form (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-[#EAE6DF] p-6 sm:p-8 shadow-sm space-y-6">
              
              <div className="border-b border-[#EAE6DF] pb-4">
                <h3 className="font-serif text-2xl font-bold text-[#14221F]">
                  VIP Consultation & Booking Form
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Please provide your contact details to schedule a site tour or unlock confidential developer collateral.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                {/* Full Name & Phone Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-gray-700 uppercase font-mono tracking-wider flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#245348]" />
                      <span>Full Name *</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded-xl px-3.5 py-2.5 text-xs text-[#14221F] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-gray-700 uppercase font-mono tracking-wider flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-[#245348]" />
                      <span>Mobile Number *</span>
                    </label>
                    <div className="flex items-center">
                      <span className="bg-[#EAE6DF] text-gray-700 px-3 py-2.5 rounded-l-xl border border-r-0 border-[#EAE6DF] font-mono text-xs font-semibold">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        placeholder="98200 12345"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded-r-xl px-3.5 py-2.5 text-xs text-[#14221F] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-gray-700 uppercase font-mono tracking-wider flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[#245348]" />
                    <span>Email Address (For Official Quotation & Brochure)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="rajesh.sharma@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded-xl px-3.5 py-2.5 text-xs text-[#14221F] focus:outline-none transition-colors"
                  />
                </div>

                {/* Micro-market & Interested Project */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-gray-700 uppercase font-mono tracking-wider flex items-center gap-1">
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
                      className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded-xl px-3.5 py-2.5 text-xs text-[#14221F] focus:outline-none transition-colors"
                    >
                      {LOCATIONS_LIST.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-gray-700 uppercase font-mono tracking-wider flex items-center gap-1">
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
                      className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded-xl px-3.5 py-2.5 text-xs text-[#14221F] focus:outline-none transition-colors"
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
                    <label className="text-[11px] font-semibold text-gray-700 uppercase font-mono tracking-wider flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-[#245348]" />
                      <span>Desired Typology</span>
                    </label>
                    <select
                      value={formData.configuration}
                      onChange={(e) => setFormData({ ...formData, configuration: e.target.value })}
                      className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded-xl px-3.5 py-2.5 text-xs text-[#14221F] focus:outline-none transition-colors"
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
                    <label className="text-[11px] font-semibold text-gray-700 uppercase font-mono tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#245348]" />
                      <span>Consultation Type</span>
                    </label>
                    <select
                      value={formData.consultationType}
                      onChange={(e) => setFormData({ ...formData, consultationType: e.target.value })}
                      className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded-xl px-3.5 py-2.5 text-xs text-[#14221F] focus:outline-none transition-colors"
                    >
                      <option value="VIP Site Visit & Tour">VIP Site Visit & Tour</option>
                      <option value="Direct Phone Callback">Direct Phone Callback (Senior Advisor)</option>
                      <option value="WhatsApp Quotation & Brochure">WhatsApp Quotation & Floor Plans</option>
                      <option value="Virtual 360° Walkthrough">Virtual 360° Guided Walkthrough</option>
                    </select>
                  </div>
                </div>

                {/* Site Visit Preferred Date & Time Slot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-gray-700 uppercase font-mono tracking-wider flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#245348]" />
                      <span>Preferred Visit Date</span>
                    </label>
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded-xl px-3.5 py-2.5 text-xs text-[#14221F] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-gray-700 uppercase font-mono tracking-wider flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#245348]" />
                      <span>Preferred Time Window</span>
                    </label>
                    <select
                      value={formData.timeSlot}
                      onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                      className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded-xl px-3.5 py-2.5 text-xs text-[#14221F] focus:outline-none transition-colors"
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
                  <label className="text-[11px] font-semibold text-gray-700 uppercase font-mono tracking-wider flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-[#245348]" />
                    <span>Special Requirements / Specific Floor Inquiries</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Higher floor sea view preferred, require official cost sheet & payment schedule..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded-xl p-3 text-xs text-[#14221F] focus:outline-none transition-colors"
                  />
                </div>

                {/* Privacy & Legal disclaimer */}
                <div className="bg-[#FAF9F6] p-3 rounded-xl border border-[#EAE6DF] text-[11px] text-gray-500 leading-relaxed">
                  <p>
                    By submitting this request, you authorize Concave Realty and certified project representatives to contact you via Phone / SMS / WhatsApp. Your information is protected under our privacy policy.
                  </p>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-[#245348] hover:bg-[#1B3F37] text-white text-xs uppercase tracking-widest font-semibold transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
                >
                  <PhoneCall className="w-4 h-4 text-[#DFBE79] group-hover:rotate-12 transition-transform" />
                  <span>
                    {isSubmitting ? "Connecting with Advisory Desk..." : "Confirm VIP Consultation & Send Details"}
                  </span>
                </button>

              </form>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
export default EnquiryPage;

