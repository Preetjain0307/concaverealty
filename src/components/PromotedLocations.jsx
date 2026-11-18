import React, { useState } from 'react';
import { 
  MapPin, 
  ArrowRight, 
  ZoomIn, 
  ZoomOut, 
  ExternalLink, 
  ShieldCheck, 
  Train, 
  Car, 
  Building2, 
  Sparkles,
  Route,
  Navigation
} from 'lucide-react';
import { PROMOTED_LOCATIONS, PROJECTS_DATA } from '../data/projectsData';

export function PromotedLocations({ onSelectLocation }) {
  const [selectedLocName, setSelectedLocName] = useState(PROMOTED_LOCATIONS[0].name);
  const [mapType, setMapType] = useState('roadmap'); // 'roadmap' | 'satellite'
  const [mapZoom, setMapZoom] = useState(14);

  const activeLoc = PROMOTED_LOCATIONS.find(l => l.name === selectedLocName) || PROMOTED_LOCATIONS[0];
  const activeProjects = PROJECTS_DATA.filter(p => p.location.toLowerCase() === activeLoc.name.toLowerCase());

  const handleSelect = (locName) => {
    setSelectedLocName(locName);
    setMapZoom(14);
  };

  return (
    <section id="promoted-locations" className="py-16 sm:py-24 bg-[#FAF9F6] text-[#14221F] border-t border-[#EAE6DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#245348]/10 text-[#245348] text-xs font-mono font-semibold tracking-wider uppercase mb-1">
            <Compass className="w-3.5 h-3.5 text-[#C59B4E]" />
            <span>Interactive Location Explorer</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#14221F]">
            Mumbai's Most Desired Addresses
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-light max-w-2xl mx-auto">
            Explore verified residential corridors with precision satellite mapping, key metro transit hubs, and curated luxury developments.
          </p>
        </div>

        {/* Micro-market Selector Chips */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {PROMOTED_LOCATIONS.map((loc) => {
            const isSelected = loc.name === activeLoc.name;
            return (
              <button
                key={loc.name}
                type="button"
                onClick={() => handleSelect(loc.name)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 border ${
                  isSelected
                    ? 'bg-[#245348] text-white border-[#245348] shadow-md font-semibold'
                    : 'bg-white text-gray-700 border-[#EAE6DF] hover:border-[#C59B4E] hover:text-[#14221F]'
                }`}
              >
                <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-[#DFBE79]' : 'text-gray-400'}`} />
                <span>{loc.name}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-[#183C32] text-[#DFBE79]' : 'bg-gray-100 text-gray-500'
                }`}>
                  {loc.activeListings}
                </span>
              </button>
            );
          })}
        </div>

        {/* Featured Precision Interactive Map Container */}
        <div className="bg-white rounded-2xl border border-[#EAE6DF] shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Left / Top Details & Corridor Panel */}
          <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#EAE6DF] bg-[#FAF9F6] space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono tracking-widest bg-white px-2.5 py-1 rounded border border-[#EAE6DF] text-[#8B6846] font-semibold">
                  {activeLoc.badge} Micro-Market
                </span>
                <span className="text-xs font-mono text-gray-500">
                  PIN: {activeLoc.pincode}
                </span>
              </div>

              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#14221F]">
                  {activeLoc.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1 font-light leading-relaxed">
                  {activeLoc.tagline}
                </p>
              </div>

              {/* Transit & Key Highway Infrastructure */}
              <div className="space-y-2 pt-2 border-t border-[#EAE6DF]">
                <span className="text-[10px] uppercase font-mono text-gray-400 font-semibold tracking-wider block">
                  Transit & Arterial Corridors:
                </span>
                <div className="p-2.5 rounded-lg bg-white border border-[#EAE6DF] text-xs text-[#14221F] flex items-center gap-2">
                  <Train className="w-4 h-4 text-[#245348] shrink-0" />
                  <span className="truncate">{activeLoc.corridors}</span>
                </div>
              </div>

              {/* Key Landmark Hubs */}
              {activeLoc.landmarks && (
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-mono text-gray-400 font-semibold tracking-wider block">
                    Key Micro-Market Landmarks:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeLoc.landmarks.map((landmark, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-white border border-[#EAE6DF] text-[11px] text-gray-700 flex items-center gap-1"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C59B4E]" />
                        <span>{landmark}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Coordinates Pill */}
              <div className="text-[11px] font-mono text-gray-500 flex items-center gap-1.5 pt-1">
                <Navigation className="w-3.5 h-3.5 text-[#C59B4E]" />
                <span>GPS Center: {activeLoc.lat.toFixed(4)}° N, {activeLoc.lng.toFixed(4)}° E</span>
              </div>
            </div>

            {/* Direct Action Button */}
            <div className="pt-4 border-t border-[#EAE6DF]">
              <button
                type="button"
                onClick={() => onSelectLocation(activeLoc.name)}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#245348] hover:bg-[#1B3F37] text-white font-semibold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer group"
              >
                <span>View {activeLoc.name} Developments ({activeProjects.length})</span>
                <ArrowRight className="w-4 h-4 text-[#DFBE79] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right / Bottom Interactive Embedded Map */}
          <div className="lg:col-span-8 relative min-h-[360px] sm:min-h-[460px] bg-slate-100">
            <iframe
              key={`${activeLoc.name}-${mapType}-${mapZoom}`}
              title={`${activeLoc.name} location on Google Maps`}
              src={`https://maps.google.com/maps?q=${activeLoc.lat},${activeLoc.lng}&hl=en&z=${mapZoom}${mapType === 'satellite' ? '&t=k' : '&t=m'}&ie=UTF8&iwloc=near&output=embed`}
              className="w-full h-full border-0 absolute inset-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Map Controls Floating Bar */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10 bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-gray-200 shadow-md">
              {/* Street vs Satellite */}
              <div className="flex items-center bg-gray-100 p-0.5 rounded-lg text-[10px] font-semibold">
                <button
                  type="button"
                  onClick={() => setMapType('roadmap')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    mapType === 'roadmap' ? 'bg-white text-[#14221F] shadow-xs font-bold' : 'text-gray-500 hover:text-black'
                  }`}
                >
                  Street
                </button>
                <button
                  type="button"
                  onClick={() => setMapType('satellite')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    mapType === 'satellite' ? 'bg-[#245348] text-white shadow-xs font-bold' : 'text-gray-500 hover:text-black'
                  }`}
                >
                  Satellite 3D
                </button>
              </div>

              <div className="w-[1px] h-4 bg-gray-200" />

              {/* Zoom Controls */}
              <button
                type="button"
                onClick={() => setMapZoom(prev => Math.min(prev + 1, 17))}
                disabled={mapZoom >= 17}
                title="Zoom In"
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-700 disabled:opacity-30 cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setMapZoom(prev => Math.max(prev - 1, 12))}
                disabled={mapZoom <= 12}
                title="Zoom Out"
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-700 disabled:opacity-30 cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>

              <div className="w-[1px] h-4 bg-gray-200" />

              {/* Open in Google Maps */}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${activeLoc.lat},${activeLoc.lng}`}
                target="_blank"
                rel="noreferrer"
                title="Open in full Google Maps"
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#245348] hover:text-white text-gray-700 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Bottom Floating Pin Badge */}
            <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
              <div className="bg-[#14221F]/90 backdrop-blur-md border border-[#C59B4E]/40 px-3 py-2 rounded-xl shadow-lg flex items-center gap-2.5 text-white">
                <span className="w-2.5 h-2.5 rounded-full bg-[#DFBE79] animate-pulse" />
                <div className="text-xs">
                  <strong className="block font-serif text-[#DFBE79]">{activeLoc.name} Micro-Market</strong>
                  <span className="text-gray-300 font-mono text-[10px]">{activeLoc.activeListings} Active Luxury Developments</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* 8 Micro-Market Quick Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {PROMOTED_LOCATIONS.map((loc) => {
            const isSelected = loc.name === activeLoc.name;
            return (
              <div
                key={loc.name}
                onClick={() => handleSelect(loc.name)}
                className={`rounded-xl p-5 cursor-pointer transition-all duration-300 border ${
                  isSelected
                    ? 'bg-white border-[#245348] shadow-md ring-2 ring-[#245348]/20 -translate-y-1'
                    : 'bg-white border-[#EAE6DF] hover:border-[#C59B4E] hover:shadow-sm hover:-translate-y-0.5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-lg font-bold text-[#14221F]">
                    {loc.name}
                  </h4>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-gray-50 border border-gray-200 text-gray-600">
                    {loc.badge}
                  </span>
                </div>

                <p className="text-xs text-gray-500 mt-1 line-clamp-2 min-h-[32px]">
                  {loc.keyHighlight}
                </p>

                <div className="mt-3 pt-3 border-t border-[#EAE6DF] flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-mono text-[11px]">
                    <strong className="text-[#14221F] font-semibold">{loc.activeListings}</strong> Developments
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLocation(loc.name);
                    }}
                    className="text-[#245348] font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
