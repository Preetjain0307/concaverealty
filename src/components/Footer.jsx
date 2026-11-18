import React, { useState } from 'react';
import {
  ChevronUp,
  ChevronDown,
  ShieldCheck,
  Phone,
  Mail,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Building2,
  MapPin,
  Clock,
  Compass
} from 'lucide-react';
import {
  PrivacyPolicyModal,
  TermsConditionsModal,
  DisclaimerModal,
  CookiePolicyModal
} from './LegalModals';

const INSTAGRAM_URL = "https://www.instagram.com/concaverealtyindia?mdxt=MTZkYTJobTV5YnpuMA==";
const WHATSAPP_URL = "https://wa.me/918291090155";
const PHONE_NUMBER = "8291090155";
const EMAIL_ADDRESS = "concaverealtyindia@gmail.com";

export function Footer({ onNavigate, onOpenEnquiry, onSelectLocation }) {
  // Modal states for legal & compliance documents
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [cookieOpen, setCookieOpen] = useState(false);

  // Mobile accordion states to keep mobile footer sleek, compact & elegant
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileLocationsOpen, setMobileLocationsOpen] = useState(false);
  const [mobileResidencesOpen, setMobileResidencesOpen] = useState(false);
  const [mobileReraOpen, setMobileReraOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId) => {
    onNavigate('home');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 600, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* CONCAVE REALTY SIGNATURE LUXURY FOOTER (DESKTOP)                          */}
      {/* (Styled strictly in our brand theme: Forest Green, Gold & Warm Champagne) */}
      {/* ========================================================================= */}
      <footer className="hidden md:block w-full bg-[#14221F] text-[#D0C5B4] pt-6 sm:pt-8 pb-4 sm:pb-5 border-t border-[#C59B4E]/30 relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-[#C59B4E]/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 bg-[#245348]/20 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-12 lg:px-20 relative z-10 space-y-4 sm:space-y-6">

          {/* 4-Column Structured Real Estate Footer (Mobile: Brand first, then compact accordions) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-start">

            {/* Column 1 on Desktop (Order 2 on Mobile): Governance & Corporate Identity */}
            <div className="lg:col-span-3 order-2 lg:order-1 border-b md:border-b-0 border-white/10 pb-3 md:pb-0">
              <button
                type="button"
                onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                className="w-full flex items-center justify-between py-1 md:py-0 md:pointer-events-none text-left cursor-pointer md:cursor-default"
                aria-expanded={mobileAboutOpen}
              >
                <h4 className="text-xs uppercase tracking-[0.25em] font-semibold text-[#DFBE79]">
                  About & Governance
                </h4>
                <ChevronDown className={`w-4 h-4 text-[#DFBE79] transition-transform duration-200 md:hidden ${mobileAboutOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className={`${mobileAboutOpen ? 'block pt-2' : 'hidden'} md:block md:pt-2`}>
                <ul className="space-y-1.5 text-xs text-[#D0C5B4] font-light">
                  <li>
                    <button
                      onClick={() => scrollToSection('about-us')}
                      className="hover:text-[#DFBE79] transition-colors text-left cursor-pointer block"
                    >
                      About Us
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection('our-vision')}
                      className="hover:text-[#DFBE79] transition-colors text-left cursor-pointer block"
                    >
                      Our Vision
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection('our-mission')}
                      className="hover:text-[#DFBE79] transition-colors text-left cursor-pointer block"
                    >
                      Our Mission
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setTermsOpen(true)}
                      className="hover:text-[#DFBE79] transition-colors text-left cursor-pointer block"
                    >
                      Terms & Conditions
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setDisclaimerOpen(true)}
                      className="hover:text-[#DFBE79] transition-colors text-left cursor-pointer block"
                    >
                      Disclaimer
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setPrivacyOpen(true)}
                      className="hover:text-[#DFBE79] transition-colors text-left cursor-pointer block"
                    >
                      Privacy Policy
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setCookieOpen(true)}
                      className="hover:text-[#DFBE79] transition-colors text-left cursor-pointer block"
                    >
                      Cookie Policy
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onNavigate('careers');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-[#DFBE79] transition-colors text-left cursor-pointer block"
                    >
                      Careers and Hiring
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onNavigate('contact');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-[#DFBE79] transition-colors text-left cursor-pointer block"
                    >
                      Contact Us
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Column 2 on Desktop (Order 3 on Mobile): Official Served Micro-Markets */}
            <div className="lg:col-span-3 order-3 lg:order-2 border-b md:border-b-0 border-white/10 pb-3 md:pb-0">
              <button
                type="button"
                onClick={() => setMobileLocationsOpen(!mobileLocationsOpen)}
                className="w-full flex items-center justify-between py-1 md:py-0 md:pointer-events-none text-left cursor-pointer md:cursor-default"
                aria-expanded={mobileLocationsOpen}
              >
                <h4 className="text-xs uppercase tracking-[0.25em] font-semibold text-[#DFBE79]">
                  Prime Locations
                </h4>
                <ChevronDown className={`w-4 h-4 text-[#DFBE79] transition-transform duration-200 md:hidden ${mobileLocationsOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className={`${mobileLocationsOpen ? 'block pt-2' : 'hidden'} md:block md:pt-2`}>
                <div className="grid grid-cols-2 md:grid-cols-1 gap-x-3 gap-y-1.5 text-xs text-[#D0C5B4] font-light">
                  {[
                    "Borivali",
                    "Kandivali",
                    "Malad",
                    "Goregaon",
                    "Jogeshwari",
                    "Andheri",
                    "Bandra",
                    "Lower Parel"
                  ].map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        if (onSelectLocation) {
                          onSelectLocation(loc);
                        } else {
                          onNavigate('projects');
                        }
                      }}
                      className="hover:text-[#DFBE79] transition-colors text-left cursor-pointer block truncate py-0.5"
                    >
                      • {loc}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 3 on Desktop (Order 4 on Mobile): Signature Mumbai Developments */}
            <div className="lg:col-span-3 order-4 lg:order-3 border-b md:border-b-0 border-white/10 pb-3 md:pb-0">
              <button
                type="button"
                onClick={() => setMobileResidencesOpen(!mobileResidencesOpen)}
                className="w-full flex items-center justify-between py-1 md:py-0 md:pointer-events-none text-left cursor-pointer md:cursor-default"
                aria-expanded={mobileResidencesOpen}
              >
                <h4 className="text-xs uppercase tracking-[0.25em] font-semibold text-[#DFBE79]">
                  Signature Residences
                </h4>
                <ChevronDown className={`w-4 h-4 text-[#DFBE79] transition-transform duration-200 md:hidden ${mobileResidencesOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className={`${mobileResidencesOpen ? 'block pt-2' : 'hidden'} md:block md:pt-2`}>
                <ul className="space-y-1.5 text-xs text-[#D0C5B4] font-light">
                  <li>
                    <a
                      href="https://linktr.ee/Kalpataru_Advay_Borivali"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[#DFBE79] transition-colors block truncate"
                    >
                      Kalpataru Advay (Borivali W)
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.godrejproperties.com/digitalcollateral/mumbai/skyshore/"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[#DFBE79] transition-colors block truncate"
                    >
                      Godrej Skyshore (Versova)
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.godrejproperties.com/digitalcollaterals/mumbai/reserve/"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[#DFBE79] transition-colors block truncate"
                    >
                      Godrej Reserve (Kandivali E)
                    </a>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        if (onSelectLocation) onSelectLocation('Kandivali');
                        else onNavigate('projects');
                      }}
                      className="hover:text-[#DFBE79] transition-colors text-left cursor-pointer block truncate"
                    >
                      Mahindra Vista (Kandivali E)
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        if (onSelectLocation) onSelectLocation('Borivali');
                        else onNavigate('projects');
                      }}
                      className="hover:text-[#DFBE79] transition-colors text-left cursor-pointer block truncate"
                    >
                      Lodha Altus (Borivali W)
                    </button>
                  </li>
                  <li className="pt-1">
                    <button
                      onClick={() => onNavigate('projects')}
                      className="text-[11px] font-semibold text-[#DFBE79] hover:text-white transition-colors cursor-pointer block"
                    >
                      Explore All 43+ Curated Projects →
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Column 4 on Desktop (Order 1 on Mobile): Brand Identity & Direct Connect */}
            <div className="lg:col-span-3 order-1 lg:order-4 space-y-2.5 pb-2 md:pb-0">
              
              {/* Brand Header */}
              <div className="space-y-1">
                <span 
                  className="font-serif text-lg sm:text-2xl font-bold tracking-[0.12em] text-[#F7F3EB] block uppercase"
                  style={{ fontFamily: '"Cormorant Garamond", Cinzel, serif' }}
                >
                  CONCAVE REALTY
                </span>
                <span className="text-[8.5px] sm:text-[9px] uppercase font-sans tracking-[0.22em] text-[#DFBE79] block font-semibold">
                  Where Legacy Meets Luxury
                </span>
                <div className="pt-0.5">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#183C32] border border-[#C59B4E]/50 text-[9.5px] sm:text-[10px] text-[#DFBE79] font-mono shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#DFBE79]" />
                    <span>MahaRERA: A51900045781</span>
                  </div>
                </div>
              </div>

              {/* Direct Verified Contact Card */}
              <div className="p-2 sm:p-2.5 rounded-lg bg-[#183C32]/80 border border-[#C59B4E]/40 space-y-1.5 text-xs">
                
                {/* Phone & WhatsApp */}
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#F7F3EB] hover:text-[#25D366] transition-colors group"
                >
                  <div className="w-5 h-5 rounded-full bg-[#25D366]/20 flex items-center justify-center text-[#25D366] shrink-0 group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                    <Phone className="w-2.5 h-2.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[8px] uppercase font-mono text-gray-400 block leading-none">Direct Desk / WhatsApp</span>
                    <strong className="font-semibold text-xs block text-white">+91 {PHONE_NUMBER}</strong>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${EMAIL_ADDRESS}`}
                  className="flex items-center gap-2 text-[#F7F3EB] hover:text-[#DFBE79] transition-colors group pt-1 border-t border-white/10"
                >
                  <div className="w-5 h-5 rounded-full bg-[#C59B4E]/20 flex items-center justify-center text-[#DFBE79] shrink-0 group-hover:bg-[#C59B4E] group-hover:text-[#14221F] transition-colors">
                    <Mail className="w-2.5 h-2.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[8px] uppercase font-mono text-gray-400 block leading-none">Official Correspondence</span>
                    <strong className="font-semibold text-[11px] block truncate text-white">{EMAIL_ADDRESS}</strong>
                  </div>
                </a>

              </div>

              {/* Verified Social Media Channels & Staff Portals */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/10">
                <div className="flex items-center gap-2">
                  {/* Instagram */}
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Concave Realty Instagram"
                    className="w-7 h-7 rounded-full bg-[#245348] text-white hover:bg-[#C59B4E] hover:text-[#14221F] flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-110"
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
                    title="Chat with Concave Realty on WhatsApp"
                    className="w-7 h-7 rounded-full bg-[#245348] text-white hover:bg-[#25D366] flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-110"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  </a>
                </div>
              </div>

            </div>

          </div>



          {/* ========================================================= */}
          {/* STATUTORY MAHARERA DISCLOSURE BAR                         */}
          {/* ========================================================= */}
          <div className="pt-3.5 border-t border-white/10 text-[10px] text-gray-400 leading-relaxed">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#DFBE79] shrink-0 mt-0.5" />
              <p>
                <strong className="text-white">MahaRERA Statutory Notice:</strong> All residential developments displayed on this platform are registered under the Maharashtra Real Estate Regulatory Authority (MahaRERA). Concave Realty operates as a certified real estate advisory and channel partner under <strong>MahaRERA Registration No. A51900045781</strong>.
              </p>
            </div>
          </div>

          {/* ========================================================= */}
          {/* BOTTOM COPYRIGHT & SCROLL TO TOP                          */}
          {/* ========================================================= */}
          <div className="relative border-t border-white/10 pt-4 text-center">

            {/* Centered Scroll to Top Chevron Button */}
            <button
              onClick={scrollToTop}
              className="absolute left-1/2 -top-3.5 -translate-x-1/2 w-7 h-7 rounded-full bg-[#183C32] border border-[#C59B4E]/50 hover:border-[#DFBE79] flex items-center justify-center text-[#DFBE79] hover:bg-[#C59B4E] hover:text-[#14221F] transition-all cursor-pointer shadow-md"
              title="Scroll to Top"
            >
              <ChevronUp className="w-4 h-4" />
            </button>

            {/* Centered Copyright */}
            <div className="text-[10px] text-gray-400 space-y-0.5 font-light">
              <p>
                © Concave Realty {new Date().getFullYear()} All Rights Reserved. • MahaRERA Reg. No. <strong className="text-gray-300 font-mono">A51900045781</strong>
              </p>
              <p className="text-[9px] text-gray-500 font-serif italic">
                “Where Legacy Meets Luxury” • Mumbai, India
              </p>
            </div>

          </div>

        </div>
      </footer>

      {/* ========================================================================= */}
      {/* CONCAVE REALTY CLEAN MOBILE FOOTER                                        */}
      {/* Small, simple, elegant 2-column layout in our dark luxury forest green &  */}
      {/* gold brand theme, styled exclusively for mobile view.                     */}
      {/* ========================================================================= */}
      <footer className="block md:hidden w-full bg-[#14221F] text-[#D0C5B4] px-6 pt-9 pb-6 border-t border-[#C59B4E]/30 relative overflow-hidden">
        {/* Subtle luxury ambient glow */}
        <div className="pointer-events-none absolute -top-20 -left-20 w-64 h-64 bg-[#C59B4E]/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 w-64 h-64 bg-[#245348]/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-sm mx-auto">

          {/* Simple & Clean 2-Column Links Grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-3.5 text-[13px] font-normal leading-snug">
            
            {/* Column 1: Company & Navigation */}
            <div className="space-y-3.5 flex flex-col items-start">
              <button
                type="button"
                onClick={() => scrollToSection('about-us')}
                className="text-[#D0C5B4] hover:text-[#DFBE79] active:text-[#DFBE79] transition-colors text-left cursor-pointer"
              >
                About Us
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('our-vision')}
                className="text-[#D0C5B4] hover:text-[#DFBE79] active:text-[#DFBE79] transition-colors text-left cursor-pointer"
              >
                Our Vision
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('our-mission')}
                className="text-[#D0C5B4] hover:text-[#DFBE79] active:text-[#DFBE79] transition-colors text-left cursor-pointer"
              >
                Our Mission
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigate('projects');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-[#D0C5B4] hover:text-[#DFBE79] active:text-[#DFBE79] transition-colors text-left cursor-pointer"
              >
                Projects
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigate('careers');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-[#D0C5B4] hover:text-[#DFBE79] active:text-[#DFBE79] transition-colors text-left cursor-pointer"
              >
                Careers and Hiring
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigate('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-[#D0C5B4] hover:text-[#DFBE79] active:text-[#DFBE79] transition-colors text-left cursor-pointer"
              >
                Contact Us
              </button>
            </div>

            {/* Column 2: Legal & Portals */}
            <div className="space-y-3.5 flex flex-col items-start">
              <button
                type="button"
                onClick={() => setTermsOpen(true)}
                className="text-[#D0C5B4] hover:text-[#DFBE79] active:text-[#DFBE79] transition-colors text-left cursor-pointer"
              >
                Terms & Conditions
              </button>
              <button
                type="button"
                onClick={() => setPrivacyOpen(true)}
                className="text-[#D0C5B4] hover:text-[#DFBE79] active:text-[#DFBE79] transition-colors text-left cursor-pointer"
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={() => setDisclaimerOpen(true)}
                className="text-[#D0C5B4] hover:text-[#DFBE79] active:text-[#DFBE79] transition-colors text-left cursor-pointer"
              >
                Disclaimer
              </button>
              <button
                type="button"
                onClick={() => setCookieOpen(true)}
                className="text-[#D0C5B4] hover:text-[#DFBE79] active:text-[#DFBE79] transition-colors text-left cursor-pointer"
              >
                Cookie Policy
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigate('projects');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-[#D0C5B4] hover:text-[#DFBE79] active:text-[#DFBE79] transition-colors text-left cursor-pointer"
              >
                Signature Residences
              </button>
              <button
                type="button"
                onClick={() => onOpenEnquiry && onOpenEnquiry({ projectName: "Curated Portfolio", location: "Mumbai" })}
                className="text-[#DFBE79] hover:text-white active:text-white transition-colors text-left cursor-pointer font-medium"
              >
                Book Consultation
              </button>
            </div>

          </div>

          {/* Full Brand Wordmark & Slogan */}
          <div className="pt-8 pb-4">
            <h2 className="text-2xl xs:text-3xl font-serif font-bold tracking-wider text-[#F7F3EB] uppercase select-none">
              CONCAVE REALTY
            </h2>
            <p className="text-xs text-[#DFBE79] font-serif italic mt-1">
              “Where Legacy Meets Luxury”
            </p>
          </div>

          {/* Clean Solid Circular Social Buttons (Instagram, WhatsApp, YouTube, LinkedIn) */}
          <div className="flex items-center gap-3 pb-7">
            {/* Instagram */}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-8 h-8 rounded-full bg-[#1F332C] text-[#DFBE79] border border-white/10 flex items-center justify-center hover:bg-[#C59B4E] hover:text-[#14221F] transition-colors shadow-xs"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            {/* WhatsApp */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-8 h-8 rounded-full bg-[#1F332C] text-[#25D366] border border-white/10 flex items-center justify-center hover:bg-[#25D366] hover:text-[#14221F] transition-colors shadow-xs"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="w-8 h-8 rounded-full bg-[#1F332C] text-[#DFBE79] border border-white/10 flex items-center justify-center hover:bg-[#C59B4E] hover:text-[#14221F] transition-colors shadow-xs"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-8 h-8 rounded-full bg-[#1F332C] text-[#DFBE79] border border-white/10 flex items-center justify-center hover:bg-[#C59B4E] hover:text-[#14221F] transition-colors shadow-xs"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>

          {/* Minimal Divider Line with Centered Chevron Down Toggle */}
          <div className="relative border-t border-white/15 pt-5 pb-1 flex flex-col items-center">
            <button
              type="button"
              onClick={() => setMobileReraOpen(!mobileReraOpen)}
              className="absolute -top-3 px-3 bg-[#14221F] text-[#A69B8D] hover:text-[#DFBE79] transition-colors cursor-pointer"
              aria-label="Toggle Statutory & RERA Disclosures"
            >
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileReraOpen ? 'rotate-180 text-[#DFBE79]' : ''}`} />
            </button>

            {/* Collapsible Statutory Details */}
            {mobileReraOpen && (
              <div className="w-full pb-4 text-center space-y-1 text-[10px] text-[#A69B8D] border-b border-white/10 mb-3 font-light">
                <p>
                  MahaRERA Registration No. <strong className="text-white font-mono">A51900045781</strong>
                </p>
                <p>
                  Certified Real Estate Advisory & Channel Partner • Mumbai, India
                </p>
                <button
                  onClick={scrollToTop}
                  className="inline-flex items-center gap-1 text-[#DFBE79] hover:underline pt-1 text-[10px] cursor-pointer"
                >
                  <ChevronUp className="w-3 h-3" /> Back to Top
                </button>
              </div>
            )}

            <p className="text-[12px] text-[#8E867B] text-center font-light">
              © Concave Realty {new Date().getFullYear()} All Rights Reserved.
            </p>
          </div>

        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 3. LEGAL & COMPLIANCE MODALS                                              */}
      {/* ========================================================================= */}
      <PrivacyPolicyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <TermsConditionsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
      <DisclaimerModal isOpen={disclaimerOpen} onClose={() => setDisclaimerOpen(false)} />
      <CookiePolicyModal isOpen={cookieOpen} onClose={() => setCookieOpen(false)} />
    </>
  );
}

export default Footer;
