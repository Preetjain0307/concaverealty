import React from 'react';
import {
  Phone,
  Mail,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

const PHONE_NUMBER = "8291090155";
const EMAIL_ADDRESS = "concaverealtyindia@gmail.com";
const WHATSAPP_URL = "https://wa.me/918291090155?text=Hello%20Concave%20Realty%2C%20I%20am%20interested%20in%20exploring%20luxury%20properties%20in%20Mumbai.";

export function ContactPage({ onNavigateHome, onOpenEnquiry }) {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#14221F] pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-[#C59B4E]/15 rounded-full blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 bg-[#245348]/20 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto relative z-10 space-y-12">

        {/* Back to Home Navigation */}
        <div>
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#183C32] hover:text-[#C59B4E] font-semibold transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Home</span>
          </button>
        </div>

        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-12 bg-[#C59B4E]/60" />
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#C59B4E]">
              Concave Realty • Mumbai
            </span>
            <div className="h-[1px] w-12 bg-[#C59B4E]/60" />
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#183C32] tracking-tight"
            style={{
              fontFamily: '"Cormorant Garamond", Cinzel, serif',
              fontVariantCaps: 'small-caps',
            }}
          >
            Contact Us
          </h1>

          <p className="font-serif italic text-lg sm:text-xl text-[#6A5F52]">
            “Where Legacy Meets Luxury”
          </p>

          <div className="pt-2 flex justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#183C32]/10 border border-[#C59B4E]/40 text-xs text-[#183C32] font-mono font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C59B4E]" />
              <span>MahaRERA Registered Agent: A51900045781</span>
            </div>
          </div>
        </div>

        {/* Focused Contact Cards (Phone & Email) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-4">

          {/* 1. Phone & WhatsApp Card */}
          <div className="p-8 sm:p-10 rounded-2xl bg-white border border-[#EAE6DF] shadow-[0_10px_30px_rgba(24,60,50,0.06)] hover:border-[#C59B4E] transition-all duration-300 space-y-6 text-center group">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#25D366]/15 flex items-center justify-center text-[#25D366] group-hover:scale-110 transition-transform shadow-xs">
              <Phone className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#8B6846] font-semibold block">
                Direct Phone & WhatsApp
              </span>
              <a
                href={`tel:+91${PHONE_NUMBER}`}
                className="text-2xl sm:text-3xl font-bold text-[#183C32] hover:text-[#C59B4E] transition-colors block font-mono"
              >
                +91 {PHONE_NUMBER}
              </a>
              <p className="text-xs text-gray-500">
                Available daily for call & WhatsApp inquiries
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`tel:+91${PHONE_NUMBER}`}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#183C32] hover:bg-[#245348] text-white text-xs uppercase tracking-wider font-semibold transition-colors shadow-xs"
              >
                Call Direct
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs uppercase tracking-wider font-semibold transition-colors shadow-xs"
              >
                WhatsApp Chat
              </a>
            </div>
          </div>

          {/* 2. Official Email Card */}
          <div className="p-4 xs:p-6 sm:p-10 rounded-2xl bg-white border border-[#EAE6DF] shadow-[0_10px_30px_rgba(24,60,50,0.06)] hover:border-[#C59B4E] transition-all duration-300 space-y-6 text-center group">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#C59B4E]/15 flex items-center justify-center text-[#8B6846] group-hover:scale-110 transition-transform shadow-xs">
              <Mail className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#8B6846] font-semibold block">
                Official Email
              </span>
              <div className="py-1">
                <a
                  href={`mailto:${EMAIL_ADDRESS}`}
                  title={`Send email to ${EMAIL_ADDRESS}`}
                  className="text-[14px] xs:text-[15px] sm:text-base md:text-lg lg:text-xl font-bold text-[#183C32] hover:text-[#C59B4E] transition-colors inline-block tracking-tight select-all"
                >
                  {EMAIL_ADDRESS}
                </a>
              </div>
              <p className="text-xs text-gray-500">
                Official inquiries, developer partnerships & verified dossiers
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <a
                href={`mailto:${EMAIL_ADDRESS}?subject=Inquiry%20regarding%20Concave%20Realty%20Properties`}
                className="w-full sm:w-auto px-8 py-2.5 rounded-full bg-[#183C32] hover:bg-[#245348] text-white text-xs uppercase tracking-wider font-semibold transition-colors shadow-xs"
              >
                Send Email
              </a>
            </div>
          </div>

        </div>

        {/* Business Details & Statutory Regulatory Disclosure */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#EAE6DF] shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#8B6846] font-semibold block font-mono">
              OFFICIAL BUSINESS CREDENTIALS
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold text-[#183C32]"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              Concave Realty Business Details
            </h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#C59B4E] to-transparent mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#EAE6DF] space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400 font-semibold block">Operating Brand</span>
              <span className="font-bold text-[#14221F] text-sm block">Concave Realty</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#EAE6DF] space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400 font-semibold block">Business Classification</span>
              <span className="font-bold text-[#14221F] text-sm block">Certified Real Estate Advisory & Channel Partner</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#EAE6DF] space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400 font-semibold block">MahaRERA Registration</span>
              <span className="font-bold font-mono text-emerald-800 text-sm block">A51900045781</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#EAE6DF] space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400 font-semibold block">Registered Territory</span>
              <span className="font-bold text-[#14221F] text-sm block">Mumbai, Maharashtra, India</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#EAE6DF] space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400 font-semibold block">Advisory Desk Hours</span>
              <span className="font-bold text-[#14221F] text-sm block">Monday – Sunday, 9:00 AM – 8:00 PM IST</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#EAE6DF] space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400 font-semibold block">Regulatory Authority</span>
              <span className="font-bold text-[#14221F] text-sm block">Maharashtra RERA (Govt of Maharashtra)</span>
            </div>
          </div>
        </div>

        {/* Schedule Consultation Prompt */}
        <div className="text-center pt-2 space-y-4">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-mono">
            Prefer an in-person or virtual consultation?
          </p>
          <button
            onClick={() => onOpenEnquiry && onOpenEnquiry({})}
            type="button"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-gradient-to-r from-[#DFBE79] via-[#C59B4E] to-[#B3883B] hover:from-[#EBD296] hover:to-[#C59B4E] text-[#14221F] font-bold text-xs uppercase tracking-[0.2em] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border border-[#F6E4B8]"
          >
            <Sparkles className="w-4 h-4 text-[#14221F]" />
            <span>Book Consultation</span>
            <ArrowRight className="w-4 h-4 text-[#14221F]" />
          </button>
        </div>

      </div>
    </div>
  );
}

export default ContactPage;

