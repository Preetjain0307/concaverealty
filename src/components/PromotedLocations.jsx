import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { PROMOTED_LOCATIONS } from '../data/projectsData';

export function PromotedLocations({ onSelectLocation }) {
  return (
    <section id="promoted-locations" className="py-24 bg-white text-[#14221F] border-t border-[#EAE6DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C59B4E] font-semibold block">
            PRIME TERRITORIES
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
            Mumbai's Most Desired Addresses
          </h2>
          <p className="text-xs text-gray-500 font-light">
            Select a micro-market to explore curated residential developments and connect with our dedicated territory consultants.
          </p>
        </div>

        {/* Minimal Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROMOTED_LOCATIONS.map((loc, idx) => (
            <div
              key={idx}
              onClick={() => onSelectLocation(loc.name)}
              className="bg-[#FAF9F6] border border-[#EAE6DF] hover:border-[#C59B4E] rounded-lg p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl font-bold text-[#14221F] group-hover:text-[#245348] transition-colors">
                  {loc.name}
                </h3>
                <span className="text-[10px] uppercase font-mono tracking-wider bg-white px-2.5 py-1 rounded border border-[#EAE6DF] text-gray-600">
                  {loc.badge}
                </span>
              </div>

              <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                {loc.tagline}
              </p>

              <div className="mt-4 pt-4 border-t border-[#EAE6DF] flex items-center justify-between text-xs">
                <span className="text-gray-400">
                  <strong className="text-[#14221F] font-semibold">{loc.activeListings}</strong> Active Developments
                </span>
                <span className="text-[#245348] font-semibold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
