import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Compass, 
  PhoneCall, 
  ShieldCheck, 
  Headphones, 
  Menu, 
  X, 
  ChevronDown, 
  Sparkles,
  MessageCircle,
  Search
} from 'lucide-react';

export function Navbar({ onNavigate, currentView, onOpenEnquiry, onOpenTour, activeUser, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[#1D3530] text-white border-b border-[#284F45] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Slogan (Lodha minimalist style) */}
          <div 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-full overflow-hidden border border-[#C59B4E]/60 p-0.5 bg-[#284F45] flex-shrink-0 group-hover:scale-105 transition-transform">
              <img 
                src="/logo.jpg" 
                alt="Concave Realty" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-widest text-white">
                CONCAVE
              </span>
              <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#C59B4E] -mt-0.5 hidden sm:inline-block">
                Where Legacy Meets Luxury
              </span>
            </div>
          </div>

          {/* Desktop Links (Lodha style: Uppercase, spacious, refined) */}
          <div className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-widest font-medium text-gray-200">
            <button
              onClick={() => onNavigate('home')}
              className={`hover:text-[#C59B4E] transition-colors ${currentView === 'home' ? 'text-[#C59B4E] border-b border-[#C59B4E] pb-1' : ''}`}
            >
              Our Story
            </button>
            <button
              onClick={() => onNavigate('projects')}
              className={`hover:text-[#C59B4E] transition-colors ${currentView === 'projects' ? 'text-[#C59B4E] border-b border-[#C59B4E] pb-1' : ''}`}
            >
              Our Projects
            </button>
            <button
              onClick={() => onNavigate('locations')}
              className={`hover:text-[#C59B4E] transition-colors ${currentView === 'locations' ? 'text-[#C59B4E] border-b border-[#C59B4E] pb-1' : ''}`}
            >
              Locations
            </button>
            <button
              onClick={() => onNavigate('amenities')}
              className={`hover:text-[#C59B4E] transition-colors ${currentView === 'amenities' ? 'text-[#C59B4E] border-b border-[#C59B4E] pb-1' : ''}`}
            >
              Amenities
            </button>
            <button
              onClick={() => onOpenTour(1)}
              className="inline-flex items-center gap-1.5 text-[#C59B4E] hover:text-white transition-colors"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>360° Tours</span>
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Minimal Lodha Enquire Action */}
            <button
              onClick={() => onOpenEnquiry({ projectName: "Kalpataru Advay", location: "Borivali West" })}
              className="text-xs uppercase tracking-widest text-gray-200 hover:text-[#C59B4E] transition-colors flex items-center gap-1.5 font-medium"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#C59B4E]" />
              <span>Enquire</span>
            </button>

            {/* User requested Sign In button color: #245348 */}
            <div className="relative">
              <button
                onClick={() => setPortalDropdownOpen(!portalDropdownOpen)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[#245348] hover:bg-[#1B3F37] border border-[#284F45] text-xs font-medium uppercase tracking-wider text-white transition-all shadow-sm"
              >
                {activeUser ? (
                  <span className="text-[#DFBE79] font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    {activeUser.role === 'admin' ? 'Admin Portal' : `${activeUser.name.split(' ')[0]} (Caller)`}
                  </span>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C59B4E]" />
                    <span>Sign In</span>
                  </>
                )}
                <ChevronDown className="w-3 h-3 text-gray-300" />
              </button>

              {portalDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-[#1D3530] border border-[#284F45] rounded-lg shadow-xl p-2 z-50 text-xs space-y-1"
                  onMouseLeave={() => setPortalDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[10px] text-gray-400 uppercase tracking-widest border-b border-white/10 font-mono">
                    Workspace Access
                  </div>

                  <button
                    onClick={() => {
                      setPortalDropdownOpen(false);
                      onNavigate('caller');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded text-left hover:bg-[#284F45] text-gray-200 hover:text-white transition-colors"
                  >
                    <Headphones className="w-3.5 h-3.5 text-[#C59B4E]" />
                    <span>Caller Panel</span>
                  </button>

                  <button
                    onClick={() => {
                      setPortalDropdownOpen(false);
                      onNavigate('admin');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded text-left hover:bg-[#284F45] text-gray-200 hover:text-white transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C59B4E]" />
                    <span>Admin Panel</span>
                  </button>

                  {activeUser && (
                    <div className="pt-1 border-t border-white/10">
                      <button
                        onClick={() => {
                          setPortalDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left px-3 py-1.5 text-red-300 hover:text-red-200 hover:bg-red-950/40 rounded text-[11px]"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => onOpenEnquiry({ projectName: "Kalpataru Advay", location: "Borivali West" })}
              className="px-3 py-1.5 rounded text-[11px] uppercase tracking-wider font-semibold text-white bg-[#245348]"
            >
              Enquire
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded bg-[#284F45] text-gray-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1D3530] border-b border-[#284F45] px-4 pt-3 pb-6 space-y-2 text-xs uppercase tracking-wider">
          <button
            onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 px-3 rounded hover:bg-[#284F45] text-gray-200"
          >
            Our Story
          </button>
          <button
            onClick={() => { onNavigate('projects'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 px-3 rounded hover:bg-[#284F45] text-gray-200"
          >
            Our Projects
          </button>
          <button
            onClick={() => { onNavigate('locations'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 px-3 rounded hover:bg-[#284F45] text-gray-200"
          >
            Locations
          </button>
          <button
            onClick={() => { onNavigate('amenities'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 px-3 rounded hover:bg-[#284F45] text-gray-200"
          >
            Amenities
          </button>
          <button
            onClick={() => { onOpenTour(1); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 px-3 rounded hover:bg-[#284F45] text-[#C59B4E]"
          >
            360° Tours
          </button>

          <div className="pt-2 border-t border-white/10 flex gap-2">
            <button
              onClick={() => { onNavigate('caller'); setMobileMenuOpen(false); }}
              className="flex-1 py-2 rounded bg-[#245348] text-white text-center font-medium"
            >
              Caller Panel
            </button>
            <button
              onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
              className="flex-1 py-2 rounded bg-[#284F45] text-white text-center font-medium"
            >
              Admin Panel
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
