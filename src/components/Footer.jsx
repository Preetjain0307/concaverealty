import React from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  ArrowUpRight, 
  Globe,
  Share2
} from 'lucide-react';

export function Footer({ onNavigate, onOpenEnquiry }) {
  return (
    <footer className="bg-[#EFECE6] text-[#14221F] pt-16 pb-10 border-t border-[#E5E0D8] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Content Matching Lodha Screen */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1 */}
          <div className="space-y-2.5 font-light text-gray-700">
            <button onClick={() => onNavigate('home')} className="block hover:text-[#245348] text-left">About Us</button>
            <button onClick={() => onNavigate('projects')} className="block hover:text-[#245348] text-left">Our Developments</button>
            <button onClick={() => onNavigate('locations')} className="block hover:text-[#245348] text-left">Key Locations</button>
            <button onClick={() => onNavigate('amenities')} className="block hover:text-[#245348] text-left">Signature Hospitality</button>
          </div>

          {/* Column 2 */}
          <div className="space-y-2.5 font-light text-gray-700">
            <a href="https://linktr.ee/Kalpataru_Advay_Borivali" target="_blank" rel="noreferrer" className="block hover:text-[#245348]">
              Kalpataru Advay (Borivali West)
            </a>
            <a href="https://www.godrejproperties.com/digitalcollateral/mumbai/skyshore/" target="_blank" rel="noreferrer" className="block hover:text-[#245348]">
              Godrej Skyshore (Versova)
            </a>
            <a href="https://www.godrejproperties.com/digitalcollaterals/mumbai/reserve/" target="_blank" rel="noreferrer" className="block hover:text-[#245348]">
              Godrej Reserve (Kandivali East)
            </a>
            <button onClick={() => onOpenEnquiry({ projectName: "Kalpataru Advay", location: "Borivali West" })} className="block hover:text-[#245348] text-left font-medium">
              VIP Site Visit Booking
            </button>
          </div>

          {/* Column 3: Workspaces */}
          <div className="space-y-2.5 font-light text-gray-700">
            <button onClick={() => onNavigate('caller')} className="block hover:text-[#245348] text-left">
              Caller Workspace (4h/10d Retries)
            </button>
            <button onClick={() => onNavigate('admin')} className="block hover:text-[#245348] text-left">
              Super Admin Portal (Excel Export)
            </button>
            <div className="pt-2 text-gray-500 text-[11px]">
              Concave Realty Executive Office<br />
              Link Road, Western Suburbs, Mumbai
            </div>
          </div>

          {/* Column 4: Brand Identity & Social Icons */}
          <div className="flex flex-col items-start md:items-end justify-between space-y-6">
            <div className="text-left md:text-right">
              <span className="font-serif text-3xl font-bold tracking-widest text-[#14221F] block">
                CONCAVE REALTY
              </span>
              <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#C59B4E] block">
                Where Legacy Meets Luxury
              </span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 text-[#14221F]">
              <a href="#" className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black/5 transition-colors" title="Instagram">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black/5 transition-colors" title="YouTube">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black/5 transition-colors" title="LinkedIn">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>

        </div>

        {/* MahaRERA Compliance Notice */}
        <div className="pt-8 border-t border-[#E5E0D8] text-[11px] text-gray-600 leading-relaxed space-y-2">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#245348] flex-shrink-0 mt-0.5" />
            <p>
              <strong>MahaRERA & Project Verification Notice:</strong> Project specifications, prices, configurations, and possession dates are curated from authorized developer collateral and registered MahaRERA records (e.g. Kalpataru Advay RERA: <strong>P51800077381</strong>). Official MahaRERA registration details are displayed per project and will be updated as further developer filings occur. This platform functions as a discovery and sales enablement portal and does not constitute a guaranteed offer of contract.
            </p>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="text-center text-[11px] text-gray-500 pt-4 border-t border-[#E5E0D8]">
          © Concave Realty {new Date().getFullYear()} All Rights Reserved. Slogan: “Where Legacy Meets Luxury”.
        </div>

      </div>
    </footer>
  );
}
