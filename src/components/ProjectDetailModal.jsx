import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  MapPin,
  Building2,
  Layers,
  ShieldCheck,
  Compass,
  PhoneCall,
  Calendar,
  ExternalLink,
  Info,
  Lock,
  Eye,
  Navigation,
  Sparkles,
  CheckCircle2,
  Train,
  ShoppingBag,
  Car,
  Trees,
  Waves,
  Dumbbell,
  Trophy,
  Crown,
  Film,
  Flame,
  ArrowUpRight,
  Plane,
  Maximize2
} from 'lucide-react';

// Seamlessly try multiple extensions (1.jpg -> 1.png -> 1.webp -> 1.jpeg) when user adds photos
const handleModalImgError = (e, fallback) => {
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
    e.currentTarget.src = '/projects/project_img_27.jpg';
  }
};

const getFeatureConfig = (feat = '') => {
  const f = feat.toLowerCase();
  if (/metro|railway|train|station|monorail/.test(f)) {
    return { category: 'Transit & Metro', icon: Train };
  }
  if (/mall|retail|inorbit|infiniti|shopping|phoenix|market/.test(f)) {
    return { category: 'Lifestyle & Retail', icon: ShoppingBag };
  }
  if (/highway|express|weh|road|jvlr|sea link|coastal|freeway/.test(f)) {
    return { category: 'Arterial Corridor', icon: Car };
  }
  if (/park|forest|sea|beach|mountain|green|nature|promenade|racecourse/.test(f)) {
    return { category: 'Scenic & Nature', icon: Trees };
  }
  if (/airport|bkc|sez|it park|commercial|corporate/.test(f)) {
    return { category: 'Commercial Nexus', icon: Building2 };
  }
  return { category: 'Key Advantage', icon: Sparkles };
};

const getAmenityConfig = (amenity = '') => {
  const a = amenity.toLowerCase();
  if (/pool|lap|infinity|aquatic|splash|jacuzzi/.test(a)) {
    return { category: 'Aquatics', icon: Waves };
  }
  if (/gym|fitness|crossfit|aerobics|workout/.test(a)) {
    return { category: 'Fitness', icon: Dumbbell };
  }
  if (/spa|sauna|steam|hydrotherapy|wellness/.test(a)) {
    return { category: 'Wellness', icon: Flame };
  }
  if (/tennis|squash|badminton|cricket|sports|court/.test(a)) {
    return { category: 'Sports', icon: Trophy };
  }
  if (/park|garden|trail|tree|reflexology|nature/.test(a)) {
    return { category: 'Nature', icon: Trees };
  }
  if (/lounge|deck|sky|stargazing|sundeck/.test(a)) {
    return { category: 'Sky Living', icon: Crown };
  }
  if (/theatre|cineplex|screening|cinema/.test(a)) {
    return { category: 'Entertainment', icon: Film };
  }
  if (/concierge|valet|security|biometric|access/.test(a)) {
    return { category: 'Privilege', icon: ShieldCheck };
  }
  if (/club|banquet|ballroom|hall/.test(a)) {
    return { category: 'Clubhouse', icon: Building2 };
  }
  return { category: 'Lifestyle', icon: Sparkles };
};

