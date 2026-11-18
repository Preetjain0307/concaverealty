import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Compass,
  PhoneCall,
  ShieldCheck,
  Headphones,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  MessageCircle,
  Search
} from 'lucide-react';

const WHATSAPP_URL = "https://wa.me/918291090155?text=Hello%20Concave%20Realty%2C%20I%20am%20interested%20in%20exploring%20luxury%20properties%20in%20Mumbai.";

export function Navbar({ onNavigate, currentView, onOpenEnquiry, activeUser, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[#1D3530] text-white border-b border-[#284F45] transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Brand Logo & Slogan (Lodha minimalist style) */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 sm:gap-3.5 cursor-pointer group min-w-0"
          >
            <div className="w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full overflow-hidden border border-[#C59B4E]/60 p-0.5 bg-[#284F45] flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs">
              <img
                src="/logo_icon.jpg"
                alt="Concave Realty"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-serif text-[14px] xs:text-[16px] sm:text-xl lg:text-2xl font-bold tracking-tight xs:tracking-normal sm:tracking-widest text-white whitespace-nowrap select-none">
                CONCAVE REALTY
              </span>
              <div className="flex items-center gap-2 -mt-0.5">
                <span className="text-[8px] xs:text-[9px] sm:text-[10px] uppercase font-sans tracking-[0.14em] sm:tracking-[0.25em] text-[#C59B4E] whitespace-nowrap block">
                  Where Legacy Meets Luxury
                </span>
                <span className="text-[9px] font-mono tracking-wider text-emerald-300/80 hidden md:inline-block border-l border-white/20 pl-2">
                  MahaRERA: A51900045781
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Links (Lodha style: Uppercase, spacious, refined) */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs uppercase tracking-widest font-medium text-gray-200">
            <button
              onClick={() => onNavigate('home')}
              className={`hover:text-[#DFBE79] transition-colors ${currentView === 'home' ? 'text-[#DFBE79] border-b border-[#DFBE79] pb-1' : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('projects')}
              className={`hover:text-[#DFBE79] transition-colors ${currentView === 'projects' ? 'text-[#DFBE79] border-b border-[#DFBE79] pb-1' : ''}`}
            >
              Our Projects
            </button>
            <button
              onClick={() => onNavigate('amenities')}
              className={`hover:text-[#DFBE79] transition-colors ${currentView === 'amenities' ? 'text-[#DFBE79] border-b border-[#DFBE79] pb-1' : ''}`}
            >
              Amenities
            </button>
            <button
              onClick={() => onNavigate('careers')}
              className={`hover:text-[#DFBE79] transition-colors ${currentView === 'careers' ? 'text-[#DFBE79] border-b border-[#DFBE79] pb-1' : ''}`}
            >
              Careers and Hiring
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className={`hover:text-[#DFBE79] transition-colors ${currentView === 'contact' ? 'text-[#DFBE79] border-b border-[#DFBE79] pb-1' : ''}`}
            >
              Contact Us
            </button>
          </div>

          {/* Right Action Buttons: Lodha-style WhatsApp CHAT + ENQUIRE */}
          <div className="hidden md:flex items-center gap-6">

            {/* Lodha-style WhatsApp Chat Action */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-widest text-gray-200 hover:text-[#25D366] transition-colors flex items-center gap-2 font-medium group cursor-pointer"
              title="Chat with Concave Realty on WhatsApp (+91 82910 90155)"
            >
              <svg 
                className="w-4 h-4 fill-current text-[#25D366] group-hover:scale-110 transition-transform" 
                viewBox="0 0 24 24"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>Chat</span>
            </a>

            {/* Minimal Lodha Enquire Action */}
            <button
              onClick={() => onOpenEnquiry({ projectName: "Kalpataru Advay", location: "Borivali West" })}
              className="text-xs uppercase tracking-widest text-gray-200 hover:text-[#DFBE79] transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#DFBE79]" />
              <span>Enquire</span>
            </button>

          </div>

          {/* Mobile Menu Actions */}
          <div className="flex md:hidden items-center gap-1.5 xs:gap-2 shrink-0">
            {/* Mobile WhatsApp Chat Action */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="p-1.5 xs:p-2 rounded-full bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all shrink-0"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
            </a>

            {/* Mobile Enquire Action - Compact phone icon on mobile, text on sm: */}
            <button
              onClick={() => onOpenEnquiry({ projectName: "Kalpataru Advay", location: "Borivali West" })}
              aria-label="Enquire about luxury residences"
              className="p-1.5 xs:p-2 sm:px-3 sm:py-1.5 rounded-full text-white bg-[#245348] hover:bg-[#1B3F37] border border-[#C59B4E]/40 shrink-0 flex items-center gap-1.5 transition-all shadow-xs"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#DFBE79]" />
              <span className="hidden sm:inline text-[11px] uppercase tracking-wider font-semibold">Enquire</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="p-1.5 xs:p-2 rounded-full bg-white/10 text-gray-200 hover:text-white shrink-0"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1D3530] border-b border-[#284F45] px-4 pt-3 pb-6 space-y-2 text-xs uppercase tracking-wider">
          <button
            onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-[#284F45] text-gray-200 transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => { onNavigate('projects'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-[#284F45] text-gray-200 transition-colors"
          >
            Our Projects
          </button>
          <button
            onClick={() => { onNavigate('amenities'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-[#284F45] text-gray-200 transition-colors"
          >
            Amenities
          </button>
          <button
            onClick={() => { onNavigate('careers'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-[#284F45] text-gray-200 transition-colors"
          >
            Careers and Hiring
          </button>
          <button
            onClick={() => { onNavigate('contact'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-[#284F45] text-gray-200 transition-colors"
          >
            Contact Us
          </button>

          <div className="pt-2 border-t border-white/10 space-y-2">
            <button
              onClick={() => {
                onOpenEnquiry({ projectName: "Kalpataru Advay", location: "Borivali West" });
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#245348] border border-[#C59B4E]/50 text-[#DFBE79] hover:bg-[#1B3F37] font-semibold text-xs uppercase tracking-wider"
            >
              <PhoneCall className="w-4 h-4 text-[#DFBE79]" />
              <span>Enquire / Book Consultation</span>
            </button>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] font-semibold text-xs uppercase tracking-wider"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          {/* Quick Staff Access on Mobile */}
          <div className="pt-2 flex items-center justify-between text-[10px] text-gray-400 font-mono">
            <button
              onClick={() => { onNavigate('caller'); setMobileMenuOpen(false); }}
              className="hover:text-[#DFBE79]"
            >
              • Caller Desk
            </button>
            <button
              onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
              className="hover:text-[#DFBE79]"
            >
              • Admin Portal
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
