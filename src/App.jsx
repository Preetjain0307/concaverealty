import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SplashIntro } from './components/SplashIntro';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SignatureProjects } from './components/SignatureProjects';
import { PromotedLocations } from './components/PromotedLocations';
import { AmenitiesSection } from './components/AmenitiesSection';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { VirtualTourModal } from './components/VirtualTourModal';
import { EnquiryModal } from './components/EnquiryModal';
import { EnquiryPage } from './components/EnquiryPage';
import { CallerPortal } from './components/CallerPortal';
import { AdminPortal } from './components/AdminPortal';
import { Footer } from './components/Footer';
import { PROJECTS_DATA } from './data/projectsData';
import { dbStore } from './data/dbStore';

export function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'projects', 'locations', 'amenities', 'enquiry', 'caller', 'admin'

  const [selectedProject, setSelectedProject] = useState(null);
  const [tourModalOpen, setTourModalOpen] = useState(false);
  const [tourProjectId, setTourProjectId] = useState(1);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [enquiryInitialData, setEnquiryInitialData] = useState({});

  const [searchFilter, setSearchFilter] = useState({ location: 'All', type: 'All', budget: 'All' });
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    try {
      dbStore.init();
    } catch (e) {
      console.error("DB init failed:", e);
    }
  }, []);

  const handleOpenTour = (projectId = 1) => {
    setTourProjectId(projectId);
    setTourModalOpen(true);
  };

  const handleOpenEnquiry = (initialData = {}) => {
    setEnquiryInitialData(initialData);
    setCurrentView('enquiry');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
  };

  const tourProject = PROJECTS_DATA.find(p => p.id === tourProjectId) || PROJECTS_DATA[0];

  return (
    <ErrorBoundary>
      {/* 3-Second Logo Splash Animation Screen */}
      {showSplash && (
        <SplashIntro onFinish={() => setShowSplash(false)} />
      )}

      {/* Light aesthetic Lodha-grade canvas */}
      <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#14221F] selection:bg-[#245348] selection:text-white">

        {/* Navigation Bar (Header: #1D3530, Sign in button: #245348) */}
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

        {/* Main Content Area */}
        <main className="flex-1">
          {currentView === 'home' && (
            <>
              {/* Fullscreen Video Hero */}
              <ErrorBoundary>
                <HeroSection
                  onSearch={handleSearch}
                  onExplore={() => {
                    setCurrentView('projects');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenTour={handleOpenTour}
                  onOpenEnquiry={handleOpenEnquiry}
                />
              </ErrorBoundary>

              {/* Promoted Locations */}
              <ErrorBoundary>
                <PromotedLocations
                  onSelectLocation={handleSelectLocation}
                />
              </ErrorBoundary>

              {/* 50+ Curated World-Class Amenities */}
              <ErrorBoundary>
                <AmenitiesSection onOpenEnquiry={handleOpenEnquiry} />
              </ErrorBoundary>

              {/* Attractive Animated Luxury Portfolio Teaser Banner (Positioned at bottom of Home Page) */}
              <section className="py-20 bg-gradient-to-b from-[#FAF9F6] via-[#14221F] to-[#0E1715] border-t border-[#EAE6DF] relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

                  {/* Luxury Animated Card */}
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#14221F] via-[#1D3530] to-[#14221F] p-8 sm:p-14 border border-[#C59B4E]/40 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group hover:border-[#C59B4E] transition-all duration-500">

                    {/* Animated Ambient Glows */}
                    <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-[#C59B4E]/15 rounded-full blur-3xl animate-pulse" />
                    <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 bg-[#245348]/30 rounded-full blur-3xl" />

                    {/* Interior diagonal subtle shimmer */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">

                      {/* Clean Heading */}
                      <div className="space-y-2 max-w-2xl">
                        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white drop-shadow-md">
                          Explore Our Curated Projects Portfolio
                        </h2>
                      </div>

                      {/* Animated Luxury Action Button */}
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => {
                            setCurrentView('projects');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="relative px-8 sm:px-10 py-4 sm:py-4.5 rounded-2xl bg-gradient-to-r from-[#245348] to-[#1B3F37] hover:from-[#C59B4E] hover:to-[#B3883B] text-white hover:text-[#14221F] text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-xl flex items-center gap-3 group/btn border border-[#C59B4E]/40 hover:scale-105 active:scale-95 cursor-pointer"
                        >
                          <span>View All Projects</span>
                          <ArrowRight className="w-4 h-4 text-[#DFBE79] group-hover/btn:text-[#14221F] group-hover/btn:translate-x-1.5 transition-all duration-300" />
                        </button>
                      </div>

                    </div>

                  </div>

                </div>
              </section>
            </>
          )}

          {currentView === 'projects' && (
            <div className="pt-20">
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
            <div className="pt-20">
              <ErrorBoundary>
                <PromotedLocations
                  onSelectLocation={handleSelectLocation}
                />
              </ErrorBoundary>
            </div>
          )}

          {currentView === 'amenities' && (
            <div className="pt-20">
              <ErrorBoundary>
                <AmenitiesSection onOpenEnquiry={handleOpenEnquiry} />
              </ErrorBoundary>
            </div>
          )}

          {currentView === 'enquiry' && (
            <ErrorBoundary>
              <EnquiryPage
                initialData={enquiryInitialData}
                onNavigateHome={() => {
                  setCurrentView('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateProjects={() => {
                  setCurrentView('projects');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </ErrorBoundary>
          )}

          {currentView === 'caller' && (
            <ErrorBoundary>
              <CallerPortal
                currentUser={activeUser && activeUser.role === 'caller' ? activeUser : null}
                onLogin={(user) => setActiveUser(user)}
                onLogout={handleLogout}
              />
            </ErrorBoundary>
          )}

          {currentView === 'admin' && (
            <ErrorBoundary>
              <AdminPortal
                currentUser={activeUser && activeUser.role === 'admin' ? activeUser : null}
                onLogin={(admin) => setActiveUser(admin)}
                onLogout={handleLogout}
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

        {/* Lodha-style Warm Stone Footer */}
        <ErrorBoundary>
          <Footer
            onNavigate={(view) => {
              setCurrentView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenEnquiry={handleOpenEnquiry}
          />
        </ErrorBoundary>

      </div>
    </ErrorBoundary>
  );
}
export default App;
