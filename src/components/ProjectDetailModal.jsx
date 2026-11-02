import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Building2, 
  Layers, 
  ShieldCheck, 
  Download, 
  Compass, 
  PhoneCall, 
  CheckCircle2
} from 'lucide-react';

export function ProjectDetailModal({ project, onClose, onOpenTour, onOpenEnquiry }) {
  if (!project) return null;

  const [activeImageIdx, setActiveImageIdx] = useState(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar using user requested #1D3530 */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1D3530] text-white">
          <div>
            <h3 className="font-serif text-2xl font-bold">
              {project.name}
            </h3>
            <p className="text-xs text-[#DFBE79]">
              {project.builder} • {project.location}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-[#14221F]">
          
          {/* Gallery View */}
          <div className="space-y-3">
            <div className="relative h-64 sm:h-80 rounded-lg overflow-hidden border border-[#EAE6DF]">
              <img
                src={project.images[activeImageIdx] || project.coverImage}
                alt={project.name}
                className="w-full h-full object-cover"
              />
              
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span className="text-xs uppercase font-mono tracking-wider bg-white/95 text-[#14221F] px-3 py-1 rounded shadow-sm">
                  {project.locality}
                </span>
                
                {project.virtualTourUrl && (
                  <button
                    onClick={() => onOpenTour(project.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-[#245348] text-white shadow-sm hover:bg-[#1B3F37]"
                  >
                    <Compass className="w-3.5 h-3.5 text-[#DFBE79]" />
                    <span>360° Virtual Tour</span>
                  </button>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {project.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-20 h-14 rounded overflow-hidden border-2 flex-shrink-0 transition-all ${
                    activeImageIdx === idx ? 'border-[#245348] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Pricing & Actions Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg bg-[#FAF9F6] border border-[#EAE6DF]">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-gray-500 font-mono">
                Indicative All-In Pricing
              </div>
              <div className="font-serif text-3xl font-bold text-[#14221F]">
                {project.priceRange}
              </div>
              <div className="text-[11px] text-[#C59B4E]">
                *Subject to floor-rise, orientation & developer confirmation
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {project.digitalKitUrl && (
                <a
                  href={project.digitalKitUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded border border-[#EAE6DF] hover:border-black text-xs font-semibold"
                >
                  <Download className="w-3.5 h-3.5 text-[#245348]" />
                  <span>Digital Kit</span>
                </a>
              )}

              {project.mapUrl && (
                <a
                  href={project.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded border border-[#EAE6DF] hover:border-black text-xs font-medium"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#245348]" />
                  <span>Google Maps</span>
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
                className="inline-flex items-center gap-2 px-5 py-2 rounded bg-[#245348] hover:bg-[#1B3F37] text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Book Site Visit</span>
              </button>
            </div>
          </div>

          {/* Key Facts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded bg-[#FAF9F6] border border-[#EAE6DF]">
              <span className="text-[10px] uppercase text-gray-400 block font-mono">Land Parcel</span>
              <span className="font-semibold text-[#14221F] mt-0.5 block">{project.landParcel}</span>
            </div>
            <div className="p-3 rounded bg-[#FAF9F6] border border-[#EAE6DF]">
              <span className="text-[10px] uppercase text-gray-400 block font-mono">Towers & Structure</span>
              <span className="font-semibold text-[#14221F] mt-0.5 block">{project.towers}</span>
            </div>
            <div className="p-3 rounded bg-[#FAF9F6] border border-[#EAE6DF]">
              <span className="text-[10px] uppercase text-gray-400 block font-mono">Elevators</span>
              <span className="font-semibold text-[#14221F] mt-0.5 block">{project.elevators}</span>
            </div>
            <div className="p-3 rounded bg-[#FAF9F6] border border-[#EAE6DF]">
              <span className="text-[10px] uppercase text-gray-400 block font-mono">MahaRERA ID</span>
              <span className="font-semibold font-mono text-[#245348] mt-0.5 block">{project.rera}</span>
            </div>
          </div>

          {/* Configurations Table */}
          <div className="space-y-2">
            <h4 className="font-serif text-lg font-bold">
              Available Configurations & Quotations
            </h4>

            <div className="overflow-x-auto rounded border border-[#EAE6DF]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F6] text-gray-600 uppercase font-mono text-[10px] border-b border-[#EAE6DF]">
                  <tr>
                    <th className="py-2.5 px-3">Configuration</th>
                    <th className="py-2.5 px-3">Carpet Area</th>
                    <th className="py-2.5 px-3">Quoted Value</th>
                    <th className="py-2.5 px-3">Possession</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE6DF] text-gray-800">
                  {project.configurations.map((cfg, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF9F6] transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-[#14221F]">{cfg.bhk}</td>
                      <td className="py-2.5 px-3 font-mono">{cfg.carpetArea}</td>
                      <td className="py-2.5 px-3 font-semibold text-[#245348]">{cfg.price}</td>
                      <td className="py-2.5 px-3 text-gray-500">{cfg.possessionDate}</td>
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
                          className="px-2.5 py-1 rounded bg-[#245348] text-white text-[11px] font-medium"
                        >
                          Enquire Unit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Overview & Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <h4 className="font-serif text-base font-bold">Project Overview</h4>
              <p className="text-xs text-gray-600 leading-relaxed font-light">
                {project.overview}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-serif text-base font-bold">Signature Highlights</h4>
              <ul className="space-y-1.5 text-xs text-gray-600 font-light">
                {project.highlights.map((hl, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#245348] flex-shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
