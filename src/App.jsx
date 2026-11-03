import React, { useState, useEffect } from 'react';
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
import { CallerPortal } from './components/CallerPortal';
import { AdminPortal } from './components/AdminPortal';
import { Footer } from './components/Footer';
import { PROJECTS_DATA } from './data/projectsData';
import { dbStore } from './data/dbStore';

export function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'projects', 'locations', 'amenities', 'caller', 'admin'

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
    setEnquiryModalOpen(true);
  };

  const handleSearch = (filters) => {
    setSearchFilter(filters);
    setCurrentView('projects');
    const el = document.getElementById('signature-projects');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectLocation = (locName) => {
    setSearchFilter(prev => ({ ...prev, location: locName }));
    setCurrentView('projects');
    const el = document.getElementById('signature-projects');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
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
              {/* Fullscreen Video Hero matching Lodha */}
              <ErrorBoundary>
                <HeroSection
                  onSearch={handleSearch}
                  onExplore={() => {
                    const el = document.getElementById('signature-projects');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onOpenTour={handleOpenTour}
                  onOpenEnquiry={handleOpenEnquiry}
                />
              </ErrorBoundary>

              {/* Minimal Editorial Signature Projects Showcase */}
              <ErrorBoundary>
                <SignatureProjects
                  onSelectProject={setSelectedProject}
                  onOpenTour={handleOpenTour}
                  onOpenEnquiry={handleOpenEnquiry}
                  filterLocation={searchFilter.location}
                  filterType={searchFilter.type}
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
                <AmenitiesSection />
              </ErrorBoundary>
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
                <AmenitiesSection />
              </ErrorBoundary>
            </div>
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
