import React, { useState } from 'react';
import { 
  MapPin, 
  Compass, 
  Download, 
  ExternalLink, 
  ArrowRight,
  Eye,
  PhoneCall,
  Sparkles
} from 'lucide-react';
import { PROJECTS_DATA } from '../data/projectsData';

export function SignatureProjects({ 
  onSelectProject, 
  onOpenTour, 
  onOpenEnquiry,
  filterLocation = 'All',
  filterType = 'All'
}) {
  const [selectedBhkTab, setSelectedBhkTab] = useState('All');

  const filteredProjects = PROJECTS_DATA.filter((proj) => {
    if (filterLocation !== 'All' && proj.location.toLowerCase() !== filterLocation.toLowerCase()) {
      return false;
    }
    if (selectedBhkTab !== 'All') {
      const hasConfig = proj.configurations.some(c => c.bhk.toLowerCase().includes(selectedBhkTab.toLowerCase()));
      if (!hasConfig) return false;
    }
    return true;
  });

  return (
    <section id="signature-projects" className="py-24 bg-[#FAF9F6] text-[#14221F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Lodha Editorial Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C59B4E] font-semibold block">
            OUR PROMISE
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#14221F] tracking-tight">
            Creators of Extraordinary Developments
          </h2>
          <p className="text-gray-600 text-sm font-light leading-relaxed">
            Concave Realty unites discerning homebuyers with Mumbai’s most iconic addresses. Impeccable architecture, panoramic views, and enduring craftsmanship.
          </p>

          {/* Minimal Filter Tabs */}
          <div className="flex justify-center gap-6 pt-4 text-xs uppercase tracking-widest text-gray-500 font-medium">
            {['All', '3 BHK', '4 BHK', 'Jodi'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedBhkTab(tab)}
                className={`pb-1 transition-all ${
                  selectedBhkTab === tab
                    ? 'text-[#14221F] font-bold border-b-2 border-[#C59B4E]'
                    : 'hover:text-[#14221F]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Editorial Project Showcase (Lodha split-screen style) */}
        <div className="space-y-16">
          {filteredProjects.map((project, idx) => {
            const isReversed = idx % 2 === 1;

            return (
              <div 
                key={project.id}
                className={`bg-white rounded-xl overflow-hidden border border-[#EAE6DF] shadow-subtle hover:shadow-luxury-light transition-all duration-300 flex flex-col ${
                  isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'
                }`}
              >
                {/* Visual Half */}
                <div className="lg:w-1/2 relative min-h-[380px] lg:min-h-[460px] overflow-hidden group">
                  <img
                    src={project.coverImage}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                  
                  {/* Location badge on photo */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded text-xs uppercase tracking-wider font-semibold text-[#14221F] shadow-sm">
                    {project.location}
                  </div>

                  {/* 360 Tour Button on photo if available */}
                  {project.virtualTourUrl && (
                    <button
                      onClick={() => onOpenTour(project.id)}
                      className="absolute bottom-4 right-4 bg-[#1D3530]/90 backdrop-blur-md text-white hover:bg-[#C59B4E] transition-colors px-3 py-1.5 rounded text-xs uppercase tracking-wider font-medium flex items-center gap-1.5 shadow-md"
                    >
                      <Compass className="w-3.5 h-3.5 text-[#DFBE79]" />
                      <span>360° Virtual Tour</span>
                    </button>
                  )}
                </div>

                {/* Content Half (Clean, spacious, Lodha-inspired typography) */}
                <div className="lg:w-1/2 p-8 sm:p-12 flex flex-col justify-between space-y-6">
                  
                  <div className="space-y-4">
                    {/* Subheading */}
                    <div className="flex items-center justify-between text-xs uppercase tracking-widest text-gray-500">
                      <span>{project.builder}</span>
                      <span className="text-[#C59B4E] font-medium">{project.status}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#14221F]">
                      {project.name}
                    </h3>

                    <p className="text-sm text-gray-600 font-light leading-relaxed">
                      {project.overview}
                    </p>

                    {/* Key Specifications Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3 border-t border-[#EAE6DF] text-xs">
                      <div>
                        <span className="text-[10px] uppercase text-gray-400 block tracking-wider">Starting Price</span>
                        <span className="font-serif text-lg font-bold text-[#14221F]">{project.priceDisplay}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-gray-400 block tracking-wider">Land & Towers</span>
                        <span className="font-medium text-[#14221F]">{project.landParcel.split(' ')[0]} {project.landParcel.split(' ')[1]} • {project.towers.split(' ')[0]} Twr</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-gray-400 block tracking-wider">Possession</span>
                        <span className="font-medium text-[#14221F]">{project.possession.split('(')[0]}</span>
                      </div>
                    </div>

                    {/* Festive offer / Jodi callout */}
                    {project.festiveOffer && (
                      <div className="bg-[#FAF9F6] border-l-2 border-[#C59B4E] p-2.5 text-xs text-[#14221F]">
                        <strong>Special Privilege:</strong> {project.festiveOffer}
                      </div>
                    )}
                  </div>

                  {/* Clean Action Buttons (Using user's #245348 button) */}
                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#EAE6DF]">
                    <button
                      onClick={() => onSelectProject(project)}
                      className="px-5 py-2.5 rounded lodha-btn-outline text-xs uppercase tracking-widest font-semibold"
                    >
                      Know More
                    </button>

                    <button
                      onClick={() => onOpenEnquiry({
                        projectName: project.name,
                        location: project.location,
                        project: project
                      })}
                      className="px-5 py-2.5 rounded bg-[#245348] hover:bg-[#1B3F37] text-white text-xs uppercase tracking-widest font-semibold transition-all shadow-sm"
                    >
                      Book Site Visit
                    </button>

                    {project.digitalKitUrl && (
                      <a
                        href={project.digitalKitUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs uppercase tracking-widest text-[#C59B4E] hover:text-[#14221F] font-semibold inline-flex items-center gap-1 transition-colors pl-2"
                      >
                        <span>Digital Kit</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
