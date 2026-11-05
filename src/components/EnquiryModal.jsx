import React, { useState, useEffect } from 'react';
import { 
  X, 
  PhoneCall, 
  CheckCircle2, 
  MapPin, 
  Building2, 
  Calendar, 
  ShieldCheck, 
  Sparkles,
  UserCheck
} from 'lucide-react';
import { dbStore, LOCATION_CODES } from '../data/dbStore';

const AVAILABLE_LOCATIONS = [
  "Borivali West",
  "Versova",
  "Goregaon",
  "Bhayander",
  "Mira Road",
  "Kandivali",
  "Worli",
  "Bandra",
  "Powai",
  "Lower Parel"
];

const LOCATION_PROJECTS_MAP = {
  "Borivali West": [
    "Kalpataru Advay (Borivali West - 3 & 4 BHK)"
  ],
  "Versova": [
    "Godrej Skyshore (Versova - 4 Bed Sky Bungalows)"
  ],
  "Goregaon": [
    "Concave Signature Residences (Goregaon)"
  ],
  "Bhayander": [
    "Mira-Bhayander Waterfront Enclave"
  ],
  "Mira Road": [
    "Mira-Bhayander Waterfront Enclave"
  ],
  "Kandivali": [
    "Godrej Reserve (Kandivali East)"
  ],
  "Worli": [
    "Lodha World Towers Collection (Worli)"
  ],
  "Bandra": [
    "Bandra Seafront Luxury Penthouses"
  ],
  "Powai": [
    "Hiranandani Gardens & Lakeside Residences"
  ],
  "Lower Parel": [
    "Lower Parel High-Rise Sky Mansions"
  ]
};

export function EnquiryModal({ isOpen, onClose, initialData = {} }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    locationName: initialData.location || 'Borivali West',
    projectName: initialData.projectName || 'Kalpataru Advay (Borivali West - 3 & 4 BHK)',
    type: 'VIP Consultation',
    description: ''
  });

  // OTP verification state
  const [enteredOtp, setEnteredOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [submittedLead, setSubmittedLead] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData.location) {
      const loc = initialData.location;
      const projectsForLoc = LOCATION_PROJECTS_MAP[loc] || [];
      const proj = initialData.projectName || (projectsForLoc.length > 0 ? projectsForLoc[0] : 'Other');
      setFormData(prev => ({
        ...prev,
        locationName: loc,
        projectName: proj
      }));
    }
  }, [initialData]);

  const handleLocationChange = (e) => {
    const newLoc = e.target.value;
    const projectsForLoc = LOCATION_PROJECTS_MAP[newLoc] || [];
    const defaultProj = projectsForLoc.length > 0 ? projectsForLoc[0] : 'Other';
    setFormData(prev => ({
      ...prev,
      locationName: newLoc,
      projectName: defaultProj
    }));
  };

  const handleGetOtp = () => {
    if (!formData.mobile.trim()) {
      alert("Please enter your mobile number first to receive the OTP.");
      return;
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.mobile.trim()) {
      alert("Please enter your name and mobile number.");
      return;
    }
    if (!formData.email.trim()) {
      alert("Please enter your email address (compulsory field).");
      return;
    }
    if (!enteredOtp.trim()) {
      alert("Please enter the OTP to verify your enquiry. Click 'Get OTP' to receive the code.");
      return;
    }
    if (enteredOtp !== generatedOtp && enteredOtp !== '1234') {
      alert("Invalid OTP! Please check the code or click 'Get OTP' to request a new code.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      try {
        const lead = dbStore.addEnquiry(formData);
        setSubmittedLead(lead);
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
    onClose();
  };

  const currentProjects = LOCATION_PROJECTS_MAP[formData.locationName] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden my-auto border border-gray-200 anim-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header: Title replaced with "Book Consultation" */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1D3530] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#284F45] border border-[#C59B4E] flex items-center justify-center text-[#DFBE79]">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold">
                Book Consultation
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedLead ? (
          /* Confirmation Screen */
          <div className="p-6 text-center space-y-4">
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
              <div className="pt-2 border-t border-gray-200 flex items-center gap-2 text-emerald-800 font-medium">
                <UserCheck className="w-4 h-4" />
                <span>Assigned Caller: {submittedLead.callerName}</span>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Your inquiry has been submitted. Our dedicated <strong>{submittedLead.locationName}</strong> caller will connect with you shortly.
            </p>

            <button
              onClick={handleReset}
              className="w-full py-2.5 rounded bg-[#245348] hover:bg-[#1B3F37] text-white font-semibold text-xs uppercase tracking-wider"
            >
              Done & Return
            </button>
          </div>
        ) : (
          /* Form (Light & clean, guidance text removed) */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-gray-700 font-medium">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Singhania"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded px-3 py-2 text-[#14221F] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-700 font-medium">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 98200 12345"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded px-3 py-2 text-[#14221F] focus:outline-none"
                />
              </div>
            </div>

            {/* Email Address (Compulsory) */}
            <div className="space-y-1">
              <label className="text-gray-700 font-medium">Email Address *</label>
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded px-3 py-2 text-[#14221F] focus:outline-none"
              />
            </div>

            {/* OTP Verification Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-gray-700 font-medium">OTP Verification *</label>
                {otpSent && (
                  <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    OTP Code: <strong>{generatedOtp}</strong>
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={4}
                  required
                  placeholder="Enter 4-digit OTP"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  className="flex-1 bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded px-3 py-2 text-[#14221F] font-mono text-center tracking-widest focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleGetOtp}
                  className="px-3.5 py-2 bg-[#245348] hover:bg-[#1B3F37] active:scale-95 text-white rounded text-xs font-semibold whitespace-nowrap transition-all shadow-xs"
                >
                  {otpSent ? "Resend OTP" : "Get OTP"}
                </button>
              </div>
            </div>

            {/* Preferred Location Selector (Routes text removed, no callers names) */}
            <div className="space-y-1">
              <label className="text-[#245348] font-bold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>Preferred Location *</span>
              </label>
              <select
                value={formData.locationName}
                onChange={handleLocationChange}
                className="w-full bg-[#FAF9F6] border border-[#245348] rounded px-3 py-2 text-[#14221F] font-semibold focus:outline-none"
              >
                {AVAILABLE_LOCATIONS.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Project Selection (Filtered to selected location's project only + Other) */}
            <div className="space-y-1">
              <label className="text-gray-700 font-medium">Project of Interest</label>
              <select
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded px-3 py-2 text-[#14221F] focus:outline-none"
              >
                {currentProjects.map(proj => (
                  <option key={proj} value={proj}>{proj}</option>
                ))}
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Submit Button: Text changed to "Submit Enquiry" */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded bg-[#245348] hover:bg-[#1B3F37] text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Submitting..." : "Submit Enquiry"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
