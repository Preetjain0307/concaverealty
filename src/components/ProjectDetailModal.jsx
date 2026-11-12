import React, { useState, useEffect } from 'react';
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
  Eye
} from 'lucide-react';

export function ProjectDetailModal({ project, onClose, onOpenTour, onOpenEnquiry }) {
  if (!project) return null;

  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Always reset to the primary official hero image when opening or changing projects
  useEffect(() => {
    setActiveImageIdx(0);
  }, [project?.id]);

  const imagesList = (project.images && project.images.length > 0)
    ? project.images
    : [project.coverImage];

  const currentImage = imagesList[activeImageIdx] || project.coverImage;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar using #1D3530 */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1D3530] text-white">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-2xl font-bold">
                {project.name}
              </h3>
              {project.status && (
                <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-[#284F45] text-[#DFBE79] border border-[#C59B4E]/40">
                  {project.status}
                </span>
              )}
            </div>
            <p className="text-xs text-[#DFBE79] mt-0.5">
              {project.builder} • {project.locality || project.location}, {project.city || 'Mumbai'}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-[#14221F]">

          {/* Section: Property Image Gallery */}
          <div className="space-y-3">
            <div className="relative h-64 sm:h-84 md:h-96 rounded-lg overflow-hidden border border-[#EAE6DF] bg-gray-900 group">
              <img
                src={currentImage}
                alt={project.name}
                referrerPolicy="no-referrer"
                onError={(e) => { e.currentTarget.src = '/projects/project_img_27.jpg'; }}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
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
                      alt={`${project.name} gallery view ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      onError={(e) => { e.currentTarget.src = '/projects/project_img_27.jpg'; }}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & Quick Enquire Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg bg-[#FAF9F6] border border-[#EAE6DF]">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-gray-500 font-mono">
                Indicative Quoted Price
              </div>
              <div className="font-sans text-2xl sm:text-3xl font-semibold text-[#14221F] tracking-tight">
                {project.priceRange || project.priceDisplay}
              </div>
              <div className="text-[11px] text-[#C59B4E] font-medium">
                *Subject to floor-rise, unit availability & developer confirmation
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {project.mapUrl && (
                <a
                  href={project.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded border border-[#EAE6DF] hover:border-black text-xs font-medium text-[#14221F] bg-white transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#245348]" />
                  <span>View on Map</span>
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
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded bg-[#245348] hover:bg-[#1B3F37] text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Enquire Now</span>
              </button>
            </div>
          </div>

          {/* Section: Project Specifications */}
          <div>
            <h4 className="font-serif text-base font-bold text-[#14221F] mb-2.5 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#245348]" />
              <span>Project Specifications</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded bg-[#FAF9F6] border border-[#EAE6DF]">
                <span className="text-[10px] uppercase text-gray-400 block font-mono">Land Parcel</span>
                <span className="font-semibold text-[#14221F] mt-0.5 block">{project.landParcel || 'On Request'}</span>
              </div>
              <div className="p-3 rounded bg-[#FAF9F6] border border-[#EAE6DF]">
                <span className="text-[10px] uppercase text-gray-400 block font-mono">Towers & Structure</span>
                <span className="font-semibold text-[#14221F] mt-0.5 block">{project.towers || 'High-Rise Tower'}</span>
              </div>
              <div className="p-3 rounded bg-[#FAF9F6] border border-[#EAE6DF]">
                <span className="text-[10px] uppercase text-gray-400 block font-mono">Elevators</span>
                <span className="font-semibold text-[#14221F] mt-0.5 block">{project.elevators || 'High-Speed Elevators'}</span>
              </div>
              <div className="p-3 rounded bg-[#FAF9F6] border border-[#EAE6DF]">
                <span className="text-[10px] uppercase text-gray-400 block font-mono">MahaRERA Registration</span>
                <span className="font-semibold font-mono text-[#245348] mt-0.5 block break-all">
                  {project.rera || 'Verified / In Progress'}
                </span>
              </div>
            </div>
          </div>

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

          {/* Section: Location & Connectivity */}
          {project.connectivity && project.connectivity.length > 0 && (
            <div className="space-y-2.5 pt-2 border-t border-[#EAE6DF]">
              <h4 className="font-serif text-base font-bold text-[#14221F] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#245348]" />
                <span>Location & Connectivity</span>
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                {project.connectivity.map((conn, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#C59B4E]" />
                    <span>{conn}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="pt-4 border-t border-[#EAE6DF] flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-gray-500 font-mono">
              Concave Realty Exclusive Portfolio
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded border border-gray-300 hover:border-black text-xs uppercase tracking-wider font-semibold text-gray-700 transition-colors"
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
                className="px-6 py-2 rounded bg-[#245348] hover:bg-[#1B3F37] text-white text-xs uppercase tracking-widest font-semibold transition-all shadow-sm"
              >
                Enquire Now
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
