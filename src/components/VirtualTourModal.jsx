import React, { useState } from 'react';
import { X, ExternalLink, Compass, ShieldCheck, RefreshCw } from 'lucide-react';

export function VirtualTourModal({ isOpen, onClose, project }) {
  if (!isOpen || !project) return null;

  const tourUrl = project.virtualTourUrl || "https://view.pixeldo.com/KalpataruAdvay/";
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-lg"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl h-[92vh] sm:h-[90vh] bg-[#051912] border border-[#c59b4e]/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-3.5 sm:px-6 py-3 bg-[#07241b] border-b border-[#c59b4e]/30 gap-3">
          
          {/* Left info */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#051912] border border-[#c59b4e] flex items-center justify-center text-[#dfbe79] shrink-0">
              <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '10s' }} />
            </div>
            <div className="min-w-0">
              <h3 className="font-serif text-sm sm:text-lg font-bold text-white flex items-center gap-2 truncate">
                <span className="truncate">{project.name}</span>
                <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded bg-[#114937] text-emerald-300 border border-emerald-400/30 shrink-0">
                  360° TOUR
                </span>
              </h3>
              <p className="text-[10px] sm:text-[11px] text-gray-400 truncate">
                {project.locality || project.location}, {project.city || 'Mumbai'}
                {project.rera && <span className="ml-2 font-mono text-[10px] text-[#c59b4e] hidden xs:inline">RERA: {project.rera}</span>}
              </p>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <a
              href={tourUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#245348] hover:bg-[#1B3F37] border border-[#dfbe79]/60 text-[#dfbe79] hover:text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
            >
              <span>Full Screen</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#051912] text-gray-300 hover:text-white border border-white/10 hover:border-[#c59b4e] transition-colors cursor-pointer"
              aria-label="Close 360 tour"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 360 Tour Frame Container */}
        <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">
          {/* Loading Overlay */}
          {isLoading && !hasError && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#07241b] text-center p-6 space-y-3.5">
              <div className="relative w-14 h-14 rounded-full border-2 border-[#DFBE79]/20 border-t-[#DFBE79] animate-spin flex items-center justify-center">
                <Compass className="w-7 h-7 text-[#DFBE79]" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-base sm:text-lg text-white font-bold tracking-wide">
                  Loading 360° Virtual Walkthrough
                </h4>
                <p className="text-xs text-gray-300 font-mono">
                  Streaming high-resolution 360° panoramas for {project.name}...
                </p>
              </div>
              <a
                href={tourUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#245348] hover:bg-[#1B3F37] text-[#DFBE79] hover:text-white border border-[#DFBE79]/50 text-xs font-bold uppercase tracking-wider transition-all shadow-md"
              >
                <span>Launch in Direct Window</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Fallback Error Card if iframe blocked */}
          {hasError && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#051912] text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#114937]/50 border border-[#DFBE79] flex items-center justify-center text-[#DFBE79]">
                <Compass className="w-8 h-8 animate-pulse" />
              </div>
              <div className="space-y-1.5 max-w-md">
                <h4 className="font-serif text-xl text-white font-bold">
                  {project.name} 360° Panorama
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Your browser requires opening the interactive 360° experience in full screen for motion and gyroscope support.
                </p>
              </div>
              <a
                href={tourUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#DFBE79] to-[#C59B4E] text-[#14221F] font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all"
              >
                <span>Launch 360° Tour Full Screen</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          <iframe
            key={tourUrl}
            src={tourUrl}
            title={`${project.name} 360° Virtual Tour by Pixeldo`}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; xr-spatial-tracking; fullscreen"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => setIsLoading(false)}
            onError={() => setHasError(true)}
          />
        </div>

        {/* Bottom Bar */}
        <div className="px-3.5 sm:px-6 py-2 bg-[#07241b] border-t border-[#c59b4e]/20 flex items-center justify-between text-xs text-gray-400 flex-wrap gap-2">
          <span className="flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#dfbe79] shrink-0" />
            <span className="truncate">Interactive Real Estate Virtualization • Official Asset</span>
          </span>
          <span className="font-mono text-[10.5px] sm:text-[11px] text-[#dfbe79]">
            Drag & Rotate to explore 360° Panorama
          </span>
        </div>
      </div>
    </div>
  );
}
