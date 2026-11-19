import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SplashIntro } from './components/SplashIntro';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutUs } from './components/AboutUs';
import { SignatureProjects } from './components/SignatureProjects';
import { PromotedLocations } from './components/PromotedLocations';
import { AmenitiesSection } from './components/AmenitiesSection';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { VirtualTourModal } from './components/VirtualTourModal';
import { EnquiryModal } from './components/EnquiryModal';
import { CallerPortal } from './components/CallerPortal';
import { AdminPortal } from './components/AdminPortal';
import { ContactPage } from './components/ContactPage';
import { CareerPage } from './components/CareerPage';
import { Footer } from './components/Footer';
import { LegalPage } from './components/LegalPage';
import { PROJECTS_DATA } from './data/projectsData';
import { dbStore } from './data/dbStore';

function HomeCtaBanner({ onExplore }) {
  const ctaRef = React.useRef(null);

  React.useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-revealed');
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-revealed');
          observer.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full bg-[#FAF9F6] py-20 sm:py-24 px-6 sm:px-12 text-center border-t border-[#EAE6DF] relative overflow-hidden">
      {/* Subtle Luxury Ambient Glows */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-[#C59B4E]/10 rounded-full blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 bg-[#245348]/5 rounded-full blur-3xl" />

      <div ref={ctaRef} className="max-w-4xl mx-auto relative z-10 space-y-6 home-cta-block">
        <div className="flex items-center justify-center gap-3.5">
          <div className="h-[1px] w-12 bg-[#C59B4E]/50" />
          <span className="text-xs uppercase tracking-[0.28em] font-semibold text-[#8B6846]">
            Curated Portfolio
          </span>
          <div className="h-[1px] w-12 bg-[#C59B4E]/50" />
        </div>

        <h2 
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#14221F] tracking-tight leading-tight"
          style={{
            fontFamily: '"Cormorant Garamond", Cinzel, serif',
            fontVariantCaps: 'small-caps',
          }}
        >
          Experience Mumbai’s Finest Addresses
        </h2>

        <p className="text-sm sm:text-base text-[#554B3E] max-w-2xl mx-auto font-light leading-relaxed">
          Discover handpicked luxury penthouses, waterfront residences, and bespoke architectural landmarks crafted for generational living.
        </p>

        <div className="pt-6 flex justify-center">
          <button
            onClick={onExplore}
            className="group relative inline-flex items-center justify-center gap-4 px-12 sm:px-16 py-5 sm:py-6 min-h-[64px] sm:min-h-[72px] rounded-full bg-gradient-to-r from-[#DFBE79] via-[#C59B4E] to-[#B3883B] hover:from-[#EBD296] hover:to-[#C59B4E] text-[#14221F] font-bold text-sm sm:text-base uppercase tracking-[0.22em] shadow-[0_16px_40px_rgba(197,155,78,0.35)] hover:shadow-[0_20px_50px_rgba(197,155,78,0.5)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border-2 border-[#F6E4B8]"
          >
            <span>Explore Our Projects</span>
            <ArrowRight className="w-5 h-5 text-[#14221F] group-hover:translate-x-2 transition-transform duration-300 shrink-0" />
          </button>
        </div>
      </div>
    </section>
  );
}

export function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'projects', 'locations', 'amenities', 'enquiry', 'caller', 'admin', 'legal'
  const [legalTab, setLegalTab] = useState('terms'); // 'terms', 'privacy', 'disclaimer', 'cookies'

  const [selectedProject, setSelectedProject] = useState(null);
  const [tourModalOpen, setTourModalOpen] = useState(false);
  const [tourProjectId, setTourProjectId] = useState(1);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [enquiryInitialData, setEnquiryInitialData] = useState({});

  const [searchFilter, setSearchFilter] = useState({ location: 'All', type: 'All', budget: 'All' });
  const [activeUser, setActiveUser] = useState(null);

  // Cookie transparency & DPDP storage notice banner
  const [cookieConsentVisible, setCookieConsentVisible] = useState(false);

  useEffect(() => {
    try {
      const ack = localStorage.getItem('concave_cookie_acknowledged');
      if (!ack) {
        const timer = setTimeout(() => setCookieConsentVisible(true), 3000);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // Fallback if localStorage restricted
    }
  }, []);

  const handleDismissCookieBanner = () => {
    try {
      localStorage.setItem('concave_cookie_acknowledged', 'true');
    } catch (e) {}
    setCookieConsentVisible(false);
  };

  useEffect(() => {
    try {
      dbStore.init();
    } catch (e) {
      console.error("DB init failed:", e);
    }

    // Dedicated Portal & Multi-Route Navigation (/concave-admin, /concave-caller, hash & pushState)
    const handleRoute = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      const hash = window.location.hash.toLowerCase();

      if (path === '/concave-admin' || path === '/admin' || hash === '#concave-admin' || hash === '#admin') {
        setCurrentView('admin');
        if (window.location.pathname !== '/concave-admin') {
          window.history.replaceState(null, '', '/concave-admin');
        }
      } else if (path === '/concave-caller' || path === '/caller' || hash === '#concave-caller' || hash === '#caller') {
        setCurrentView('caller');
        if (window.location.pathname !== '/concave-caller') {
          window.history.replaceState(null, '', '/concave-caller');
        }
      } else if (path === '/careers' || hash === '#careers' || hash === '#career') {
        setCurrentView('careers');
      } else if (hash === '#terms' || hash === '#terms-and-conditions' || path === '/terms') {
        setLegalTab('terms');
        setCurrentView('legal');
      } else if (hash === '#privacy' || hash === '#privacy-policy' || path === '/privacy') {
        setLegalTab('privacy');
        setCurrentView('legal');
      } else if (hash === '#disclaimer' || hash === '#rera-disclaimer' || path === '/disclaimer') {
        setLegalTab('disclaimer');
        setCurrentView('legal');
      } else if (hash === '#cookies' || hash === '#cookie-policy' || path === '/cookies') {
        setLegalTab('cookies');
        setCurrentView('legal');
      } else if (hash === '#legal' || path === '/legal') {
        setLegalTab('terms');
        setCurrentView('legal');
      }
    };
    handleRoute();
    window.addEventListener('popstate', handleRoute);
    window.addEventListener('hashchange', handleRoute);

    const handleKeydown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setCurrentView('admin');
        window.history.pushState(null, '', '/concave-admin');
      } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        setCurrentView('caller');
        window.history.pushState(null, '', '/concave-caller');
      }
    };
    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('popstate', handleRoute);
      window.removeEventListener('hashchange', handleRoute);
      window.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  // Search Engine Hardening: Dynamically apply noindex to private administrative portals
  useEffect(() => {
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.name = 'robots';
      document.head.appendChild(robotsMeta);
    }

    if (currentView === 'admin' || currentView === 'caller') {
      robotsMeta.content = 'noindex, nofollow, noarchive, nosnippet';
    } else {
      robotsMeta.content = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
    }
  }, [currentView]);

  const handleOpenTour = (projectId = 1) => {
    setTourProjectId(projectId);
    setTourModalOpen(true);
  };

  const handleOpenEnquiry = (initialData = {}) => {
    setEnquiryInitialData(initialData);
    setEnquiryModalOpen(true);
  };

  // If user state was on enquiry view, seamlessly switch to home and show Preet's enquiry modal
  useEffect(() => {
    if (currentView === 'enquiry') {
      setCurrentView('home');
      setEnquiryModalOpen(true);
    }
  }, [currentView]);

  const handleSearch = (filters) => {
    setSearchFilter(filters);
    setCurrentView('projects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectLocation = (locName) => {
    setSearchFilter(prev => ({ ...prev, location: locName }));
    setCurrentView('projects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setActiveUser(null);
    setCurrentView('home');
    window.history.pushState(null, '', '/');
  };

  const isPortalView = currentView === 'admin' || currentView === 'caller';
  const tourProject = PROJECTS_DATA.find(p => p.id === tourProjectId) || PROJECTS_DATA[0];

  return (
    <ErrorBoundary>
      {/* 3-Second Logo Splash Animation Screen */}
      {showSplash && (
        <SplashIntro onFinish={() => setShowSplash(false)} />
      )}

      {/* Light aesthetic Lodha-grade canvas */}
      <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#14221F] selection:bg-[#245348] selection:text-white">

        {/* Navigation Bar: Hidden on standalone Admin and Caller portals */}
        {!isPortalView && (
          <Navbar
            onNavigate={(view) => {
              setCurrentView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            currentView={currentView}
            onOpenEnquiry={handleOpenEnquiry}
            activeUser={activeUser}
            onLogout={handleLogout}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1">
          {currentView === 'home' && (
            <>
              {/* Fullscreen Video Hero */}
              <ErrorBoundary>
                <HeroSection
                  onSearch={handleSearch}
                  onOpenTour={handleOpenTour}
                  onOpenEnquiry={handleOpenEnquiry}
                />
              </ErrorBoundary>

              {/* About Us, Mission & Vision Showcase */}
              <ErrorBoundary>
                <AboutUs />
              </ErrorBoundary>

              {/* Explore Our Projects CTA (Light Luxury Banner before Dark Footer with smooth scroll reveal) */}
              <HomeCtaBanner
                onExplore={() => {
                  setCurrentView('projects');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </>
          )}

          {currentView === 'projects' && (
            <div className="pt-16 sm:pt-20">
              <ErrorBoundary>
                <SignatureProjects
                  onSelectProject={setSelectedProject}
                  onOpenTour={handleOpenTour}
                  onOpenEnquiry={handleOpenEnquiry}
                  filterLocation={searchFilter.location}
                  filterType={searchFilter.type}
                />
              </ErrorBoundary>
            </div>
          )}

          {currentView === 'locations' && (
            <div className="pt-16 sm:pt-20">
              <ErrorBoundary>
                <PromotedLocations
                  onSelectLocation={handleSelectLocation}
                />
              </ErrorBoundary>
            </div>
          )}

          {currentView === 'amenities' && (
            <div className="pt-16 sm:pt-20">
              <ErrorBoundary>
                <AmenitiesSection onOpenEnquiry={handleOpenEnquiry} />
              </ErrorBoundary>
            </div>
          )}

          {currentView === 'contact' && (
            <ErrorBoundary>
              <ContactPage
                onNavigateHome={() => {
                  setCurrentView('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenEnquiry={handleOpenEnquiry}
              />
            </ErrorBoundary>
          )}

          {currentView === 'careers' && (
            <ErrorBoundary>
              <CareerPage
                onNavigateHome={() => {
                  setCurrentView('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenEnquiry={handleOpenEnquiry}
              />
            </ErrorBoundary>
          )}

          {currentView === 'caller' && (
            <ErrorBoundary>
              <CallerPortal
                currentUser={activeUser && activeUser.role === 'caller' ? activeUser : null}
                onLogin={(user) => setActiveUser(user)}
                onLogout={handleLogout}
                onNavigateHome={() => {
                  setCurrentView('home');
                  window.history.pushState(null, '', '/');
                }}
              />
            </ErrorBoundary>
          )}

          {currentView === 'admin' && (
            <ErrorBoundary>
              <AdminPortal
                currentUser={activeUser && activeUser.role === 'admin' ? activeUser : null}
                onLogin={(admin) => setActiveUser(admin)}
                onLogout={handleLogout}
                onNavigateHome={() => {
                  setCurrentView('home');
                  window.history.pushState(null, '', '/');
                }}
              />
            </ErrorBoundary>
          )}

          {currentView === 'legal' && (
            <ErrorBoundary>
              <LegalPage
                initialTab={legalTab}
                onNavigateHome={() => {
                  setCurrentView('home');
                  window.location.hash = '';
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSelectDocument={(tab) => {
                  setLegalTab(tab);
                  window.location.hash = tab;
                }}
              />
            </ErrorBoundary>
          )}
        </main>

        {/* Global Modals */}
        <ErrorBoundary>
          <ProjectDetailModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            onOpenTour={handleOpenTour}
            onOpenEnquiry={handleOpenEnquiry}
          />
        </ErrorBoundary>

        <ErrorBoundary>
          <VirtualTourModal
            isOpen={tourModalOpen}
            onClose={() => setTourModalOpen(false)}
            project={tourProject}
          />
        </ErrorBoundary>

        <ErrorBoundary>
          <EnquiryModal
            isOpen={enquiryModalOpen}
            onClose={() => setEnquiryModalOpen(false)}
            initialData={enquiryInitialData}
          />
        </ErrorBoundary>

        {/* Website Footer: Hidden on standalone Admin and Caller portals */}
        {!isPortalView && (
          <ErrorBoundary>
            <Footer
              onNavigate={(view) => {
                if (['terms', 'privacy', 'disclaimer', 'cookies', 'cookie-policy', 'legal'].includes(view)) {
                  const doc = view === 'cookie-policy' ? 'cookies' : (view === 'legal' ? 'terms' : view);
                  setLegalTab(doc);
                  setCurrentView('legal');
                  window.location.hash = doc;
                } else {
                  setCurrentView(view);
                  window.location.hash = view === 'home' ? '' : view;
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectLocation={handleSelectLocation}
              onOpenEnquiry={handleOpenEnquiry}
            />
          </ErrorBoundary>
        )}

        {/* Luxury Cookie & Privacy Preferences Banner (Website only) */}
        {!isPortalView && cookieConsentVisible && (
          <aside 
            aria-label="Privacy and Cookie Preferences"
            className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 p-4 sm:p-5 rounded-2xl bg-[#14221F]/95 backdrop-blur-md border border-[#C59B4E]/50 text-white shadow-2xl animate-fade-up space-y-3"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#183C32] border border-[#C59B4E] flex items-center justify-center text-[#DFBE79] shrink-0">
                <span className="font-serif font-bold text-xs">CR</span>
              </div>
              <div className="space-y-1 text-xs">
                <h4 className="font-serif font-bold text-sm text-[#F7F3EB] tracking-wide">
                  Cookie & Privacy Preferences
                </h4>
                <p className="text-[#D0C5B4] text-[11.5px] leading-relaxed">
                  We use essential cookies to ensure you receive a seamless browsing experience and personalized luxury property recommendations. We value your privacy and do not track or sell your personal data.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-1 text-xs font-semibold">
              <button
                onClick={() => {
                  setLegalTab('cookies');
                  setCurrentView('legal');
                  window.location.hash = 'cookies';
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3.5 py-1.5 rounded-lg border border-[#C59B4E]/40 hover:border-[#DFBE79] text-[#DFBE79] hover:text-white transition-colors cursor-pointer text-[11px] font-medium"
              >
                Cookie Policy
              </button>
              <button
                onClick={handleDismissCookieBanner}
                className="px-4 py-1.5 rounded-lg bg-[#245348] hover:bg-[#1B3F37] text-white transition-all shadow-sm cursor-pointer text-[11px] uppercase tracking-wider font-semibold"
              >
                Accept All
              </button>
            </div>
          </aside>
        )}

      </div>
    </ErrorBoundary>
  );
}
export default App;
