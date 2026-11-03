import React from 'react';
import { X, ExternalLink, Compass, ShieldCheck } from 'lucide-react';

export function VirtualTourModal({ isOpen, onClose, project }) {
  if (!isOpen || !project) return null;

  const tourUrl = project.virtualTourUrl || "https://view.pixeldo.com/KalpataruAdvay/";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-lg"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl h-[90vh] bg-[#051912] border border-[#c59b4e]/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#07241b] border-b border-[#c59b4e]/30 gap-3">
          
          {/* Left info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#051912] border border-[#c59b4e] flex items-center justify-center text-[#dfbe79] flex-shrink-0">
              <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '10s' }} />
            </div>
            <div className="min-w-0">
              <h3 className="font-serif text-base sm:text-lg font-bold text-white flex items-center gap-2 flex-wrap truncate">
                <span>{project.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#114937] text-emerald-300 border border-emerald-400/30">
                  360° VIRTUAL TOUR
                </span>
              </h3>
              <p className="text-[11px] text-gray-400 truncate">
                {project.locality || project.location}, {project.city || 'Mumbai'}
                {project.rera && <span className="ml-2 font-mono text-[10px] text-[#c59b4e]">RERA: {project.rera}</span>}
              </p>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={tourUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#051912] border border-[#c59b4e]/40 text-[#dfbe79] hover:bg-[#c59b4e] hover:text-[#051912] text-xs font-semibold transition-all"
            >
              <span className="hidden sm:inline">Full Screen Window</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#051912] text-gray-300 hover:text-white border border-white/10 hover:border-[#c59b4e] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 360 Tour Iframe */}
        <div className="relative flex-1 bg-black">
          <iframe
            key={tourUrl}
            src={tourUrl}
            title={`${project.name} 360° Tour`}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; xr-spatial-tracking"
            allowFullScreen
          />
        </div>

        {/* Bottom Bar */}
        <div className="px-4 sm:px-6 py-2.5 bg-[#07241b] border-t border-[#c59b4e]/20 flex items-center justify-between text-xs text-gray-400 flex-wrap gap-2">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#dfbe79]" />
            <span>Interactive Real Estate Virtualization • Official Developer Asset</span>
          </span>
          <span className="font-mono text-[11px] text-[#dfbe79]">
            Drag & Rotate to explore 360° Panorama
          </span>
        </div>
      </div>
    </div>
  );
}
