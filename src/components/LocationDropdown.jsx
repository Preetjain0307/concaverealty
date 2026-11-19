import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Check 
} from 'lucide-react';

/**
 * Clean Location Catalog matching user's exact mockup
 * Minimal, elegant, with zero clutter, search bar, or logos
 */
const POPULAR_LOCATIONS = [
  {
    name: 'All Locations',
    display: 'All Locations',
    subtitle: 'Explore properties in Mumbai'
  },
  {
    name: 'Borivali',
    display: 'Borivali',
    subtitle: 'Western suburbs'
  },
  {
    name: 'Kandivali',
    display: 'Kandivali',
    subtitle: 'Residential neighbourhood'
  },
  {
    name: 'Malad',
    display: 'Malad',
    subtitle: 'Commercial & skyline living'
  },
  {
    name: 'Goregaon',
    display: 'Goregaon',
    subtitle: 'Integrated luxury township'
  },
  {
    name: 'Jogeshwari',
    display: 'Jogeshwari',
    subtitle: 'Western suburbs & metro corridor'
  },
  {
    name: 'Andheri',
    display: 'Andheri',
    subtitle: 'Prime commercial & seafront living'
  },
  {
    name: 'Bandra',
    display: 'Bandra',
    subtitle: 'Ultra prime coastal residences'
  },
  {
    name: 'Lower Parel',
    display: 'Lower Parel',
    subtitle: 'South Mumbai skyscraper district'
  }
];

