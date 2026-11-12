import React from 'react';
import {
  ChevronUp,
  ShieldCheck,
  Phone,
  Mail,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Lock
} from 'lucide-react';

const INSTAGRAM_URL = "https://www.instagram.com/concaverealtyindia?mdxt=MTZkYTJobTV5YnpuMA==";
const WHATSAPP_URL = "https://wa.me/918291090155";
const PHONE_NUMBER = "8291090155";
const EMAIL_ADDRESS = "concaverealtyindia@gmail.com";

export function Footer({ onNavigate, onOpenEnquiry }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#FAF7F2] text-[#222222] pt-10 pb-6 border-t border-[#E7E0D5] relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* ========================================================= */}
        {/* COMPACT & ELEGANT 3-COLUMN FOOTER LAYOUT                  */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

          {/* Column 1: Signature Projects (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C59B4E]" />
              <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#8B6846] font-semibold">
                Signature Developments
              </h4>
            </div>

            <ul className="space-y-1.5 text-xs text-gray-700 font-normal">
              <li>
                <a
                  href="https://linktr.ee/Kalpataru_Advay_Borivali"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#245348] hover:translate-x-0.5 transition-all flex items-center justify-between group py-0.5"
                >
                  <span>Kalpataru Advay (Borivali W)</span>
                  <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-[#245348] transition-colors" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.godrejproperties.com/digitalcollateral/mumbai/skyshore/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#245348] hover:translate-x-0.5 transition-all flex items-center justify-between group py-0.5"
                >
                  <span>Godrej Skyshore (Versova)</span>
                  <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-[#245348] transition-colors" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.godrejproperties.com/digitalcollaterals/mumbai/reserve/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#245348] hover:translate-x-0.5 transition-all flex items-center justify-between group py-0.5"
                >
                  <span>Godrej Reserve (Kandivali E)</span>
                  <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-[#245348] transition-colors" />
                </a>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('projects')}
                  className="hover:text-[#245348] hover:translate-x-0.5 transition-all flex items-center justify-between w-full group text-left cursor-pointer py-0.5"
                >
                  <span>Oberoi Sky City (Borivali E)</span>
                  <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-[#245348] transition-colors" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('projects')}
                  className="hover:text-[#245348] hover:translate-x-0.5 transition-all flex items-center justify-between w-full group text-left cursor-pointer py-0.5"
                >
                  <span>Lodha Altus (Borivali W)</span>
                  <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-[#245348] transition-colors" />
                </button>
              </li>
              <li className="pt-1">
                <button
                  onClick={() => onNavigate('projects')}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#245348] hover:text-[#C59B4E] transition-colors cursor-pointer"
                >
                  <span>Explore All 43+ Mumbai Projects</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Experiences & Portals (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C59B4E]" />
              <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#8B6846] font-semibold">
                Experiences & Hospitality
              </h4>
            </div>

            <ul className="space-y-1.5 text-xs text-gray-700 font-normal">
              <li>
                <button
                  onClick={() => onNavigate('amenities')}
                  className="hover:text-[#245348] hover:translate-x-0.5 transition-all flex items-center justify-between w-full text-left cursor-pointer py-0.5"
                >
                  <span>Resort Clubhouse & Lap Pool</span>
                  <span className="text-[10px] font-mono text-gray-400">Amenity</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('amenities')}
                  className="hover:text-[#245348] hover:translate-x-0.5 transition-all flex items-center justify-between w-full text-left cursor-pointer py-0.5"
                >
                  <span>Zen Yoga & Thermal Sauna</span>
                  <span className="text-[10px] font-mono text-gray-400">Wellness</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('amenities')}
                  className="hover:text-[#245348] hover:translate-x-0.5 transition-all flex items-center justify-between w-full text-left cursor-pointer py-0.5"
                >
                  <span>Confidential Floor Blueprints</span>
                  <Lock className="w-2.5 h-2.5 text-[#C59B4E]" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenEnquiry && onOpenEnquiry({ projectName: "Kalpataru Advay", location: "Borivali West" })}
                  className="hover:text-[#245348] hover:translate-x-0.5 transition-all flex items-center justify-between w-full text-left cursor-pointer font-medium text-[#14221F] py-0.5"
                >
                  <span>Schedule VIP Site Visit</span>
                  <Sparkles className="w-2.5 h-2.5 text-[#C59B4E]" />
                </button>
              </li>
              <li className="pt-1.5 flex items-center gap-3 text-[11px]">
                <button
                  onClick={() => onNavigate('caller')}
                  className="text-gray-500 hover:text-[#245348] transition-colors underline cursor-pointer"
                >
                  Caller Portal
                </button>
                <span className="text-gray-300">•</span>
                <button
                  onClick={() => onNavigate('admin')}
                  className="text-gray-500 hover:text-[#245348] transition-colors underline cursor-pointer"
                >
                  Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Brand & Contact (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            
            {/* Brand Header */}
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-[#C59B4E] p-0.5 bg-[#284F45] flex-shrink-0">
                  <img
                    src="/logo_icon.jpg"
                    alt="Concave Realty"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <span className="font-serif text-lg font-bold tracking-wider text-[#14221F] block uppercase leading-tight">
                    CONCAVE REALTY
                  </span>
                  <span className="text-[8px] uppercase font-sans tracking-[0.25em] text-[#C59B4E] block">
                    Where Legacy Meets Luxury
                  </span>
                </div>
              </div>
            </div>

            {/* Compact Verified Contact Box (Without location) */}
            <div className="p-2.5 rounded-lg bg-white border border-[#E7E0D5] shadow-xs space-y-1.5 text-xs">
              
              {/* WhatsApp Business */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#14221F] hover:text-[#25D366] transition-colors group"
              >
                <div className="w-5 h-5 rounded-full bg-[#25D366]/15 flex items-center justify-center text-[#25D366] flex-shrink-0 group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                  <Phone className="w-2.5 h-2.5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] uppercase font-mono text-gray-400 block leading-none">WhatsApp Business</span>
                  <strong className="font-semibold text-xs block truncate leading-tight">+91 {PHONE_NUMBER}</strong>
                </div>
              </a>

              {/* Email Address */}
              <a
                href={`mailto:${EMAIL_ADDRESS}`}
                className="flex items-center gap-2 text-[#14221F] hover:text-[#8B6846] transition-colors group pt-1 border-t border-gray-100"
              >
                <div className="w-5 h-5 rounded-full bg-[#C59B4E]/15 flex items-center justify-center text-[#8B6846] flex-shrink-0 group-hover:bg-[#C59B4E] group-hover:text-white transition-colors">
                  <Mail className="w-2.5 h-2.5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] uppercase font-mono text-gray-400 block leading-none">Official Email</span>
                  <strong className="font-semibold text-xs block truncate leading-tight">{EMAIL_ADDRESS}</strong>
                </div>
              </a>

            </div>

            {/* Social Icons (Instagram & WhatsApp) */}
            <div className="flex items-center gap-2.5 pt-0.5">
              
              {/* Instagram */}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                title="Follow Concave Realty on Instagram"
                className="w-7 h-7 rounded-full bg-[#14221F] text-white flex items-center justify-center hover:bg-[#8B6846] transition-all hover:scale-105 shadow-xs"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* WhatsApp Direct */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                title="Chat on WhatsApp Business (8291090155)"
                className="w-7 h-7 rounded-full bg-[#14221F] text-white flex items-center justify-center hover:bg-[#25D366] transition-all hover:scale-105 shadow-xs"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </a>

            </div>

          </div>

        </div>

        {/* ========================================================= */}
        {/* COMPACT MAHARERA TRANSPARENCY NOTICE                      */}
        {/* ========================================================= */}
        <div className="pt-4 border-t border-[#E7E0D5] text-[10px] text-gray-500 leading-relaxed space-y-1">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#245348] flex-shrink-0 mt-0.5" />
            <p>
              <strong>MahaRERA Notice:</strong> Project specifications, pricing, and possession dates are sourced from authorized developer collateral and registered MahaRERA records (Kalpataru Advay: <strong>P51800077381</strong>; Godrej Skyshore: <strong>P51800054522</strong>). Concave Realty operates as a certified real estate discovery & advisory partner.
            </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* BOTTOM DIVIDER WITH CENTERED CARET & COMPACT COPYRIGHT   */}
        {/* ========================================================= */}
        <div className="relative border-t border-[#E7E0D5] pt-4 text-center">
          
          {/* Centered Scroll to Top Button */}
          <button
            onClick={scrollToTop}
            className="absolute left-1/2 -top-3 -translate-x-1/2 w-6 h-6 rounded-full bg-[#FAF7F2] border border-[#E7E0D5] hover:border-[#C59B4E] flex items-center justify-center text-[#14221F] hover:bg-[#14221F] hover:text-white transition-all cursor-pointer shadow-xs"
            title="Scroll to Top"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>

          {/* Centered Brand Copyright */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-[11px] text-gray-500 font-light">
            <span>© Concave Realty {new Date().getFullYear()} All Rights Reserved.</span>
            <span className="hidden sm:inline-block text-gray-300">•</span>
            <span className="font-serif italic text-gray-600">“Where Legacy Meets Luxury”</span>
          </div>

        </div>

      </div>
    </footer>
  );
}
