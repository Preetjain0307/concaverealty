import React from 'react';
import { 
  Waves, 
  Dumbbell, 
  Trees, 
  Gamepad2, 
  Building2, 
  ShieldCheck,
  Sparkles, 
  Crown,
  Lock,
  Eye,
  ArrowRight
} from 'lucide-react';

const ICON_MAP = {
  Waves,
  Dumbbell,
  Trees,
  Gamepad2,
  Building2,
  ShieldCheck,
  Sparkles,
  Crown
};

// =========================================================
// HEADER MARQUEE SHOWCASE (AUTHENTIC LUXURY THEME IMAGES)
// =========================================================
const HEADER_MARQUEE_DATA = [
  {
    id: 'hm-lounge',
    title: "Double-Height Residents' Club & Billiards Salon",
    subtitle: "Soaring timber paneling, bespoke cocktail bar & marble social lounge",
    tag: "Private Social Club",
    image: "/amenities/theme_residents_lounge.jpg"
  },
  {
    id: 'hm-spa',
    title: "Zen Yoga Sanctuary & Finnish Wood Sauna",
    subtitle: "Japanese bamboo screens, skyline panoramic views & thermal steam",
    tag: "Holistic Wellness",
    image: "/amenities/theme_wellness_spa.jpg"
  },
  {
    id: 'hm-club',
    title: "Mediterranean Villa Clubhouse & Lap Pool",
    subtitle: "Spanish arches, private cabana deck, gym & gourmet cafe lounge",
    tag: "Resort Living",
    image: "/amenities/theme_clubhouse_pool.jpg"
  },
  {
    id: 'hm-kids',
    title: "Architectural Wooden Treehouse & Play Arena",
    subtitle: "Natural birch wood playhouse, child-safe soft turf & climbing structures",
    tag: "Adventure Wonderland",
    image: "/amenities/kids_play_v2.jpg"
  },
  {
    id: 'hm-banquet',
    title: "Grand Celebratory Ballroom & Banquet Salon",
    subtitle: "Crystal chandeliers, formal dining suites & private catering lounge",
    tag: "Royal Celebrations",
    image: "/amenities/banquet_hall.jpg"
  },
  {
    id: 'hm-infinity',
    title: "Rooftop Sky Horizon Infinity Pool",
    subtitle: "Cantilevered glass horizon edge with breathtaking sunset ocean views",
    tag: "Skyline Horizon",
    image: "/amenities/infinity_pool.jpg"
  }
];

// Duplicate for continuous seamless marquee loop
const HEADER_MARQUEE = [...HEADER_MARQUEE_DATA, ...HEADER_MARQUEE_DATA];

// =========================================================
// 8 CURATED AMENITIES CARDS IN WARM ARCHITECTURAL LUXURY THEME
// =========================================================
const AMENITIES_DATA = [
  {
    id: 1,
    name: "Resort Clubhouse & Lap Pool",
    desc: "Mediterranean villa with Olympic lap pool, submerged loungers & sundeck",
    icon: "Waves",
    image: "/amenities/theme_clubhouse_pool.jpg",
    hasWaterRipple: true,
    animClass: "anim-ken-burns-1"
  },
  {
    id: 2,
    name: "Double-Height Residents' Club",
    desc: "Bespoke cocktail lounge with tournament billiards salon & soaring ceilings",
    icon: "Building2",
    image: "/amenities/theme_residents_lounge.jpg",
    hasWaterRipple: false,
    animClass: "anim-ken-burns-2"
  },
  {
    id: 3,
    name: "Zen Yoga & Thermal Sauna",
    desc: "Japanese bamboo meditation sanctuary with Finnish wood sauna suite",
    icon: "Trees",
    image: "/amenities/theme_wellness_spa.jpg",
    hasWaterRipple: false,
    animClass: "anim-ken-burns-1"
  },
  {
    id: 4,
    name: "Kids' Treehouse Adventure",
    desc: "Scandinavian natural birch wood playhouse with child-safe soft play turf",
    icon: "Gamepad2",
    image: "/amenities/kids_play_v2.jpg",
    hasWaterRipple: false,
    animClass: "anim-ken-burns-2"
  },
  {
    id: 5,
    name: "Fully-equipped Gymnasium",
    desc: "Technogym high-performance strength rigs & personal conditioning zone",
    icon: "Dumbbell",
    image: "/amenities/gymnasium.jpg",
    hasWaterRipple: false,
    animClass: "anim-ken-burns-1"
  },
  {
    id: 6,
    name: "Banquets & Celebrations Hall",
    desc: "Grand celebratory ballroom with crystal chandeliers & bespoke catering pantry",
    icon: "Crown",
    image: "/amenities/banquet_hall.jpg",
    hasWaterRipple: false,
    animClass: "anim-ken-burns-2"
  },
  {
    id: 7,
    name: "Rooftop Sky Infinity Pool",
    desc: "Cantilevered horizon pool with breathtaking sunset ocean vistas",
    icon: "Sparkles",
    image: "/amenities/infinity_pool.jpg",
    hasWaterRipple: true,
    animClass: "anim-ken-burns-1"
  },
  {
    id: 8,
    name: "24x7 Security & Concierge",
    desc: "Multi-tier biometric access, RFID boom barriers & 24/7 white-glove team",
    icon: "ShieldCheck",
    image: "/amenities/security.jpg",
    hasWaterRipple: false,
    animClass: "anim-ken-burns-2"
  }
];

