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

export function EnquiryModal({ isOpen, onClose, initialData = {} }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    locationName: initialData.location || 'Borivali West',
    projectName: initialData.projectName || 'Kalpataru Advay',
    type: 'VIP Consultation',
    description: ''
  });

  const [submittedLead, setSubmittedLead] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData.location) {
      setFormData(prev => ({
        ...prev,
        locationName: initialData.location,
        projectName: initialData.projectName || prev.projectName
      }));
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.mobile.trim()) {
      alert("Please provide your name and mobile number.");
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
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden my-auto border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header using user requested #1D3530 */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1D3530] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#284F45] border border-[#C59B4E] flex items-center justify-center text-[#DFBE79]">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold">
                Book Consultation & Site Visit
              </h3>
              <p className="text-[10px] text-[#DFBE79] uppercase tracking-widest font-mono">
                CONCAVE SALES ENABLEMENT
              </p>
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
          /* Confirmation Screen showing Automated Location Routing */
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h4 className="font-serif text-2xl font-bold text-[#14221F]">
              Enquiry Transferred Successfully
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
                <span>Assigned Specialist: {submittedLead.callerName}</span>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Your inquiry has been transferred directly to our <strong>{submittedLead.locationName}</strong> territory advisor. You will receive an immediate call back and digital collateral.
            </p>

            <button
              onClick={handleReset}
              className="w-full py-2.5 rounded bg-[#245348] hover:bg-[#1B3F37] text-white font-semibold text-xs uppercase tracking-wider"
            >
              Done & Return
            </button>
          </div>
        ) : (
          /* Form (Light & clean) */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div className="bg-[#FAF9F6] p-3 rounded border border-[#EAE6DF] text-gray-600 text-[11px]">
              Select your preferred micro-market location to automatically connect with that region’s dedicated luxury sales consultant.
            </div>

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

            <div className="space-y-1">
              <label className="text-gray-700 font-medium">Email Address (Optional)</label>
              <input
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded px-3 py-2 text-[#14221F] focus:outline-none"
              />
            </div>

            {/* Territory Location Selector */}
            <div className="space-y-1">
              <label className="text-[#245348] font-bold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>Preferred Location (Routes to Local Caller) *</span>
              </label>
              <select
                value={formData.locationName}
                onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                className="w-full bg-[#FAF9F6] border border-[#245348] rounded px-3 py-2 text-[#14221F] font-semibold focus:outline-none"
              >
                <option value="Borivali West">Borivali West (Routed to Priya Deshmukh)</option>
                <option value="Versova">Versova (Routed to Sneha Kapadia)</option>
                <option value="Goregaon">Goregaon (Routed to Rahul Sharma)</option>
                <option value="Bhayander">Bhayander (Routed to Rahul Sharma)</option>
                <option value="Mira Road">Mira Road (Routed to Priya Deshmukh)</option>
                <option value="Worli">Worli (Routed to Sneha Kapadia)</option>
                <option value="Kandivali">Kandivali East (Routed to Vikram Mehta)</option>
                <option value="Bandra">Bandra (Routed to Sneha Kapadia)</option>
                <option value="Powai">Powai (Routed to Vikram Mehta)</option>
                <option value="Lower Parel">Lower Parel (Routed to Vikram Mehta)</option>
              </select>
            </div>

            {/* Project Selection */}
            <div className="space-y-1">
              <label className="text-gray-700 font-medium">Project of Interest</label>
              <select
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded px-3 py-2 text-[#14221F] focus:outline-none"
              >
                <option value="Kalpataru Advay">Kalpataru Advay (Borivali West - 3 & 4 BHK)</option>
                <option value="Godrej Skyshore">Godrej Skyshore (Versova - 4 Bed Sky Bungalows)</option>
                <option value="Godrej Reserve">Godrej Reserve (Kandivali East)</option>
                <option value="Concave Signature Residences">Concave Signature Residences (Goregaon)</option>
                <option value="Lodha World Towers Collection">Lodha World Towers (Worli)</option>
                <option value="Mira-Bhayander Waterfront Enclave">Mira-Bhayander Waterfront Enclave</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-gray-700 font-medium">Requirements / Preferred Timing</label>
              <textarea
                rows={2}
                placeholder="e.g., Interested in 3 BHK higher floor with sea view."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded px-3 py-2 text-[#14221F] focus:outline-none resize-none"
              />
            </div>

            {/* User requested button color: #245348 */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded bg-[#245348] hover:bg-[#1B3F37] text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Routing to Territory Specialist..." : "Submit Enquiry & Connect With Caller"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
