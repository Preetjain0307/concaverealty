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
  Sun 
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

export function AmenitiesSection() {
  return (
    <section id="amenities" className="py-24 bg-[#FAF9F6] text-[#14221F] border-t border-[#EAE6DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
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

      </div>
    </section>
  );
}