export function ProjectDetailModal({ project, onClose, onOpenTour, onOpenEnquiry }) {
  if (!project) return null;

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const modalRef = useRef(null);

  // Always reset to the primary official hero image when opening or changing projects
  useEffect(() => {
    setActiveImageIdx(0);
  }, [project?.id]);

  // Auto-focus modal on open for keyboard accessibility
  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  const imagesList = (project.images && project.images.length > 0)
    ? project.images
    : (project.coverImage ? [project.coverImage] : []);

  const currentImage = imagesList[activeImageIdx] || project.coverImage || '';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        tabIndex="-1"
        className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border border-gray-200 focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar using #1D3530 */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-[#1D3530] text-white gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h3 id="project-modal-title" className="font-serif text-lg sm:text-2xl font-bold truncate">
                {project.name}
              </h3>
              {project.status && (
                <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider px-1.5 sm:px-2 py-0.5 rounded bg-[#284F45] text-[#DFBE79] border border-[#C59B4E]/40 shrink-0">
                  {project.status}
                </span>
              )}
            </div>
            <p className="text-[11px] sm:text-xs text-[#DFBE79] mt-0.5 truncate">
              {project.builder} • {project.locality || project.location}, {project.city || 'Mumbai'}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close project details"
            className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6 flex-1 text-[#14221F]">

          {/* Section: Property Image Gallery */}
          <div className="space-y-3">
            <div 
              className="relative h-72 sm:h-96 md:h-[490px] rounded-xl overflow-hidden border border-[#EAE6DF] bg-[#0E1715] flex items-center justify-center group cursor-pointer"
              onClick={() => setIsLightboxOpen(true)}
              title="Click to view full photo"
            >
              {currentImage ? (
                <>
                  {/* Soft ambient background for portrait photos so full photo fits without black bars */}
                  <img
                    src={currentImage}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-35 scale-110 pointer-events-none"
                  />

                  {/* Main Photo - fully visible without cropping */}
                  <img
                    src={currentImage}
                    alt={`${project.name} exterior view, ${project.location} Mumbai`}
                    referrerPolicy="no-referrer"
                    onError={(e) => handleModalImgError(e, project.fallbackCover)}
                    className="relative z-10 w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.01]"
                  />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6 text-white/70 space-y-3 z-10">
                  <div className="w-16 h-16 rounded-full bg-[#1D3530] border border-[#DFBE79]/40 flex items-center justify-center text-[#DFBE79]">
                    <Building2 className="w-8 h-8" />
                  </div>
                  <p className="font-serif text-lg text-white font-medium">New Photos Being Curated</p>
                  <p className="text-xs text-white/60 max-w-sm">All previous project visuals removed. Ready for new official photo uploads for {project.name}.</p>
                </div>
              )}

              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 pointer-events-none" />

              {/* Top right Expand / Fullscreen icon */}
              <div className="absolute top-3 right-3 z-20 pointer-events-auto">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLightboxOpen(true);
                  }}
                  title="View full size photo"
                  aria-label="View full size photo"
                  className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-md transition-all border border-white/20 shadow-md hover:scale-105 cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              <div 
                className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="text-xs uppercase font-mono tracking-wider bg-white/95 text-[#14221F] px-3 py-1 rounded shadow-sm font-semibold">
                  {project.locality || project.location}
                </span>

                {/* 360° Virtual Tour button - strictly conditional */}
                {project.virtualTourUrl && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenTour(project.id);
                    }}
                    aria-label={`Open 360° virtual tour for ${project.name}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-semibold bg-[#245348] text-white shadow-md hover:bg-[#1B3F37] transition-colors"
                  >
                    <Compass className="w-4 h-4 text-[#DFBE79] animate-spin" style={{ animationDuration: '10s' }} />
                    <span>360° Virtual Tour</span>
                  </button>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {imagesList.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {imagesList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-20 h-14 rounded overflow-hidden border-2 flex-shrink-0 transition-all ${activeImageIdx === idx ? 'border-[#245348] scale-105 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                  >
                    <img
                      src={img}
                      alt={`${project.name} - project photo ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      onError={(e) => handleModalImgError(e, project.fallbackCover)}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & Quick Enquire Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-lg bg-[#FAF9F6] border border-[#EAE6DF]">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-gray-500 font-mono">
                Indicative Quoted Price
              </div>
              <div className="font-sans text-xl sm:text-3xl font-semibold text-[#14221F] tracking-tight">
                {project.priceRange || project.priceDisplay}
              </div>
              <div className="text-[10px] sm:text-[11px] text-[#C59B4E] font-medium">
                *Subject to floor-rise, unit availability & developer confirmation
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {project.mapUrl && (
                <a
                  href={project.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded border border-[#EAE6DF] hover:border-black text-xs font-medium text-[#14221F] bg-white transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#245348] shrink-0" />
                  <span>Map</span>
                </a>
              )}

              <button
                onClick={() => {
                  onClose();
                  onOpenEnquiry({
                    projectName: project.name,
                    location: project.location,
                    project
                  });
                }}
                aria-label={`Enquire about ${project.name}`}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded bg-[#245348] hover:bg-[#1B3F37] text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5 shrink-0" />
                <span>Enquire Now</span>
              </button>
            </div>
          </div>

          {/* Section: Project Specifications */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#C59B4E]" />
                <h4 
                  className="text-lg sm:text-xl font-bold text-[#14221F] tracking-tight"
                  style={{ fontFamily: '"Cormorant Garamond", Cinzel, serif' }}
                >
                  Architectural Specifications
                </h4>
              </div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-gray-400 font-semibold">
                Official Roster
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#FAF8F5] to-white border border-[#EAE6DF] hover:border-[#C59B4E]/60 transition-all shadow-2xs group">
                <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                  <Layers className="w-3.5 h-3.5 text-[#C59B4E]" />
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold">Land Parcel</span>
                </div>
                <span className="font-bold text-[#14221F] text-sm block group-hover:text-[#183C32] transition-colors">{project.landParcel || 'On Request'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#FAF8F5] to-white border border-[#EAE6DF] hover:border-[#C59B4E]/60 transition-all shadow-2xs group">
                <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                  <Building2 className="w-3.5 h-3.5 text-[#C59B4E]" />
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold">Towers & Structure</span>
                </div>
                <span className="font-bold text-[#14221F] text-sm block group-hover:text-[#183C32] transition-colors">{project.towers || 'High-Rise Tower'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#FAF8F5] to-white border border-[#EAE6DF] hover:border-[#C59B4E]/60 transition-all shadow-2xs group">
                <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                  <Navigation className="w-3.5 h-3.5 text-[#C59B4E]" />
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold">Elevators</span>
                </div>
                <span className="font-bold text-[#14221F] text-sm block group-hover:text-[#183C32] transition-colors">{project.elevators || 'High-Speed Elevators'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#FAF8F5] to-white border border-[#EAE6DF] hover:border-[#C59B4E]/60 transition-all shadow-2xs group">
                <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold">MahaRERA Registered</span>
                </div>
                <span className="font-bold font-mono text-emerald-800 text-xs block break-all mt-0.5">
                  {project.rera || 'Verified / In Progress'}
                </span>
              </div>
            </div>
          </div>

          {/* Section: Key Connectivity & Strategic Features */}
          {project.keyFeatures && project.keyFeatures.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C59B4E] font-bold block">
                    Strategic Location Advantage
                  </span>
                  <h4 
                    className="text-xl sm:text-2xl font-bold text-[#14221F] tracking-tight mt-0.5"
                    style={{ fontFamily: '"Cormorant Garamond", Cinzel, serif' }}
                  >
                    Key Connectivity & Prime Landmarks
                  </h4>
                </div>
                <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#183C32]/10 border border-[#C59B4E]/30 text-[11px] text-[#183C32] font-semibold">
                  <Navigation className="w-3.5 h-3.5 text-[#C59B4E]" />
                  <span>Prime Micro-Market</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.keyFeatures.map((feat, idx) => {
                  const meta = getFeatureConfig(feat);
                  const IconComp = meta.icon;
                  return (
                    <div
                      key={idx}
                      className="relative flex items-center gap-3.5 p-3.5 rounded-xl bg-gradient-to-r from-[#FAF8F5] via-white to-[#FAF8F5] border border-[#E8E2D5] hover:border-[#C59B4E] hover:shadow-[0_8px_20px_rgba(20,34,31,0.08)] transition-all duration-300 group"
                    >
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#183C32] to-[#245348] text-[#DFBE79] border border-[#C59B4E]/30 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-108 group-hover:shadow-md transition-all duration-300">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C59B4E]" />
                          <span className="text-[9px] uppercase font-mono font-bold tracking-wider text-[#8B6846]">
                            {meta.category}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-[#183C32] leading-snug">
                          {feat}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section: Curated Lifestyle Amenities */}
          {project.amenities && project.amenities.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C59B4E] font-bold block">
                    World-Class Living
                  </span>
                  <h4 
                    className="text-xl sm:text-2xl font-bold text-[#14221F] tracking-tight mt-0.5"
                    style={{ fontFamily: '"Cormorant Garamond", Cinzel, serif' }}
                  >
                    Curated Lifestyle & Wellness Amenities
                  </h4>
                </div>
                <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-[#DFBE79]/20 to-[#C59B4E]/30 text-[#8B6846] text-xs font-semibold font-mono border border-[#C59B4E]/40 shadow-2xs shrink-0">
                  {project.amenitiesCount || `${project.amenities.length}+ Curated Facilities`}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {project.amenities.map((amenity, idx) => {
                  const meta = getAmenityConfig(amenity);
                  const IconComp = meta.icon;
                  return (
                    <div
                      key={idx}
                      className="relative flex flex-col justify-between p-3.5 rounded-xl bg-gradient-to-b from-white to-[#FAF9F6] border border-[#EAE6DF] hover:border-[#C59B4E] shadow-[0_2px_8px_rgba(20,34,31,0.03)] hover:shadow-[0_8px_22px_rgba(197,155,78,0.16)] transition-all duration-300 group hover:-translate-y-0.5"
                    >
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#183C32]/10 text-[#183C32] group-hover:bg-[#183C32] group-hover:text-[#DFBE79] flex items-center justify-center transition-colors duration-300 shadow-2xs">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className="text-[9px] uppercase font-mono tracking-wider text-gray-400 group-hover:text-[#C59B4E] transition-colors font-semibold">
                          {meta.category}
                        </span>
                      </div>
                      <div>
                        <h5 className="text-xs sm:text-[13px] font-bold text-[#14221F] group-hover:text-[#183C32] transition-colors leading-snug">
                          {amenity}
                        </h5>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section: Available Configurations & Quotations */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-serif text-base font-bold text-[#14221F]">
                Available Configurations & Quotations
              </h4>
              <span className="text-[11px] text-gray-500 font-mono">
                Possession: {project.possession}
              </span>
            </div>

            <div className="overflow-x-auto rounded border border-[#EAE6DF]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F6] text-gray-600 uppercase font-mono text-[10px] border-b border-[#EAE6DF]">
                  <tr>
                    <th className="py-2.5 px-3">Configuration</th>
                    <th className="py-2.5 px-3">Carpet Area</th>
                    <th className="py-2.5 px-3">Quoted Value*</th>
                    <th className="py-2.5 px-3">Possession</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE6DF] text-gray-800">
                  {project.configurations && project.configurations.length > 0 ? (
                    project.configurations.map((cfg, idx) => (
                      <tr key={idx} className="hover:bg-[#FAF9F6] transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-[#14221F]">
                          {cfg.bhk}
                          {cfg.floorPlanLabel && (
                            <span className="text-[10px] text-gray-500 block font-normal">
                              {cfg.floorPlanLabel}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-mono">{cfg.carpetArea}</td>
                        <td className="py-2.5 px-3 font-semibold text-[#245348]">{cfg.price}</td>
                        <td className="py-2.5 px-3 text-gray-500">{cfg.possessionDate || project.possession}</td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => {
                              onClose();
                              onOpenEnquiry({
                                projectName: project.name,
                                location: project.location,
                                configuration: cfg.bhk,
                                project
                              });
                            }}
                            className="px-3 py-1 rounded bg-[#245348] hover:bg-[#1B3F37] text-white text-[11px] font-medium transition-colors"
                          >
                            Enquire Unit
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-4 text-center text-gray-500">
                        Configurations and quotation available on request
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mandatory Price Disclaimer */}
            <div className="bg-[#FAF9F6] border-l-2 border-[#C59B4E] p-3 text-[11px] text-gray-600 leading-relaxed rounded-r">
              <p className="flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#C59B4E] flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Price Disclaimer:</strong> *Prices mentioned are indicative quoted prices and are subject to change without prior notice. Actual pricing, apartment availability, taxes, additional charges and final commercial terms must be confirmed with the authorized sales representative or developer.
                </span>
              </p>
            </div>
          </div>

          {/* Section: Architectural Floor View */}
          <div className="pt-2 border-t border-[#EAE6DF]">
            <div
              onClick={() => {
                onClose();
                onOpenEnquiry({
                  projectName: project.name,
                  location: project.location,
                  configuration: 'Master Floor View & Unit Layout',
                  project
                });
              }}
              className="group relative rounded-xl overflow-hidden border border-[#EAE6DF] bg-slate-900 cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <img
                  src="/projects/floor_view_typical.svg"
                  alt={`${project.name} Floor View`}
                  className="w-full h-full object-cover filter blur-[6px] group-hover:blur-[3px] scale-105 group-hover:scale-110 transition-all duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/30" />

                {/* Badges */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded text-[10px] uppercase font-mono font-semibold text-[#14221F] flex items-center gap-1 shadow-sm">
                  <Lock className="w-3 h-3 text-[#C59B4E]" />
                  <span>Floor View Protected</span>
                </div>
                <div className="absolute top-3 right-3 bg-[#245348] text-white px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-semibold shadow-sm">
                  {project.name}
                </div>

                {/* Center CTA */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white space-y-2 pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-[#1D3530]/90 border border-[#DFBE79] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Lock className="w-5 h-5 text-[#DFBE79]" />
                  </div>
                  <div>
                    <h5 className="font-serif text-sm sm:text-base font-bold text-white drop-shadow">
                      Architectural Floor View & Unit Layout
                    </h5>
                    <p className="text-[11px] text-gray-200 max-w-xs drop-shadow mt-0.5">
                      Floor plans and room dimensions are confidential. Click to unlock official layout via enquiry.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#245348] text-white text-[10px] uppercase tracking-wider font-semibold shadow-md group-hover:bg-[#1B3F37] transition-all border border-[#DFBE79]/40 mt-1">
                    <Eye className="w-3.5 h-3.5 text-[#DFBE79]" />
                    <span>Click to Enquire & Unlock Floor View</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Accurate Location & Map View */}
          <div className="space-y-3 pt-3 border-t border-[#EAE6DF]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-serif text-base font-bold text-[#14221F] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#245348]" />
                  <span>Location & Map View</span>
                </h4>
                <p className="text-xs text-gray-500 font-light mt-0.5">
                  {project.locality ? `${project.locality}, ` : ''}{project.location}, Mumbai, Maharashtra
                </p>
              </div>

              {project.mapUrl && (
                <a
                  href={project.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#245348]/10 hover:bg-[#245348] text-[#245348] hover:text-white border border-[#245348]/20 text-xs font-mono font-semibold transition-all self-start sm:self-auto"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* Interactive Embedded Google Map for Exact Project Location */}
            <div className="relative w-full h-64 sm:h-72 rounded-xl overflow-hidden border border-[#EAE6DF] shadow-inner bg-slate-100">
              <iframe
                title={`${project.name} location on Google Maps`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(`${project.name} ${project.locality || ''} ${project.location} Mumbai`)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Key Transit & Vicinity Connectivity */}
            {project.connectivity && project.connectivity.length > 0 && (
              <div className="pt-1.5">
                <span className="text-[11px] font-mono uppercase text-gray-500 font-semibold tracking-wider block mb-1.5">
                  Key Transit & Vicinity Connectivity:
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                  {project.connectivity.map((conn, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C59B4E] shrink-0" />
                      <span>{conn}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Bottom Action Footer */}
          <div className="pt-4 border-t border-[#EAE6DF] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-[11px] sm:text-xs text-gray-500 font-mono text-center sm:text-left">
              Concave Realty Curated Portfolio
            </div>
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={onClose}
                aria-label="Close project details"
                className="flex-1 sm:flex-initial px-4 py-2.5 sm:py-2 rounded border border-gray-300 hover:border-black text-xs uppercase tracking-wider font-semibold text-gray-700 transition-colors text-center"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  onOpenEnquiry({
                    projectName: project.name,
                    location: project.location,
                    project
                  });
                }}
                aria-label={`Enquire about ${project.name}`}
                className="flex-1 sm:flex-initial px-5 sm:px-6 py-2.5 sm:py-2 rounded bg-[#245348] hover:bg-[#1B3F37] text-white text-xs uppercase tracking-widest font-semibold transition-all shadow-sm text-center"
              >
                Enquire Now
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Fullscreen High-Resolution Lightbox View */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all border border-white/20 shadow-xl cursor-pointer"
            aria-label="Close full size view"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={currentImage}
            alt={project.name}
            className="max-w-[96vw] max-h-[92vh] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