// =========================================================
// 6 ARCHITECTURAL FLOOR VIEWS (CONFIDENTIAL BLUR FORM ONLY)
// =========================================================
const FLOOR_VIEWS = [
  {
    id: 'fv-penthouse',
    title: "Duplex Penthouse Sky Mansion",
    level: "L46-47 • Sky Duplex",
    carpetArea: "3,450 sq.ft CA",
    svg: "/projects/floor_view_penthouse.svg",
    highlight: "Private Heated Plunge Pool, 80-ft Wrap-Around Deck & Biometric Foyer",
    type: "Sky Mansion Layout"
  },
  {
    id: 'fv-4bhk',
    title: "Signature 4 BHK Presidential Suite",
    level: "L15-44 • Tower Core",
    carpetArea: "1,895 sq.ft CA",
    svg: "/projects/floor_view_4bhk.svg",
    highlight: "Master Bedroom Suite, 3 Private Viewing Sundecks & Staff Quarters",
    type: "Presidential 4 BHK"
  },
  {
    id: 'fv-3bhk',
    title: "Royale 3 BHK Cross-Air Residence",
    level: "L06-38 • Panoramic",
    carpetArea: "1,280 sq.ft CA",
    svg: "/projects/floor_view_3bhk.svg",
    highlight: "East-West Cross Ventilation, Full Modular Island Kitchen & Sundeck",
    type: "Luxury 3 BHK"
  },
  {
    id: 'fv-podium',
    title: "Podium & Clubhouse Master Deck",
    level: "Level 05 • Eco-Deck",
    carpetArea: "2+ Acres Deck",
    svg: "/projects/floor_view_amenities.svg",
    highlight: "Olympic pool blueprint, squash courts, banquet lawn & wellness pavilion",
    type: "Master Amenity Deck"
  },
  {
    id: 'fv-rooftop',
    title: "Rooftop Sky Observatory & Terrace",
    level: "Level 48 • Sky Deck",
    carpetArea: "15,000 sq.ft",
    svg: "/projects/floor_view_rooftop.svg",
    highlight: "360° Arabian Sea View, Stargazing Telescope Dome & Cocktail Cabanas",
    type: "Rooftop Sky Deck"
  },
  {
    id: 'fv-cluster',
    title: "Typical Residential Tower Cluster",
    level: "Typical • High-Rise",
    carpetArea: "4 Units / Core",
    svg: "/projects/floor_view_typical.svg",
    highlight: "Shows 2, 3 & 4 BHK placements, 6 high-speed elevator cores & fire chutes",
    type: "Tower Cluster Core"
  }
];