export function LocationDropdown({
  selectedLocation = 'All Locations',
  onSelectLocation,
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef(null);
  const isAllSelected = selectedLocation === 'All Locations' || selectedLocation === 'All';

  // Find active location object
  const activeLocation = useMemo(() => {
    if (isAllSelected) {
      return POPULAR_LOCATIONS[0];
    }
    return POPULAR_LOCATIONS.find(
      (loc) => loc.name.toLowerCase() === selectedLocation.toLowerCase()
    ) || {
      name: selectedLocation,
      display: selectedLocation,
      subtitle: 'Western suburbs'
    };
  }, [selectedLocation, isAllSelected]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (locName) => {
    if (onSelectLocation) {
      onSelectLocation(locName);
    }
    setIsOpen(false);
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % POPULAR_LOCATIONS.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + POPULAR_LOCATIONS.length) % POPULAR_LOCATIONS.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (POPULAR_LOCATIONS[highlightedIndex]) {
          handleSelect(POPULAR_LOCATIONS[highlightedIndex].name);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      case 'Tab':
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-sm sm:max-w-md mx-auto ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Small Eyebrow Label with subtle gold accent dot */}
      <div className="mb-1.5 px-1 flex items-center justify-between text-left">
        <span className="text-[10.5px] font-mono tracking-[0.18em] uppercase font-bold text-[#245348] select-none flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C59B4E] animate-pulse" />
          SELECT LOCATION
        </span>
      </div>

      {/* ============================================================== */}
      {/* CLOSED TRIGGER BUTTON                                          */}
      {/* Animated White Luxury Box matching website brand colors        */}
      {/* ============================================================== */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Select location: Currently ${activeLocation.display}`}
        className={`group relative w-full px-3.5 py-2.5 sm:py-3 rounded-xl text-left transition-all duration-300 ease-out flex items-center justify-between gap-3 bg-white border cursor-pointer select-none active:scale-[0.99] hover:-translate-y-0.5 overflow-hidden ${
          isOpen
            ? 'border-[#C59B4E] bg-gradient-to-r from-white via-[#F4F9F6] to-white ring-2 ring-[#DFBE79]/35 shadow-[0_12px_30px_rgba(20,34,31,0.14)]'
            : 'border-[#E2DDD3] hover:border-[#C59B4E] hover:bg-gradient-to-r from-white via-[#FAFDFB] to-white shadow-[0_4px_16px_rgba(20,34,31,0.06)] hover:shadow-[0_10px_25px_rgba(20,34,31,0.12)]'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Circular Pin Icon Medallion with animated hover scale */}
          <div className="w-7 h-7 rounded-full flex items-center justify-center border shrink-0 bg-[#EAF4F0] border-[#C59B4E]/60 text-[#14221F] shadow-xs group-hover:scale-110 group-hover:border-[#C59B4E] transition-transform duration-300 ease-out">
            <div className="w-2.5 h-2.5 rounded-full border-[1.5px] border-[#245348] flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-[#C59B4E]" />
            </div>
          </div>

          <span className="text-[14.5px] sm:text-[15.5px] font-semibold text-[#14221F] tracking-tight truncate font-sans group-hover:text-[#0D1C18] transition-colors">
            {isAllSelected ? 'All Locations' : activeLocation.display}
          </span>
        </div>

        {/* Right Dropdown Arrow in Forest Green / Gold */}
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-[#245348] group-hover:text-[#C59B4E] transition-all duration-300 ease-out shrink-0 ${
            isOpen ? 'rotate-180 text-[#C59B4E]' : ''
          }`}
        >
          <ChevronDown className="w-3.5 h-3.5 stroke-[2.2]" />
        </div>

        {/* Subtle Animated Bottom Gold Accent Line on Hover */}
        <span className="pointer-events-none absolute bottom-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-[#C59B4E] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>

      {/* ============================================================== */}
      {/* DROPDOWN PANEL                                                 */}
      {/* Animated White Box with website green & gold accents           */}
      {/* ============================================================== */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Popular Locations"
          className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl overflow-hidden bg-white border border-[#E0D8CA] shadow-[0_20px_45px_-8px_rgba(20,34,31,0.2)] animate-in fade-in slide-in-from-top-2 duration-200 ease-out"
        >
          {/* Signature Brand Forest-to-Gold Hairline Bar */}
          <div className="h-[2px] w-full bg-gradient-to-r from-[#14221F] via-[#C59B4E] to-[#14221F]" />

          {/* Section Header: POPULAR LOCATIONS */}
          <div className="px-3.5 pt-2.5 pb-1 text-left border-b border-[#F0EBE1] bg-[#FAF8F5]/60 flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-[0.16em] uppercase font-bold text-[#4D685E] select-none">
              POPULAR LOCATIONS
            </span>
            <span className="text-[10px] font-mono text-[#C59B4E] font-medium">
              Mumbai
            </span>
          </div>

          {/* Locations List (White background with light green highlight & hover animation) */}
          <div className="p-1.5 space-y-0.5 max-h-[250px] sm:max-h-[280px] overflow-y-auto custom-scrollbar">
            {POPULAR_LOCATIONS.map((loc, idx) => {
              const isSelected = isAllSelected 
                ? loc.name === 'All Locations'
                : selectedLocation.toLowerCase() === loc.name.toLowerCase();
              const isHighlighted = idx === highlightedIndex;

              return (
                <button
                  key={loc.name}
                  type="button"
                  onClick={() => handleSelect(loc.name)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={`group relative w-full px-3 py-2 sm:py-2.5 rounded-lg flex items-center justify-between gap-2.5 text-left transition-all duration-200 cursor-pointer active:scale-[0.99] overflow-hidden ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#E3F2EB] via-[#EBF6F1] to-[#E3F2EB] border border-[#C59B4E]/60 text-[#14221F] shadow-xs'
                      : isHighlighted
                      ? 'bg-[#F2F8F5] border border-[#D5E6DE] text-[#14221F] translate-x-0.5'
                      : 'bg-white border border-transparent text-[#14221F] hover:bg-[#F6FAF8] hover:translate-x-0.5'
                  }`}
                >
                  {/* Left: Name & Subtitle in Website Green */}
                  <div className="flex flex-col min-w-0 flex-1 pl-0.5">
                    <span className={`text-[14px] sm:text-[14.5px] tracking-tight truncate leading-tight font-sans ${
                      isSelected ? 'font-bold text-[#0D241D]' : 'font-semibold text-[#14221F] group-hover:text-[#0D241D]'
                    }`}>
                      {loc.display}
                    </span>
                    <span className={`text-[11.5px] font-sans truncate leading-tight mt-0.5 ${
                      isSelected ? 'text-[#245348] font-medium' : 'text-[#566E64] group-hover:text-[#385348]'
                    }`}>
                      {loc.subtitle}
                    </span>
                  </div>

                  {/* Right: Animated checkmark or chevron */}
                  <div className="flex items-center gap-1 shrink-0 pl-1">
                    {isSelected ? (
                      <Check className="w-3.5 h-3.5 text-[#14221F] stroke-[2.5] animate-in zoom-in-75 duration-150" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-[#8CA097] group-hover:text-[#C59B4E] group-hover:translate-x-0.5 transition-all duration-200" />
                    )}
                  </div>

                  {/* Active Animated Bottom Gold Pulse Indicator Bar */}
                  {isSelected && (
                    <span className="pointer-events-none absolute bottom-0 left-3 right-3 h-[1.5px] bg-gradient-to-r from-transparent via-[#C59B4E] to-transparent animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
