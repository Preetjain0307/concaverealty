import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  MapPin, 
  Compass, 
  ArrowRight,
  Eye,
  PhoneCall,
  Sparkles,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Layers,
  Search,
  SlidersHorizontal,
  X,
  ChevronRight,
  ChevronDown,
  Home,
  Navigation,
  Train
} from 'lucide-react';
import { PROJECTS_DATA, LOCATIONS_LIST, MARQUEE_IMAGES } from '../data/projectsData';

// Fallback image in case any photo ever encounters an error
const FALLBACK_IMG = '/projects/project_img_27.jpg';

// Seamlessly try multiple extensions (1.jpg -> 1.png -> 1.webp -> 1.jpeg) when user adds photos
const handleProjectImgError = (e, fallback) => {
  const currentSrc = e.currentTarget.src || '';
  if (currentSrc.endsWith('.jpg')) {
    e.currentTarget.src = currentSrc.replace(/\.jpg$/, '.png');
  } else if (currentSrc.endsWith('.png')) {
    e.currentTarget.src = currentSrc.replace(/\.png$/, '.webp');
  } else if (currentSrc.endsWith('.webp')) {
    e.currentTarget.src = currentSrc.replace(/\.webp$/, '.jpeg');
  } else if (fallback && currentSrc !== fallback) {
    e.currentTarget.src = fallback;
  } else {
    e.currentTarget.src = FALLBACK_IMG;
  }
};

// Cleanly format & deduplicate BHK labels for card chips (avoids "3 BHK 3 BHK" or "Palatial BHK")
const getCleanBhkChips = (configurations = []) => {
  const seen = new Set();
  const chips = [];
  configurations.forEach((cfg) => {
    const raw = (cfg?.bhk || '').trim();
    if (!raw) return;
    const match = raw.match(/(\d+(?:\.\d+)?\s*BHK)/i);
    const label = match
      ? match[1].toUpperCase().replace(/\s+/, ' ')
      : /jodi/i.test(raw)
        ? 'Jodi'
        : /penthouse/i.test(raw)
          ? 'Penthouse'
          : /duplex/i.test(raw)
            ? 'Duplex'
            : raw.split(' ').slice(0, 2).join(' ');
    if (!seen.has(label)) {
      seen.add(label);
      chips.push(label);
    }
  });
  return chips;
};

// Micro-market descriptors for attractive location cards
const LOCATION_META = {
  "Borivali": { subtitle: "West & Link Road", tag: "National Park" },
  "Kandivali": { subtitle: "East & Reserve", tag: "Forest Living" },
  "Malad": { subtitle: "Mindspace & West", tag: "Skyline Living" },
  "Goregaon": { subtitle: "Aarey & Hub", tag: "Integrated Living" },
  "Jogeshwari": { subtitle: "JVLR & Downtown", tag: "Metro Connected" },
  "Andheri": { subtitle: "Versova & Coastal", tag: "Seafront Luxury" },
  "Bandra": { subtitle: "BKC & Coast", tag: "Ultra Prime" },
  "Lower Parel": { subtitle: "Midtown Towers", tag: "Sky Bungalows" }
};