export function AmenitiesSection({ onOpenEnquiry }) {
  return (
    <section id="amenities" className="py-20 bg-[#FAF7F2] text-[#14221F] border-t border-[#E7E0D5] relative overflow-hidden">
      
      {/* Warm Ambient Architectural Glows */}
      <div className="absolute top-10 -left-40 w-96 h-96 bg-[#C59B4E]/12 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#8B6846]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 -left-40 w-96 h-96 bg-[#245348]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="space-y-12 relative z-10">
        
        {/* ========================================================= */}
        {/* HEADER MARQUEE SHOWCASE (USER LUXURY THEME IMAGES)        */}
        {/* ========================================================= */}
        <div className="relative w-full overflow-hidden py-2">
          {/* Subtle Left & Right Edge Vignette Fades */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-r from-[#FAF7F2] via-[#FAF7F2]/90 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-l from-[#FAF7F2] via-[#FAF7F2]/90 to-transparent z-20 pointer-events-none" />

          {/* Marquee Track */}
          <div className="animate-marquee-amenities">
            {HEADER_MARQUEE.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                onClick={() => onOpenEnquiry && onOpenEnquiry({
                  projectName: item.title,
                  location: "Concave Luxury Developments",
                  configuration: `Signature Amenity Experience: ${item.title}`
                })}
                className="w-[320px] sm:w-[440px] h-[200px] sm:h-[240px] flex-shrink-0 mx-3 group relative rounded-2xl overflow-hidden border border-[#E7E0D5] hover:border-[#C59B4E] cursor-pointer shadow-md hover:shadow-[0_20px_40px_rgba(139,104,70,0.22)] transition-all duration-500 hover:-translate-y-1.5 bg-slate-900"
              >
                {/* Image with Ken Burns */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover anim-ken-burns-1 group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                
                {/* Luxury Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15 group-hover:from-black/75 transition-colors" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none anim-light-sweep" />

                {/* Floating Tag */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-[#14221F] text-[10px] font-mono uppercase tracking-wider font-semibold shadow-sm">
                    {item.tag}
                  </span>
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-3.5 left-4 right-4 z-10 text-white space-y-0.5">
                  <h3 className="font-serif text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-[#DFBE79] transition-colors drop-shadow leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-gray-200 font-light leading-relaxed drop-shadow line-clamp-1">
                    {item.subtitle}
                  </p>
                </div>

                {/* Top Gold Shimmer Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#C59B4E] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 8 AMENITIES CARDS IN WARM LUXURY THEME                    */}
        {/* ========================================================= */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {AMENITIES_DATA.map((item) => {
              const IconComponent = ICON_MAP[item.icon] || Sparkles;

              return (
                <div
                  key={item.id}
                  onClick={() => onOpenEnquiry && onOpenEnquiry({
                    projectName: item.name,
                    location: "Concave Luxury Developments",
                    configuration: `Lifestyle Amenity: ${item.name}`
                  })}
                  className="group relative rounded-2xl overflow-hidden border border-[#E7E0D5] hover:border-[#C59B4E] bg-white cursor-pointer shadow-sm hover:shadow-[0_15px_35px_rgba(139,104,70,0.15)] transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between"
                >
                  {/* Top Image Window with Realistic Living Animation */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className={`w-full h-full object-cover ${item.animClass} group-hover:scale-110 transition-transform duration-700 ease-out`}
                    />

                    {/* Translucent Water Ripple Overlay */}
                    {item.hasWaterRipple && (
                      <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/30 to-transparent pointer-events-none anim-water-caustic" />
                    )}

                    {/* Gliding Light Sweep */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none anim-light-sweep" />

                    {/* Vignette Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                    {/* Warm Wood Glassmorphism Icon Badge */}
                    <div className="absolute top-3 left-3 w-9 h-9 rounded-xl bg-white/95 backdrop-blur-md border border-[#C59B4E]/30 flex items-center justify-center text-[#245348] group-hover:bg-[#1D3530] group-hover:text-[#DFBE79] group-hover:border-[#C59B4E] transition-all duration-300 shadow-md">
                      <IconComponent className="w-4 h-4 transition-transform group-hover:scale-110" />
                    </div>
                  </div>

                  {/* Card Content in Warm Luxury Tone with Perfectly Aligned Heights */}
                  <div className="p-4 bg-white flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-base font-bold text-[#14221F] group-hover:text-[#8B6846] transition-colors leading-snug line-clamp-1 h-6 flex items-center">
                        {item.name}
                      </h3>
                      <p className="text-xs text-[#5C5549] font-light leading-relaxed line-clamp-2 h-9 mt-1 flex items-center">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {/* Top Subtle Gold Highlight Line on Hover */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#C59B4E] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* FLOOR VIEWS SECTION (PROTECTED BLUR ONLY - CLEAN & CHIC)  */}
        {/* ========================================================= */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-4 border-t border-[#E7E0D5]">
          
          {/* Clean Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E7E0D5] pb-4">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#C59B4E] font-semibold block font-mono">
                ARCHITECTURAL BLUEPRINTS
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#14221F]">
                Exclusive Floor Views & Blueprints
              </h3>
            </div>
            
            <span className="text-xs font-mono text-gray-500">
              Confidential layouts in protected blur mode — click to unlock HD layout
            </span>
          </div>

          {/* 6 Authentic Blurred Blueprints Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FLOOR_VIEWS.map((fv) => (
              <div
                key={fv.id}
                onClick={() => onOpenEnquiry && onOpenEnquiry({
                  projectName: fv.title,
                  location: "Mumbai Signature Developments",
                  configuration: `Confidential Floor View: ${fv.title} (${fv.carpetArea})`
                })}
                className="group relative rounded-2xl overflow-hidden border border-[#E7E0D5] hover:border-[#C59B4E] bg-white shadow-lg hover:shadow-[0_20px_45px_rgba(139,104,70,0.22)] transition-all duration-500 hover:-translate-y-2 cursor-pointer flex flex-col justify-between"
              >
                {/* Blueprint Container with Protected Blur */}
                <div className="relative h-64 sm:h-72 overflow-hidden bg-slate-100">
                  
                  {/* SVG Blueprint with Gaussian Blur */}
                  <img
                    src={`${fv.svg}?v=3`}
                    alt={`${fv.title} Protected Blueprint`}
                    className="w-full h-full object-cover filter blur-[5px] group-hover:blur-[2.5px] scale-105 group-hover:scale-110 transition-all duration-700 ease-out opacity-95"
                  />

                  {/* Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/20 group-hover:via-black/15 transition-colors" />

                  {/* Top Floating Security Badge with Protected Non-Wrapping Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10 gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#14221F] text-[10px] font-mono font-semibold shadow-sm whitespace-nowrap flex-shrink-0">
                      <Lock className="w-3 h-3 text-[#C59B4E] flex-shrink-0" />
                      <span>Confidential Plan</span>
                    </span>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1D3530]/90 backdrop-blur-md text-[#DFBE79] border border-[#C59B4E]/40 text-[10px] font-mono uppercase tracking-wider font-semibold shadow-sm whitespace-nowrap flex-shrink-0">
                      {fv.level}
                    </span>
                  </div>

                  {/* Center Lock Shield & Call to Action with Perfectly Aligned Plaque */}
                  <div className="absolute inset-0 flex items-center justify-center p-3 text-center text-white pointer-events-none z-10">
                    <div className="w-full max-w-[275px] bg-black/60 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10 shadow-2xl flex flex-col items-center justify-between h-[185px]">
                      
                      {/* Round Lock Badge */}
                      <div className="w-9 h-9 rounded-full bg-[#1D3530] border-2 border-[#DFBE79] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                        <Lock className="w-4 h-4 text-[#DFBE79]" />
                      </div>

                      {/* Title & Subtitle with Fixed Height Slot for Identical Baseline */}
                      <div className="w-full space-y-1">
                        <h4 className="font-serif text-sm sm:text-base font-bold tracking-tight text-white drop-shadow-md group-hover:text-[#DFBE79] transition-colors leading-snug line-clamp-2 h-10 flex items-center justify-center text-center px-1">
                          {fv.title}
                        </h4>
                        <p className="text-[10px] text-gray-200 drop-shadow leading-relaxed font-light line-clamp-2 h-7 flex items-center justify-center text-center px-1">
                          {fv.highlight}
                        </p>
                      </div>

                      {/* Action Button */}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#245348] text-white text-[10px] uppercase tracking-wider font-semibold shadow-md group-hover:bg-[#1B3F37] transition-all border border-[#DFBE79]/40 flex-shrink-0">
                        <Eye className="w-3 h-3 text-[#DFBE79]" />
                        <span>Click to Unlock Layout</span>
                      </span>

                    </div>
                  </div>

                  {/* Carpet Area Tag */}
                  <div className="absolute bottom-3 right-3 pointer-events-none z-10">
                    <span className="px-2.5 py-1 rounded bg-black/80 backdrop-blur-md border border-white/20 text-[#DFBE79] font-mono text-[10px] font-semibold shadow-sm whitespace-nowrap">
                      {fv.carpetArea}
                    </span>
                  </div>
                </div>

                {/* Card Info Footer */}
                <div className="p-3.5 bg-white flex items-center justify-between text-xs border-t border-[#E7E0D5]">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-[#C59B4E] flex-shrink-0" />
                    <span className="font-semibold text-[#14221F] truncate text-xs">{fv.type}</span>
                  </div>
                  <span className="text-[#245348] font-mono font-semibold flex items-center gap-1 group-hover:text-[#C59B4E] transition-colors whitespace-nowrap flex-shrink-0 ml-2">
                    <span>Enquire Layout</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform" />
                  </span>
                </div>

                {/* Top Subtle Gold Shimmer Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C59B4E] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
