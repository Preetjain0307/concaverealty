import React from 'react';
import { 
  Waves, 
  Dumbbell, 
  Trees, 
  Gamepad2, 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  Film, 
  Flame, 
  ConciergeBell, 
  Laptop, 
  Zap, 
  Sun,
  Lock,
  Eye,
  ArrowRight
} from 'lucide-react';
import { AMENITIES_LIST } from '../data/projectsData';

const ICON_MAP = {
  Waves,
  Dumbbell,
  Trees,
  Gamepad2,
  Building2,
  ShieldCheck,
  Sparkles,
  Film,
  Flame,
  ConciergeBell,
  Laptop,
  Zap,
  Sun
};

export function AmenitiesSection({ onOpenEnquiry }) {
  return (
    <section id="amenities" className="py-24 bg-[#FAF9F6] text-[#14221F] border-t border-[#EAE6DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C59B4E] font-semibold block">
            EXPERIENCES & WELLNESS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
            50+ World-Class Curated Amenities
          </h2>
          <p className="text-xs text-gray-500 font-light">
            Every development features private clubhouses, wellness spas, and curated hospitality designed for elevated living.
          </p>
        </div>

        {/* Minimal Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {AMENITIES_LIST.map((item) => {
            const IconComponent = ICON_MAP[item.icon] || Sparkles;
            return (
              <div
                key={item.id}
                className="bg-white border border-[#EAE6DF] hover:border-[#C59B4E] rounded-lg p-5 transition-all duration-300 group hover:-translate-y-1 shadow-subtle"
              >
                <div className="w-10 h-10 rounded bg-[#FAF9F6] border border-[#EAE6DF] group-hover:border-[#C59B4E] flex items-center justify-center text-[#245348] mb-3 transition-colors">
                  <IconComponent className="w-5 h-5 text-[#245348] group-hover:text-[#C59B4E] transition-colors" />
                </div>
                <h4 className="font-serif text-base font-bold text-[#14221F] group-hover:text-[#245348] transition-colors">
                  {item.name}
                </h4>
                <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* FLOOR VIEW & MASTER LAYOUT SECTION (BLURRED + ENQUIRY)   */}
        {/* ========================================================= */}
        <div className="pt-10 border-t border-[#EAE6DF] space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.25em] text-[#C59B4E] font-semibold block font-mono">
                ARCHITECTURAL MASTER PLANS
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#14221F]">
                Exclusive Floor Views & Amenity Decks
              </h3>
              <p className="text-xs text-gray-500 font-light max-w-xl leading-relaxed">
                Architectural floor views, podium level master plans, and typical cluster layouts. Blueprints are confidential and protected — click any layout to request full access.
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-xs font-mono text-[#245348] bg-white px-3.5 py-2 rounded-xl border border-[#EAE6DF] shadow-sm flex-shrink-0">
              <Lock className="w-3.5 h-3.5 text-[#C59B4E]" />
              <span>Click Floor View to Enquire & Unlock</span>
            </div>
          </div>

          {/* Floor View Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Floor View 1: Amenity & Podium Deck Plan */}
            <div
              onClick={() => onOpenEnquiry && onOpenEnquiry({
                projectName: "Podium Amenities & Clubhouse Deck",
                location: "Mumbai Signature Developments",
                configuration: "Amenity Level Master Floor Plan"
              })}
              className="group relative rounded-2xl overflow-hidden border border-[#EAE6DF] bg-white shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col"
            >
              {/* Blurred Image Container */}
              <div className="relative h-72 sm:h-80 overflow-hidden bg-slate-900">
                <img
                  src="/projects/floor_view_amenities.svg"
                  alt="Clubhouse & Amenity Deck Floor View"
                  className="w-full h-full object-cover filter blur-[6px] group-hover:blur-[3px] scale-105 group-hover:scale-110 transition-all duration-500"
                />
                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-black/45 group-hover:bg-black/35 transition-colors" />

                {/* Lock Overlay Pill */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-mono font-semibold text-[#14221F] flex items-center gap-1.5 shadow-sm">
                  <Lock className="w-3 h-3 text-[#C59B4E]" />
                  <span>Confidential Floor View</span>
                </div>

                <div className="absolute top-4 right-4 bg-[#1D3530]/90 backdrop-blur-md text-[#DFBE79] border border-[#C59B4E]/40 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold">
                  Level 05 • Eco-Deck
                </div>

                {/* Center Prompt & CTA */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white space-y-3 pointer-events-none">
                  <div className="w-14 h-14 rounded-full bg-[#1D3530]/90 border border-[#DFBE79] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Lock className="w-6 h-6 text-[#DFBE79]" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white drop-shadow-md">
                      Clubhouse & Podium Floor View
                    </h4>
                    <p className="text-xs text-gray-200 mt-1 max-w-sm drop-shadow">
                      Includes 50m Lap Pool Deck, Wellness Spa, Banquet & Private Cinema layout
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#245348] text-white text-xs uppercase tracking-wider font-semibold shadow-lg group-hover:bg-[#1B3F37] transition-all border border-[#DFBE79]/30">
                    <Eye className="w-3.5 h-3.5 text-[#DFBE79]" />
                    <span>Click to Enquire & Unlock Floor View</span>
                  </span>
                </div>
              </div>

              {/* Card Info Footer */}
              <div className="p-4 bg-white flex items-center justify-between text-xs border-t border-[#EAE6DF]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C59B4E]" />
                  <span className="font-semibold text-[#14221F]">Amenity & Leisure Layout</span>
                </div>
                <span className="text-[#245348] font-mono font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Enquire Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Floor View 2: Typical Residential Cluster Plan */}
            <div
              onClick={() => onOpenEnquiry && onOpenEnquiry({
                projectName: "Typical Residential Tower Cluster",
                location: "Mumbai Signature Developments",
                configuration: "Tower Cluster & Floor Layout"
              })}
              className="group relative rounded-2xl overflow-hidden border border-[#EAE6DF] bg-white shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col"
            >
              {/* Blurred Image Container */}
              <div className="relative h-72 sm:h-80 overflow-hidden bg-slate-900">
                <img
                  src="/projects/floor_view_typical.svg"
                  alt="Typical Tower Cluster Floor View"
                  className="w-full h-full object-cover filter blur-[6px] group-hover:blur-[3px] scale-105 group-hover:scale-110 transition-all duration-500"
                />
                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-black/45 group-hover:bg-black/35 transition-colors" />

                {/* Lock Overlay Pill */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-mono font-semibold text-[#14221F] flex items-center gap-1.5 shadow-sm">
                  <Lock className="w-3 h-3 text-[#C59B4E]" />
                  <span>Protected Blueprint</span>
                </div>

                <div className="absolute top-4 right-4 bg-[#1D3530]/90 backdrop-blur-md text-[#DFBE79] border border-[#C59B4E]/40 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold">
                  High-Rise Tower
                </div>

                {/* Center Prompt & CTA */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white space-y-3 pointer-events-none">
                  <div className="w-14 h-14 rounded-full bg-[#1D3530]/90 border border-[#DFBE79] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Lock className="w-6 h-6 text-[#DFBE79]" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white drop-shadow-md">
                      Typical Cluster Floor View
                    </h4>
                    <p className="text-xs text-gray-200 mt-1 max-w-sm drop-shadow">
                      Shows 2, 3 & 4 BHK unit placements, high-speed lift cores & private sundecks
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#245348] text-white text-xs uppercase tracking-wider font-semibold shadow-lg group-hover:bg-[#1B3F37] transition-all border border-[#DFBE79]/30">
                    <Eye className="w-3.5 h-3.5 text-[#DFBE79]" />
                    <span>Click to Enquire & Unlock Floor View</span>
                  </span>
                </div>
              </div>

              {/* Card Info Footer */}
              <div className="p-4 bg-white flex items-center justify-between text-xs border-t border-[#EAE6DF]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-[#14221F]">Residential Unit Cluster</span>
                </div>
                <span className="text-[#245348] font-mono font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Enquire Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