export function SignatureProjects({ 
  onSelectProject, 
  onOpenTour, 
  onOpenEnquiry,
  filterLocation = 'All',
  filterType = 'All',
  onNavigateHome
}) {
  // Default selected location is All Locations
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBhk, setSelectedBhk] = useState('All');
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close mobile location dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setLocationDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Synchronize when external filterLocation prop is passed
  useEffect(() => {
    if (filterLocation && filterLocation !== 'All' && filterLocation !== 'All Locations') {
      const match = LOCATIONS_LIST.find(loc => loc.toLowerCase() === filterLocation.toLowerCase());
      if (match) {
        setSelectedLocation(match);
      }
    } else if (filterLocation === 'All' || filterLocation === 'All Locations') {
      setSelectedLocation('All Locations');
    }
  }, [filterLocation]);

  // Filter projects by location, search query, and BHK
  const displayedProjects = useMemo(() => {
    return PROJECTS_DATA.filter((proj) => {
      // 1. Location filter
      if (selectedLocation !== 'All Locations' && selectedLocation !== 'All') {
        if (proj.location.toLowerCase() !== selectedLocation.toLowerCase()) {
          return false;
        }
      }

      // 2. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = proj.name.toLowerCase().includes(q);
        const matchesBuilder = proj.builder.toLowerCase().includes(q);
        const matchesLocality = (proj.locality || '').toLowerCase().includes(q);
        const matchesLocation = proj.location.toLowerCase().includes(q);
        const matchesOverview = (proj.overview || '').toLowerCase().includes(q);
        if (!matchesName && !matchesBuilder && !matchesLocality && !matchesLocation && !matchesOverview) {
          return false;
        }
      }

      // 3. BHK filter
      if (selectedBhk !== 'All') {
        const hasBhk = proj.configurations?.some(cfg => 
          cfg.bhk.toLowerCase().includes(selectedBhk.toLowerCase())
        );
        if (!hasBhk) return false;
      }

      return true;
    });
  }, [selectedLocation, searchQuery, selectedBhk]);

  // Scroll-reveal entrance + mobile center-focus lift animation for all project cards
  const cardRefs = useRef([]);

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean);
    if (cards.length === 0) return;

    if (!('IntersectionObserver' in window)) {
      cards.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    // 1. Smooth fade-up reveal as each box enters the viewport
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );

    // 2. Mobile active-card focus lift & subtle photo zoom as user scrolls through boxes
    const focusObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('project-card--in-focus');
          } else {
            entry.target.classList.remove('project-card--in-focus');
          }
        });
      },
      { threshold: 0.45, rootMargin: '-18% 0px -18% 0px' }
    );

    cards.forEach((el) => {
      revealObserver.observe(el);
      focusObserver.observe(el);
    });

    return () => {
      revealObserver.disconnect();
      focusObserver.disconnect();
    };
  }, [displayedProjects]);

  // Smoothly scroll down to the projects section when a location is clicked
  const handleLocationClick = (loc) => {
    setSelectedLocation(loc);
    setTimeout(() => {
      const showcaseSection = document.getElementById('projects-showcase-section');
      if (showcaseSection) {
        const navOffset = 85; // offset for the glassmorphism navbar
        const targetY = showcaseSection.getBoundingClientRect().top + window.pageYOffset - navOffset;
        window.scrollTo({
          top: targetY,
          behavior: 'smooth'
        });
      }
    }, 50);
  };

  // Duplicated marquee images for infinite seamless scrolling
  const marqueeItems = [...MARQUEE_IMAGES, ...MARQUEE_IMAGES];

  return (
    <div id="signature-projects-page" className="min-h-screen bg-[#FAF9F6] text-[#14221F]">
      
      {/* ============================================================== */}
      {/* HERO BANNER – MARQUEE BACKGROUND + ANIMATED GOLD HEADING       */}
      {/* ============================================================== */}
      <div className="relative h-48 xs:h-56 sm:h-72 md:h-80 w-full overflow-hidden border-b border-[#EAE6DF] flex items-center justify-center group shadow-md">
        
        {/* Background Scrolling Architectural Image Marquee */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
          {/* Subtle horizontal fade masks on sides */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-black/60 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-black/60 to-transparent z-10" />

          {/* Marquee Track fitting the exact field height */}
          <div className="animate-marquee flex gap-4 h-full pointer-events-none">
            {marqueeItems.map((item, idx) => (
              <div
                key={idx}
                className="h-full w-72 sm:w-84 md:w-96 flex-shrink-0 relative overflow-hidden select-none pointer-events-none"
              >
                <img
                  src={item.url}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
                  className="w-full h-full object-cover filter brightness-[0.75] contrast-[1.05]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />

                {/* Subtle location & title watermark */}
                <div className="absolute bottom-3 left-3 right-3 text-white/80 pointer-events-none">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#DFBE79] block truncate">
                    {item.location} • {item.title}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Transparent Frosted Glass Blur Overlay across the marquee field */}
          <div className="pointer-events-none absolute inset-0 bg-black/30 backdrop-blur-[2px] z-10" />
        </div>

        {/* Animated Golden Heading centered in the field */}
        <div className="relative z-20 max-w-5xl mx-auto text-center px-4 pointer-events-none select-none">
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight animated-gold-heading">
            Mumbai's Signature Addresses
          </h1>
        </div>

      </div>

      {/* ============================================================== */}
      {/* SECTION B: LOCATION SELECTION & INTERACTIVE FILTERS            */}
      {/* ============================================================== */}
      <section className="pt-5 pb-8 sm:py-10 md:py-12 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6 md:space-y-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-1.5">
            <h2 className="font-serif text-2xl xs:text-3xl sm:text-5xl font-bold text-[#14221F] tracking-tight">
              Explore Location
            </h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#C59B4E] to-transparent mx-auto mt-1.5" />
          </div>

          {/* Mobile View: Single Luxury Select Location Dropdown (with All Locations inside) */}
          <div className="block md:hidden pt-0.5">
            <div ref={dropdownRef} className="relative">
              {(() => {
                const isAllSelected = selectedLocation === 'All Locations' || selectedLocation === 'All';

                return (
                  <>
                    <button
                      type="button"
                      onClick={() => setLocationDropdownOpen(prev => !prev)}
                      aria-expanded={locationDropdownOpen}
                      className="group relative w-full px-4 py-3.5 rounded-2xl text-left transition-all duration-300 flex items-center justify-between gap-3 border cursor-pointer overflow-hidden bg-gradient-to-r from-[#122420] via-[#1B3831] to-[#122420] text-[#FFF7E2] border-[#C59B4E] shadow-[0_10px_28px_-4px_rgba(20,34,31,0.45)] ring-1 ring-[#DFBE79]/40"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center border shrink-0 bg-[#244940] border-[#DFBE79]/60 text-[#DFBE79] shadow-[0_0_12px_rgba(223,190,121,0.3)]">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <span
                          className="text-[19px] font-bold tracking-[0.06em] truncate"
                          style={{ fontFamily: '"Cormorant Garamond", serif' }}
                        >
                          {isAllSelected ? 'Select Location' : selectedLocation}
                        </span>
                      </div>

                      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all border bg-white/10 border-[#DFBE79]/40 text-[#DFBE79]">
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                          locationDropdownOpen ? 'rotate-180' : ''
                        }`} />
                      </div>

                      <span className="pointer-events-none absolute bottom-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-[#DFBE79] to-transparent" />
                    </button>

                    {/* Boutique Luxury Dropdown Panel (All Locations + 8 Full Uncut Micro-Markets) */}
                    {locationDropdownOpen && (
                      <div className="mt-2.5 rounded-2xl overflow-hidden bg-gradient-to-b from-[#FAF4E7] via-[#FDFBF6] to-[#F5ECDA] border border-[#C59B4E]/60 shadow-[0_22px_48px_-8px_rgba(20,34,31,0.22)] ring-1 ring-inset ring-white/80 z-30 relative">
                        {/* Signature Top Forest-to-Gold Hairline Bar */}
                        <div className="h-[2.5px] w-full bg-gradient-to-r from-[#14221F] via-[#DFBE79] to-[#14221F]" />

                        <div className="p-2.5 grid grid-cols-2 gap-2">
                          {/* All Locations Option inside Select Location (centered luxury champagne-ivory tile, styled like Borivali) */}
                          <button
                            type="button"
                            onClick={() => {
                              setLocationDropdownOpen(false);
                              handleLocationClick('All Locations');
                            }}
                            className={`col-span-2 group relative px-3 py-2.5 rounded-xl flex items-center justify-center gap-2.5 border transition-all duration-200 cursor-pointer active:scale-[0.98] overflow-hidden ${
                              isAllSelected
                                ? 'bg-gradient-to-r from-[#FFFDF7] via-[#FAF0D8] to-[#FFFDF7] text-[#14221F] border-[#C59B4E] shadow-[0_6px_16px_-4px_rgba(197,155,78,0.28)] ring-1 ring-[#DFBE79]/45'
                                : 'bg-gradient-to-b from-white to-[#FBF7EE] text-[#14221F] border-[#E0D2B4] shadow-[0_3px_10px_-2px_rgba(20,34,31,0.06)] hover:border-[#C59B4E] hover:bg-[#FAF4E4]'
                            }`}
                          >
                            <span className="h-[1px] w-6 bg-gradient-to-r from-transparent to-[#C59B4E]/60 shrink-0" />
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                              isAllSelected
                                ? 'bg-gradient-to-br from-[#14221F] to-[#245348] border-[#DFBE79] text-[#DFBE79] shadow-[0_2px_8px_rgba(20,34,31,0.28)]'
                                : 'bg-gradient-to-br from-[#F7EDD7] to-[#EAD8B2] border-[#C59B4E]/55 text-[#1B3831] group-hover:from-[#14221F] group-hover:to-[#245348] group-hover:text-[#DFBE79]'
                            }`}>
                              <Sparkles className="w-3 h-3" />
                            </span>
                            <span
                              className="text-[16px] font-bold tracking-[0.04em] whitespace-nowrap"
                              style={{ fontFamily: '"Cormorant Garamond", serif' }}
                            >
                              All Locations
                            </span>
                            <span className="h-[1px] w-6 bg-gradient-to-l from-transparent to-[#C59B4E]/60 shrink-0" />
                            {isAllSelected && (
                              <span className="pointer-events-none absolute bottom-0 left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-[#C59B4E] to-transparent" />
                            )}
                          </button>

                          {LOCATIONS_LIST.map((loc) => {
                            const isSelected = selectedLocation.toLowerCase() === loc.toLowerCase();

                            return (
                              <button
                                key={loc}
                                type="button"
                                onClick={() => {
                                  setLocationDropdownOpen(false);
                                  handleLocationClick(loc);
                                }}
                                className={`group relative px-2.5 py-2.5 rounded-xl text-left flex items-center gap-2 border transition-all duration-200 cursor-pointer active:scale-[0.97] overflow-hidden ${
                                  isSelected
                                    ? 'bg-gradient-to-br from-[#FFFDF7] via-[#FAF0D8] to-[#F3E3BE] text-[#14221F] border-[#C59B4E] shadow-[0_6px_16px_-4px_rgba(197,155,78,0.28)] ring-1 ring-[#DFBE79]/45'
                                    : 'bg-gradient-to-b from-white to-[#FBF7EE] text-[#14221F] border-[#E0D2B4] shadow-[0_3px_10px_-2px_rgba(20,34,31,0.06)] hover:border-[#C59B4E] hover:from-[#FFFDF8] hover:to-[#F7EEDB]'
                                }`}
                              >
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                                  isSelected
                                    ? 'bg-gradient-to-br from-[#14221F] to-[#245348] border-[#DFBE79] text-[#DFBE79] shadow-[0_2px_8px_rgba(20,34,31,0.28)]'
                                    : 'bg-gradient-to-br from-[#F7EDD7] to-[#EAD8B2] border-[#C59B4E]/55 text-[#1B3831] group-hover:from-[#14221F] group-hover:to-[#245348] group-hover:text-[#DFBE79]'
                                }`}>
                                  <MapPin className="w-3 h-3" />
                                </span>
                                <span
                                  className="text-[15.5px] font-bold tracking-[0.02em] whitespace-nowrap"
                                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                                >
                                  {loc}
                                </span>
                                {isSelected && (
                                  <span className="pointer-events-none absolute bottom-0 left-3 right-3 h-[1.5px] bg-gradient-to-r from-transparent via-[#C59B4E] to-transparent" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>

          {/* Desktop View: Attractive & Animated Location Cards Grid – Balanced Medium Size Layout */}
          <div className="hidden md:block pt-2">
            <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-3.5">
              
              {/* All Locations Master Card */}
              <button
                type="button"
                onClick={() => handleLocationClick('All Locations')}
                className={`group relative p-2.5 xs:p-3.5 sm:p-4 rounded-xl text-left transition-all duration-300 flex flex-col justify-between border cursor-pointer min-h-[88px] sm:min-h-[92px] ${
                  selectedLocation === 'All Locations' || selectedLocation === 'All'
                    ? 'bg-gradient-to-br from-[#14221F] via-[#1D3530] to-[#245348] text-white border-[#C59B4E] shadow-[0_8px_20px_-3px_rgba(36,83,72,0.45)] ring-2 ring-[#C59B4E]/60 scale-[1.02]'
                    : 'bg-white text-[#14221F] border-[#EAE6DF] hover:border-[#C59B4E] hover:shadow-md hover:-translate-y-1'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    selectedLocation === 'All Locations' || selectedLocation === 'All'
                      ? 'bg-[#284F45] text-[#DFBE79] shadow-xs'
                      : 'bg-[#FAF9F6] text-[#245348] group-hover:bg-[#245348] group-hover:text-[#DFBE79]'
                  }`}>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-bold transition-colors ${
                    selectedLocation === 'All Locations' || selectedLocation === 'All'
                      ? 'bg-[#14221F] text-[#DFBE79] border border-[#C59B4E]/40'
                      : 'bg-[#FAF9F6] text-gray-700 border border-[#EAE6DF] group-hover:border-[#C59B4E]/40'
                  }`}>
                    {PROJECTS_DATA.length} Projects
                  </span>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-sm sm:text-base font-bold tracking-tight">
                      All Locations
                    </h4>
                    <span className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      selectedLocation === 'All Locations' || selectedLocation === 'All'
                        ? 'bg-white/10 text-[#DFBE79]'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      Portfolio
                    </span>
                  </div>
                  <p className={`text-[11px] font-light truncate ${
                    selectedLocation === 'All Locations' || selectedLocation === 'All'
                      ? 'text-gray-300'
                      : 'text-gray-500'
                  }`}>
                    All 8 micro-markets
                  </p>
                </div>

                {/* Active Gold Indicator Bar */}
                {(selectedLocation === 'All Locations' || selectedLocation === 'All') && (
                  <div className="absolute -bottom-0.5 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-[#C59B4E] to-transparent rounded-full animate-pulse" />
                )}
              </button>

              {/* 8 Required Location Cards */}
              {LOCATIONS_LIST.map((loc) => {
                const isSelected = selectedLocation.toLowerCase() === loc.toLowerCase();
                const projectCount = PROJECTS_DATA.filter(p => p.location.toLowerCase() === loc.toLowerCase()).length;
                const meta = LOCATION_META[loc] || { subtitle: "Western Suburbs", tag: "Signature Living" };

                return (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => handleLocationClick(loc)}
                    className={`group relative p-2.5 xs:p-3.5 sm:p-4 rounded-xl text-left transition-all duration-300 flex flex-col justify-between border cursor-pointer min-h-[88px] sm:min-h-[92px] ${
                      isSelected
                        ? 'bg-gradient-to-br from-[#14221F] via-[#1D3530] to-[#245348] text-white border-[#C59B4E] shadow-[0_8px_20px_-3px_rgba(36,83,72,0.45)] ring-2 ring-[#C59B4E]/60 scale-[1.02]'
                        : 'bg-white text-[#14221F] border-[#EAE6DF] hover:border-[#C59B4E] hover:shadow-md hover:-translate-y-1'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-[#284F45] text-[#DFBE79] shadow-xs'
                          : 'bg-[#FAF9F6] text-[#245348] group-hover:bg-[#245348] group-hover:text-[#DFBE79]'
                      }`}>
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-bold transition-colors ${
                        isSelected
                          ? 'bg-[#14221F] text-[#DFBE79] border border-[#C59B4E]/40'
                          : 'bg-[#FAF9F6] text-gray-700 border border-[#EAE6DF] group-hover:border-[#C59B4E]/40'
                      }`}>
                        {projectCount} {projectCount === 1 ? 'Project' : 'Projects'}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif text-sm sm:text-base font-bold tracking-tight">
                          {loc}
                        </h4>
                        {meta.tag && (
                          <span className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            isSelected
                              ? 'bg-white/10 text-[#DFBE79]'
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {meta.tag}
                          </span>
                        )}
                      </div>
                      <p className={`text-[11px] font-light truncate ${
                        isSelected ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {meta.subtitle}
                      </p>
                    </div>

                    {/* Active Gold Indicator Bar */}
                    {isSelected && (
                      <div className="absolute -bottom-0.5 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-[#C59B4E] to-transparent rounded-full animate-pulse" />
                    )}
                  </button>
                );
              })}

            </div>
          </div>

          {/* Search & Quick Filter Controls Bar */}
          <div id="projects-showcase-section" className="relative overflow-hidden bg-gradient-to-b from-white via-[#FDFBF7] to-[#F8F3E6] p-3.5 sm:p-5 rounded-2xl border border-[#E2D5BC] shadow-[0_10px_28px_-8px_rgba(20,34,31,0.1)] flex flex-col md:flex-row items-center justify-between gap-3.5 sm:gap-4 scroll-mt-24">
            <div className="pointer-events-none absolute top-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-[#DFBE79]/85 to-transparent" />
            
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-[#9E7B42] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search project, builder, or micro-market..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/95 border border-[#DFD2B8] focus:border-[#C59B4E] focus:ring-2 focus:ring-[#DFBE79]/25 rounded-xl pl-10 pr-9 py-2.5 text-xs text-[#14221F] placeholder:text-[#8C8170] shadow-[inset_0_1px_3px_rgba(20,34,31,0.04)] focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C8170] hover:text-[#14221F] p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* BHK Filter Badges */}
            <div className="flex items-center justify-between sm:justify-start gap-1.5 overflow-x-auto w-full md:w-auto pb-0.5 md:pb-0 no-scrollbar">
              <span className="text-[11px] uppercase tracking-wider text-[#8B6846] font-mono mr-1 hidden sm:inline shrink-0">
                Typology:
              </span>
              {['All', '2 BHK', '3 BHK', '4 BHK', 'Jodi'].map((bhk) => (
                <button
                  key={bhk}
                  type="button"
                  onClick={() => setSelectedBhk(bhk)}
                  className={`px-2.5 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs tracking-[0.02em] font-medium transition-all duration-200 cursor-pointer shrink-0 ${
                    selectedBhk === bhk
                      ? 'bg-gradient-to-r from-[#122420] via-[#1C3A33] to-[#245348] text-[#FCE9BE] border border-[#C59B4E] shadow-[0_4px_12px_-2px_rgba(20,34,31,0.35)] font-semibold'
                      : 'bg-white text-[#3F4B47] hover:bg-[#FAF4E7] hover:text-[#14221F] border border-[#E2D6BE] hover:border-[#C59B4E]/70 shadow-[0_1px_3px_rgba(20,34,31,0.04)]'
                  }`}
                >
                  {bhk}
                </button>
              ))}
            </div>

          </div>

          {/* ============================================================== */}
          {/* SECTION C & D: LOCATION-WISE PROJECT INFORMATION CARDS GRID    */}
          {/* ============================================================== */}
          {displayedProjects.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#EAE6DF] p-12 text-center space-y-4">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto" />
              <h3 className="font-serif text-xl font-bold text-[#14221F]">
                No developments matched your current criteria
              </h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Try resetting your search query or switching to "All Locations" to view our complete Mumbai portfolio.
              </p>
              <button
                onClick={() => {
                  setSelectedLocation('All Locations');
                  setSearchQuery('');
                  setSelectedBhk('All');
                }}
                className="px-6 py-2.5 rounded-xl bg-[#245348] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#1B3F37] transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {(() => {
                cardRefs.current = [];
                return displayedProjects.map((project, cardIdx) => {
                  const hasVirtualTour = Boolean(project.virtualTourUrl);
                  const bhkChips = getCleanBhkChips(project.configurations);
                  const hasConnectivity = Boolean(
                    project.transit?.metro ||
                    project.transit?.landmark ||
                    (project.keyFeatures && project.keyFeatures.length > 0)
                  );

                  return (
                    <div
                      key={`${selectedLocation}-${selectedBhk}-${project.id}`}
                      ref={(el) => {
                        if (el) cardRefs.current[cardIdx] = el;
                      }}
                      style={{ '--card-delay': `${(cardIdx % 3) * 75}ms` }}
                      className="project-card-reveal relative bg-gradient-to-b from-white via-white to-[#FCF9F3] rounded-[22px] overflow-hidden border border-[#E6DDCB] shadow-[0_10px_30px_-8px_rgba(20,34,31,0.10)] hover:shadow-[0_24px_50px_-12px_rgba(20,34,31,0.20)] hover:border-[#C59B4E] flex flex-col group"
                    >
                      {/* Signature Forest-Gold Luxury Top Bar */}
                      <div className="h-[3px] w-full bg-gradient-to-r from-[#14221F] via-[#DFBE79] to-[#14221F]" />

                      {/* 1. Main Project Image with subtle zoom on hover & mobile scroll focus */}
                      <div
                        className="relative h-44 sm:h-48 overflow-hidden bg-[#0E1715] flex items-center justify-center cursor-pointer"
                        onClick={() => onSelectProject(project)}
                      >
                        {project.coverImage ? (
                          <>
                            {/* Ambient soft backdrop so full portrait towers fit beautifully without blank space */}
                            <img
                              src={project.coverImage}
                              alt=""
                              aria-hidden="true"
                              className="absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-110 pointer-events-none"
                            />

                            <img
                              src={project.coverImage}
                              alt={project.name}
                              referrerPolicy="no-referrer"
                              onError={(e) => handleProjectImgError(e, project.fallbackCover)}
                              className="project-card-photo relative z-10 w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0D1A17]/85 via-black/15 to-black/25 opacity-85 group-hover:opacity-70 transition-opacity" />
                            {/* Subtle Champagne Light Sheen Sweep */}
                            <div className="project-card-sheen z-10" />
                          </>
                        ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#14221F] via-[#1D3530] to-[#245348] flex flex-col items-center justify-center p-4 text-center select-none relative z-10">
                          <div className="w-12 h-12 rounded-full bg-[#DFBE79]/15 border border-[#DFBE79]/30 flex items-center justify-center mb-2 shadow-inner">
                            <Building2 className="w-6 h-6 text-[#DFBE79]" />
                          </div>
                          <span className="text-xs font-serif font-semibold text-[#DFBE79] tracking-wider uppercase">
                            Exclusive Residence
                          </span>
                          <span className="text-[10px] text-gray-300 font-mono tracking-tight mt-0.5">
                            Photos Available on Advisory Request
                          </span>
                        </div>
                      )}

                      {/* Top Overlay Row: Frosted Location Badge & Status Pill */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-20 pointer-events-none">
                        {/* Clickable Location Map Pill */}
                        <a
                          href={project.coords ? `https://www.google.com/maps/search/?api=1&query=${project.coords.lat},${project.coords.lng}` : project.mapUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title={`View exact location of ${project.name} on Google Maps (${project.locality || project.location})`}
                          className="bg-[#12221E]/80 hover:bg-[#12221E] backdrop-blur-md px-3 py-1 rounded-full text-[10.5px] uppercase tracking-wider font-semibold text-[#FFF7E2] shadow-md flex items-center gap-1.5 max-w-[58%] truncate transition-all pointer-events-auto border border-[#DFBE79]/35 hover:border-[#DFBE79] group/loc"
                        >
                          <MapPin className="w-3 h-3 text-[#DFBE79] shrink-0 group-hover/loc:scale-110 transition-transform" />
                          <span className="truncate">{project.locality || project.location}</span>
                        </a>

                        {/* Status Badge */}
                        <div className="bg-white/95 backdrop-blur-md text-[#183C32] border border-[#DFBE79]/50 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wide font-semibold shadow-md max-w-[40%] truncate shrink-0 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                          <span className="truncate">{project.status || 'Verified'}</span>
                        </div>
                      </div>

                      {/* Bottom Right: 360° Virtual Tour button - strictly conditional */}
                      {hasVirtualTour && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenTour(project.id);
                          }}
                          className="absolute bottom-3 right-3 z-20 bg-[#183C32]/90 hover:bg-[#245348] backdrop-blur-md text-white px-3 py-1 rounded-full text-[10.5px] font-semibold flex items-center gap-1.5 shadow-md transition-all border border-[#DFBE79]/50 hover:scale-105 active:scale-95"
                        >
                          <Compass className="w-3.5 h-3.5 text-[#DFBE79] animate-spin" style={{ animationDuration: '8s' }} />
                          <span>360° Tour</span>
                        </button>
                      )}

                      {/* Bottom Left: Multiple photos count pill */}
                      {project.images && project.images.length > 0 && (
                        <div className="absolute bottom-3 left-3 z-20 bg-[#12221E]/75 backdrop-blur-md text-[#FFF7E2] border border-white/15 px-2.5 py-1 rounded-full text-[10px] font-mono flex items-center gap-1.5 shadow-sm">
                          <Eye className="w-3 h-3 text-[#DFBE79]" />
                          <span>{project.images.length} {project.images.length === 1 ? 'Photo' : 'Photos'}</span>
                        </div>
                      )}
                    </div>

                    {/* Card Content Body */}
                    <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
                      <div className="space-y-2">

                        {/* Refined Developer Eyebrow */}
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-[1.5px] bg-gradient-to-r from-[#C59B4E] to-[#DFBE79] rounded-full shrink-0" />
                          <span className="text-[10px] font-mono font-semibold text-[#8B6846] uppercase tracking-[0.2em] truncate">
                            {project.builder}
                          </span>
                        </div>

                        {/* Sculptural Project Name & Editorial Tagline */}
                        <div className="-mt-0.5">
                          <h3
                            onClick={() => onSelectProject(project)}
                            className="text-[21px] sm:text-[23px] font-bold text-[#14221F] group-hover:text-[#1D3530] transition-colors cursor-pointer truncate leading-tight tracking-tight"
                            style={{ fontFamily: '"Cormorant Garamond", serif' }}
                            title={project.name}
                          >
                            {project.name}
                          </h3>
                          <p className="text-[11.5px] text-[#6A5F52] mt-0.5 line-clamp-1 font-serif italic min-h-[15px]" title={project.tagline || project.overview}>
                            {project.tagline || project.overview}
                          </p>
                        </div>

                        {/* Clean, Deduplicated Champagne BHK Pills */}
                        <div className="flex flex-wrap items-center gap-1.5 min-h-[24px]">
                          {bhkChips.map((chip, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-0.5 rounded-full bg-[#FAF6EC] border border-[#E5D7B8] text-[10px] font-semibold text-[#1D3530] tracking-wide group-hover:border-[#C59B4E] transition-colors shadow-[0_1px_2px_rgba(197,155,78,0.08)]"
                            >
                              {chip}
                            </span>
                          ))}
                        </div>

                        {/* Recessed Luxury Connectivity Highlight Box */}
                        {hasConnectivity && (
                          <div className="rounded-xl bg-[#FAF8F3] border border-[#EFE7D8] px-2.5 py-2 space-y-1">
                            {project.transit?.metro && (
                              <div className="flex items-center gap-2 text-[10.5px] text-[#1D3530] font-medium truncate">
                                <span className="w-4 h-4 rounded-full bg-[#1D3530]/10 text-[#1D3530] flex items-center justify-center shrink-0">
                                  <Train className="w-2.5 h-2.5" />
                                </span>
                                <span className="truncate" title={project.transit.metro}>
                                  {project.transit.metro}
                                </span>
                              </div>
                            )}

                            {project.transit?.landmark ? (
                              <div className="flex items-center gap-2 text-[10.5px] text-[#63584C] font-normal truncate">
                                <span className="w-4 h-4 rounded-full bg-[#C59B4E]/15 text-[#8B6846] flex items-center justify-center shrink-0">
                                  <Building2 className="w-2.5 h-2.5" />
                                </span>
                                <span className="truncate" title={project.transit.landmark}>
                                  {project.transit.landmark}
                                </span>
                              </div>
                            ) : project.keyFeatures && project.keyFeatures.length > 0 ? (
                              <div className="flex items-center gap-2 text-[10.5px] text-[#63584C] font-normal truncate">
                                <span className="w-4 h-4 rounded-full bg-[#C59B4E]/15 text-[#8B6846] flex items-center justify-center shrink-0">
                                  <Navigation className="w-2.5 h-2.5" />
                                </span>
                                <span className="truncate" title={project.keyFeatures[0]}>
                                  {project.keyFeatures[0]}
                                </span>
                              </div>
                            ) : null}
                          </div>
                        )}

                      </div>

                      {/* Pricing & Dual Boutique CTA Action Buttons */}
                      <div className="pt-2.5 space-y-2.5 relative">
                        {/* Refined Champagne Gold Divider */}
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#DFBE79]/70 to-transparent" />

                        <div className="flex items-end justify-between gap-2">
                          <div>
                            <span className="text-[9px] uppercase text-[#8B6846] block font-mono tracking-[0.16em] font-semibold">
                              Indicative Price
                            </span>
                            <div className="font-sans text-[17px] sm:text-[19px] font-bold text-[#14221F] tracking-tight group-hover:text-[#1D3530] transition-colors leading-snug">
                              {project.priceRange || project.priceDisplay}
                            </div>
                          </div>
                          <span className="text-[9px] text-[#8E8477] italic font-serif pb-0.5 shrink-0">
                            *Onwards
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => onSelectProject(project)}
                            className="w-full py-2 px-3 rounded-xl border border-[#1D3530]/35 bg-[#FAF8F3] hover:bg-[#1D3530] text-[#1D3530] hover:text-[#DFBE79] hover:border-[#1D3530] text-[10.5px] uppercase tracking-[0.14em] font-bold transition-all duration-200 text-center cursor-pointer shadow-xs active:scale-[0.98]"
                          >
                            Details
                          </button>

                          <button
                            type="button"
                            onClick={() => onOpenEnquiry({
                              projectName: project.name,
                              location: project.location,
                              project: project
                            })}
                            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#14221F] via-[#1D3530] to-[#245348] hover:from-[#DFBE79] hover:via-[#C59B4E] hover:to-[#B3883B] text-[#FFF7E2] hover:text-[#14221F] border border-[#C59B4E]/60 text-[10.5px] uppercase tracking-[0.14em] font-bold transition-all duration-300 shadow-[0_6px_18px_rgba(20,34,31,0.2)] hover:shadow-[0_8px_22px_rgba(197,155,78,0.35)] flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
                          >
                            <PhoneCall className="w-3.5 h-3.5 text-[#DFBE79] group-hover:text-current" />
                            <span>Enquire</span>
                          </button>
                        </div>
                      </div>

                    </div>

                    </div>
                  );
                });
              })()}
            </div>
          )}

        </div>
      </section>

    </div>
  );
}
